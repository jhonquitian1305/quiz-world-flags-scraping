import { getScrapingUrl } from "../constants";
import requestPromise from 'request-promise';
import $ from 'cheerio';
import fs from 'fs';

// Función para extraer datos

export function extractData(continent: string){
    const url = getScrapingUrl(continent);
    const flagItems: Array<object> = [];

    requestPromise(url).then((html: string) => {
        const selectFlags = $(".flag-grid li", html);
        selectFlags.map((_, element) => {
            // nombre, area, population, continent, url, imagen
            const aElement = $("a", element);
            const areaString = aElement.attr("data-area");
            const population = aElement.attr("data-population");
            const url = aElement.attr("href");
            const name = $("span", element).text();
            let img = $("img", element).attr("src");
            let imgArray = img?.split("/") || [];
            img = imgArray[imgArray?.length - 1];
            flagItems.push({
                area: parseInt(areaString || '0', 10),
                population,
                url,
                name,
                code: img.replace(".png", ""),
                continent
            });            
        });
        fs.writeFileSync(`./${continent}.json`, JSON.stringify(flagItems));
    })
}