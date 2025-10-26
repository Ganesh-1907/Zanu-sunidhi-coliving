import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { Gallery } from "../models/gallery";

const router = express.Router();

// ---------------- Multer Setup ---------------- //
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------------- GridFS Setup ---------------- //
let gfs: mongoose.mongo.GridFSBucket;

mongoose.connection.once("open", () => {
  const db = mongoose.connection.db;
  if (!db) return console.error("❌ MongoDB connection not ready");
  gfs = new mongoose.mongo.GridFSBucket(db as mongoose.mongo.Db, { bucketName: "galleryImages" });
  console.log("✅ GridFS initialized for galleryImages bucket");
});

// ---------------- POST: Upload Image ---------------- //
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { category, alt } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });

    const uploadStream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });
    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      const newImage = await Gallery.create({
        category,
        alt,
        imageUrl: `/api/gallery/image/${uploadStream.filename}`,
      });
      res.status(201).json({ success: true, data: newImage });
    });

    uploadStream.on("error", (err) => {
      console.error("Upload Error:", err);
      res.status(500).json({ success: false, error: err.message });
    });

  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- GET: Fetch All Gallery Items ---------------- //
router.get("/", async (_req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images); // return array directly for frontend convenience
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- GET: Serve Image by Filename ---------------- //
router.get("/image/:filename", async (req, res) => {
  try {
    if (!gfs) return res.status(500).json({ success: false, message: "GridFS not initialized" });

    const downloadStream = gfs.openDownloadStreamByName(req.params.filename);
    downloadStream.pipe(res);

    downloadStream.on("error", () => {
      res.status(404).json({ success: false, message: "Image not found" });
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- DELETE: Delete Gallery Item ---------------- //
router.delete("/:id", async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) return res.status(404).json({ success: false, message: "Item not found" });

    // Delete the file from GridFS
    const filename = galleryItem.imageUrl.split("/").pop();
    if (filename && gfs) {
      const files = await gfs.find({ filename }).toArray();
      if (files.length > 0) {
        await gfs.delete(files[0]._id);
      }
    }

    // Delete the document from MongoDB
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
