import express from "express";
import { Contact } from "../models/contact";

const router = express.Router();

// POST: Contact form submission
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const contact = await Contact.create({ name, email, phone, message });
    res.status(201).json({ success: true, data: contact });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
