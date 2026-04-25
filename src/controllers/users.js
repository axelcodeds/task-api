const { pool } = require("../config/database");

function assertSelfAccess(req, res) {
  if (String(req.user.id) !== String(req.params.id)) {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }
  return true;
}

exports.getAll = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, email, name, created_at FROM users",
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    if (!assertSelfAccess(req, res)) {
      return;
    }

    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!assertSelfAccess(req, res)) {
      return;
    }

    const { id } = req.params;
    const { name, email } = req.body;

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, email, name",
      [name, email, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    if (!assertSelfAccess(req, res)) {
      return;
    }

    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
