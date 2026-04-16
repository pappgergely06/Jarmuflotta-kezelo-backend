const verifyToken = jest.fn((req, res, next) => {
    req.user = { id: 1, role: 'admin' };
    next();
});

module.exports = { verifyToken };
