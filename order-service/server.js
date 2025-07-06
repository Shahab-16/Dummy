const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const PORT = process.env.PORT || 5004;

server.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});