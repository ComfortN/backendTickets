// const router = require("express").Router();
// const db = require("../db/db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");


// // REGISTER
// router.post("/register", async (req, res) => {
//   const { name, email, password, role = "user" } = req.body;
 
//   const hashed = await bcrypt.hash(password, 10);

//   try {
//     const stmt = db.prepare(
//       "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
//     );

//     const result = stmt.run(name, email, hashed, role);

//     res.json({ id: result.lastInsertRowid });
//   } catch {
//     res.status(400).json({ message: "Email already exists" });
//   }
// });


// // LOGIN
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = db
//     .prepare("SELECT * FROM users WHERE email = ?")
//     .get(email);

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(400).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign(
//     { id: user.id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   res.json({ token, user });
// });

// module.exports = router;


const router = require("express").Router();
const pool = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, email, hashed, role]
    );

    res.json({ id: result.rows[0].id });
  } catch (error) {
    res.status(400).json({ message: "Email already exists" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
