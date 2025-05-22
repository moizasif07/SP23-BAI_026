const express = require("express");
const server = express();

const PORT = 4000;
const expressLayouts = require("express-ejs-layouts");
server.use(express.static("public"));
server.set("view engine", "ejs");
server.use(expressLayouts);

server.get("/", (req, res) => {
  res.render("index"); 
});

server.get("/checkout", (req, res) => {
  res.render("checkout", { layout: false }); 
});

// Start the server
server.listen(PORT, () => {
  console.log(`✅ Server Started at http://localhost:${PORT}`);
});
