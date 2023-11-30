"use client"

import Post from "./Post";
import { IPost } from "@/interfaces";

function Feed(props:{post:IPost[]|undefined}) {


    return (
<div className="flex flex-col items-center gap-5 w-full">
  <div className="md:w-2/4 flex flex-col gap-3 items-center">
    {props.post?.map((post, id) => {
      return <Post post={post} key={id} />;
    })}
  </div>
</div>

    );
}

export default Feed;