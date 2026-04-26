const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM driver_assignment');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a sofőr hozzárendelések lekérdezésekor");
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM driver_assignment WHERE assignment_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send("Hozzárendelés nem található");
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a hozzárendelés lekérdezésekor");
    }
});

router.get('/driver/:driver_id', verifyToken, async (req, res) => {
	try {
		const rows = await db.query('SELECT * FROM driver_assignment WHERE driver_id = ?', [req.params.driver_id]);
		if (rows.length === 0) return res.status(404).send("Nincs a sofőrnek autója");
		res.json(rows[0]);
	} catch (err) {
		console.error(err)
		res.status(500).send("Hiba a hozzárendelés lekérdezésekor");
	}
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { assigned_from, assigned_to, vehicle_id, driver_id } = req.body;
        const result = await db.query(
            'INSERT INTO driver_assignment (assigned_from, assigned_to, vehicle_id, driver_id) VALUES (?, ?, ?, ?)',
            [assigned_from, assigned_to, vehicle_id, driver_id]
        );
        res.status(201).json({ id: result.insertId, message: "Hozzárendelés sikeresen létrehozva" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a hozzárendelés létrehozásakor");
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { assigned_from, assigned_to, vehicle_id, driver_id } = req.body;
        const result = await db.query(
            'UPDATE driver_assignment SET assigned_from=?, assigned_to=?, vehicle_id=?, driver_id=? WHERE assignment_id=?',
            [assigned_from, assigned_to, vehicle_id, driver_id, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).send("Hozzárendelés nem található");
        res.json({ message: "Hozzárendelés sikeresen frissítve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a hozzárendelés frissítésekor");
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM driver_assignment WHERE assignment_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send("Hozzárendelés nem található");
        res.json({ message: "Hozzárendelés sikeresen törölve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a hozzárendelés törlésekor");
    }
});

module.exports = router;
