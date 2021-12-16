import XLSX from 'xlsx';

const parseValueEnum = (value: any, valueEnum: any) => {
  return valueEnum[value] ? valueEnum[value]?.text || valueEnum[value] : value;
};

const ExportExcel = (columns: any[], rows: any[], fileName = 'export.xlsx') => {
  const headers = columns.filter((col) => col?.hideInTable != true && col?.valueType != 'option');
  const datas = rows.map((row) =>
    headers.map((header) =>
      header?.valueEnum
        ? parseValueEnum(row[header.dataIndex], header.valueEnum)
        : row[header.dataIndex],
    ),
  );

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers.map((header) => header?.title), ...datas]);
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');

  // 导出 Excel
  XLSX.writeFile(wb, fileName);
};

export default ExportExcel;
