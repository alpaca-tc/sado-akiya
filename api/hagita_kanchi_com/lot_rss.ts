#!/usr/bin/env DENO_DIR=/tmp deno run
import { generateLotRss2 } from "./mod.ts";

export default async (_: Request) => {
  const body = await generateLotRss2();
  const headers = new Headers({ "Content-Type": "application/rss+xml" });

  return new Response(body, { status: 200, headers });
};
