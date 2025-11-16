import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import clsx from "clsx";
import { Activity, ChartLine, Clock4, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const dashboardTraffic = [
  {
    name: "Mon",
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: "Tue",
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: "Wed",
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: "Thu",
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: "Fri",
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: "Sat",
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: "Sun",
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
];
const dashboardCards = [
  {
    label: `Total Clicks`,
    icon: ChartLine,
    value: Intl.NumberFormat("en-US", {
      style: "decimal",
      currency: "USD",
    }).format(1248),
    desc: `+12.4% vs last week`,
  },
  {
    label: `Unique Visitors`,
    icon: User,
    value: Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(2350),
    desc: `+5.8% vs last week`,
  },
  {
    label: `Bounce Rate`,
    icon: Activity,
    value: Intl.NumberFormat("en-US", {
      style: "percent",
    }).format(42),
    desc: `-3.2% vs last week`,
  },
  {
    label: `Avg. Session`,
    icon: Clock4,
    value: `3m 24s`,
    desc: `+18s vs last month`,
  },
];
const dashboardReferrers = [
  { name: "Direct", value: 512 },
  { name: "Product Hunt", value: 238 },
  { name: "Twitter", value: 174 },
  { name: "Blog", value: 104 },
];
const dashboardDevices = [
  { name: "Desktop", value: 74 },
  { name: "Mobile", value: 22 },
  { name: "Tablet", value: 4 },
];

const TabsAnalytics = () => {
  return (
    <div className="space-y-4">
      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Weekly clicks and unique visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardTraffic}>
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
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="currentColor"
                className="text-primary"
                fill="currentColor"
                fillOpacity={0.15}
              />
              <Area
                type="monotone"
                dataKey="uniques"
                stroke="currentColor"
                className="text-muted-foreground"
                fill="currentColor"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
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
            <CardTitle>Referrers</CardTitle>
            <CardDescription>Top sources driving traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList items={dashboardReferrers} barBg="bg-primary" />
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Devices</CardTitle>
            <CardDescription>How users access your app</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList
              items={dashboardDevices}
              barBg="bg-primary"
              valueFormatter={(v) => v + `%`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TabsAnalytics;

type BarList = {
  items: { name: string; value: number }[];
  barBg?: string;
  valueFormatter?: (n: number) => string;
};

const BarList = ({ items, barBg, valueFormatter }: BarList) => {
  const max = Math.max(...items.map((i) => i.value), 1);
  const [animatedWidths, setAnimatedWidths] = useState<string[]>(
    items.map(() => "0%")
  );

  useEffect(() => {
    // Trigger animation sau khi render
    const timer = setTimeout(() => {
      setAnimatedWidths(
        items.map((item) => {
          const w = Math.round((item.value / max) * 100);
          return `${w}%`;
        })
      );
    }, 50);

    return () => clearTimeout(timer);
  }, [items, max]);

  return (
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li key={idx}>
          <div className="mb-1 text-muted-foreground text-xs truncate">
            {item.name}
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-muted h-2.5 w-full rounded-full overflow-hidden">
              <div
                className={clsx([
                  "h-full rounded-full transition-all duration-1000",
                  barBg,
                ])}
                style={{ width: animatedWidths[idx] }}
              ></div>
            </div>

            <div className="text-xs font-medium ps-2">
              {valueFormatter ? valueFormatter(item.value) : item.value}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
