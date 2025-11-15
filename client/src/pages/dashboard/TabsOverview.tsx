import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const dashboardCards = [
  {
    label: `Total Revenue`,
    icon: DollarSign,
    value: Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(45231.89),
    desc: `+20.1% from last month`,
  },
  {
    label: `Subscriptions`,
    icon: Users,
    value: Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(2350),
    desc: `+180.1% from last month`,
  },
  {
    label: `Sales`,
    icon: CreditCard,
    value: Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(12234),
    desc: `+19% from last month`,
  },
  {
    label: `Active Now`,
    icon: Activity,
    value: Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(573),
    desc: `+201 from last month`,
  },
];

const dashboardRecentSales = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    value: 1999,
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    value: 39,
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    value: 299,
  },
  {
    name: "William Kim",
    email: "will@email.com",
    value: 99,
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    value: 39,
  },
];

const dashboardCharts = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

const TabsOverview = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {dashboardCards.map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{card.label}</span>
                <card.icon className="text-muted-foreground " size={16} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-muted-foreground text-xs">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dashboardCharts}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar
                  dataKey="total"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {dashboardRecentSales.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="w-9 aspect-square rounded-full overflow-hidden bg-muted font-semibold flex items-center justify-center">
                    {item.name.split(" ").map((w) => w[0])}
                  </span>
                  <div>
                    <p className="font-semibold text-base">{item.name}</p>
                    <p className="text-muted-foreground">{item.email}</p>
                  </div>
                </div>
                <span className="font-semibold text-base">
                  +
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(item.value)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TabsOverview;
