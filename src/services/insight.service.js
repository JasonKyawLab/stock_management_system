import { generateInsight } from '../ai/gemini.client.js';

export async function buildInventoryInsight( {
    product,
    similarProducts,
    lowStockThreshold = 5
} ){

    if (!product){
        throw new Error ("Product data is required");
    }

    const isLowStock = product.quantity <= lowStockThreshold;

 const similarText = similarProducts.length > 0
  ? similarProducts.map(
      (p, index) =>
        `${index + 1}. ${p.description} (SKU: ${p.sku}, Brand: ${p.brand})`
    ).join("\n")
  : "No similar products found.";

    
    const prompt = `
You are an inventory assistant for a retail store.

Product:
- Name: ${product.name}
- SKU: ${product.sku}
- Price: ${product.price}
- Stock: ${product.quantity}

Stock Status:
${isLowStock ? "LOW STOCK" : "SUFFICIENT STOCK"}

Similar Products:
${similarText}

Task:
Explain the stock situation and recommend what the staff should do.
Keep the response short and practical.
`;

        return await generateInsight(prompt);
};