import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { Gallery } from "../models/gallery";

const router = express.Router();

// ---------------- Multer Setup ---------------- //
// Use memory storage so the file buffer is available
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------------- GridFS Setup ---------------- //
let gfs: mongoose.mongo.GridFSBucket;

// Initialize GridFS bucket once mongoose connection is open
mongoose.connection.once("open", () => {
  const db = mongoose.connection.db;
  if (!db) {
    console.error("❌ MongoDB connection not ready");
    return;
  }
  gfs = new mongoose.mongo.GridFSBucket(db as mongoose.mongo.Db, { bucketName: "galleryImages" });
  console.log("✅ GridFS initialized for galleryImages bucket");
});

// ---------------- POST: Upload Image ---------------- //
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { category, alt } = req.body;

    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });

    // Upload file to GridFS
    const uploadStream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });
    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      // ✅ Use uploadStream.filename
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
    res.json({ success: true, data: images });
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

    downloadStream.on("error", (err) => {
      res.status(404).json({ success: false, message: "Image not found" });
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
