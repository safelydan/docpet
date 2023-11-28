//import { JsonWebTokenError } from 'jsonwebtoken'
import { db } from '../connect.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username) {
        return res.status(422).json({ msg: 'O nome é obrigatório' });
    }
    if (!/^[a-zA-Z0-9_-]{3,16}$/.test(username)) {
        return res.status(422).json({ msg: 'Nome de usuário inválido. Use apenas letras, números, "-" e "_", com 3 a 16 caracteres.' });
    }
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' });
    }
    if (!/^\S+@\S+$/.test(email)) {
        return res.status(422).json({ msg: 'Formato de email inválido.' });
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória' });
    }
    if (password.length < 8) {
        return res.status(422).json({ msg: 'A senha deve ter no mínimo 8 caracteres' });
    }
    if (confirmPassword !== password) {
        return res.status(422).json({ msg: 'As senhas estão diferentes' });
    }

    db.query('SELECT email FROM user WHERE email = ?', [email], async (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ msg: 'Não foi possível conectar' });
        }
        if (data.length > 0) {
            return res.status(500).json({ msg: 'Este email já está registrado' });
        } else {
            const passwordHash = await bcrypt.hash(password, 8);
            db.query(
                'INSERT INTO user SET ?', { username, email, password: passwordHash },
                (error) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ msg: 'Erro no servidor' });
                    } else {
                        return res.status(200).json({ msg: 'Cadastro efetuado com sucesso' });
                    }
                }
            );
        }
    });
};

export const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Digite o e-mail e a senha.' });
    }

    db.query(
        'SELECT * FROM user WHERE email = ?', 
        [email], 
        async (error, data) => {
            if (error){
                console.log(error);
                return res.status(500).json({msg: 'Erro no servidor'});
            }
            if(data.length === 0){
                return res.status(404).json({msg: 'Usuário não encontrado' });
            } else {
                const user = data[0];
                console.log(data);
                const checkPassword = await bcrypt.compare(password, user.password);

                if(!checkPassword){
                    return res.status(422).json({msg: 'Senha incorreta'});
                }
                
                try{
                    const refreshToken = jwt.sign({
                        exp: Math.floor(Date.now()/1000) + 24 * 60 * 60,
                        id: user.password
                    },
                    process.env.REFRESH, 
                    {algorithm: "HS256"} 
                    );
                    const token = jwt.sign({
                        exp: Math.floor(Date.now()/1000) + 3600,
                        id: user.password
                    },
                    process.env.TOKEN, 
                    {algorithm: "HS256"} 
                    );

                    delete user.password;

                    res.cookie("accessToken", token, {httpOnly: true})
                    .cookie("refreshToken", refreshToken, {httpOnly: true})
                    .status(200).json({msg: 'Usuário logado com sucesso', user});
                    // Quando fizer o login recebe o user completo e os tokens, serve para salvar e usar depois dentro da aplicação

                }
                catch(error){
                    console.log(error);
                    return res.send(500).json({msg: 'Error'});
                }
            }
        }
    );
};

// Função que divide em três os tokens

export const refresh = (req, res) => {
    const authHeader = req.headers.cookie?.split(';')[1];
    const refresh = authHeader && authHeader.split('=')[1];
    const tokenStruct = refresh.split('.')[1];
    const payload = atob(tokenStruct); // Descripto na base64
    
    try {
        const refreshToken = jwt.sign({
            exp: Math.floor(Date.now()/1000) + 24 * 60 * 60,
            id: JSON.parse(payload).id, 
        },
        process.env.REFRESH, 
        {algorithm: "HS256"} 
        );
        const token = jwt.sign({
            exp: Math.floor(Date.now()/1000) + 3600,
            id: JSON.parse(payload).id,            
        },
        process.env.TOKEN, 
        {algorithm: "HS256"} 
        );

        res.cookie("accessToken", token, {httpOnly: true})
        .cookie("refreshToken", refreshToken, {httpOnly: true})
        .status(200).json({msg: 'Token atualizado com sucesso'});
        // Quando fizer o login recebe o user completo e os tokens, serve para salvar e usar depois dentro da aplicação

    }
    catch(error){
        console.log(error);
        return res.send(500).json({msg: 'Error'});
    }
};

// Faz o logout e limpa os cookies
export const logout = (req, res) => {
    return res.clearCookie('accessToken', {secure: true, sameSite: 'none'})
    .clearCookie('refreshToken', {secure: true, sameSite: 'none'})
    .status(200).json({msg: 'Logout efetuado com sucesso'});
};

export const deleteUser = (req, res) => {
    const userId = req.user.id; // Assumindo que você tenha um middleware que define req.user após a autenticação
  
    db.query('DELETE FROM user WHERE id = ?', [userId], (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Erro no servidor' });
      } else {
        return res.status(200).json({ msg: 'Usuário excluído com sucesso' });
      }
    });
};
