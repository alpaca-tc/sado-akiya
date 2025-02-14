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

const CHINTAI_URL =
  "https://hagitakanchi.annex-homes.jp/bukken_display_24911.html";
const KODATE_URL = "https://www.hagita-kanchi.com/bukken_display_6412.html";
const RESALE_PROPERTY_URL = "https://www.hagita-kanchi.com/bukken_display_1916.html";

type Row = {
  // COLLECTION: string;
  ID: string;
  // SITECODE: string;
  // MEMBERID: string;
  // BUKKENNUM: string;
  NEWDATE: string;
  // TIMELIMITDATE: string;
  // FLGOPEN: string;
  // STATUS: string;
  // BUKKENTYPE: string;
  // FLGINVESTMENT: null,
  // FLGBUNJOU: null,
  BUKKENNAME: string;
  // BUKKENNAMERUBY: string;
  // ALLNUMBER: string;
  // POST1: string;
  // POST2: string;
  // ADDR11: string;
  // ADDR12: string;
  // ADDR1: string;
  // ADDR2: string;
  // ADDR2NAME: string;
  // ADDR3NAME: string;
  // AD1: string;
  // ADDR: string;
  // ROSEN1: string;
  // EKI1: string;
  // BUSSTOP1: string;
  // BUSTIME1: null,
  // WALKDISTANCE1: string;
  // ROSEN2: null,
  // EKI2: null,
  // BUSSTOP2: null,
  // BUSTIME2: null,
  // WALKDISTANCE2: null,
  // ROSEN3: null,
  // EKI3: null,
  // BUSSTOP3: null,
  // BUSTIME3: null,
  // WALKDISTANCE3: null,
  // TRAFFICOTHER: null,
  // TRAFFICCAR: null,
  // LANDAREA: null,
  // LANDAREAH: null,
  // LANDKENPEI: null,
  // LANDYOUSEKI: null,
  // LANDROADCOND: null,
  // LANDRIGHT: null,
  // LANDYOUTO: null,
  // HOUSEKOUZOU: "1",
  // HOUSEAREA: "26.49",
  // HOUSEAREAH: "26.49",
  // LANDAREAALL: null,
  // HOUSEAREAALL: null,
  // HOUSEKENCHIKUAREA: null,
  // HOUSEKAISUU: "2",
  // HOUSEKAISUUCHIKA: null,
  // KENCHIKUDATE: "199703",
  // FLGNEW: "0",
  // HOUSEKANRININ: null,
  // ROOMKAISUU: "2",
  // BALCONYAREA: null,
  // WINDOWANGLE: "4",
  // MADORICODE: "120",
  // MADORICODEH: "120",
  // MADORIETC: null,
  // MADORILIST: "1K",
  TOKUCHOU: string;
  // ETC: string;
  // EXTRAURL: null,
  // MONEYROOM: null,
  // MONEYROOMH: null,
  // MONTHMONEYROOM: string;
  // MONTHMONEYROOMH: string;
  // MONEYTAX: "3",
  // MONEYTSUBO: null,
  // MONTHMONEYTSUBO: "4618",
  // MONEYKYOUEKI: "3000",
  // MONEYKYOUEKITAX: "2",
  // MONEYSHOUKYAKU: null,
  // MONEYCOMBO: "40000",
  // MONEYREIKIN: "1",
  // MONEYREIKINTAX: null,
  // MONEYSHIKIKIN: "1",
  // MONEYHOSHOUKIN: null,
  // MONEYRIMAWARI: null,
  // MONEYRIMAWARIH: null,
  // MONEYRIMAWARINOW: null,
  // MONEYROOMINITIAL: "114000",
  // PARKINGKUBUN: "1",
  // PARKINGNUMBER: "2",
  // PARKINGMEMO: "2台目駐車料：月額3,000円",
  // GENKYOCODE: null,
  // USABLESTATUS: "3",
  // USABLEDATE: "202312",
  // USABLESHUN: "1",
  SCHOOLELENAME: string;
  // SCHOOLJUNNAME: "佐渡市立佐和田中学校",
  // KYAKUZUKE: "0",
  // TAIYOU: "6",
  // SYSTEMPICTMADORI: "1",
  // SYSTEMPICTMISC: "1",
  // SYSTEMPANORAMA: "0",
  // SYSTEMAPPROVED: "1",
  // NL: "136779806",
  // EL: "498002457",
  // FLGADJUST: "1",
  // DETAILURL: "http://realestate.homes.co.jp/search/detail/b%5B%5D=1004850000424/tk=3/",
  // HOUSEKOUZOULIFE: "11",
  // PHOTOREMOTEFILENAME: "http://img.homes.jp/226y88dqbwtj735.jpg,1,1,http://img.homes.jp/4f41/5f7d6412295e02fffe5734147beb_bd"... 392 more characters,
  // PHOTOASPECT: "https://image4.homes.jp/smallimg/image.php?file=http%3A%2F%2Fimg.homes.jp%2F4f41%2F5f7d6412295e02fff"... 48 more characters,
  // GROUPID: null,
  // ADDRESSADDR2: "佐渡市",
  // OPENROOMOPENING: null,
  // OPENROOMEND: null,
  // OPENROOMTIME: null,
  // OPENROOMNOTES: null,
  // CCF: {
  //   "210101": "公営水道",
  //   "210202": "プロパンガス",
  //   "210302": "浄化槽",
  //   "220101": "専用バス",
  //   "220201": "専用トイレ",
  //   "220301": "バス・トイレ別",
  //   "220501": "シャワー",
  //   "220701": "温水洗浄便座",
  //   "223101": "洗面所独立",
  //   "230801": "給湯",
  //   "240104": "エアコン",
  //   "260101": "CATV",
  //   "260503": "光ファイバー",
  //   "290101": "フローリング",
  //   "290901": "室内洗濯機置場",
  //   "294301": "照明器具付",
  //   "320601": "駐車場2台以上",
  //   "320801": "駐車場あり",
  //   "323401": "平面駐車場",
  //   "330203": "総戸数30戸以下",
  //   "340102": "2階以上の物件",
  //   "340201": "最上階の物件"
  // },
  // ROSEN1NAME: "バス",
  // ROSEN2NAME: null,
  // ROSEN3NAME: null,
  // ROSEN1SHORTNAME: "バス",
  // ROSEN2SHORTNAME: null,
  // ROSEN3SHORTNAME: null,
  // EKI1NAME: "八幡新町",
  // EKI2NAME: null,
  // EKI3NAME: null,
  // STAFFID: null,
  // STAFFCOMMENT: null,
  // BUKKENTYPENAME: "アパート",
  // ADDR11NAME: "新潟県",
  // LANDRIGHTNAME: null,
  // HOUSEKOUZOUNAME: "木造",
  // POSTALL: "9521311",
  // POSTALL5: "95213",
  // FLGUSEBUS1: "1",
  // FLGUSEBUS2: "0",
  // FLGUSEBUS3: "0",
  // W1: null,
  // W2: null,
  // W3: null,
  // SYSTEMPICTASPECT: "1",
  // EKIAD11: null,
  // MONEYROOMRANGE: null,
  // MONTHMONEYROOMRANGE: "3.5-4.0",
  // MONEYRIMAWARIRANGE: null,
  // HOUSEAREARANGE: "25-30",
  // WALKMINUTES: null,
  // HOUSEAGE: "27",
  FULLADDR: string;
  // FULLTRAFFIC1: "バス 八幡新町下車 徒歩3分",
  // FULLTRAFFIC2: null,
  // FULLTRAFFIC3: null,
  MONEYROOMTEXT: string;
  // SAITAKAKAKUTAITEXT: null,
  // URINUSHITEXT: null,
  // HANBAIKAISYATEXT: null,
  MADORITEXT: string;
  // HOUSEAREATEXT: "26.49m2",
  // LANDAREATEXT: null,
  // CTAGID: "2101120#2108053#2108060#2108700",
  // FLGMONEYROOM: "0",
  // FLGMONTHMONEYROOM: "1",
  // FLGHOUSEAREA: "1",
  // FLGLANDAREA: "0",
  // FLGHOUSEAGE: "1",
  // FLGHANKYOKAKIN: "0",
  // FLAT: "37.9973239",
  // FLON: "138.3308240",
  // GEO_USED_LAT: null,
  // GEO_USED_LON: null,
  // GEO_DISTANCE: "0.00",
  // GEO_UNIT: "km",
  // PHOTOS: [
  //   [Object], [Object],
  //   [Object], [Object],
  //   [Object], [Object],
  //   [Object], [Object],
  //   [Object], [Object]
  // ],
  // WINDOWANGLENAME: "南東",
  // GENKYONAME: "",
  // TAIYOUNAME: "仲介",
  // USABLETEXT: "2023年12月 上旬",
  // HOUSEKOUZOULONGNAME: "木造",
  // PARKINGKUBUNNAME: "空有",
  // LANDYOUTONAME: "",
  // BTG: 3001,
  // LANDTSUBO: "",
  // HOUSETSUBO: 8.01,
  // MONEYSHIKIKINTEXT: "1ヶ月",
  // MONEYSHIKIKINWITHHOSYOUKINTEXT: "1ヶ月",
  // MONEYREIKINTEXT: "1ヶ月",
  // MONEYREIKINWITHHOSYOUKINTEXT: "1ヶ月",
  // MONEYSHOUKYAKUTEXT: "",
  // MONEYHOSYOUKINTEXT: "",
  // LANDROADCONDTEXT: "",
  // NAVIURL: null,
  // TRAFFICINFO: { TRAFFIC: "バス 八幡新町", USEEKINO: 1 },
  // WALKMINUTESTEXT1: "3分",
  // WALKMINUTESTEXT2: null,
  // WALKMINUTESTEXT3: null
};

