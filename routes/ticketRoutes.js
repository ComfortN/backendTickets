const router = require("express").Router();
const db = require("../db/db");

const auth = require("../middleware/auth");
const role = require("../middleware/role");


// CREATE TICKET (user)
router.post("/", auth, (req, res) => {
  const { title, description, category, priority } = req.body;

  const stmt = db.prepare(`
    INSERT INTO tickets (title, description, category, priority, createdBy)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    title,
    description,
    category,
    priority,
    req.user.id
  );

  res.json({ id: result.lastInsertRowid });
});


// USER: view own tickets
router.get("/my", auth, (req, res) => {
  const tickets = db
    .prepare("SELECT * FROM tickets WHERE createdBy = ?")
    .all(req.user.id);

  res.json(tickets);
});


// SUPPORT: view all
router.get("/", auth, role("support"), (req, res) => {
  const tickets = db.prepare("SELECT * FROM tickets").all();
  res.json(tickets);
});


// SUPPORT: update status
router.put("/:id/status", auth, role("support"), (req, res) => {
  db.prepare(
    "UPDATE tickets SET table= ? WHERE id = ?"
  ).run(req.body.status, req.params.id);

  res.json({ message: "Updated" });
});

module.exports = router;
