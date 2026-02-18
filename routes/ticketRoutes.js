// const router = require("express").Router();
// const db = require("../db/db");

// const auth = require("../middleware/auth");
// const role = require("../middleware/role");


// // CREATE TICKET (user)
// router.post("/", auth, (req, res) => {
//   const { title, description, category, priority } = req.body;

//   const stmt = db.prepare(`
//     INSERT INTO tickets (title, description, category, priority, createdBy)
//     VALUES (?, ?, ?, ?, ?)
//   `);

//   const result = stmt.run(
//     title,
//     description,
//     category,
//     priority,
//     req.user.id
//   );

//   res.json({ id: result.lastInsertRowid });
// });


// // USER: view own tickets
// router.get("/my", auth, (req, res) => {
//   const tickets = db
//     .prepare("SELECT * FROM tickets WHERE createdBy = ?")
//     .all(req.user.id);

//   res.json(tickets);
// });


// // SUPPORT: view all
// router.get("/", auth, role("support"), (req, res) => {
//   const tickets = db.prepare("SELECT * FROM tickets").all();
//   res.json(tickets);
// });


// // SUPPORT: update status
// router.put("/:id/status", auth, role("support"), (req, res) => {
//   db.prepare(
//     "UPDATE tickets SET table= ? WHERE id = ?"
//   ).run(req.body.status, req.params.id);

//   res.json({ message: "Updated" });
// });

// module.exports = router;




const router = require("express").Router();
const pool = require("../db/db");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// CREATE TICKET (user)
router.post("/", auth, async (req, res) => {
  const { title, description, priority } = req.body;

  const result = await pool.query(
    `INSERT INTO tickets (title, description, priority, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [title, description, priority, req.user.id]
  );

  res.json({ id: result.rows[0].id });
});


// USER: view own tickets
router.get("/my", auth, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM tickets WHERE user_id = $1",
    [req.user.id]
  );

  res.json(result.rows);
});


// SUPPORT: view all
router.get("/", auth, role("support"), async (req, res) => {
  const result = await pool.query("SELECT * FROM tickets");
  res.json(result.rows);
});


// SUPPORT: update status
router.put("/:id/status", auth, role("support"), async (req, res) => {
  await pool.query(
    "UPDATE tickets SET status = $1 WHERE id = $2",
    [req.body.status, req.params.id]
  );

  res.json({ message: "Updated" });
});

module.exports = router;
