import Feed from "@/app/components/Feed";
import Share from "@/app/components/Share";

function Main() {
    return (
    <div className="w-2/6 flex flex-col gap-5">
        <Share />
        <Feed/>
    </div>)
}

export default Main;