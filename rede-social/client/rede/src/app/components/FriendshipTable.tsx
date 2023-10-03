import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { useContext } from "react";
import UserContext from "@/context/UserContext";


interface IFriendship{
    id: number,
    follower_id: number
    followed_id: number
    username: string
    userImg: string
}


function Friendshiptable() {

    const {user} = useContext(UserContext)

    const {data, error} = useQuery({
        queryKey:['friendship'], 
        queryFn:()=> makeRequest.get('friendship/?follower_id=' + user?.id).then((res)=>{
            return res.data.data;
        })
    })
    
    if(error){
        console.log(error)
    }



    return (    
        <div>
            <span>seguindo</span>
            {data?.map((friendship: IFriendship)=>{
                return (
                    <div key={friendship.id} className="flex">
                        <img 
                        src={friendship.userImg? friendship.userImg: 'https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png'} 
                        alt="imagem do perfil" 
                        className="u-8 h-8 rounded-full" />
                        <span className="font-bold">{user?.username}</span>
                        <button>deixar de seguir</button>
                    </div>
                )
            })}
        </div>
        )
}

export default Friendshiptable;