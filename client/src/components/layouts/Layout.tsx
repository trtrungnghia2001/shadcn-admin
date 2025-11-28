import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useLayoutStore } from "./data/store";

export default function Layout() {
  const { open, setOpen } = useLayoutStore();
  // console.log({ open });

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
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
