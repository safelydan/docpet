"use client"

import { useQuery } from "@tanstack/react-query"
import { makeRequest } from "../../../../axios"
import Feed from "@/app/components/Feed"

interface IPost {
    id: number;
    post_desc: string;
    img: string;
    username: string;
    userImg: string;
    created_at: string;
}


function Profile({searchParams}:{searchParams:{id:string}})
{

    const profileQuery = useQuery({
        queryKey:['profile', searchParams.id],
        queryFn:()=> makeRequest.get('users/get-user?id=' + searchParams.id).then((res)=>{
            return res.data[0]
        })
})

    if(profileQuery.error){
        console.log(profileQuery.error)
    }

    const postQuery = useQuery<IPost[] | undefined>({
        queryKey: ['posts'],
        queryFn: () => makeRequest.get('post/')
            .then((res) => {
                return res.data.data;
            })
    });

    if (postQuery.error) {
        console.log(postQuery.error);
    }

    return(
        <div className="w-3/5 flex flex-col items-center">
            <div className="relative">
                <img className="rounded-xl" src={profileQuery.data?.bgImg? profileQuery.data.bgImg: 
                    'https://img.freepik.com/fotos-gratis/fundo-azul-do-gradiente-de-luxo-abstrato-liso-azul-escuro-com-vinheta-preta-studio-banner_1258-52393.jpg?w=740&t=st=1696028331~exp=1696028931~hmac=ff6d78a9446b39ef04877dee2de00952857aa4f088936de0c5b8778ce72ad8c6'} 
                    alt="capa" />

            <div className="flex absolute bottom-[-110px] left-10 items-center">
                <img className="w-40 h-40 rounded-full border-zinc-100 border-4" src={profileQuery.data?.userImg?profileQuery.data.userImg: "https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png"} alt="" />
                <span className="text-2m font-bold pl-2">{profileQuery.data?.username}</span>
            </div>
        </div>
        <div className="pt-36 w-3/5" >
            <Feed post={postQuery.data/>
        </div>
    </div>
    )
}


export default Profile