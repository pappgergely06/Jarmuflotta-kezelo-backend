const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM services_list');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a szerviz lista tételek lekérdezésekor");
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM services_list WHERE service_list_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send("Szerviz lista tétel nem található");
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a szerviz lista tétel lekérdezésekor");
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, cost, service_id } = req.body;
        const [result] = await db.query(
            'INSERT INTO services_list (name, cost, service_id) VALUES (?, ?, ?)',
            [name, cost, service_id]
        );
        res.status(201).json({ id: result.insertId, message: "Szerviz lista tétel sikeresen hozzáadva" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a szerviz lista tétel hozzáadásakor");
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { name, cost, service_id } = req.body;
        const [result] = await db.query(
            'UPDATE services_list SET name=?, cost=?, service_id=? WHERE service_list_id=?',
            [name, cost, service_id, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).send("Szerviz lista tétel nem található");
        res.json({ message: "Szerviz lista tétel sikeresen frissítve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a szerviz lista tétel frissítésekor");
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM services_list WHERE service_list_id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).send("Szerviz lista tétel nem található");
        res.json({ message: "Szerviz lista tétel sikeresen törölve" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Hiba a szerviz lista tétel törlésekor");
    }
});

module.exports = router;
