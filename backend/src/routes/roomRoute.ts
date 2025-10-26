import { Router, Request, Response } from "express";
import { Room, IRoom } from "../models/room";

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

export default router;
