#!/bin/bash

# curl -XDELETE 'http://10.10.0.57:9200/roomlist-*/'
curl -XPUT 'http://10.10.0.57:9200/_template/roomlist' -d '
{
  "template" : "roomlist-*",
  "mappings": {
    "_default_":{
      "_all":{ "enabled":false }
    },
    "global": {
      "dynamic":true,
      "properties": {
        "timestamp": { "type": "date" },
        "plat": { "type": "string", "index": "not_analyzed" },
        "online": { "type": "integer" },
        "anchor_id": { "type": "string", "index": "not_analyzed" },
        "cate_id": { "type": "string", "index": "not_analyzed" },
        "url": { "type": "string", "index": "not_analyzed" },
        "city": { "type": "string", "index": "not_analyzed" },
        "follow": { "type": "integer" },
        "online": { "type": "integer" },
        "anchor_level": { "type": "integer" },
        "room_id": { "type": "string", "index": "not_analyzed" }
      }
    }
  }
}
'