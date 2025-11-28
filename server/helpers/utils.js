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

export function exportArrayToExcel(res, data = [], filename = "data.xlsx") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 2️⃣ Viết workbook ra ArrayBuffer
  const arrayBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });

  // 3️⃣ Chuyển sang Node Buffer
  const buffer = Buffer.from(arrayBuffer);

  // 4️⃣ Set headers để client download file
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  // ✨ Tắt cache để tránh 304 Not Modified
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // 5️⃣ Gửi buffer về client
  res.send(buffer);
}
