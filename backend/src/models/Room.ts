import mongoose, { Document, Model } from "mongoose";

export interface IRoom extends Document {
  type: string;
  price: string;
  period?: string;
  capacity: number;
  popular?: boolean;
}

const roomSchema = new mongoose.Schema<IRoom>({
  type: { type: String, required: true },
  price: { type: String, required: true },
  period: { type: String, default: "/month" },
  capacity: { type: Number, required: true },
  popular: { type: Boolean, default: false },
});

export const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>("Room", roomSchema);
