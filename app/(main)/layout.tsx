import Header from "@/app/components/Header";

const MainLayout = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <>
            <Header />
            {children}
        </>
    )
}
export default MainLayout;  

