import express from "express";
import { env } from "./config/env.js";
import inventoryRoutes  from "./routes/inventory.routes.js";
import productRoutes from "./routes/product.routes.js"; 
import { connectToMongo } from './database/mongo.js'
import aiRoutes from './routes/ai.routes.js';

//const express = rßquire("express");

const app = express();

// middleware
app.use(express.json());

async function startServer() {
  // MongoDb Connection
  await connectToMongo();

  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      message: 'Inventory system running'
    });
  });

  // root route
  app.get("/", (req, res) => {
    res.send("Stock Management System API is running");
  });

  // Logging middleware
  app.use((req, res, next) => {
  const start = Date.now();

  console.log(`⚠️➡️  ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `⚠️⬅️  ${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`
    );
  });

  next();
});

  // list inventroy from PostgreSql
  app.use('/inventory', inventoryRoutes);

  // list produdcts from MongoDb
  app.use("/products",productRoutes);

  // use ai
  //GET http://localhost:3000/ai/inventory/TV-LG-55-002/insight
  app.use("/ai", aiRoutes);

  // start server
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });

}

startServer();



