const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await db.query('SELECT user_id, username, role FROM users');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a felhasználók lekérdezésekor");
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const rows = await db.query('SELECT user_id, username, role FROM users WHERE user_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send("Felhasználó nem található");
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a felhasználó lekérdezésekor");
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { username, role } = req.body;
        const result = await db.query(
            'UPDATE users SET username=?, role=? WHERE user_id=?',
            [username, role, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).send("Felhasználó nem található");
        res.json({ message: "Felhasználó sikeresen frissítve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a felhasználó frissítésekor");
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send("Felhasználó nem található");
        res.json({ message: "Felhasználó sikeresen törölve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a felhasználó törlésekor");
    }
});

module.exports = router;
