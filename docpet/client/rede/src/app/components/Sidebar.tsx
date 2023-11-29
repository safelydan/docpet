import UserContext from "@/context/UserContext";
import Link from "next/link";
import { useContext } from "react";
import {
  FaAlignLeft,
  FaHome,
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import { IUser } from "@/interfaces";

function Sidebar() {
  const { user } = useContext(UserContext);

  return (
    <aside className="fixed w-1/6 pl-4 mt-1"> 
      <nav className="flex flex-col gap-6 text-gray-600 font-semibold">
        <Link href="/main" className="flex items-center gap-2 hover:text-blue-500">
          <FaHome className="w-6 h-6 md:w-8 md:h-8" />
          <span className="text-lg font-bold hidden md:inline">Início</span>
        </Link>
        <Link href="/sections/faq" className="flex items-center gap-2 hover:text-blue-500">
          <FaInfoCircle className="w-6 h-6 md:w-8 md:h-8" />
          <span className="text-lg font-bold hidden md:inline">Sobre</span>
        </Link>
        <Link href="/sections/faqsection" className="flex items-center gap-2 hover:text-blue-500">
          <FaQuestionCircle className="w-6 h-6 md:w-8 md:h-8" />
          <span className="text-lg font-bold hidden md:inline">Ajuda</span>
        </Link>
        <Link href={'/profile?id=' + user?.id} className="flex items-center gap-2 mt-auto hover:text-blue-500">
          <img
            src={user?.userImg ? user.userImg : 'https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png'}
            alt="imagem do perfil"
            className="w-6 h-6 md:w-8 md:h-8 rounded-full"
          />
          <span className="text-lg font-bold hidden md:inline">{user?.username}</span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
