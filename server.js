const WebSocket = require("ws");
const http = require("http");

// خادم HTTP لتشغيل WebSocket على نفس البورت
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// قائمة بالاتصالات النشطة
let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);

  ws.on("message", (message) => {
    // إعادة إرسال الرسالة لجميع العملاء باستثناء المرسل
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    clients = clients.filter(client => client !== ws);
  });
});

// شغّل السيرفر على المنفذ المناسب
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});