import { Router, Request, Response } from "express";
import { Room, IRoom } from "../models/Room";

const router = Router();

// POST - add a room
router.post("/", async (req: Request, res: Response) => {
  try {
    const { type, price, period, capacity, popular } = req.body as Partial<IRoom>;
    const room = new Room({ type, price, period, capacity, popular });
    await room.save();
    res.status(201).json(room);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET - fetch all rooms
router.get("/", async (_req: Request, res: Response) => {
  try {
    const rooms = await Room.find().sort({ _id: 1 });
    res.status(200).json(rooms);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ❌ DELETE - Delete room by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    console.log("🗑️ DELETE request received for room ID:", req.params.id);
    const { id } = req.params;

    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      console.log("⚠️ Room not found for ID:", id);
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    console.log("✅ Room deleted:", id);
    res.status(200).json({ success: true, message: "Room deleted successfully" });
  } catch (err: any) {
    console.error("❌ Error deleting room:", err);
    res.status(500).json({ success: false, message: "Failed to delete room" });
  }
});


export default router;
