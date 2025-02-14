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

# スマイティ
# 中古物件 https://sumaity.com/house/used/area_list/?sort1=2&search_type=a&page_count=30&pref_id=15&create_date=0&acity_id%5B%5D=15224000000
/feed subscribe https://sado-akiya.vercel.app/api/sumaity_com/chuuko_rss 

# 萩田換地
# 賃貸情報 https://hagitakanchi.annex-homes.jp/bukken_display_24911.html
/feed subscribe https://sado-akiya.vercel.app/api/hagita_kanchi_com/chintai_rss

# 中古物件 https://www.hagita-kanchi.com/bukken_display_1916.html
/feed subscribe https://sado-akiya.vercel.app/api/hagita_kanchi_com/resale_priority_rss

# 賃貸情報 https://www.hagita-kanchi.com/bukken_display_6412.html
/feed subscribe https://sado-akiya.vercel.app/api/hagita_kanchi_com/kodate_rss
```

## Development

```
$ vercel dev
```
