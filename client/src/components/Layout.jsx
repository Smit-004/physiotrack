import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-teal-50">
      <Navbar />
      <main className="flex-1">
        <Outlet /> {/* yahan current page (Dashboard/Logs) aata hai */}
      </main>
      <Footer />
    </div>
  );
}