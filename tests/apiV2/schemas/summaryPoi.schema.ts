class SummaryPoiSchema {
  static 200= {
    "type": "object",
    "properties": {
      "code": {
        "type": "integer",
        "enum": [
          200
        ]
      },
      "success": {
        "type": "boolean"
      },
      "message": {
        "type": "string"
      },
      "meta": {
        "type": "object",
        "properties": {
          "source": {
            "type": "string"
          },
          "lastUpdate": {
            "type": "string"
          }
        },
        "required": [
          "source",
          "lastUpdate"
        ]
      },
      "data": {
        "type": "object",
        "properties": {
          "totalPoi": {
            "type": "integer"
          },
          "unvalidated": {
            "type": "integer"
          },
          "assigned": {
            "type": "integer"
          },
          "approvalProcess": {
            "type": "integer"
          },
          "approvalProcessSubmitted": {
            "type": "integer"
          },
          "approvalProcessValidMitra": {
            "type": "integer"
          },
          "approvalProcessValidInternal": {
            "type": "integer"
          },
          "valid": {
            "type": "integer"
          },
          "invalid": {
            "type": "integer"
          },
          "notFound": {
            "type": "integer"
          }
        },
        "required": [
          "totalPoi",
          "unvalidated",
          "assigned",
          "approvalProcess",
          "approvalProcessSubmitted",
          "approvalProcessValidMitra",
          "approvalProcessValidInternal",
          "valid",
          "invalid",
          "notFound"
        ]
      }
    },
    "required": [
      "code",
      "success",
      "message",
      "meta",
      "data"
    ]
  }

  static 401= {
    "type": "object",
    "properties": {
      "code": {
        "type": "integer",
        "enum": [401]
      },
      "success": {
        "type": "boolean",
        "enum": [false]
      },
      "message": {
        "type": "string"
      },
      "data": {
        "type": ["null"]
      },
      "meta": {
        "type": "object",
        "properties": {
          "illustrationUrl": {
            "type": "string"
          },
          "message": {
            "type": "string"
          },
          "subMessage": {
            "type": "string"
          }
        },
        "required": ["illustrationUrl", "message", "subMessage"]
      }
    },
    "required": ["code", "success", "message", "data", "meta"]
  }
}

export default SummaryPoiSchema;