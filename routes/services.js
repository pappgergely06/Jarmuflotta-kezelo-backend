const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM services');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a szervizek lekérdezésekor");
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM services WHERE service_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send("Szerviz nem található");
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a szerviz lekérdezésekor");
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { date, type, next_service, vehicle_id } = req.body;
        const [result] = await db.query(
            'INSERT INTO services (date, type, next_service, vehicle_id) VALUES (?, ?, ?, ?)',
            [date, type, next_service, vehicle_id]
        );
        res.status(201).json({ id: result.insertId, message: "Szerviz bejegyzés sikeresen hozzáadva" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a szerviz bejegyzés hozzáadásakor");
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { date, type, next_service, vehicle_id } = req.body;
        const [result] = await db.query(
            'UPDATE services SET date=?, type=?, next_service=?, vehicle_id=? WHERE service_id=?',
            [date, type, next_service, vehicle_id, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).send("Szerviz nem található");
        res.json({ message: "Szerviz bejegyzés sikeresen frissítve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a szerviz bejegyzés frissítésekor");
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM services WHERE service_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send("Szerviz nem található");
        res.json({ message: "Szerviz bejegyzés sikeresen törölve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a szerviz bejegyzés törlésekor");
    }
});

module.exports = router;
