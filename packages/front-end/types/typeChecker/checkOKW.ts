import type { OKW_TYPE } from "../OKW.type";

let testOKW: OKW_TYPE = {
  title: "Robert's test OKW for Sewing",
  contact: "Robert L. Read, PhD, read.robert@gmail.com",
  contributors: "Robert L. Read",
  version: 0.1,
  "development-stage": "early",
  license: "Creative Commons CC0 (Public Domain Dedication)",
  licensor: "Robert L. Read",
  "documentation-home": "https://www.pubinv.org/",
  "inventory-atoms": [
    {
      identifier: "Q8231603",
      description: "General purpose cotton fabric of garment weight for sewing",
      link: "https://www.wikidata.org/wiki/Q8231603",
    },
    {
      identifier: "Q3715160",
      description:
        "General purpose wool suiting appropriate for seweing garments for men",
      link: "https://www.wikidata.org/wiki/Q3715160",
    },
  ],
  "product-atoms": [
    {
      identifier: "Q2160801",
      description: "Simple skirts with drawstrings",
      link: "https://www.wikidata.org/wiki/Q2160801",
    },
  ],
  "tool-list-atoms": [
    {
      identifier: "Q49013",
      description: "Baby Loc Sewing Machine",
      link: "https://www.wikidata.org/wiki/Q49013",
    },
    {
      identifier: "Q40847",
      description: "Scissors",
      link: "https://www.wikidata.org/wiki/Q40847",
    },
    {
      identifier: "Q111337721",
      description: "Shears",
      link: "https://www.wikidata.org/wiki/Q111337721",
    },
    {
      identifier: "Q1391831",
      description: "Thread",
      link: "https://www.wikidata.org/wiki/Q1391831",
    },
    {
      identifier: "Q107196205",
      description: "measuring tape",
      link: "https://www.wikidata.org/wiki/Q107196205",
    },
    {
      identifier: "Q111591519",
      description: "Pins",
      link: "https://www.wikidata.org/wiki/Q111591519",
    },
  ],
  processes: [
    {
      identifier: "Q211387",
      description: "Sewing of simple (non-fashion) garments",
      link: "https://www.wikidata.org/wiki/Q652122",
    },
  ],
};

console.log(testOKW);
