window.schema = {
   "title": "How can we help?",
   "required": [
      "summary",
      "message"
   ],
   "properties": {
      "options": {
         "_id": "options",
         "_path": "options",
         "path": "options",
         "properties": {
            "issue": {
               "type": "string",
               "enum": [
                  "tech-support",
                  "feature-request",
                  "bug-report"
               ],
               "display": {
                  "name": "fm-radio-list",
                  "options": [
                     {
                        "id": "tech-support",
                        "title": "Tech support"
                     },
                     {
                        "id": "feature-request",
                        "title": "Feature request"
                     },
                     {
                        "id": "bug-report",
                        "title": "Bug report"
                     }
                  ],
                  "inline": true
               },
               "_id": "issue",
               "_path": "options.issue",
               "path": "options.issue",
               "title": "Issue",
               "_order": 1002,
               "level": 2
            },
            "priority": {
               "type": "string",
               "enum": [
                  "low",
                  "normal",
                  "high",
                  "urgent"
               ],
               "display": {
                  "name": "fm-radio-list",
                  "options": [
                     {
                        "id": "low",
                        "title": "Low"
                     },
                     {
                        "id": "normal",
                        "title": "Normal"
                     },
                     {
                        "id": "high",
                        "title": "High"
                     },
                     {
                        "id": "urgent",
                        "title": "Urgent"
                     }
                  ]
               },
               "_id": "priority",
               "_path": "options.priority",
               "path": "options.priority",
               "title": "Priority",
               "_order": 1003,
               "level": 2
            }
         },
         "display": {
            "name": "fm-input-group"
         },
         "title": "Options",
         "_order": 1001,
         "level": 1
      },
      "summary": {
         "type": "string",
         "maxLength": 100,
         "_id": "summary",
         "_path": "summary",
         "path": "summary",
         "display": {
            "name": "fm-input",
            "type": "text",
            "maxlength": 100,
            "required": true
         },
         "title": "Summary",
         "_order": 1004,
         "level": 1
      },
      "message": {
         "type": "string",
         "maxLength": 2048,
         "display": {
            "name": "fm-textarea",
            "type": "text",
            "maxlength": 2048,
            "required": true
         },
         "_id": "message",
         "_path": "message",
         "path": "message",
         "title": "Message",
         "_order": 1005,
         "level": 1
      }
   },
   "_id": "",
   "path": "",
   "display": {
      "name": "fm-input-group"
   },
   "_order": 1000,
   "level": 0
}
