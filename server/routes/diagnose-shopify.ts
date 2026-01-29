import { RequestHandler } from "express";

export const handleDiagnoseShopify: RequestHandler = async (_req, res) => {
  try {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      status: "ok",
      issues: [],
      environment: {},
      connection: null,
    };

    // Check environment variables
    const shopName = process.env.SHOPIFY_SHOP;
    const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION || "2025-01";
    const blogId = process.env.BLOG_ID;

    diagnostics.environment = {
      SHOPIFY_SHOP: shopName ? `✓ Set (${shopName})` : "✗ NOT SET",
      SHOPIFY_ADMIN_ACCESS_TOKEN: accessToken ? `✓ Set (length: ${accessToken.length})` : "✗ NOT SET",
      SHOPIFY_API_VERSION: apiVersion,
      BLOG_ID: blogId ? `✓ Set (${blogId})` : "Not set (will be fetched)",
    };

    // Validate credentials format
    if (!shopName) {
      diagnostics.issues.push("SHOPIFY_SHOP environment variable is not set");
    } else if (!shopName.includes("myshopify.com")) {
      diagnostics.issues.push(`SHOPIFY_SHOP format may be incorrect: "${shopName}". Expected format: "myshop.myshopify.com"`);
    }

    if (!accessToken) {
      diagnostics.issues.push("SHOPIFY_ADMIN_ACCESS_TOKEN environment variable is not set");
    } else if (accessToken.length < 20) {
      diagnostics.issues.push(`SHOPIFY_ADMIN_ACCESS_TOKEN seems too short (${accessToken.length} chars). Access tokens are typically longer.`);
    }

    // Try to validate connection if we have the basic credentials
    if (shopName && accessToken) {
      try {
        console.log(`[Diagnose] Attempting connection to ${shopName}`);
        const baseUrl = `https://${shopName}/admin/api/${apiVersion}`;
        
        const response = await fetch(`${baseUrl}/shop.json`, {
          headers: {
            "X-Shopify-Access-Token": accessToken,
          },
        });

        if (response.ok) {
          const data = await response.json();
          diagnostics.connection = {
            status: "✓ Connected",
            shopName: data.shop?.name,
            url: `${baseUrl}/shop.json`,
            responseStatus: response.status,
          };
        } else {
          diagnostics.connection = {
            status: "✗ Connection Failed",
            url: `${baseUrl}/shop.json`,
            responseStatus: response.status,
            responseStatusText: response.statusText,
          };

          if (response.status === 401) {
            diagnostics.issues.push("HTTP 401: Access token is invalid or expired. Please regenerate your Shopify API token.");
          } else if (response.status === 404) {
            diagnostics.issues.push(`HTTP 404: Shop not found. Please verify that SHOPIFY_SHOP="${shopName}" is correct.`);
          } else {
            diagnostics.issues.push(`HTTP ${response.status}: ${response.statusText}`);
          }
        }
      } catch (error) {
        diagnostics.connection = {
          status: "✗ Connection Error",
          error: error instanceof Error ? error.message : String(error),
        };
        diagnostics.issues.push(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    // Set overall status
    if (diagnostics.issues.length > 0) {
      diagnostics.status = "error";
    } else if (diagnostics.connection?.status?.includes("Connected")) {
      diagnostics.status = "ok";
    } else if (!shopName || !accessToken) {
      diagnostics.status = "error";
    }

    res.json(diagnostics);
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }
};
