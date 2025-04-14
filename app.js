const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory products
const products = [
  { id: 1, name: "Laptop", description: "High performance", price: 59999 },
  { id: 2, name: "Headphones", description: "Noise-cancelling", price: 1999 },
];

// Custom Middlewares
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`Request took ${duration}ms`);
  });
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index", { products });
});

app.get("/product/:id", (req, res, next) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return next(); // 404
  res.render("product", { product });
});

app.get("/new", (req, res) => {
  res.render("new", { error: null });
});

app.post("/product", (req, res, next) => {
  const { name, description, price } = req.body;

  if (!name || !description || isNaN(price) || price <= 0) {
    return res.render("new", { error: "Please enter valid data!" });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    description,
    price: parseFloat(price),
  };

  products.push(newProduct);
  res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    products.splice(index, 1);
  }
  res.redirect("/");
});

app.get("/stats", (req, res) => {
  const total = products.length;
  const prices = products.map(p => p.price);
  const avg = (prices.reduce((a, b) => a + b, 0) / total).toFixed(2);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  res.render("stats", { total, avg, min, max });
});


// 404 Middleware
app.use((req, res, next) => {
  res.status(404).render("notfound", { path: req.url });
});


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
