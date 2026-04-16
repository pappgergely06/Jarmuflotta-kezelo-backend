const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vehicles');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a járművek lekérdezésekor");
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vehicles WHERE vehicle_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send("Jármű nem található");
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a jármű lekérdezésekor");
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { created_at, next_technical_exam, year, model, brand, vin, start_odometer, insurance_expiry, lisence_plate } = req.body;
        const [result] = await db.query(
            'INSERT INTO vehicles (created_at, next_technical_exam, year, model, brand, vin, start_odometer, insurance_expiry, lisence_plate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [created_at, next_technical_exam, year, model, brand, vin, start_odometer, insurance_expiry, lisence_plate]
        );
        res.status(201).json({ id: result.insertId, message: "Jármű sikeresen hozzáadva" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a jármű hozzáadásakor");
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { created_at, next_technical_exam, year, model, brand, vin, start_odometer, insurance_expiry, lisence_plate } = req.body;
        const [result] = await db.query(
            'UPDATE vehicles SET created_at=?, next_technical_exam=?, year=?, model=?, brand=?, vin=?, start_odometer=?, insurance_expiry=?, lisence_plate=? WHERE vehicle_id=?',
            [created_at, next_technical_exam, year, model, brand, vin, start_odometer, insurance_expiry, lisence_plate, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).send("Jármű nem található");
        res.json({ message: "Jármű sikeresen frissítve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a jármű frissítésekor");
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM vehicles WHERE vehicle_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send("Jármű nem található");
        res.json({ message: "Jármű sikeresen törölve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a jármű törlésekor");
    }
});

module.exports = router;
