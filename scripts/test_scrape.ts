import * as cheerio from "cheerio";

async function run() {
  const res = await fetch("https://www.daiict.ac.in/academic-calendar");
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log("=== LINKS ===");
  $("a").each((i, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (text.includes("calendar") || text.includes("autumn") || text.includes("winter") || text.includes("b.tech") || text.includes("ug")) {
        console.log($(el).text().trim(), " -> ", $(el).attr("href"));
    }
  });

  console.log("\n=== TEXT ===");
  $("td").each((i, el) => {
      console.log($(el).text().trim());
  });
}
run();
