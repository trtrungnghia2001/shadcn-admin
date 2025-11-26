import * as XLSX from "xlsx";

export async function parseExcelToArray(file) {
  if (!file || !file.buffer) {
    throw new Error("Invalid file or file buffer missing");
  }

  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

export function exportArrayToExcel(data = []) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}
