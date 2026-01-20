import express from 'express';
import pool from '../database/postgres.js'

const router = express.Router();

// GET /inventory - List all inventory items
router.get('/', async (req, res) => {
    try {

        const query = `
        SELECT 
        p.sku,
        p.name,
        p.price,
        i.quantity
        FROM products p
        JOIN inventory i ON p.id = i.product_id
        ORDER BY p.id;
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(" 🛑ERROR GET/inventory : ", err);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

// GET /inventory/low-stock     (default 5)
router.get('/low-stock', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const query = `
        SELECT 
        p.sku,
        p.name,
        i.quantity
        FROM products p
        JOIN inventory i ON p.id = i.product_id
        WHERE i.quantity <= $1
        ORDER BY i.quantity ASC;
        `;

        const result = await pool.query(query, [limit]);

        res.json({
            threshold: limit,
            count: result.rows.length,
            items: result.rows
        });

    } catch (err) {
        console.error(" 🛑ERROR POST/inventory/update : ", err);
        res.status(500).json({
            error: 'Failed to fetch low stock items'
        });
    }
});

// GET /inventory/sku - Get inventory item by SKU
// http://localhost:3000/inventory/TV-LG-55-002
router.get('/:sku', async (req, res) => {
    const { sku } = req.params;
    try {

        const query = `
      SELECT
        p.sku,
        p.name,
        p.price,
        i.quantity
      FROM products p
      JOIN inventory i ON p.id = i.product_id
      WHERE p.sku = $1;
    `;

        const result = await pool.query(query, [sku]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(" 🛑ERROR GET/inventory/sku : ", err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// GET /inventory/:sku/history
router.get('/:sku/history', async (req, res) => {
  try {
    const { sku } = req.params;

    const query = `
      SELECT
        h.change,
        h.old_quantity,
        h.new_quantity,
        h.reason,
        h.created_at
      FROM stock_history h
      JOIN products p ON h.product_id = p.id
      WHERE p.sku = $1
      ORDER BY h.created_at DESC;
    `;

    const result = await pool.query(query, [sku]);

    res.json({
      sku,
      count: result.rows.length,
      history: result.rows
    });

  } catch (err) {
    console.error("🛑 ERROR GET /inventory/:sku/history:", err);
    res.status(500).json({ error: 'Failed to fetch stock history' });
  }
});

// POST /inventory/update
router.post('/update', async (req, res) => {

    const client = await pool.connect();

    try {

        const { sku, change } = req.body;

        if (!sku || typeof change !== 'number') {
            return res.status(400).json({ error: 'Invalid Input' });
        }

        await client.query('BEGIN');

        //Get current stock
        const productResult = await client.query(`
            SELECT p.id, i.quantity
            FROM products p
            JOIN inventory i ON p.id = i.product_id
            WHERE p.sku = $1
            FOR UPDATE
            `, [sku]
        );

        if (productResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Product not found' });
        }

        const { id, quantity } = productResult.rows[0];
        const newQuantity = quantity + change;

        if (newQuantity < 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        await client.query(
            `
            INSERT INTO stock_history
            (product_id, change, old_quantity, new_quantity, reason)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [id, change, quantity, newQuantity, 'manual update']
        );
        await client.query(
            `UPDATE inventory SET quantity = $1 WHERE product_id = $2`,
            [newQuantity, id]);

        await client.query('COMMIT');

        res.json({
            sku,
            oldQuantity: quantity,
            newQuantity
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(" 🛑ERROR POST/inventory/update : ", err);
        res.status(500).json({ error: 'Failed to update inventory' });
    } finally {
        client.release();
    }
});

export default router;