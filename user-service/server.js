const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});