const parseRow = (prefix: string, row: Row): Entry => {
  return {
    id: row.ID,
    title:
      `${row.BUKKENNAME} ${row.MADORITEXT} (${row.MONEYROOMTEXT}) ${row.FULLADDR}`,
    updated: new Date(row.NEWDATE),
    content: row.TOKUCHOU,
    link: `${prefix}/${row.ID}`,
  };
};

const search = async (prefix: string, body: string): Promise<Entry[]> => {
  const responseBody = await fetch(
    "https://hagitakanchi.annex-homes.jp/b4h_customer/api/search",
    {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "content-type": "application/x-www-form-urlencoded",
      },
      "body": body,
      "method": "POST",
    },
  ).then((res) => res.json());

  const rows = (responseBody as { ROWSET: Row[] }).ROWSET;

  return rows.map((row) => parseRow(prefix, row));
}

const fetchChintaiEntries = (): Promise<Entry[]> => {
  return search("https://www.hagita-kanchi.com/detail/1184/BRent", "siteKey=1184&memberid=100485&groupid=&payFlag=0&otherCompanyFlag=0&btsg=3001&baseaddr11=15&baseaddr1=15224&addr1=15224&rosen=&eki=&ccf=&free_word=%E4%B8%A1%E6%B4%A5&moneyroom=&moneyroomh=&moneycombo=0&housearea=&houseareah=&madori=&houseage=&walkminutesh=&pictmadori=0&pictmisc=0&panorama=0&newdate=&balconyarea=&flgused=0&landarea=&landareah=&buscombo=0&tbg=&housekouzou=&rimawari=&genkyo=&pricemode=1&floatHideFlag=0&domain=https%3A%2F%2Fwww.hagita-kanchi.com%2F&hits=30&page=1&sortby=-newdate")
};

