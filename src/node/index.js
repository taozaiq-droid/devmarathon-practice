const express = require("express");
const path = require("path");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// 1. ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. データベース接続
const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "postgres",
  password: "pass_5466",
  port: 5432,
});

// 3. ルート設定

// 【一覧取得】
app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers ORDER BY customer_id ASC");
    res.json(customerData.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 【詳細取得】
app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [id]);
    res.json(customerData.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 【新規登録】
app.post("/register", async (req, res) => {
  try {
    const { company_name, industry, contact, location } = req.body;
    await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4)",
      [company_name, industry, contact, location]
    );
    res.redirect("/customer/list.html");
  } catch (err) {
    res.status(500).send("エラー: " + err.message);
  }
});

// 【更新】
app.put("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, industry, contact, location } = req.body;
    await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4 WHERE customer_id = $5",
      [company_name, industry, contact, location, id]
    );
    res.json({ message: "更新成功" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 【削除】
app.delete("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);
    res.json({ message: "削除成功" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. 静的ファイル
app.use(express.static(path.join(__dirname, "src/web")));

// 5. 起動
app.listen(5466, "0.0.0.0", () => {
  console.log(`Server running on port 5466`);
});