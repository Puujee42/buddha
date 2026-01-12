
const XLSX = require('xlsx');
const workbook = XLSX.readFile('гүрэм засал.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
console.log(JSON.stringify(jsonData.slice(0, 5), null, 2));
