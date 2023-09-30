"use client"
<<<<<<< HEAD

=======
>>>>>>> 0e950f74e2d9ab084fe66bcfb389ab11478b7f65
import { useEffect, useState } from "react";
import Post from "./Post";
import { makeRequest } from "../../../axios";
import Share from "./Share";
import { useQuery } from "@tanstack/react-query";

interface IPost {
    id: number;
    post_desc: string;
    img: string;
    username: string;
    userImg: string;
    created_at: string;
}

function Feed() {
    const { data, isLoading, error } = useQuery<IPost[] | undefined>({
        queryKey: ['posts'],
        queryFn: () => makeRequest.get('post/')
            .then((res) => {
                return res.data.data;
            })
    });

    if (error) {
        console.log(error);
    }

    return (
        <div className="flex flex-col items-center gap-5 w-full">
            <Share />
            {isLoading ? (<span>carregando</span>) :
                (
                    <div className="w-full flex flex-col gap-5 items-center">{
                        data?.map((post, id) => {
                            return <Post post={post} key={id} />;
                        })
                    }</div>
                )}
        </div>
    );
}

export default Feed;