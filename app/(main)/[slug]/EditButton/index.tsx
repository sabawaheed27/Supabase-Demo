

import Link from "next/link";

const EditButton = ({ slug }: { slug: string }) => {
  return (
    <Link className="button-secondary px-4 py-2 ml-2 rounded bg-blue-500 text-white hover:bg-blue-600" href={`/${slug}/edit`}>
      Edit
    </Link>
  );
};

export default EditButton;
