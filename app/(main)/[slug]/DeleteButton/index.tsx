
'use client'

import DeletePost from "@/action/delete-post"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

const DeleteButton = ({postId}: {postId: number})=>{
    const queryClient = useQueryClient();
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: DeletePost,
        onMutate: () => {
            toast.loading("Deleting post...", { id: "delete-post" });
        },
        onSuccess: () => {
            // Invalidate all posts queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['home-posts'] });
            
            // Show success toast
            toast.success("Post deleted successfully!", { id: "delete-post" });
            
            // Close confirmation modal
            setShowConfirm(false);
            
            // Refresh the page data without full reload
            router.refresh();
            
            // Redirect to home if on single post page
            // Uncomment the line below if needed
            // router.push('/');
        },
        onError: (error) => {
            toast.error("Failed to delete post", { id: "delete-post" });
            console.error("Delete error:", error);
        }
    });

    const handleDelete = () => {
        mutate(postId);
    };

    return (
        <>
            <button 
                onClick={() => setShowConfirm(true)}
                className="button-tertiary"
                disabled={isPending}
            >
                {isPending ? "Deleting..." : "Delete Post"}
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowConfirm(false)}
                >
                    <div 
                        className="bg-white rounded-lg p-6 max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-2">Delete Post?</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete this post? This action cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                disabled={isPending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition"
                            >
                                {isPending ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DeleteButton;