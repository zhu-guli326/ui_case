import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const portFlagIndex = process.argv.indexOf("--port");
const hostFlagIndex = process.argv.indexOf("--host");
const port = Number(process.env.IMAGE2_UI_PORT || (portFlagIndex >= 0 ? process.argv[portFlagIndex + 1] : 4174));
const host = process.env.IMAGE2_UI_HOST || (hostFlagIndex >= 0 ? process.argv[hostFlagIndex + 1] : "127.0.0.1");
const types = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".mjs":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".json":"application/json; charset=utf-8", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".webp":"image/webp", ".svg":"image/svg+xml", ".mp4":"video/mp4", ".webm":"video/webm" };

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
  let pathname = decodeURIComponent(requestUrl.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  const target = path.resolve(root, `.${pathname}`);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  fs.stat(target, (statError, stats) => {
    const file = !statError && stats.isDirectory() ? path.join(target, "index.html") : target;
    fs.readFile(file, (error, data) => {
      if (error) { response.writeHead(404, { "Content-Type":"text/plain; charset=utf-8" }).end("Not found"); return; }
      response.writeHead(200, { "Content-Type":types[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control":"no-cache" });
      response.end(data);
    });
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`端口 ${port} 已被占用。请关闭旧的预览窗口后重试。`);
    process.exitCode = 1;
    return;
  }
  throw error;
});

server.listen(port, host, () => {
  console.log(`Image2 UI 已启动：http://${host}:${port}/`);
  console.log("保持此窗口开启；按 Ctrl+C 停止预览。");
});
