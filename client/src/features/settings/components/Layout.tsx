import { Separator } from "@/components/ui/separator";
import type React from "react";
import { useMemo } from "react";
import { settingTabs } from "../data/constant";
import { useLocation } from "react-router-dom";
import SettingSidebar from "./SettingSidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const tabActive = useMemo(() => {
    return settingTabs.find((tab) =>
      location.pathname
        .toLocaleLowerCase()
        .includes(tab.key.toLocaleLowerCase())
    );
  }, [location.pathname]);

  return (
    <div className="flex-1 space-y-6">
      {/* top */}
      <div className="space-y-1">
        <h2>Settings</h2>
        <p className="text-muted-foreground text-base">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator />
      <div className="flex items-start gap-8">
        <SettingSidebar />
        <div className="space-y-6 flex-1">
          <div>
            <p className="font-medium text-base">{tabActive?.title}</p>
            <p className="text-muted-foreground">{tabActive?.description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
