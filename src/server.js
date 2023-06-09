import express from "express";
import fetch from "node-fetch";
import { Stack } from "./Stack";
const app = express();

function parseHtmlForAhrefs(text) {
  let match;
  const links = [];
  const regex = /<a[\s\S]*?href=["']?([^"']*)["']?[\s\S]*?>/g;
  while ((match = regex.exec(text))) {
    const href = match[1];
    if (href.startsWith("/")) {
      links.push(href);
    }
  }
  return links;
}

function isValid(link, domainName) {
  // Проверяем, что ссылка ведет на тот же домен
  const { hostname } = URL.parse(link);
  return hostname === URL.parse(domainName).hostname;
}

async function fetchCrawler(url) {
  let stack = new Stack();
  stack.push(url);
  const linksAll = [];
  try {
    while (stack.length) {
      const response = await fetch(stack.pop());
      const body = await response.text();

      linksAll.push(parseHtmlForAhrefs(body));
      const uniqLinks = [...new Set(linksAll)];

      uniqLinks.forEach((link) => {
        if (isValid(link, stack[0])) stack.push(link);
      });
      // return uniqLinks;
    }
  } catch (err) {
    throw err;
  }
}

app.post("/parse", async (req, res) => {
  try {
    // const links = await fetchCrawler(req.body.domainName);
    const links = await fetchCrawler("http://www.darlingsk.ru/");
    res.send(links);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// app.listen(3000, async () => {
//     console.log("Server running on port 3000");
// console.log(await fetchCrawler("http://www.darlingsk.ru/"));
// });
