const axios = require("axios");
const cheerio = require("cheerio");

const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36" };

const baseURL = "https://animes.vision/animes/bleach?page=";
let pageNumber = 1;
const allEpisodes = [];

async function fetchPage(pageNumber) {
  const url = `${baseURL}${pageNumber}`;
  try {
    const response = await axios.get(url, { headers });
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      const itemLinks = [];
      $(".screen-item-thumbnail").each((index, element) => {
        const href = $(element).attr("href");
        const title = $(element)
          .siblings(".screen-item-info")
          .find("h3.sii-title")
          .text();
        const imgSrc = $(element).find("img.sit-img").attr("src");

        if (href && href.includes("episodio")) {
          itemLinks.push({ href, title, imgSrc });
        }
      });

      if (itemLinks.length === 0) {
        console.log(`Página ${pageNumber}: vazia`);
        return true;
      } else {
        console.log(`Página ${pageNumber}:`);
        console.log(itemLinks);
        allEpisodes.push(...itemLinks);
        return false;
      }
    } else {
      console.error(`${pageNumber}: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`${pageNumber}: ${error}`);
    return false;
  }
}

(async () => {
  while (true) {
    const isPageEmpty = await fetchPage(pageNumber);
    if (isPageEmpty) {
      console.log("Página vazia.");
      break;
    }
    pageNumber++;
  }

  const jsonEpisodes = JSON.stringify(allEpisodes, null, 2);
  console.log("JSON:");
  console.log(jsonEpisodes);
})();
