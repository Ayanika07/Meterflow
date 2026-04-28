const requestCounts = {};

export const rateLimiter = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) return next();

  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 10;

  if (!requestCounts[apiKey]) {
    requestCounts[apiKey] = { count: 1, startTime: now };
    return next();
  }

  const data = requestCounts[apiKey];
  const elapsed = now - data.startTime;

  if (elapsed > windowMs) {
    requestCounts[apiKey] = { count: 1, startTime: now };
    return next();
  }

  if (data.count >= maxRequests) {
    return res.status(429).json({
      message: "Rate limit exceeded. Max 10 requests per minute.",
      retryAfter: Math.ceil((windowMs - elapsed) / 1000) + " seconds"
    });
  }

  data.count++;
  next();
};