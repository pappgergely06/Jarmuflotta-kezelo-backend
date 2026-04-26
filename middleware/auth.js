const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("Token szükséges!");

    try{
	const tokenParts = token.split(' ');
	
	if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
		return res.status(401).send("Hibás token formátum");
	}
	const bearer = tokenParts[1];
        const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error){
        return res.status(401).send("Érvénytelen token!");
    }
};

const verifyAdmin = (req, res, next) => {
    if (!req.user || !req.user.role || req.user.role !== 'admin') return res.status(403).send("Nincs jogosultságod!");
    next();
};

module.exports = { verifyToken, verifyAdmin };
