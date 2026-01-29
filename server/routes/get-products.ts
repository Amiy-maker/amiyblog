import { RequestHandler } from "express";
import { getShopifyClient } from "../services/shopify-client.js";

export const handleGetProducts: RequestHandler = async (req, res) => {
  try {
    const shopifyClient = getShopifyClient();

    // Validate connection first
    const isConnected = await shopifyClient.validateConnection();
    if (!isConnected) {
      return res.status(503).json({
        error: "Unable to connect to Shopify",
        code: "SHOPIFY_CONNECTION_FAILED",
        details: "Please check your Shopify credentials are properly configured",
      });
    }

    // Fetch products
    const products = await shopifyClient.getProducts();

    res.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Determine error code based on error message
    let errorCode = "SHOPIFY_ERROR";
    if (errorMessage.includes("authentication")) {
      errorCode = "SHOPIFY_AUTH_ERROR";
    } else if (errorMessage.includes("not configured")) {
      errorCode = "SHOPIFY_NOT_CONFIGURED";
    } else if (errorMessage.includes("not found")) {
      errorCode = "SHOPIFY_NOT_FOUND";
    }

    res.status(500).json({
      error: "Failed to load products from Shopify",
      code: errorCode,
      details: errorMessage,
    });
  }
};
