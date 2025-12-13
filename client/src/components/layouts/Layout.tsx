import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <Header />
        <section className="flex-1 p-4">
          <Outlet />
        </section>
      </main>
    </SidebarProvider>
  );
}
