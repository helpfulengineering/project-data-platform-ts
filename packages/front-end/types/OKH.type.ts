// OKH type
// example OKH from here:
// https://github.com/helpfulengineering/library/blob/main/alpha/okh/okh-chococolate-chip.yml

import { contactInfo, ATOM, YYYY_MM_DD, versionType } from "./general.type";

type OKH_TYPE = {
  title: string;
  description: string;
  "intended-use": string;
  keywords: string[];
  "project-link": string;
  image: string;
  made: boolean;
  "made-independently": boolean;
  license: string;
  licensor: contactInfo;
  "okh-manifest-version": string;
  "date-created": YYYY_MM_DD;
  "date-updated": YYYY_MM_DD;
  "manifest-author": contactInfo;
  "manifest-language": string;
  contact: contactInfo;
  version: versionType;
  "development-stage": string;
  "documentation-home": string;
  bom: string;
  "bom-atoms": ATOM[];
  "tool-list": string;
  "tool-list-atoms": ATOM[];
  "product-atom": ATOM;
  "making-instructions": { path: string; title: string; Steps: string[] };
  "maintenance-instructions": string;
  "health-safety-notice": string;
  "standards-used": string;
};
