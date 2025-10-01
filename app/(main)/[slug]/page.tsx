
import { createClient } from "@/utils/supabase/server-client";
import DeleteButton from "./DeleteButton";
import { getSinglePost } from "@/utils/supabase/queries";

const SinglePost = async ({ params }: { params: { slug: string }}) => {
    const { slug } = await params;
    const {data, error}= await getSinglePost(slug)
    
    if (error || !data) {
        return <div className="text-center text-red-500">Post not found or an error occurred.</div>

    }

    const supabase = await createClient();
    const {data: {user}}= await supabase.auth.getUser()

    const isAuthor = user?.id === data.user_id;

    return (
        <>
            <div className="max-w-3xl mx-auto my-12 p-6 rounded-lg shadow-md bg-white">
                <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
                <p className="mt-6 text-gray-500 text-right">
                    By {data.users.username}
                </p>
            </div>

            {data.content && (
                <div className="max-w-2xl p-4 m-auto mt-4 rounded-2xl bg-gray-200 text-center text-gray-700">
                    <div>{data.content}</div>
                </div>
            )}

            {isAuthor && (
                <div className="w-2xl p-4 m-auto mt-4 flex border-2 border-gray-700 rounded-2xl bg-gray-200 text-center text-gray-700">
                    <DeleteButton postId={data.id!} />
                </div>
            )}
        </>
    );
};

export default SinglePost;
