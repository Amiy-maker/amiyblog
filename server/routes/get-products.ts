import { RequestHandler } from "express";
import { getShopifyClient } from "../services/shopify-client.js";

export const handleGetProducts: RequestHandler = async (req, res) => {
  try {
    console.log("GET /api/products request received");
    const limit = parseInt(req.query.limit as string) || 250;
    console.log(`Fetching products with limit: ${limit}`);

    const shopifyClient = getShopifyClient();
    console.log("Shopify client initialized");

    // Validate Shopify connection first
    console.log("Validating Shopify connection...");
    const isConnected = await shopifyClient.validateConnection();
    if (!isConnected) {
      console.error("Shopify connection validation failed - credentials may be invalid");
      return res.status(503).json({
        success: false,
        error: "Cannot connect to Shopify",
        details: "Shopify credentials are not properly configured. Please check SHOPIFY_SHOP and SHOPIFY_ADMIN_ACCESS_TOKEN environment variables.",
        code: "SHOPIFY_CONNECTION_FAILED",
      });
    }

    const products = await shopifyClient.getProducts(limit);
    console.log(`Successfully fetched ${products.length} products`);

    res.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error instanceof Error ? error.message : String(error));
    console.error("Full error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Determine error status and provide helpful message
    let status = 500;
    let code = "PRODUCTS_FETCH_ERROR";
    let userMessage = "Failed to fetch products from Shopify";

    if (errorMessage.includes("401") || errorMessage.includes("Unauthorized") || errorMessage.includes("credentials")) {
      status = 401;
      code = "SHOPIFY_AUTH_ERROR";
      userMessage = "Shopify authentication failed. Check your credentials.";
    } else if (errorMessage.includes("not configured") || errorMessage.includes("SHOPIFY_SHOP")) {
      status = 503;
      code = "SHOPIFY_NOT_CONFIGURED";
      userMessage = "Shopify is not configured. Please set up your credentials.";
    } else if (errorMessage.includes("timeout") || errorMessage.includes("ECONNREFUSED")) {
      status = 503;
      code = "SHOPIFY_TIMEOUT";
      userMessage = "Shopify server is unreachable. Please try again later.";
    }

    res.status(status).json({
      success: false,
      error: userMessage,
      details: errorMessage,
      code,
    });
  }
};
