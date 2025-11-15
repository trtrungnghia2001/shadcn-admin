import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardTabs } from "@/constants/links";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* top */}
      <section>
        <h1>Dashboard</h1>
      </section>
      {/* tabs */}
      <section>
        <Tabs defaultValue={dashboardTabs[0].label} className="space-y-6">
          <TabsList>
            {dashboardTabs.map((item) => (
              <TabsTrigger key={item.label} value={item.label}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {dashboardTabs.map((item) => (
            <TabsContent key={item.label} value={item.label}>
              {item.element}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
};

export default Dashboard;
