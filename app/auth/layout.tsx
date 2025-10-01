
import Logo from "../components/Logo";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full flex justify-center items-center py-6 shadow-sm bg-white">
        <Logo />
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>
    </div>
  );
};
export default AuthLayout;
