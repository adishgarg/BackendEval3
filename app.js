const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const products = [
  { id: 1, name: "Laptop", description: "High performance", price: 59999 },
  { id: 2, name: "Headphones", description: "Noise-cancelling", price: 1999 },
];

// Routes
app.get("/", (req, res) => {
  res.render("index", { products });
});

app.get("/product/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).render("notfound");
  res.render("product", { product });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/product", (req, res) => {
  const { name, description, price } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price: parseFloat(price),
  };
  products.push(newProduct);
  res.redirect("/");
});

// 404 middleware
app.use((req, res) => {
  res.status(404).render("notfound");
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
