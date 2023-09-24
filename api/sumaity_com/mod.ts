import {
  DOMParser,
  Element,
  Node,
} from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";
import { Feed } from "npm:feed@4.2.2";

type Entry = {
  id: string;
  title: string;
  updated: Date;
  content: string;
  link: string;
};

const BASE_URL = "https://sumaity.com";

const parseJpDate = (date: string): Date => {
  const regexp = /^(?<year>\d{4})\/(?<month>\d+)\/(?<day>\d+)/;
  const match = date.match(regexp)!;
  const groups = Object.values(match.groups!).map((str) =>
    parseInt(str, 10)
  ) as [number, number, number];

  return new Date(groups[0], groups[1] - 1, groups[2]);
};

const parseArticle = async (link: string): Promise<Entry> => {
  const body = await (await fetch(link)).text();
  const dom = new DOMParser().parseFromString(body, "text/html")!;

  const tables = Array.from(
    dom.querySelectorAll(".tableWrap table"),
  ) as Element[];

  const info: { [key: string]: string } = {};
  tables.forEach((table) => {
    Array.from(table.querySelectorAll("tr")).forEach((tr) => {
      let prev: Element | null = null;

      (Array.from(tr.childNodes) as Element[]).forEach((node) => {
        if (prev && prev.tagName === "TH" && node.tagName === "TD") {
          info[prev.innerText.trim()] = node.innerText.trim().replace(
            /\s+/,
            " ",
          ).replace(/\s*(?:月々のお支払い目安|地図・周辺情報)/, "");
        }

        if (node.tagName === "TH" || node.tagName === "TD") {
          prev = node;
        }
      });
    });
  });

  const content = [
    info["価格"],
    info["所在地"],
    info["間取り"],
    info["学校"],
  ].filter(Boolean).join(" ");

  const title = `${dom.querySelector(".estateTitle")!.innerText} ${
    dom.querySelector(".price")!.innerText
  }`;

  return {
    id: link,
    title,
    updated: parseJpDate(info["更新日"]!),
    content,
    link,
  };
};

const fetchEntries = async (url: string): Promise<Entry[]> => {
  const body = await (await fetch(url)).text();
  const dom = new DOMParser().parseFromString(body, "text/html")!;
  const result = dom.querySelector("#result") as Element;
  const articleLinks =
    (Array.from(result.querySelectorAll(".p-estate")) as Element[]).map(
      (article) => {
        const path = article.querySelector(".ui-btn-detail-A")!.getAttribute(
          "href",
        )!;
        return `${BASE_URL}${path}`;
      },
    );
  const entries = await Promise.all(articleLinks.map(parseArticle));

  return entries;
};

export const generateChuukoRss2 = async (): Promise<string> => {
  const url =
    "https://sumaity.com/house/used/area_list/?sort1=2&search_type=a&page_count=30&pref_id=15&create_date=0&acity_id%5B%5D=15224000000";
  const entries = await fetchEntries(url);

  const responseFeed = new Feed({
    id: url,
    copyright: "",
    title: "スマイティ 中古一戸建て",
    description: "",
    link: url,
    updated: entries[0]!.updated,
  });

  entries.forEach((entry) => {
    responseFeed.addItem({
      title: entry.title,
      id: entry.id,
      link: entry.link,
      description: "",
      date: entry.updated,
    });
  });

  return responseFeed.rss2();
};
