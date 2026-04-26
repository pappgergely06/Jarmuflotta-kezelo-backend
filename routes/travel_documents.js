const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM travel_document');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba az utazási naplók lekérdezésekor");
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM travel_document WHERE log_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send("Utazási napló nem található");
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba az utazási napló lekérdezésekor");
    }
});

router.get('/vehicle/:id', verifyToken, async (req, res) => {
	try {
		const rows = await db.query('SELECT * FROM travel_document WHERE vehicle_id = ?', [req.params.id]);
		if (rows.length === 0) return res.status(404).send("Utazási napló nem található");
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Hiba az utazási napló lekérdezésekor");
	}
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { date, start_km, end_km, vehicle_id } = req.body;
        const result = await db.query(
            'INSERT INTO travel_document (date, start_km, end_km, vehicle_id) VALUES (?, ?, ?, ?)',
            [date, start_km, end_km, vehicle_id]
        );
        res.status(201).json({ id: result.insertId, message: "Utazási napló sikeresen hozzáadva" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba az utazási napló hozzáadásakor");
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { date, start_km, end_km, vehicle_id } = req.body;
        const result = await db.query(
            'UPDATE travel_document SET date=?, start_km=?, end_km=?, vehicle_id=? WHERE log_id=?',
            [date, start_km, end_km, vehicle_id, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).send("Utazási napló nem található");
        res.json({ message: "Utazási napló sikeresen frissítve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba az utazási napló frissítésekor");
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM travel_document WHERE log_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send("Utazási napló nem található");
        res.json({ message: "Utazási napló sikeresen törölve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba az utazási napló törlésekor");
    }
});

module.exports = router;
