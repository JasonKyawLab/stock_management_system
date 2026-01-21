# stock_management_system
The AI-Powered Stock Management System is designed to help retail businesses manage product inventory more efficiently by combining traditional databases with AI-assisted similarity and recommendation logic.

The system stores core stock data such as SKU, quantity, and price in PostgreSQL, which acts as the single source of truth. Product-related information such as name, description, category, and tags is stored in MongoDB to support flexible data structures and retrieval-based processing.

AI is integrated as a decision-support layer that analyzes existing inventory data and product information to generate insights and recommendations. The system follows a Retrieval-Augmented Generation (RAG) approach, where relevant product data is first retrieved from the databases and then provided as context to an AI model for reasoning.

When a product is low in stock or unavailable, the system can suggest alternative products that are semantically similar. This helps store staff respond quickly and consistently without manually searching through inventory.

The AI component is triggered only when it adds value, such as during low-stock situations or when similarity insights are requested. This design keeps the system cost-aware, efficient, and scalable.

The architecture is modular and can be extended in the future by integrating vector embeddings or replacing the AI model with a managed service as the system grows.


Project Structure

inventory-system/
├── src/
│   ├── app.js
│   ├── routes/
│   │   ├── product.routes.js
│   │   └── inventory.routes.js
│   ├── database/
│   │   ├── mongo.js
│   │   └── postgres.js
│   ├── services/
│   │   ├── product.service.js
│   │   ├── inventory.service.js
│   │   └── embedding.service.js
│   └── config/
│       └── env.js
├── .gitignore
├── package.json
└── README.md
├── README.md


Steps
1.npm install
2.npm install dotenv
