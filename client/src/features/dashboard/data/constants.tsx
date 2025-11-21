import TabsAnalytics from "../components/TabsAnalytics";
import TabsOverview from "../components/TabsOverview";

export const dashboardTabs = [
  {
    label: `Overview`,
    element: <TabsOverview />,
  },
  {
    label: `Analytics`,
    element: <TabsAnalytics />,
  },
  {
    label: `Reports`,
    element: <TabsOverview />,
    disabled: true,
  },
  {
    label: `Notifications`,
    element: <TabsOverview />,
    disabled: true,
  },
];
