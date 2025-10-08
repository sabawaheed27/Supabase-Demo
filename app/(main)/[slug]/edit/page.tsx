import { getSinglePost } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";
import { redirect } from "next/navigation";
import EditForm from "./EditForm";

const EditPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { data, error } = await getSinglePost(slug);

  if (error || !data) {
    return <p className="text-center text-red-500">Post not found.</p>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user?.id !== data.user_id) {
    redirect("/");
  }
 return (
  <div className="max-w-2xl mx-auto my-12 p-6 bg-white shadow-md rounded-lg">
    <h1 className="text-2xl font-bold mb-6 text-center">Edit Post</h1>
    <EditForm post={data} />
  </div>
);
};

export default EditPage;
