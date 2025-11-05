import AccountLinks from "../AccountLinks";
import Logo from "../Logo";
import SearchInput from "../Search";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center shrink-0">
          <Logo />
        </div>

        {/* Middle: Search - Hidden on small screens, shown on md+ */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <div className="w-full max-w-lg">
            <SearchInput />
          </div>
        </div>

        {/* Right: Account Links */}
        <div className="flex items-center space-x-2 shrink-0">
          <AccountLinks />
        </div>
      </div>
      
      {/* Mobile Search - Shown only on small screens */}
      <div className="md:hidden px-4 pb-3">
        <SearchInput />
      </div>
    </header>
  );
};

export default Header;