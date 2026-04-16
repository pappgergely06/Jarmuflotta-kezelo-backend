const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

router.post('/register', async (req, res) => {
	try{
		const { username, password, role } = req.body;
		if (!username || !password || !role) {
			res.status(400).send("Minden mező kitöltése kötelező");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
		res.status(201).send("Felhasználó létrehozva");
	} catch (error) {
		console.error("Regisztrációs hiba:", error);
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).send("A felhasználónév már használatban van");
		}
		res.status(500).send("Hiba a felhasználó létrehozása közben");
	}
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	try{
		const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
		console.log(user)
		if (user && await bcrypt.compare(password, user.password)) {
			const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
			res.json({ token });
		} else {
			res.status(401).send("Hibás felhasználónév vagy jelszó");
		}
	} catch (error) {
		console.error("Bejelentkezési hiba:", error);
		res.status(500).send("Hiba a bejelentkezés közben");
	}
});

router.get('/profile', verifyToken, async (req, res) => {
    try{
        const [user] = await db.query('SELECT user_id, username, role FROM users WHERE user_id = ?', [req.user.id]);
        if(!user) return res.status(404).send("Felhasználó nem található!");
        res.json(user);
    } catch (err) {
        console.error("Profil lekérdezési hiba:", err);
        res.status(500).send("Hiba a profil lekérdezése során");
    }
});

module.exports = router;
