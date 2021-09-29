## 佐渡空き家情報RSS

佐渡市が提供している[空き家情報サイト](https://www.city.sado.niigata.jp/site/ijyu/5419.html)を監視するために、RSSに変換したデータを提供する。

## デプロイ

vercelで管理されているため、下記のフィードを監視すれば良い。

https://sado-akiya.vercel.app/api/rss

Slackで監視する場合は、下記のコマンドを叩く。

```
/feed subscribe https://sado-akiya.vercel.app/api/rss
```
