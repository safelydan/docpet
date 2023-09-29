import {db} from '../connect.js'

export const getUser = (req, res) =>{
    const id = req.query.id


    if(!id){
        return res.status(422).json({msg: 'precisamos do id do usuario'})
    }
    db.query('SELECT username, userImg, bgImg FROM user WHERE id =?', [id], (error, data)=>{
        if (error){
            console.log(error)
            return res.status(500).json({msg: 'erro no servidor', });
        }
        else{
            return res.status(200).json(data)
        }
    })
}