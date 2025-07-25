const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const PORT = process.env.PORT || 5005;

server.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});