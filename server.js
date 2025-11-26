import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ----------------------------------------------------------------------
// 🔥 CORS FIX: ทำให้รองรับทุก preflight request (OPTIONS)
// ----------------------------------------------------------------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ----------------------------------------------------------------------
// cors() แบบปกติ (ใช้ร่วมกันได้)
// ----------------------------------------------------------------------
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(express.json());


// -------------------------
// Connect MongoDB
// -------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "otop_db", // เพิ่ม dbName กันผิดฐาน
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// -------------------------
// Product Schema
// -------------------------
const productSchema = new mongoose.Schema(
  {
    province: String,
    name: String,
    community: String,
    category: String,
    description: String,
    rating: Number,
    price: Number,
    unit: String,
    stock: Number,
    imageUrl: String,
  },
  { collection: "products" }
);

const Product = mongoose.model("Product", productSchema);

// -------------------------
// Routes
// -------------------------

// 1) GET all products
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 2) GET single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Invalid product ID" });
  }
});

// 3) Create order (for checkout)
app.post("/api/orders", async (req, res) => {
  const orderData = req.body;

  // (Optional) — จะเก็บลง DB ก็ได้ แต่ตอนนี้ตอบกลับเลย
  const orderId = "ORD-" + Date.now();

  console.log("📦 New Order:", orderData);

  res.json({
    success: true,
    orderId,
  });
});

// -------------------------
// Start Server
// -------------------------
const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`🚀 Server running on http://localhost:${port}`)
);
