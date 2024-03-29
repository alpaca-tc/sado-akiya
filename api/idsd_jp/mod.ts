import {
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";
import { Feed } from "npm:feed@4.2.2";

type Entry = {
  id: string;
  title: string;
  updated: Date;
  content: string;
  link: string;
};

const BASE_URL = "http://idsd.jp/";

const fetchUtf8 = async (url: string) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder("shift_jis");
  const text = decoder.decode(buffer);

  return text;
};

const parseJpDate = (date: string): Date => {
  const regexp = /^(?<year>\d{4})年(?<month>\d+)月(?<day>\d+)日/;
  const match = date.match(regexp)!;
  const groups = Object.values(match.groups!).map((str) =>
    parseInt(str, 10)
  ) as [number, number, number];

  return new Date(groups[0], groups[1] - 1, groups[2]);
};

const parseApartment = (link: string, html: string): Entry => {
  const dom = new DOMParser().parseFromString(html, "text/html")!;

  const findVerticalPair = (title: string): string | null => {
    const td = (Array.from(dom.querySelectorAll("td")) as Element[]).find((
      el,
    ) => el.innerText.trim() === title);
    const tr = td?.parentElement!;
    const nextTr = tr.nextElementSibling;
    if (!(td && nextTr)) return null;

    const index = Array.from(tr.querySelectorAll("td")).indexOf(td);

    const pairTd = Array.from(nextTr.querySelectorAll("td"))[index];

    return (pairTd as Element).innerText.trim();
  };

  const findHorizonalPair = (title: string): string | null => {
    const td = (Array.from(dom.querySelectorAll("td")) as Element[]).find((
      el,
    ) => el.innerText.includes(title));
    return td?.nextElementSibling?.innerText?.trim() ?? null;
  };

  const content = [
    findVerticalPair("所在地")!,
    findVerticalPair("間取り　専有面積")!,
    `校区: ${findHorizonalPair("校　区")!}`,
  ].map((str) => str.replace(/[ \n ]+/m, "")).join(" ");

  return {
    id: link,
    title: findVerticalPair("物件名")!,
    updated: parseJpDate(findHorizonalPair("情報登録日")!),
    content,
    link,
  };
};

const fetchEntries = async (url: string) => {
  const body = await fetchUtf8(url);
  const pageDom = new DOMParser().parseFromString(body, "text/html")!;
  const uDoms = Array.from(pageDom.querySelectorAll("u")) as Element[];
  const anchorLinks = Array.from(uDoms).filter((element) =>
    (element as Element).innerText.trim() == "詳細"
  ).map((element) => {
    const href = element.querySelector("a")?.getAttribute("href");
    return `${BASE_URL}${href}`;
  });

  const entries = await Promise.all(anchorLinks.map(async (link) => {
    return parseApartment(link, await fetchUtf8(link));
  }));

  entries.sort((a, b) => a.updated < b.updated ? 1 : -1);

  return entries;
};

export const generateApartmentRss2 = async (): Promise<string> => {
  const url = `${BASE_URL}apindx.htm`;
  const entries = await fetchEntries(url);

  const responseFeed = new Feed({
    id: url,
    copyright: "",
    title: "アイディ アパート情報",
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

export const generateKashiyaRss2 = async (): Promise<string> => {
  const url = `${BASE_URL}kashiya.htm`;
  const entries = await fetchEntries(url);

  const responseFeed = new Feed({
    id: url,
    copyright: "",
    title: "アイディ 貸家情報",
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
