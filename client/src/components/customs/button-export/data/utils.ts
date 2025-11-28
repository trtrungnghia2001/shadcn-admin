import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToXLSX = (data: unknown[]) => {
  // 1. Chuyển array thành worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 2. Tạo workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 3. Ghi file ra buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // 4. Lưu file
  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "data.xlsx");
};
