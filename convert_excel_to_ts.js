const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('гүрэм засал.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const categories = [
    { nameIndex: 1, descIndex: 2, category: "Догжүр" },
    { nameIndex: 4, descIndex: 5, category: "Хатуу засал" },
    { nameIndex: 7, descIndex: 8, category: "Лүд" },
    { nameIndex: 10, descIndex: 11, category: "Чивил" },
    { nameIndex: 13, descIndex: 14, category: "Тахилга" },
    { nameIndex: 16, descIndex: 17, category: "Сан" },
    { nameIndex: 19, descIndex: 20, category: "Сэржэм" },
    { nameIndex: 22, descIndex: 23, category: "Даллага" },
    { nameIndex: 25, descIndex: 26, category: "Элдэв засал" }
];

const result = [];

categories.forEach(cat => {
    const items = [];
    // Start from row 1 (skipping header at 0)
    for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        const name = row[cat.nameIndex];
        const desc = row[cat.descIndex];

        if (name) {
            items.push({
                name: String(name).trim(),
                desc: desc ? String(desc).trim() : ""
            });
        }
    }
    
    if (items.length > 0) {
        result.push({
            category: cat.category,
            items: items
        });
    }
});

console.log(JSON.stringify(result, null, 4));