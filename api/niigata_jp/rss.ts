#!/usr/bin/env DENO_DIR=/tmp deno run
import { generateRss2 } from "./mod.ts";

export default async (_request: Request) => {
  const body = await generateRss2();
  const headers = new Headers({ "Content-Type": "application/rss+xml" });

  return new Response(body, { status: 200, headers });
};
