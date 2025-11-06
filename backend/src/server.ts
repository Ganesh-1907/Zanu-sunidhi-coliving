import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import contactRoute from "../src/routes/contactRoute";
import galleryRoute from "../src/routes/galleryRoutes";
import roomRoute from "../src/routes/roomRoute" ;
import adminAuthRoute from "../src/routes/adminAuth";


const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors()); 
app.use(express.json());

connectDB();

//admin route
app.use("/api/admin", adminAuthRoute);
// ✅ Gallery routes
app.use("/api/gallery", galleryRoute);
//contact route
app.use("/api/contact", contactRoute);
//rooms route
app.use("/api/rooms", roomRoute);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
