import { RequestHandler } from "express";
import { getShopifyClient } from "../services/shopify-client.js";

export const handleGetProducts: RequestHandler = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;

    const shopifyClient = getShopifyClient();
    const products = await shopifyClient.getProducts(limit);

    res.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      error: "Failed to fetch products",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
