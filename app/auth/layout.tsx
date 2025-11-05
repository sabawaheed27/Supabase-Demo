import Logo from "../components/Logo";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full flex justify-center items-center py-4 sm:py-6 shadow-sm bg-white">
        <Logo />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;