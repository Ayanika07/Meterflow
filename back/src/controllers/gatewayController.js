import fetch from "node-fetch";

export const forwardRequest = async (req, res) => {
  try {
    const { apiId } = req.apiKey;
    const baseUrl = apiId.baseUrl;

    // Get everything after /gateway/
    const targetPath = req.path;
    const queryString = new URLSearchParams(req.query).toString();
    const targetUrl = `${baseUrl}${targetPath}${queryString ? "?" + queryString : ""}`;

    console.log(`Forwarding to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json"
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};