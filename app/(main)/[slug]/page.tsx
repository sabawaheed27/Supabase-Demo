
import { createClient } from "@/utils/supabase/server-client";
import DeleteButton from "./DeleteButton";
import { getSinglePost } from "@/utils/supabase/queries";
import EditButton from "./EditButton";
import CommentList from "./comments/CommentList";
import CommentForm from "./comments/CommentForm";

const SinglePost = async ({ params }: { params: { slug: string } }) => {
    const { slug } =  await params;
    const supabase = await createClient();

    // Fetch post data
    const { data, error } = await getSinglePost(slug);

    if (error || !data) {
        return (
            <div className="text-center text-red-500">
                Post not found or an error occurred.
            </div>
        );
    }

    // Get current user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isAuthor = user?.id === data.user_id;

    return (
        <>
            <div className="max-w-3xl mx-auto my-12 p-6 rounded-lg shadow-md bg-white">
                <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
                {data.image_url && (
                    <img
                        src={data.image_url}
                        alt={data.title}
                        className="w-full h-auto object-cover rounded-lg my-4"
                    />
                )}
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
                    <EditButton slug={slug} />
                </div>
            )}

            {/*Add Comments Section Here */}
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>

                {/* Comment list (shows all comments) */}
                <CommentList postId={data.id} postSlug={data.slug} />

                {/* Comment form (only visible if logged in) */}
                {user ? (
                    <CommentForm postId={data.id} postSlug={data.slug} />
                ) : (
                    <p className="text-gray-500 mt-4">
                        Please log in to add a comment.
                    </p>
                )}
            </div>
        </>
    );
};

export default SinglePost;

