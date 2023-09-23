import { generateRss2 } from "./mod.ts"

export default async (request: any) => {
  const body = await generateRss2()
  const headers = new Headers({ "Content-Type": "application/rss+xml" });

  request.respond({ status: 200, headers, body });
};
