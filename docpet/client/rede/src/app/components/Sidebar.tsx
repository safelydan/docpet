import UserContext from "@/context/UserContext";
import Link from "next/link";
import { useContext } from "react";
import {
  FaBell,
  FaCog,
  FaCommentAlt,
  FaHeart,
  FaHome,
  FaInfoCircle,
  FaQuestionCircle,
  FaSearch,
  FaUsers,
} from "react-icons/fa";

function Sidebar() {
  const { user } = useContext(UserContext);

  return (
    <aside className="fixed bottom-0 w-full bg-white to-white border-t border-gray-300 z-50 p-4 md:w-1/6 md:pl-4 md:bottom-auto md:border-t-0 md:border-r">
      <nav className="flex md:flex-col md:gap-6 text-gray-700 font-semibold justify-between md:justify-start">
        <Link
          href="/main"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <FaHome className="w-6 h-6 md:w-8 md:h-8" />
          <span className="text-lg font-bold hidden md:inline">Home</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
        >
          <FaSearch className="w-6 h-6 md:w-8 md:h-8" />
          <span className="text-lg font-bold hidden md:inline">Buscar</span>
        </Link>
        <Link
          href=""
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
        >
          <FaCommentAlt className="w-6 h-6 md:w-8 md:h-8" />
          <span className="text-lg font-bold hidden md:inline">Messages</span>
        </Link>
        <Link
          href=""
          className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
        >
          <FaHeart className="w-6 h-6 md:w-8 md:h-8" />
          <span className="text-lg font-bold hidden md:inline">Favs</span>
        </Link>
        <Link
          href={"/profile?id=" + user?.id}
          className="flex items-center gap-2 mt-auto text-gray-700 hover:text-blue-500 transition-colors"
        >
          <img
            src={
              user?.userImg
                ? user.userImg
                : "https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png"
            }
            alt="imagem do perfil"
            className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-blue-400"
          />
          <span className="text-lg font-bold hidden md:inline">
            {user?.name} (@{user?.username})
          </span>
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
