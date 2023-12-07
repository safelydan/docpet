import jwt from 'jsonwebtoken'
export const checkRefreshToken = async (req, res, next) => {
    const authHeader = req.headers.cookie?.split(';')[1];
    const refreshToken = authHeader && authHeader.split('=')[1];

    if (refreshToken) {
        try {
            const decodedToken = await jwt.verify(refreshToken, process.env.REFRESH);
            req.userId = decodedToken.id; // Adiciona o ID do usuário ao objeto req para uso posterior
            next();
        } catch (error) {
            console.error(error);
            res.status(400).json({ msg: "Token inválido ou expirado" });
        }
    } else {
        return res.status(401).json({ msg: 'Acesso negado. Token de atualização ausente' });
    }
};