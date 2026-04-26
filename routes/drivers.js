const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM drivers');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a sofőrök lekérdezésekor");
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM drivers WHERE driver_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send("Sofőr nem található");
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a sofőr lekérdezésekor");
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { license_number, address, email, phone, name, starting_date, user_id } = req.body;
        const result = await db.query(
            'INSERT INTO drivers (license_number, address, email, phone, name, starting_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [license_number, address, email, phone, name, starting_date, user_id]
        );
        res.status(201).json({ id: result.insertId, message: "Sofőr sikeresen hozzáadva" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a sofőr hozzáadásakor");
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { license_number, address, email, phone, name, starting_date, user_id } = req.body;
        const result = await db.query(
            'UPDATE drivers SET license_number=?, address=?, email=?, phone=?, name=?, starting_date=?, user_id=? WHERE driver_id=?',
            [license_number, address, email, phone, name, starting_date, user_id, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).send("Sofőr nem található");
        res.json({ message: "Sofőr sikeresen frissítve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a sofőr frissítésekor");
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM drivers WHERE driver_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send("Sofőr nem található");
        res.json({ message: "Sofőr sikeresen törölve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a sofőr törlésekor");
    }
});

module.exports = router;
