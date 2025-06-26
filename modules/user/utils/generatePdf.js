const Handlebars = require("handlebars");
const { readFileSync } = require("fs");
const { default: puppeteer } = require("puppeteer");

const generatePdf = async (filename, data) => {
  const source = readFileSync(`./templates/${filename}`, "utf-8");

  const template = Handlebars.compile(source);
  const html = template(data);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: "A4" });

  await browser.close();

  return pdf;
};

module.exports = { generatePdf };
