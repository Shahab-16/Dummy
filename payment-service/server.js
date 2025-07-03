const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 5004;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
