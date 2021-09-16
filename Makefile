run:
	deno run --allow-net=www.city.sado.niigata.jp mod.ts

compile:
	deno compile --allow-net=www.city.sado.niigata.jp --unstable mod.ts --output sado-akiya-rss
