import Link from "next/link";

const Logo = () => {
  return (
    <div>
      <Link 
        href="/" 
        className="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors whitespace-nowrap"
      >
        The Quad
      </Link>
    </div>
  );
}

export default Logo;