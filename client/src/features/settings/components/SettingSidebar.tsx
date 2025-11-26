import { memo } from "react";
import { NavLink } from "react-router-dom";
import { sidebarLinks } from "@/components/layouts/data/constant";
import clsx from "clsx";

const SettingSidebar = () => {
  return (
    <aside className="space-y-1 w-1/5 hidden lg:block">
      {sidebarLinks[2].items[0].items?.map((item) => (
        <NavLink
          key={item.path}
          className={({ isActive }) =>
            clsx([
              `flex items-center gap-2 px-2 py-2 rounded-lg`,
              isActive && `font-medium bg-accent`,
            ])
          }
          to={item.path}
        >
          {item.icon && <item.icon size={16} />}
          {item.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default memo(SettingSidebar);
