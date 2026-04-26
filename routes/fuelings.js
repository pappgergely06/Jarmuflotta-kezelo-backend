const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM fuelings');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a tankolások lekérdezésekor");
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const rows = await db.query('SELECT * FROM fuelings WHERE fueling_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send("Tankolás nem található");
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a tankolás lekérdezésekor");
    }
});

router.get('/vehicle/:id', verifyToken, async (req, res) => {
	try{
		const rows = await db.query('SELECT * FROM fuelings WHERE vehicle_id = ?', [req.params.id]);
		if (rows.length === 0) return res.status(404).send("Tankolás nem található");
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).send("Hiba a tankolás lekérdezésekor");
	}
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { date, amount_liters, price_per_liter, vehicle_id } = req.body;
        const result = await db.query(
            'INSERT INTO fuelings (date, amount_liters, price_per_liter, vehicle_id) VALUES (?, ?, ?, ?)',
            [date, amount_liters, price_per_liter, vehicle_id]
        );
        res.status(201).json({ id: result.insertId, message: "Tankolás sikeresen hozzáadva" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a tankolás hozzáadásakor");
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { date, amount_liters, price_per_liter, vehicle_id } = req.body;
        const result = await db.query(
            'UPDATE fuelings SET date=?, amount_liters=?, price_per_liter=?, vehicle_id=? WHERE fueling_id=?',
            [date, amount_liters, price_per_liter, vehicle_id, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).send("Tankolás nem található");
        res.json({ message: "Tankolás sikeresen frissítve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a tankolás frissítésekor");
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM fuelings WHERE fueling_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send("Tankolás nem található");
        res.json({ message: "Tankolás sikeresen törölve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a tankolás törlésekor");
    }
});

module.exports = router;
