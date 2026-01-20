import express from "express";
import { env } from "./config/env.js";
import inventoryRoutes  from "./routes/inventory.routes.js";
import productRoutes from "./routes/product.routes.js"; 
import { connectToMongo } from './database/mongo.js'


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

  // list inventroy from PostgreSql
  app.use('/inventory', inventoryRoutes);

  // list produdcts from MongoDb
  app.use("/products",productRoutes);

  // start server
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });

}

startServer();



