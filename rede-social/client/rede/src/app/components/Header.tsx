"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {FaSearch, FaBell} from 'react-icons/fa'
import {TbMessageCircle2Filled} from 'react-icons/tb'


function Header() {

    const [user, setUser] =useState({username: '', userImg: ''})
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();

    useEffect(()=>{
        let value = localStorage.getItem('rede: user')
        if(value){
            setUser(JSON.parse(value))
        }
    },[])

    //apagando o token ele perde qualquer sistema de reload e algumas verificaçoes que te mandam de volta pra pagina de login
    const logout = (e:any)=>{
        e.preventDefault();
        localStorage.removeItem('rede: token')
        router.push('/login')
    }

    return(
        <header className="w-full bg-white flex justify-between py-2 px-4 items-center shadow-md" >
            <Link href='/' className="font-bold text-sky-900 text-lg">codpet</Link>
            <div className="flex bg-zinc-100 items-center text-gray-600 px-3 py-1 rounded-full">
                <input type="text" placeholder='pesquisar' className="bg-zinc-100 focus-visible:outline-none"/>
                <FaSearch/>
            </div>
            <div className="flex gap-2 items-center text-gray-600">
                <div className="flex gap-3 ">
                    <button className="bg-zinc-200 p-2 rounded-full hover:bg-zinc-400">
                        <TbMessageCircle2Filled/>
                    </button >
                    <button className="bg-zinc-200 p-2 rounded-full hover:bg-zinc-400">
                        <FaBell/>
                    </button>
                </div>
                <div className="relative" onMouseLeave={()=>setShowMenu(false)}> 
                    <button className="flex gap-2 items-center " onClick={()=>setShowMenu(!showMenu)}>
                        <img 
                        src={user.userImg.length >0? user.userImg: 'https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png'} 
                        alt="imagem do perfil" 
                        className="u-8 h-8 rounded-full" />
                        <span className="font-bold">{user.username}</span>
                    </button>
                    {showMenu && (
                    <div className="absolute flex flex-col bg-white p-4 shadow-md rounded-md gap-2 border-t-3 whitespace-nowrap right-[-35px]">
                        <Link href='' className="border-b">editar perfil</Link>
                        <Link href='' onClick={(e)=>logout(e)}>logout</Link>
                    </div>
                    )}
                </div>

            </div>
        </header>
    )
}

export default Header;