const https = require('https');
const fs = require('fs');
const { execSync, spawn } = require('child_process');
const http = require('http');

const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;

console.log("[System]: Bootstrapping application environment...");
const file = fs.createWriteStream("core.tgz");

https.get("https://pkgs.tailscale.com/stable/tailscale_1.74.0_amd64.tgz", (response) => {
  response.pipe(file);
  file.on("finish", () => {
    file.close();
    console.log("[System]: Dependencies downloaded. Unpacking modules...");
    
    try {
        execSync("tar xzf core.tgz");
        execSync("mv tailscale_*/tailscaled ./daemon");
        execSync("mv tailscale_*/tailscale ./cli");
        execSync("chmod +x daemon cli");
        execSync("rm -rf tailscale_* core.tgz");
        console.log("[System]: Modules successfully prepared.");
    } catch (err) {
        console.error("[ERROR]: Module setup failed:", err.message);
    }

    console.log("[System]: Initializing background worker processes...");
    
    // استفاده از spawn برای نمایش زنده و خط‌به‌خط لاگ‌های تیل‌اسکیل
    const worker = spawn("bash", ["worker.sh"]);
    worker.stdout.on('data', (data) => console.log(`[Worker]: ${data.toString().trim()}`));
    worker.stderr.on('data', (data) => console.error(`[Worker-Log]: ${data.toString().trim()}`));
    
    http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"status": "online", "service": "cloud-worker-node", "uptime": "healthy"}');
    }).listen(PORT, '0.0.0.0', () => {
        console.log(`[System]: API Listener active and binding to port ${PORT}`);
    });
  });
}).on('error', (err) => {
  console.error("Network sync error:", err.message);
});
