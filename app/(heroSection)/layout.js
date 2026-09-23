
import Header from "@/components/hero/Header";
import Footer from "@/components/footer/footer";
import { AuthProvider } from "@/context/AuthContext";


export default function RootLayout({ children }) {
    return (
    <>
     <AuthProvider>
        <Header />
        {children}
        <Footer />
     </AuthProvider>
    </>

    );
}
