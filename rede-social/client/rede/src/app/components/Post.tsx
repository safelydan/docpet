import { create } from "domain";
import { useEffect, useState } from "react";
import { FaPaperPlane, FaRegComment, FaThumbsUp } from "react-icons/fa";

interface IPost{
    id: number,
    post_desc: string,
    img: string,
    username: string,
    userImg: string,
    created_at: string
}

interface IUser{
    userImg: string,
    username: string
}

function Post(props:{post: IPost}) {


    const{post_desc, img, username, userImg, created_at} = props.post

    const [user, setUser] = useState<IUser | undefined>()
    
        useEffect(()=>{
            let value = localStorage.getItem('rede: user')
            if(value){
                setUser(JSON.parse(value))
            }
        },[])
    
        let date = new Date(created_at)
        let formatedDate = date.getDate() + "/" +(date.getMonth() + 1) + '/' + date.getFullYear() 

         

    return (
        <div className="w-1/3 bg-white rounded-lg p-4 shadow-md">
            <header className="flex gap-2 pb-4 border-b items-center">
                <img 
                className="w-8 h-8 rounded-full" 
                src={
                    userImg?
                    userImg:
                    "https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png"}

                    alt="imagem do usuario q fez o post"/>
                    <div className="flex flex-col">
                        <span className="font-semibold">{username}</span>
                        <span className="text-xs">{formatedDate }</span>
                    </div>
                    </header>




                    {post_desc && (
                    <div  className="py-4 w-full">
                        <span>{post_desc}</span>
                    </div>)}

                    {img && <img className="rounded-lg" src={img} alt="img do post"></img>}
                    <div className="flex justify-between py-4 border-b">
                       <div className="flex  gap-1 items-center">
                            <span className="bg-blue-600 w-6 h-6 text-white flex items-center justify-center rounded-full text-xs">
                                <FaThumbsUp/>
                            </span>
                            3
                        </div>
                        <span>3 comentarios</span>
                    </div>

                    <div className="flex justify-around py-4 text-gray-600 border-b">
                            <button className="flex items-center gap-1"><FaThumbsUp/>curtir</button>
                            <button className="flex items-center gap-1"><FaRegComment/>comentar</button>
                    
                    </div>
                    
                    <div className="flex gap-4 pt-6">
                    <img 
                        src={user?.userImg? user.userImg: 'https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png'} 
                        alt="imagem do perfil" 
                        className="u-8 h-8 rounded full"  />
                    
                    <div className="w-full bg-zinc-100 flex items-center text-gray rounded-full">
                        <input type="text" className="bg-zinc-100 w-full focus-visible:outline:none rounded-full" />
                        <FaPaperPlane/>
                    </div>
                   
                </div>
                 
                    
        </div>


    )
}

export default Post;