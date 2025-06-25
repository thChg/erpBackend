const multer = require("multer");
const AsyncHandler = require("express-async-handler");
const xlsx = require("xlsx");
const upload = multer({ storage: multer.memoryStorage() });

const parseExcel = AsyncHandler((req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      res.status(400);
      throw new Error("File upload failed");
    }

    try {
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      req.excelData = data;
      next();
    } catch (error) {
      res.status(500);
      throw new Error("Error reading Excel file");
    }
  });
});

module.exports = parseExcel;
