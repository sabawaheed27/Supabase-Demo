import AccountLinks from "../AccountLinks";
import Logo from "../Logo";
import SearchInput from "../Search";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

     
        {/* Middle: Search */}
        <div className="flex flex-1 justify-center px-4">
          <div className="w-full max-w-lg">
            <SearchInput />
          </div>
        </div>


        {/* Right: Account Links */}
        <div className="flex items-center space-x-2">
          <AccountLinks />
        </div>
      </div>
    </header>
  );
};

export default Header;
