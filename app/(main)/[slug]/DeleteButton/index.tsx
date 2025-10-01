'use client'

import DeletePost from "@/action/delete-post"
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const DeleteButton = ({postId}: {postId: number})=>{
    const{mutate, error}= useMutation({
        mutationFn: DeletePost,
        onMutate: ()=>toast("Post Deleted"),
        onSettled: () =>toast.success("Post Deleted")
    })
    return <button onClick={() =>mutate(postId)}className="button-tertiary">Delete Post</button>
}

export default DeleteButton;