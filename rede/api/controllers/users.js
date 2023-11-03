import {db} from '../connect.js'

export const getUser = (req, res) =>{

    const id = req.query.id

    if(!id){
        return res.status(422).json({msg: 'é preciso o id'})
    }

    db.query('SELECT username, userImg, bgImg FROM user WHERE id = ?', [id], (error, data)=>{
        if (error){
            console.log(error)
            res.status(500).json({msg: 'erro no servidor'})
        }
        else{
            return res.status(200).json(data)
        }
    })
}
export const updateUser = (req, res) =>{

    const {username, userImg, bgImg, id} = req.body

    if(!username || !userImg || !bgImg) //se todas forem negativas
    { 
        return res.status(422).json({msg: 'sem alteraçoes pra serem feitas'})
    }

    db.query('UPDATE user SET username = ?, userImg = ?, bgImg = ? WHERE id = ?', [username, userImg, bgImg, id], (error, data)=>{
    // cada ponto de interrogação desse vai ser atendida por uma dessas variaveis    
        
        if (error){
            console.log(error)
            res.status(500).json({msg: 'erro no servidor',})
        }
        if(data.affectedRows > 0)
        {
            return res.status(200).json('atualizado com sucesso')
        }
    })
}