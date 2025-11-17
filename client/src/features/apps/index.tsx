import { appsData } from "./data/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import { appSortOptions, appTypeOptions } from "./data/options";
import { SlidersHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AppPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") ?? "";
  const appType = searchParams.get("appType") ?? "all";
  const appSort = searchParams.get("appSort") ?? "asc";

  const filterApps = appsData
    .filter((app) =>
      app.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    )
    .filter((app) => {
      return appType === "all"
        ? true
        : app.status.toLocaleLowerCase() === appType.toLocaleLowerCase();
    })
    .sort((a, b) =>
      appSort === "desc"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name)
    );

  return (
    <div className="space-y-4">
      {/* top */}
      <div>
        <h2>App Integrations</h2>
        <p className="text-muted-foreground">
          Here's a list of your apps for the integration!
        </p>
      </div>
      {/* sort */}
      <div className="flex sm:items-center flex-col sm:flex-row gap-4 justify-between">
        <Input
          placeholder="Filter apps..."
          className="h-9 w-full lg:w-[250px]"
          value={searchTerm}
          onChange={(e) => {
            searchParams.set("search", e.target.value);
            setSearchParams(searchParams);
          }}
        />
        <div className="flex gap-4">
          <Select
            value={appType}
            onValueChange={(value) => {
              if (value === "all") {
                searchParams.delete("appType");
              } else {
                searchParams.set("appType", value);
              }
              setSearchParams(searchParams);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {appTypeOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={appSort}
            onValueChange={(value) => {
              if (value === "asc") {
                searchParams.delete("appSort");
              } else {
                searchParams.set("appSort", value);
              }
              setSearchParams(searchParams);
            }}
          >
            <SelectTrigger className="w-16">
              <SlidersHorizontal size={18} />
              <SelectValue className="sr-only" />
            </SelectTrigger>
            <SelectContent align="end">
              {appSortOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <item.icon size={16} />
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator className="shadow-sm" />
      {/* data */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filterApps.map(({ id, name, description, icon: Icon, status }) => (
          <Card key={id} className="p-4">
            <CardHeader className="flex items-center justify-between p-0">
              <div className="bg-muted p-2 rounded-lg flex items-center justify-center size-10">
                <Icon size={20} />
              </div>

              <Button
                variant={status === "Connected" ? "secondary" : "outline"}
                size={"sm"}
              >
                {status}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <h3 className="text-base font-semibold">{name}</h3>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppPage;
