//import { JsonWebTokenError } from 'jsonwebtoken'
import {db} from '../connect.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = (req, res)=>{
    const {username, email, password, confirmPassword} = req.body

    if (!username){
        return res.status(422).json({msg: 'o nome eh obrigatorio'})
    }
    if (!email){
        return res.status(422).json({msg: 'o email eh obrigatorio'})
    }
    if (!password){
        return res.status(422).json({msg: 'a senha eh obrigatoria'})
    }
    if (confirmPassword != password){
        return res.status(422).json({msg: 'as senhas estao diferentes'})
    }

    db.query('SELECT email FROM user WHERE email = ?', [email], async(error, data) =>{
        if(error){
            console.log(error)
            return res.status(500).json({msg: 'nao foi possivel conectar'})
        }
        if(data.length > 0){
            return res.status(500).json({msg: 'este email ja esta registrado'})
        }else{
            const passwordHash = await bcrypt.hash(password, 8)
            db.query(
                'INSERT INTO user SET ?',{username, email, password: passwordHash},
                (error) =>{
                    if (error){
                        console.log(error)
                        return res.status(500).json({msg: 'erro no servidor'})
                    }else{
                        return res.status(200).json({msg: 'cadastro efetuado com sucesso'})
                    }
                }
            )
        }
    } )
}

export const login = (req, res)=>{
    const {email, password} = req.body

    db.query(
        'SELECT * FROM user WHERE email = ?', 
        [email], 
        async (error, data) => {
            if (error){
                console.log(error)
                return res.status(500).json({msg: 'erro no servidor'});
            }
            if(data.length === 0){
                return res.status(404).json({msg: 'usuario nao encontrado' })
            }else{
                const user = data[0];
                console.log(data)
                const checkPassword = await bcrypt.compare(password, user.password);

                if(!checkPassword){
                    return res.status(422).json({msg: 'senha incorreta'})
                }
                try{
                    const refreshToken = jwt.sign({
                        exp: Math.floor(Date.now()/1000) + 24 * 60 * 60,
                        id: user.password
                    },
                    process.env.REFRESH, 
                    {algorithm: "HS256"} 
                    )
                    const token = jwt.sign({
                        exp: Math.floor(Date.now()/1000) + 3600,
                        id: user.password
                    },
                    process.env.TOKEN, 
                    {algorithm: "HS256"} 
                    )
                    delete user.password;
                    return res.cookie('acessToken', token, {httpOnly: true, })
                    .cookie('refreshToken', refreshToken, {httpOnly: true, })
                    .status(200)
                    .json({msg: 'usuario logado com sucesso', user, })
                    // quando fizer o login recebe o user completo e os tokens, serve pra salvar e usar depois dentro da aplicação

                }
                catch(error){
                    console.log(error)
                    return res.send(500).json({msg: 'error'})
                }
 
            }

            

        }
    )
}
