import {db} from '../connect.js'

export const createPost = (req, res) =>{
    const {post_desc, img, userId} = req.body;

    if(!post_desc && !img ){
        return res.status(422).json({msg: 'o post precisa de texto ou imagem'})
    }

    db.query('INSERT INTO posts SET ?', {post_desc, img, userId}, (error)=>{
        if(error){
            console.log(error)
            return res.status(500).json({msg: 'erro no servidor'})
        }else{
            return res.status(200).json({msg: 'postagem feita com sucesso'})
        }
    })
}
<<<<<<< HEAD



export const getPost = (req, res)=>{

    if(req.query.id){
        db.query('SELECT p.*, u.username, userImg FROM posts as p JOIN user as u ON (u.Id = p.userId) WHERE u.id = 1 ORDER BY created_at DESC', [req.query.id], (error, data)=>{
=======
export const getPost = (req, res)=>{

    if(req.query.id){
        db.query('SELECT p.*, u.username, userImg FROM posts as p JOIN user as u ON (u.id = p.userId) WHERE u.id = ? ORDER BY created_at DESC', [req.query.id],(error, data)=>{
>>>>>>> 96e23adb1ae255174c8a7120b2e3bdd6e3b4dc3d
            if(error){
                console.log(error)
                return res.status(500).json({msg: 'erro no servidor'})
            }else if(data){
                console.log(data)
                return res.status(200).json({data})
<<<<<<< HEAD
            }
        }
    )
}
=======
    
            }
        })
    }
>>>>>>> 96e23adb1ae255174c8a7120b2e3bdd6e3b4dc3d
    else{
        db.query('SELECT p.*, u.username, userImg FROM posts as p JOIN user as u ON (u.Id = p.userId) ORDER BY created_at DESC', (error, data)=>{
            if(error){
                console.log(error)
                return res.status(500).json({msg: 'erro no servidor'})
            }else if(data){
                console.log(data)
                return res.status(200).json({data})
    
            }
        })
    }

<<<<<<< HEAD
=======

>>>>>>> 96e23adb1ae255174c8a7120b2e3bdd6e3b4dc3d
}