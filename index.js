const axios = require("axios");
const cheerio = require("cheerio");

const baseURL = "https://animes.vision/animes/os-cavaleiros-do-zodiaco-dublado?page=";
const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",};

let pageNumber = 1;

async function fetchPage(pageNumber) {
  const url = `${baseURL}${pageNumber}`;
  try {
    const response = await axios.get(url, { headers });
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      const itemLinks = [];

      $(".item a").each((index, element) => {
        const href = $(element).attr("href");
        if (href && href.includes("episodio")) {
          itemLinks.push(href);
        }
      });

      if (itemLinks.length === 0) {
        console.log(`Página ${pageNumber}: vazia`);
        return true;
      } else {
        console.log(`Página ${pageNumber}:`);
        console.log(itemLinks);
        return false;
      }
    } else {
      console.error(`Erro na página ${pageNumber}: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error(`Erro na página ${pageNumber}: ${error}`);
    return false;
  }
}

(async () => {
  while (true) {
    const isPageEmpty = await fetchPage(pageNumber);
    if (isPageEmpty) {
      console.log("Parando de listar devido a uma página vazia.");
      break;
    }
    pageNumber++;
  }
})();
