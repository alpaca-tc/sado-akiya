## 佐渡空き家情報RSS

佐渡に関連する物件情報をRSSに変換したデータを提供する

## デプロイ

Slackで監視する場合は、下記のコマンドを叩く。

```
# 佐渡市提供の空き家情報サイト
# https://www.city.sado.niigata.jp/site/ijyu/5419.html
/feed subscribe https://sado-akiya.vercel.app/api/niigata_jp/rss

# 株式会社アイディ
# アパート情報 http://idsd.jp/apindx.htm
/feed subscribe https://sado-akiya.vercel.app/api/idsd_jp/apartment_rss
# 貸家情報 http://idsd.jp/kashiya.htm
/feed subscribe https://sado-akiya.vercel.app/api/idsd_jp/kashiya_rss
```

## Development

```
$ vercel dev
```
