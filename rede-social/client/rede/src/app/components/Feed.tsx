
import Post from "./Post";

const posts = [{
    id:1,
    post_desc: "teste1",
    img: "",
    username: "user",
    userImg: "",
},
{
    id:1,
    post_desc: "teste2",
    img: "https://1.bp.blogspot.com/-_reBqPK3Krk/YSnUhQmqj8I/AAAAAAAAEys/-SYPSF6lM04JqrUGYbGMr5yMFhRISYI-ACLcBGAsYHQ/s16000/bjork-20-anos-de-vespertine-1.jpg",
    username: "user",
    userImg: "",
}

];

function Feed() {
    return (
    
    <div className="flex flex-col items-center gap-5">
        {posts.map((post, id)=>{
            return(
                <Post post = {post} key={id}/>
            )
        })}
    </div>
)}

export default Feed;