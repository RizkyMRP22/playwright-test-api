class listPoiSchema {
    static 200 = {
        "type": "object",
        "properties": {
            "code": {
                "type": "integer"
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
                    "page": {
                        "type": "integer"
                    },
                    "size": {
                        "type": "integer"
                    },
                    "totalData": {
                        "type": "integer"
                    },
                    "totalPage": {
                        "type": "integer"
                    },
                    "geom": {
                        "type": "string"
                    },
                    "source": {
                        "type": "string"
                    },
                    "lastUpdate": {
                        "type": "string"
                    }
                },
                "required": [
                    "page",
                    "size",
                    "totalData",
                    "totalPage",
                    "geom",
                    "source",
                    "lastUpdate"
                ]
            },
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "idPoi": {
                            "type": "string"
                        },
                        "name": {
                            "type": "string"
                        },
                        "address": {
                            "type": ["string", "null"]
                        },
                        "sto": {
                            "type": ["string", "null"]
                        },
                        "segment": {
                            "type": "object",
                            "properties": {
                                "sector": {
                                    "type": "string"
                                },
                                "subSector": {
                                    "type": "string"
                                },
                                "ecosystem": {
                                    "type": "string"
                                },
                                "opportunity": {
                                    "type": "string"
                                },
                                "icon": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "sector",
                                "subSector",
                                "ecosystem",
                                "opportunity",
                                "icon"
                            ]
                        },
                        "long": {
                            "type": "number"
                        },
                        "lat": {
                            "type": "number"
                        },
                        "status": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "label": {
                                        "type": "string"
                                    },
                                    "color": {
                                        "type": "string"
                                    },
                                    "value": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "label",
                                    "value"
                                ]
                            }
                        },
                        "priority": {
                            "type": "object",
                            "properties": {
                                "level": {
                                    "type": "integer"
                                },
                                "label": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "level",
                                "label"
                            ]
                        },
                        "ranking": {
                            "type": "string"
                        },
                        "regional": {
                            "type": "string"
                        },
                        "witel": {
                            "type": "string"
                        },
                        "createdDate": {
                            "type": "string"
                        },
                        "createdBy": {
                            "type": ["string", "null"]
                        },
                        "isVisited": {
                            "type": "boolean"
                        }
                    },
                    "required": [
                        "idPoi",
                        "name",
                        "address",
                        "sto",
                        "segment",
                        "long",
                        "lat",
                        "status",
                        "priority",
                        "ranking",
                        "regional",
                        "witel",
                        "createdDate",
                        "createdBy",
                        "isVisited"
                    ]
                }
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

    static 401 = {
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

export default listPoiSchema;