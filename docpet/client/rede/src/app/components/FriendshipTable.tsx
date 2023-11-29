import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../../axios";
import { useContext } from "react";
import UserContext from "@/context/UserContext";
import Link from "next/link";
import { FaBars, FaTimes } from 'react-icons/fa'; // Added toggle icons
import { IFriendship } from '@/interfaces';

// ... (other imports)

function FriendshipTable() {
    const { user } = useContext(UserContext);
    const queryClient = useQueryClient();
    const [isMenuOpen, setMenuOpen] = useState(false);
  
    const { data, error } = useQuery({
      queryKey: [`friendship`],
      queryFn: () => makeRequest.get('friendship/?follower_id=' + user?.id).then((res) => {
        return res.data.data;
      }),
      enabled: !!user
    });
  
    if (error) {
      console.log(error);
    }
  
    const mutation = useMutation({
      mutationFn: (unfollow: { followed_id: number; follower_id: number }) =>
        makeRequest
          .delete(
            `friendship/?follower_id=${unfollow.follower_id}&followed_id=${unfollow.followed_id}`
          )
          .then((res) => res.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['friendship'] });
      },
    });
  
    return (
      <div className={`fixed right-0 w-1/6 md:w-48 mr-4 mt-1 text-gray-600 flex flex-col gap-4 ${isMenuOpen ? 'menu-open' : ''}`}>
        <span className="font-bold cursor-pointer flex items-center text-lg font-semibold text-blue-500" onClick={() => setMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes className="w-6 h-6 mr-2" /> : <FaBars className="w-6 h-6 mr-2" />}
          {isMenuOpen && 'Seguindo'}
        </span>
        {data?.map((friendship: IFriendship) => (
          <div key={friendship.id} className={`flex flex-col gap-2 items-start ${isMenuOpen ? '' : 'hidden'}`}>
            <Link href={`profile?id=${friendship.followed_id}`} className="flex items-center gap-2">
              <img
                src={friendship.userImg || 'https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png'}
                alt="imagem do perfil"
                className="w-10 h-10 rounded-full"
              />
              <span className="ml-2 font-semibold whitespace-normal break-all">
                {friendship.username}
              </span>
            </Link>
            <button
              onClick={() => user && mutation.mutate({ followed_id: friendship.followed_id, follower_id: user?.id })}
              className="px-3 py-1 bg-blue-400 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Unfollow
            </button>
          </div>
        ))}
      </div>
    );
  }
  
  export default FriendshipTable;
  
