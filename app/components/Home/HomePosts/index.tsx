'use client'
import { createClient } from "@/utils/supabase/browser-client";
import { getHomePosts, HomePostType } from "@/utils/supabase/queries";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { formatDate, timeAgo } from "@/utils/formatDate";

const HomePosts = ({ posts }: { posts: HomePostType }) => {
    const { data } = useQuery({
        queryKey: ['home-posts'],
        queryFn: async () => {
            const supabase = createClient();
            const { data, error } = await getHomePosts(supabase);
            if (error) throw error;
            return data;
        },
        initialData: posts,
        refetchOnMount: false,
        staleTime: 10000,
    });

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <div className="bg-[url('/image1.jpg')] bg-cover bg-center rounded-4xl">
                <div className="flex flex-row flex-wrap gap-6 justify-center items-center p-6">
                    {data &&
                        data.map(({ id, slug, title, users, image_url, created_at }) => (
                            <Link
                                href={`/${slug}`}
                                key={id}
                                className="w-1/3 bg-neutral-900/80 border border-neutral-800 rounded-2xl shadow-lg p-10 flex flex-col justify-between hover:scale-105 hover:shadow-blue-950 transition-all"
                            >
                                {image_url && (
                                    <img
                                        src={image_url}
                                        alt={title}
                                        className="w-full h-40 object-cover rounded mb-4"
                                    />
                                )}
                                <h2 className="font-medium text-lg text-blue-100 mb-3 pb-2">
                                    {title}
                                </h2>

                                {/* formatted date & time */}
                                <p className="text-sm text-gray-500 mb-1 italic">
                                    {formatDate(created_at)} • {timeAgo(created_at)}
                                </p>

                                <div className="text-sm text-gray-400 text-right mt-2">
                                    Posted by{" "}
                                    <span className="text-gray-400 capitalize">
                                        {users.username}
                                    </span>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default HomePosts;
