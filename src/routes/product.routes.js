import express from 'express';
import { getMongoDb } from '../database/mongo.js';

const router = express.Router();

// GET /products/search?q=lg tv
router.get("/search", async(req, res) => {
    try {
        const { q } = req.query;

        console.log("Search Query:", q);
        if ( !q ){
            return res.status(400).json( {
                error: "Query is required"
            } );
        }
            const db = getMongoDb();

            const results = await db
            .collection("products")
            .find({ $text: {$search: q }})
            .limit(10)
            .toArray();
            
            res.json({
                query:q,
                count: results.length,
                items: results
            });

    } catch (err) {
            console.error("🛑 Mongo search error:", err);
            res.status(500).json({ error: "Search failed" });
    }
});

export default router;