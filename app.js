const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
const { DB_URL, JWT_SECRET } = process.env;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

console.log(DB_URL);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
