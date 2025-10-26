import express from "express";
import { Admin } from "../models/Admin";

const router = express.Router();

// ---------------- POST: Admin Login ---------------- //
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // ✅ Successful login
    res.json({ success: true, message: "Login successful", admin: { name: admin.name, email: admin.email } });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
