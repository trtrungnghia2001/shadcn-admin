import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="px-4 py-6 flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
