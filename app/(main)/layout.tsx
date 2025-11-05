

import Header from "@/app/components/Header";

const MainLayout = ({ 
  children, 
}: Readonly<{ 
  children: React.ReactNode; 
}>) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;