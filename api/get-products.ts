import { VercelRequest, VercelResponse } from '@vercel/node';
import { getShopifyClient } from './lib/shopify-client.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      details: 'Only GET requests are supported',
    });
  }

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

    res.status(200).json({
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
}
