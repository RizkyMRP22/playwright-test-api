export const schemas = {
    200:
    {
        "$schema": "http://json-schema.org/draft-07/schema#",
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
                        "type": "string",
                        "format": "date-time"
                    }
                },
                "required": ["page", "size", "totalData", "totalPage", "geom", "source", "lastUpdate"]
            },
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "idPoi": {
                            "type": "integer"
                        },
                        "name": {
                            "type": "string"
                        },
                        "address": {
                            "type": ["string","null"]
                        },
                        "sto": {
                            "type": ["string","null"]
                        },
                        "segment": {
                            "type": "object",
                            "properties": {
                                "sector": {
                                    "type": ["string","null"]
                                },
                                "subSector": {
                                    "type": ["string","null"]
                                },
                                "ecosystem": {
                                    "type": ["string","null"]
                                },
                                "opportunity": {
                                    "type": ["string","null"]
                                },
                                "icon": {
                                    "type":["string","null"]
                                }
                            },
                            "required": ["sector", "subSector", "ecosystem", "opportunity", "icon"]
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
                                "required": ["label", "value"]
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
                            "required": ["level", "label"]
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
                            "type": "string",
                            "format": "date-time"
                        },
                        "createdBy": {
                            "type": "string"
                        },
                        "isVisited": {
                            "type": "boolean"
                        }
                    },
                    "required": ["idPoi", "name", "address", "sto", "segment", "long", "lat", "status", "priority", "ranking", "regional", "witel", "createdDate", "createdBy", "isVisited"]
                }
            }
        },
        "required": ["code", "success", "message", "meta", "data"]
    },
    400: {
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
                    "illustrationUrl": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    },
                    "subMessage": {
                        "type": "string"
                    }
                }
            },
            "data": {
                "type": "array",
                "items": {}
            }
        }
    },
    401:
    {
        "type": "object",
        "properties": {
            "code": {
                "type": "integer",
                "description": "HTTP status code"
            },
            "success": {
                "type": "boolean",
                "description": "Indicates if the request was successful"
            },
            "message": {
                "type": "string",
                "description": "Error message indicating the issue with the access token"
            },
            "data": {
                "type": [
                    "null",
                    "object"
                ],
                "description": "Data, which is null in case of an unauthorized error"
            },
            "meta": {
                "type": "object",
                "properties": {
                    "illustrationUrl": {
                        "type": "string",
                        "description": "URL for any related illustration or image, can be empty"
                    },
                    "message": {
                        "type": "string",
                        "description": "Detailed error message"
                    },
                    "subMessage": {
                        "type": "string",
                        "description": "Additional information, can be empty"
                    }
                },
                "required": [
                    "illustrationUrl",
                    "message",
                    "subMessage"
                ]
            }
        },
        "required": [
            "code",
            "success",
            "message",
            "data",
            "meta"
        ]
    },
    403: {
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
                    "illustrationUrl": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    },
                    "subMessage": {
                        "type": "string"
                    }
                }
            },
            "data": {
                "type": "object",
                "properties": {}
            }
        }
    },
    404: {
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
                    "illustrationUrl": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    },
                    "subMessage": {
                        "type": "string"
                    }
                }
            },
            "data": {
                "type": "array",
                "items": {}
            }
        }
    },
    500: {
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
                    "illustrationUrl": {
                        "type": "string"
                    },
                    "message": {
                        "type": "string"
                    },
                    "subMessage": {
                        "type": "string"
                    }
                }
            },
            "data": {
                "type": "array",
                "items": {}
            }
        }
    }
};