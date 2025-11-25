import Layout from "@/features/settings/components/Layout";
import { settingTabs } from "@/features/settings/data/constant";
import { useRoutes } from "react-router-dom";

const SettingRouter = () => {
  const routers = useRoutes(
    settingTabs.map((tab) => ({
      path: tab.key.toLocaleLowerCase(),
      element: tab.element,
    }))
  );
  return <Layout>{routers}</Layout>;
};

export default SettingRouter;
