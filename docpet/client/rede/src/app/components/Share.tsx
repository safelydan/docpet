"use client";
import React, { useContext, useState, useEffect } from "react";
import { FaPaperPlane, FaUserFriends } from "react-icons/fa";
import { TbPhoto } from "react-icons/tb";
import { makeRequest } from "../../../axios";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserContext from "@/context/UserContext";

function Share() {
  const { user } = useContext(UserContext);
  const [post_desc, setDesc] = useState("");
  const [postImg, setPostImg] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const queryCliente = useQueryClient();

  useEffect(() => {
    if (img) {
      setPostImg(URL.createObjectURL(img));
    }
  }, [img]);

  const mutation = useMutation({
    mutationFn: async (newPost: {}) => {
      await makeRequest.post("post/", newPost).then((res) => {
        return res.data;
      });
    },
    onSuccess: () => {
      queryCliente.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const upload = async () => {
    try {
      const formData = new FormData();
      img && formData.append("file", img);
      const res = await makeRequest.post("upload/", formData);
      return res.data;
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      throw new Error("Erro ao fazer upload");
    }
  };

  const sharePost = async () => {
    try {
      setLoading(true);

      let imgUrl = "";
      if (img) {
        imgUrl = await upload();
      }

      await mutation.mutateAsync({
        post_desc,
        img: imgUrl,
        userId: user?.id,
      });

      setDesc("");
      setImg(null);
    } catch (error) {
      console.error("Erro ao compartilhar post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-2/4 md:w-3/4 lg:w-1/2 xl:w-2/4 bg-white rounded-lg p-4 border border-gray-300 flex flex-col gap-4">
      {img && (
        <img
          src={postImg}
          alt="img do post"
          className="w-full rounded-lg mb-2"
        />
      )}
      <div className="flex items-start gap-4">
        <Link href={"/profile?id=" + user?.id}>
          <img
            src={
              user?.userImg
                ? user.userImg
                : "https://www.digitary.net/wp-content/uploads/2021/07/Generic-Profile-Image.png"
            }
            alt="imagem do perfil"
            className="w-10 h-10 rounded-full"
          />
        </Link>
        <textarea
          placeholder={`O que está acontecendo?!`}
          value={post_desc}
          className="flex-1 focus:outline-none resize-none border-b-2 border-gray w-full"
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="file"
            id="img"
            className="hidden l-3"
            onChange={(e) => e.target.files && setImg(e.target.files[0])}
          />
          <label htmlFor="img" className="cursor-pointer">
            <TbPhoto className="text-2xl text-gray-500 hover:text-blue-500" />
          </label>
        </div>
        <button
          onClick={sharePost}
          className={`bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 ${
            (!post_desc && !img) || loading
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
          disabled={!post_desc && !img}
        >
          {loading ? "Enviando..." : "Postar"}
        </button>
      </div>
    </div>
  );
}

export default Share;
