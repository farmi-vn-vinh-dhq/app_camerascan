import { createServer } from "node:https";
import { readFileSync } from "node:fs";
import { parse } from "node:url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3003", 10);

const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: readFileSync("./certificates/key.pem"),
  cert: readFileSync("./certificates/cert.pem"),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`✓ HTTPS server running at https://localhost:${port}`);
    console.log(`  Network: https://192.168.18.33:${port}`);
    console.log(`  Camera will work on all devices via HTTPS`);
  });
});