const fetchKodateEntries = (): Promise<Entry[]> => {
  return search("https://www.hagita-kanchi.com/detail/1184/BRent", "siteKey=1184&memberid=100485&groupid=&payFlag=0&otherCompanyFlag=0&btsg=3005&baseaddr11=15&baseaddr1=15224&addr1=15224&rosen=&eki=&ccf=&free_word=&moneyroom=&moneyroomh=&moneycombo=0&housearea=&houseareah=&madori=&houseage=&walkminutesh=&pictmadori=0&pictmisc=0&panorama=0&newdate=&balconyarea=&flgused=0&landarea=&landareah=&buscombo=0&tbg=&housekouzou=&rimawari=&genkyo=&pricemode=1&floatHideFlag=0&domain=https%3A%2F%2Fwww.hagita-kanchi.com%2F&hits=30&page=1&sortby=-newdate")
};

const fetchResalePropertyEntries = async (): Promise<Entry[]> => {
  return search("https://www.hagita-kanchi.com/detail/1184/BSale", "siteKey=1184&memberid=100485&groupid=&payFlag=1&otherCompanyFlag=0&btsg=1005&baseaddr11=15&baseaddr1=15224&addr1=15224&rosen=&eki=&ccf=&free_word=&moneyroom=&moneyroomh=&moneycombo=0&housearea=&houseareah=&madori=&houseage=&walkminutesh=&pictmadori=0&pictmisc=1&panorama=0&newdate=&balconyarea=&flgused=1&landarea=&landareah=&buscombo=0&tbg=&housekouzou=&rimawari=&genkyo=&pricemode=1&floatHideFlag=0&domain=https%3A%2F%2Fwww.hagita-kanchi.com%2F&hits=30&page=1&sortby=-newdate")
};

const generateRss = (title: string, link: string, entries: Entry[]): string => {
  const responseFeed = new Feed({
    id: link,
    copyright: "",
    title,
    description: "",
    link,
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
}

export const generateChintaiRss2 = async (): Promise<string> => {
  return generateRss("萩田換地 賃貸", CHINTAI_URL, await fetchChintaiEntries());
};

export const generateKodateRss2 = async (): Promise<string> => {
  return generateRss("萩田換地 戸建て賃貸", KODATE_URL, await fetchKodateEntries());
};

export const generateResalePropertyRss2 = async (): Promise<string> => {
  return generateRss("萩田換地 中古物件", RESALE_PROPERTY_URL, await fetchResalePropertyEntries());
};

console.log(await generateResalePropertyRss2());
