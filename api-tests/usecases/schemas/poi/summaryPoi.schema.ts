export const schemas = {
    200: {
        "type": "object",
        "properties": {
            "success": {
                "type": "boolean"
            },
            "meta": {
                "type": "object",
                "properties": {
                    "source": {
                        "type": "string"
                    },
                    "lastUpdate": {
                        "type": "string"
                    },
                    "tooltip": {
                        "type": "string"
                    }
                }
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
                    "valid": {
                        "type": "integer"
                    },
                    "invalid": {
                        "type": "integer"
                    },
                    "notFound": {
                        "type": "integer"
                    }
                }
            },
            "message": {
                "type": "string"
            },
            "code": {
                "type": "integer"
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
                "type": "object",
                "properties": {}
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
                "type": "object",
                "properties": {}
            }
        }
    }
};