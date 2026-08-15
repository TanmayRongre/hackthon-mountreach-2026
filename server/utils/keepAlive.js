/**
 * Keep-Alive Utility for Render / Cloud Web Services
 * 
 * Free-tier web services on Render, Railway, etc. spin down after 15 minutes
 * of inactivity. This utility automatically pings the server's health check endpoint
 * every 10 minutes to ensure 100% uptime and zero cold-start latency.
 */

const https = require('https');
const http = require('http');

let keepAliveTimer = null;
let lastPingTime = null;
let lastPingStatus = null;
let pingCount = 0;

/**
 * Perform a single health check ping
 */
function pingHealth(url) {
  if (!url) return;

  const targetUrl = url.endsWith('/api/health')
    ? url
    : url.endsWith('/api')
    ? `${url}/health`
    : `${url.replace(/\/$/, '')}/api/health`;

  const client = targetUrl.startsWith('https') ? https : http;
  const startTime = Date.now();

  const req = client.get(targetUrl, { timeout: 15000 }, (res) => {
    const latency = Date.now() - startTime;
    lastPingTime = new Date().toISOString();
    lastPingStatus = {
      code: res.statusCode,
      latencyMs: latency,
      url: targetUrl,
    };
    pingCount++;

    if (res.statusCode >= 200 && res.statusCode < 400) {
      console.log(`[Keep-Alive ⚡] Ping #${pingCount} successful (${latency}ms) → ${targetUrl}`);
    } else {
      console.warn(`[Keep-Alive ⚠️] Ping returned status ${res.statusCode} (${latency}ms)`);
    }

    // Consume response data to free up memory
    res.on('data', () => {});
  });

  req.on('error', (err) => {
    lastPingTime = new Date().toISOString();
    lastPingStatus = {
      error: err.message,
      url: targetUrl,
    };
    console.error(`[Keep-Alive ❌] Ping failed: ${err.message}`);
  });

  req.on('timeout', () => {
    req.destroy();
    console.warn(`[Keep-Alive ⏱️] Ping timed out for ${targetUrl}`);
  });
}

/**
 * Initialize automatic keep-alive pinger
 * @param {Object} options
 * @param {string} options.url - Explicit server URL (e.g. process.env.RENDER_EXTERNAL_URL or process.env.BACKEND_URL)
 * @param {number} options.intervalMs - Ping interval in milliseconds (default: 10 minutes = 600,000ms)
 */
function initKeepAlive(options = {}) {
  // Determine server URL:
  // 1. Explicitly provided option
  // 2. process.env.BACKEND_URL (e.g., https://hackthon-mountreach-2026.onrender.com)
  // 3. process.env.RENDER_EXTERNAL_URL (Render automatically injects this into web service environments)
  // 4. process.env.PING_URL
  const serverUrl =
    options.url ||
    process.env.BACKEND_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.PING_URL ||
    (process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:5000');

  const intervalMs = options.intervalMs || 10 * 60 * 1000; // 10 minutes

  // Stop any existing timer
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
  }

  console.log(`[Keep-Alive ⚡] Service initialized. Target URL: ${serverUrl} (Interval: ${intervalMs / 1000 / 60}m)`);

  // First ping after 30 seconds to allow cold server startup
  setTimeout(() => {
    pingHealth(serverUrl);
  }, 30000);

  // Set recurring interval
  keepAliveTimer = setInterval(() => {
    pingHealth(serverUrl);
  }, intervalMs);

  // Unref timer so it doesn't block graceful shutdown
  if (keepAliveTimer && typeof keepAliveTimer.unref === 'function') {
    keepAliveTimer.unref();
  }

  return {
    serverUrl,
    intervalMs,
  };
}

/**
 * Return current keep-alive telemetry
 */
function getKeepAliveStatus() {
  return {
    enabled: !!keepAliveTimer,
    pingCount,
    lastPingTime,
    lastPingStatus,
    targetUrl: process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL || 'Localhost / Self-Ping',
  };
}

module.exports = {
  initKeepAlive,
  pingHealth,
  getKeepAliveStatus,
};
