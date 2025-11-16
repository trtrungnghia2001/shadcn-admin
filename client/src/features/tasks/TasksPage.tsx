import { DataTable } from "@/components/customs/data-table";
import { tasks } from "./data/data";
import { DataTableColumn } from "./components/dttb-columns";
import { Download, Trash } from "lucide-react";

const TasksPage = () => {
  return (
    <div>
      <DataTable
        columns={DataTableColumn}
        data={tasks}
        bulkActions={{
          entityName: "Tasks",
          items: [
            {
              icon: <Download />,
              onClick: () => {},
              title: "Download",
            },
            {
              icon: <Trash />,
              onClick: () => {},
              title: "Delete",
              variant: "destructive",
            },
          ],
        }}
      />
    </div>
  );
};

export default TasksPage;
