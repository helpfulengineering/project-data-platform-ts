// OKW sample
// from https://github.com/helpfulengineering/OKF-Schema/blob/main/okw-schema/okw.schema.json

type OKW_TYPE = {
  $schema: string;
  title: string;
  type: string; // 'object'
  properties: {
    title: string;
    description: string;
    contact: string;
    keywords: string[];
    contributors: {
      oneOf: [
        {
          type: "string";
        },
        {
          type: "array";
          items: {
            type: "string";
          };
        }
      ];
    };
    version: {
      oneOf: [
        {
          type: "string";
        },
        {
          type: "number";
        }
      ];
    };
    "development-stage": {
      type: "string";
    };
    license: {
      oneOf: [
        {
          type: "string";
        },
        {
          type: "array";
          items: {
            type: "string";
          };
        }
      ];
    };
    licensor: {
      type: "string";
    };
    "documentation-home": {
      type: "string";
      format: "uri";
    };
    "archive-download": {
      type: "string";
      format: "uri";
    };
    "inventory-atoms": {
      type: "array";
      items: {
        $ref: "#/definitions/Atom";
      };
      description: "things which this OKW expects to have in inventory";
    };
    "product-atoms": {
      type: "array";
      items: {
        $ref: "#/definitions/Atom";
      };
      description: "things that the OKW can make without an OKH";
    };
    "tool-list-atoms": {
      type: "array";
      items: {
        $ref: "#/definitions/Atom";
      };
      description: "things that the OKW can make without an OKH";
    };
    processes: {
      type: "array";
      items: {
        $ref: "#/definitions/Atom";
      };
      description: "things that the OKW can make without an OKH";
    };
  };
  required: ["title", "license"];
  definitions: {
    Atom: {
      type: "object";
      properties: {
        identifier: {
          type: "string";
        };
        description: {
          type: "string";
        };
        link: {
          type: "string";
          format: "uri";
        };
      };
      required: ["description", "identifier"];
      additionalProperties: false;
      title: "Atom";
    };
  };
};

const sampleOKW = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Open Know-Where manifest schema for Helpful Engineering",
  type: "object",
  properties: {
    title: {
      type: "string",
    },
    description: {
      type: "string",
    },
    contact: {
      type: "string",
    },
    keywords: {
      type: "array",
      items: {
        type: "string",
      },
    },
    contributors: {
      oneOf: [
        {
          type: "string",
        },
        {
          type: "array",
          items: {
            type: "string",
          },
        },
      ],
    },
    version: {
      oneOf: [
        {
          type: "string",
        },
        {
          type: "number",
        },
      ],
    },
    "development-stage": {
      type: "string",
    },
    license: {
      oneOf: [
        {
          type: "string",
        },
        {
          type: "array",
          items: {
            type: "string",
          },
        },
      ],
    },
    licensor: {
      type: "string",
    },
    "documentation-home": {
      type: "string",
      format: "uri",
    },
    "archive-download": {
      type: "string",
      format: "uri",
    },
    "inventory-atoms": {
      type: "array",
      items: {
        $ref: "#/definitions/Atom",
      },
      description: "things which this OKW expects to have in inventory",
    },
    "product-atoms": {
      type: "array",
      items: {
        $ref: "#/definitions/Atom",
      },
      description: "things that the OKW can make without an OKH",
    },
    "tool-list-atoms": {
      type: "array",
      items: {
        $ref: "#/definitions/Atom",
      },
      description: "things that the OKW can make without an OKH",
    },
    processes: {
      type: "array",
      items: {
        $ref: "#/definitions/Atom",
      },
      description: "things that the OKW can make without an OKH",
    },
  },
  required: ["title", "license"],
  definitions: {
    Atom: {
      type: "object",
      properties: {
        identifier: {
          type: "string",
        },
        description: {
          type: "string",
        },
        link: {
          type: "string",
          format: "uri",
        },
      },
      required: ["description", "identifier"],
      additionalProperties: false,
      title: "Atom",
    },
  },
};
