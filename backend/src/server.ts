import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import contactRoute from "../src/routes/contactRoute";
import galleryRoute from "../src/routes/galleryRoutes";
import roomRoute from "../src/routes/roomRoute" ;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

connectDB();



// ✅ Gallery routes
app.use("/api/gallery", galleryRoute);

app.use("/api/contact", contactRoute);

app.use("/api/rooms", roomRoute);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
