#!/bin/bash

# curl -XDELETE 'http://10.10.0.57:9200/danmu-*/'
curl -XPUT 'http://10.10.0.57:9200/_template/danmu' -d '
{
  "template" : "danmu-*",
  "mappings": {
    "_default_":{
      "_all":{ "enabled":false }
    },
    "global": {
      "dynamic":true,
      "properties": {
        "type": { "type": "string", "index": "not_analyzed" },
        "plat": { "type": "string", "index": "not_analyzed" },
        "timestamp": { "type": "date" },
        "user_id": { "type": "string", "index": "not_analyzed" },
        "user_level": { "type": "integer" },
        "medal_level": { "type": "integer" },
        "room_id": { "type": "string", "index": "not_analyzed" },
        "cate_id": { "type": "string", "index": "not_analyzed" },
        "device": { "type": "string", "index": "not_analyzed" },
        "gift_id": { "type": "string", "index": "not_analyzed" },
        "gift_count": { "type": "integer" },
        "gift_cost": { "type": "double" }
      }
    }
  }
}
'