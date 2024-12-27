"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../../../axios";
import Feed from "@/app/components/Feed";
import { useContext, useState } from "react";
import UserContext from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import { IFriendship, IPost } from "@/interfaces";
import { FaTimesCircle } from "react-icons/fa";

function Profile() {
  const { user, setUser } = useContext(UserContext);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [followed, setFollowed] = useState(false);
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [userImg, setUserImg] = useState("");
  const [bgImg, setBgImg] = useState("");
  const [editProfile, setEditProfile] = useState(false);

  const userId = searchParams.get("id"); // userId pode ser null

  // Verifica se userId não é nulo antes de usar
  if (!userId) {
    return <div>Perfil não encontrado</div>;
  }

  // Queries para pegar dados do perfil
  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: () =>
      makeRequest.get(`users/get-user?id=${userId}`).then((res) => {
        const userData = res.data[0] || {};
        setName(userData.name);
        setUserName(userData.username);
        setUserImg(userData.userImg);
        setBgImg(userData.bgImg);
        return userData;
      }),
  });

  const postQuery = useQuery<IPost[] | undefined>({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get("post/?id=" + userId).then((res) => res.data.data),
  });

  const friendshipQuery = useQuery({
    queryKey: [`friendship`],
    queryFn: () =>
      makeRequest.get("friendship/?follower_id=" + user?.id).then((res) => {
        res.data.data.find((e: IFriendship) => {
          if (e.followed_id === +userId) {
            setFollowed(true);
          }
        });
        return res.data.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: async (unfollow: {
      followed_id: number;
      follower_id: number;
      followed: boolean;
    }) => {
      if (followed) {
        return await makeRequest
          .delete(
            `friendship/?follower_id=${unfollow.follower_id}&followed_id=${unfollow.followed_id}`
          )
          .then((res) => {
            setFollowed(false);
            res.data;
          });
      } else {
        return await makeRequest
          .post(`friendship/`, {
            follower_id: unfollow.follower_id,
            followed_id: unfollow.followed_id,
          })
          .then((res) => {
            setFollowed(true);
            res.data;
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendship"] });
    },
  });

  const handleEditProfile = () => {
    setEditProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = {
        name,
        username,
        userImg,
        bgImg,
      };

      await makeRequest.put(`users/update-user?id=${userId}`, updatedProfile);
      setEditProfile(false); // Fecha o formulário de edição
      profileQuery.refetch(); // Atualiza os dados do perfil
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  return (
    <>
      <title>
        {profileQuery.data?.name + ` (${profileQuery.data?.username}) / Codpet`}
      </title>
      <div className="max-w-screen-md mx-auto flex flex-col">
        {/* Capa do perfil */}
        <div className="relative w-full h-56 bg-gray-200">
          <img
            className="w-full h-full object-cover"
            src={
              profileQuery.data?.bgImg ||
              "https://via.placeholder.com/800x200.png?text=Banner"
            }
            alt="Capa"
          />
          {/* Avatar */}
          <div className="absolute left-4 bottom-[-50px]">
            <img
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
              src={
                profileQuery.data?.userImg ||
                "https://via.placeholder.com/150.png?text=Avatar"
              }
              alt="Avatar"
            />
          </div>
        </div>

        {/* Informações do usuário */}
        <div className="mt-12 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              {profileQuery.data?.name || "Usuário"}
            </h1>
            <p className="text-gray-500">@{profileQuery.data?.username}</p>
          </div>
          <div>
            {user?.id !== +userId ? (
              <button
                onClick={() =>
                  user &&
                  mutation.mutate({
                    followed,
                    followed_id: +userId,
                    follower_id: user.id,
                  })
                }
                className={`py-2 px-4 rounded-full font-semibold ${
                  followed
                    ? "bg-gray-300 text-black hover:bg-gray-400"
                    : "bg-blue-500 text-white hover:bg-blue-700"
                }`}
              >
                {followed ? "Deixar de seguir" : "Seguir"}
              </button>
            ) : (
              <button
                className="py-2 px-4 rounded-full bg-blue-500 text-white hover:bg-blue-700"
                onClick={handleEditProfile}
              >
                Editar perfil
              </button>
            )}
          </div>
        </div>

        {/* Formulário de edição de perfil */}
        {editProfile && (
          <div className="mt-4 px-4 py-4 bg-white shadow-md rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-semibold">
                Nome de usuário:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">
                Nome de usuário:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">
                Imagem de perfil:
              </label>
              <input
                type="text"
                value={userImg}
                onChange={(e) => setUserImg(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">
                Imagem de capa:
              </label>
              <input
                type="text"
                value={bgImg}
                onChange={(e) => setBgImg(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditProfile(false)}
                className="py-2 px-4 text-red-500 border border-red-500 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                className="py-2 px-4 bg-blue-500 text-white rounded-md"
              >
                Salvar
              </button>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="mt-4 px-4 ">
          <Feed post={postQuery.data} />
        </div>
      </div>
    </>
  );
}

export default Profile;
