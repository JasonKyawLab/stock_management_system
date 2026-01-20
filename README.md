# stock_management_system
AI-Powered Stock Management System

The AI-Powered Stock Management System is designed to help retail businesses manage product inventory more efficiently by combining traditional databases with AI-based similarity search.

The system stores core stock data such as SKU, quantity, and price in PostgreSQL, which acts as the single source of truth. Product-related information such as name, description, category, and tags is stored in MongoDB to support flexible data structures and AI processing.

AI is integrated using a local embedding model (Ollama) to convert product descriptions into vector representations. These vectors allow the system to identify similar or substitute products based on meaning rather than exact keyword matches.

When a product is out of stock or low in quantity, the system can automatically suggest alternative products that are semantically similar. This helps store staff quickly assist customers without manually searching through inventory.

The AI component runs only when necessary, such as when products are created, updated, or when a similarity search is requested. This design minimizes server load and cost while still providing intelligent features.

The system is modular, cost-aware, and scalable. It can be used by small retail shops as well as extended later for larger enterprises by replacing the local AI model with a managed AI service if needed.


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
