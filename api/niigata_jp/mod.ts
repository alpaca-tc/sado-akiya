import { DOMParser, Element, Node } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { Feed } from 'https://jspm.dev/feed'
import { urlParse } from 'https://deno.land/x/url_parse/mod.ts';

class Entry {
  constructor(
    public id: string,
    public title: string,
    public updated: Date,
    public content: string,
    public link: string
  ) {}
}

const BASE_URL = "https://www.city.sado.niigata.jp/site/ijyu/5419.html"
const FEED_URL = 'spaceflightnow.com'

export const generateRss2 = async (): Promise<string> => {
  const pageResponse = await fetch(BASE_URL)
  const pageBody = await pageResponse.text()

  const pageDom = new DOMParser().parseFromString(pageBody, "text/html")!
  const h2Doms = Array.from(pageDom.querySelectorAll('h2'))
  const newArrival = Array.from(h2Doms).find((element) => (element as Element).innerText == '新着情報') as Element

  const pDoms = Array.from(newArrival.parentElement!.querySelectorAll('p > a'))
  const entries = pDoms.map((element) => {
    const text = (element as Element).innerText
    const [, yearStr, monthStr, dayStr, title] = (/(\d{4})年(\d+)月(\d+)日\s*(.*)$/.exec(text) || ['', '', '', '', ''])
    const [year, month, day] = [yearStr, monthStr, dayStr].map((val) => parseInt(val, 10))
    const date = new Date(year, month, day)

    const href = urlParse(BASE_URL)
    href.pathname = (element as Element).getAttribute('href') || ''

    return new Entry(text, title, date, text, href.toString())
  })

  const responseFeed = new Feed({
    title: pageDom.querySelector('title')!.innerText,
    description: pageDom.querySelector('meta[name="description"]')!.getAttribute('content'),
    link: FEED_URL,
    updated: entries[0]!.updated
  })

  entries.forEach((entry) => {
    responseFeed.addItem({
      title: entry.title,
      id: entry.id,
      link: entry.link,
      description: '',
      date: entry.updated
    })
  })

  return responseFeed.rss2()
}
