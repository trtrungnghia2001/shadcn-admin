import * as XLSX from "xlsx";

export function exportToXLSX({
  rows,
  fileName = "data.xlsx",
}: {
  rows: unknown[];
  fileName?: string;
}) {
  if (!rows?.length) return;

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, fileName);
}

export function importXLSX(file: File): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(sheet);
      resolve(rows);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}
