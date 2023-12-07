import jwt from 'jsonwebtoken';

const handleTokenError = (res, error) => {
    console.error(error);
    res.status(400).json({ msg: "Token inválido" });
};

export const checkToken = (req, res, next) => {
    const cookieHeader = req.headers.cookie?.split(';')[0];
    const token = cookieHeader && cookieHeader.split('=')[1];

    if (token) {
        try {
            jwt.verify(token, process.env.TOKEN);
            next();
        } catch (error) {
            handleTokenError(res, error);
        }
    } else {
        res.status(401).json({ msg: 'Acesso negado. Token ausente' });
    }
};
