import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  category: { type: String, required: true },
  alt: { type: String },
  imageUrl: { type: String, required: true }, // URL to fetch from GridFS
  createdAt: { type: Date, default: Date.now },
});

export const Gallery = mongoose.model("Gallery", gallerySchema);
