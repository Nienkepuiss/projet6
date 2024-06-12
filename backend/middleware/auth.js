const jwt = require('jsonwebtoken');

// Middleware pour l'authentification des utilisateurs
module.exports = (req, res, next) => {
    try {
        // Récupération du token d'authentification à partir des en-têtes de la requête
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
