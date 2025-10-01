import AccountLinks from "../AccountLinks";
import Logo from "../Logo";
import SearchInput from "../Search";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

     
        {/* Middle: Search */}
        <div className="flex flex-1 justify-center px-4 sm:px-6">
          <div className="w-full max-w-md">
            <SearchInput />
          </div>
        </div>


        {/* Right: Account Links */}
        <div className="flex items-center space-x-4">
          <AccountLinks />
        </div>
      </div>
    </header>
  );
};

export default Header;
