import ThemeMenu from "@/features/theme/components/ThemeMenu";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
  return (
    <header className="flex items-center justify-baseline gap-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="!h-5" />
      </div>
      <div className="flex items-center gap-4">
        <ThemeMenu />
      </div>
    </header>
  );
};

export default Header;
