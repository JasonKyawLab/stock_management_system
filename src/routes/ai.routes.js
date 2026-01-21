import express from "express";
import pool from "../database/postgres.js";
import { getMongoDb } from "../database/mongo.js";
import { buildInventoryInsight } from "../services/insight.service.js";

const router = express.Router();

// Test route 
router.get("/test", (req, res) => {
  res.json({ ok: true });
});

// GET /ai/inventory/:sku/insight
router.get("/inventory/:sku/insight", async (req, res) => {
  const { sku } = req.params;

  try {

    const productResult = await pool.query(
      `
      SELECT
        p.sku,
        p.name,
        p.price,
        i.quantity
      FROM products p
      JOIN inventory i ON p.id = i.product_id
      WHERE p.sku = $1
      `,
      [sku]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productResult.rows[0];

    const db = getMongoDb();

    const similarProducts = await db
      .collection("products")
      .find({
        category: product.category,
        sku: { $ne: sku }
      })
      .limit(3)
      .toArray();


    const insight = await buildInventoryInsight({
      product,
      similarProducts
    });

    res.json({
      sku,
      insight
    });
  } catch (err) {
    console.error("🛑 AI insight error:", err);
    res.status(500).json({ error: "Failed to generate AI insight" });
  }
});

export default router;