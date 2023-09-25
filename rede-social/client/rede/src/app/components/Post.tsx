import { create } from "domain";
import { useContext, useEffect, useState } from "react";
import { FaPaperPlane, FaRegComment, FaThumbsUp } from "react-icons/fa";
import moment from 'moment';
import 'moment/locale/pt-br';
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import UserContext from "@/context/UserContext";
import Comment from "./Comment";

interface IPost{
    id: number;
    post_desc: string;
    img: string;
    username: string;
    userImg: string;
    created_at: string;
}

interface IUser{
    userImg: string;
    username: string;
}

interface IComments{
    id: number;
    comment_desc: string;
    userImg: string;
    comment_user_id: number;
    username: string;
    post_id: number;
    created_at: string;

}

function Post(props:{post: IPost}) {


    const{post_desc, img, username, userImg, created_at, id} = props.post

    const {user} = useContext(UserContext)
    const [comment_desc, setComment_desc] = useState('')
    const [showComments, setShowComments] = useState(false)
    const queryClient = useQueryClient()
    const {data, error, isLoading} = useQuery<IComments[] | undefined>({
        queryKey: ['comments', id],
        queryFn: ()=> makeRequest.get('comment/?post_id='+ id).then((res)=>{
            return res.data.data;
        }),
        enabled: !!id

    })  

    if (error){
        console.log(error)
    }

    const mutation = useMutation({
        mutationFn: async (newComment: {})=>{
            await makeRequest.post('comment/', newComment).then((res)=>{
                return res.data
            });

        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey: ['comments', id] })
        }
    })

    const shareComment = async ()=>{
        mutation.mutate({ comment_desc, comment_user_id: user?.id, post_id: id });
        setComment_desc('')
    }
    
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
                        <span className="text-xs">{moment(created_at).fromNow()}</span>
                    </div>
                    </header>




                    {post_desc && (
                    <div  className="py-4 w-full">
                        <span>{post_desc}</span>
                    </div>)}

                    {img && <img className="rounded-lg" src={`./upload/${img}`} alt="img do post"></img>}
                    <div className="flex justify-between py-4 border-b">
                       <div className="flex  gap-1 items-center">
                            <span className="bg-blue-600 w-6 h-6 text-white flex items-center justify-center rounded-full text-xs">
                                <FaThumbsUp/>
                            </span>
                            3
                        </div>
                        <button onClick={()=> setShowComments(!showComments)}> {data && data.length > 0 ? `${data.length} comentarios`: ''}</button>
                    </div>

                    <div className="flex justify-around py-4 text-gray-600 border-b">
                            <button className="flex items-center gap-1"><FaThumbsUp/>curtir</button>
                            <button className="flex items-center gap-1" onClick={()=> document.getElementById('comment' + id)?.focus}><FaRegComment/>comentar</button>
                    </div>
                    {showComments && data?.map((comment, id)=>{
                        return <Comment comment = {comment} key={id}/>
                    })}
                    <div className="flex gap-4 pt-6">
                    <img 
                        src={user?.userImg? user.userImg: 'https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png'} 
                        alt="imagem do perfil" 
                        className="u-8 h-8 rounded full"  />
                    

                    <div className="w-full bg-zinc-100 flex items-center text-gray rounded-full">
                        <input 
                        id={"comment" + id}
                        type="text" className="bg-zinc-100 w-full focus-visible:outline:none rounded-full" 
                        value={comment_desc}
                        onChange={(e)=> setComment_desc(e.target.value)} 
                        placeholder="comente"
                        />
                        <button onClick={()=> shareComment()}> <FaPaperPlane/></button>
                       
                    </div>
                   
                </div>
                 
                    
        </div>


    )
}

export default Post;