//import { JsonWebTokenError } from 'jsonwebtoken'
import { db } from '../connect.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Verificação do username
        if (!username) {
            return res.status(422).json({ msg: 'O username é obrigatório' });
        }
        if (!/^[a-zA-Z0-9_-]{3,16}$/.test(username)) {
            return res.status(422).json({ msg: 'Username inválido. Use apenas letras, números, "-" e "_", com 3 a 16 caracteres.' });
        }

        // Verificação do email
        if (!email) {
            return res.status(422).json({ msg: 'O email é obrigatório' });
        }
        if (!/^\S+@\S+$/.test(email)) {
            return res.status(422).json({ msg: 'Formato de email inválido.' });
        }

        // Verificação da senha
        if (!password) {
            return res.status(422).json({ msg: 'A senha é obrigatória' });
        }
        if (password.length < 8) {
            return res.status(422).json({ msg: 'A senha deve ter no mínimo 8 caracteres' });
        }
        if (confirmPassword !== password) {
            return res.status(422).json({ msg: 'As senhas estão diferentes' });
        }

        const [emailData] = await db.promise().query('SELECT email FROM user WHERE email = ?', [email]);
        if (emailData.length > 0) {
            return res.status(422).json({ msg: 'Este email já está registrado' });
        }

        const [usernameData] = await db.promise().query('SELECT username FROM user WHERE username = ?', [username]);
        if (usernameData.length > 0) {
            return res.status(422).json({ msg: 'Este username já está em uso' });
        }

        const passwordHash = await bcrypt.hash(password, 8);
        await db.promise().query('INSERT INTO user SET ?', { username, email, password: passwordHash });

        return res.status(200).json({ msg: 'Cadastro efetuado com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Erro no servidor' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Digite o e-mail e a senha.' });
        }

        const [data] = await db.promise().query('SELECT * FROM user WHERE email = ?', [email]);

        if (data.length === 0) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        const user = data[0];
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(422).json({ msg: 'Senha incorreta' });
        }

        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH, { expiresIn: '24h' });
        const token = jwt.sign({ id: user.id }, process.env.TOKEN, { expiresIn: '1h' });

        delete user.password;

        res.cookie('accessToken', token, { httpOnly: true })
            .cookie('refreshToken', refreshToken, { httpOnly: true })
            .status(200).json({ msg: 'Usuário logado com sucesso', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Erro no servidor' });
    }
};

// Função que divide em três os tokens


export const refresh = (req, res) => {
    try {
        const authHeader = req.headers.cookie?.split(';')[1];
        const refresh = authHeader && authHeader.split('=')[1];
        const tokenStruct = refresh.split('.')[1];
        const payload = atob(tokenStruct); // Descriptografado na base64

        const refreshToken = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            id: JSON.parse(payload).id,
        },
            process.env.REFRESH,
            { algorithm: "HS256" }
        );
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 3600,
            id: JSON.parse(payload).id,
        },
            process.env.TOKEN,
            { algorithm: "HS256" }
        );

        res.cookie("accessToken", token, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .status(200).json({ msg: 'Token atualizado com sucesso' });
        // Quando fizer o login recebe o user completo e os tokens, serve para salvar e usar depois dentro da aplicação
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error' });
    }
};

// Faz o logout e limpa os cookies
export const logout = (req, res) => {
    return res.clearCookie('accessToken', { secure: true, sameSite: 'none' })
        .clearCookie('refreshToken', { secure: true, sameSite: 'none' })
        .status(200).json({ msg: 'Logout efetuado com sucesso' });
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;

        await db.promise().query('DELETE FROM user WHERE id = ?', [userId]);

        return res.status(200).json({ msg: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Erro no servidor' });
    }
};
