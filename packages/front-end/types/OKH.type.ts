// OKH type
// example OKH from here:
// https://github.com/helpfulengineering/library/blob/main/alpha/okh/okh-chococolate-chip.yml

import {
  type CONTACT_TYPE,
  type YYYY_MM_DD,
  type VERSION_TYPE,
} from "./general.type";
import { type ATOM_TYPE } from "./ATOM.type";

export type OKH_TYPE = {
  id: number;
  title: string;
  description: string;
  "intended-use": string;
  keywords?: string[];
  "project-link": string;
  image: string | string[] | null;
  made: boolean;
  "made-independently": boolean;
  license:
    | string
    | { hardware: string; documentation: string; software: string };
  licensor: CONTACT_TYPE;
  "okh-manifest-version": string;
  "date-created": YYYY_MM_DD | string; // Needs to be ISO 8601
  "date-updated": YYYY_MM_DD | string; // Needs to be ISO 8601
  "manifest-author": CONTACT_TYPE;
  "manifest-language": string;
  contact: CONTACT_TYPE;
  version?: VERSION_TYPE;
  "development-stage"?: string;
  "documentation-home"?: string;
  bom?: string;
  "bom-atoms"?: ATOM_TYPE[];
  "tool-list"?: string;
  "tool-list-atoms"?: ATOM_TYPE[];
  "product-atom"?: ATOM_TYPE;
  "making-instructions"?: { path?: string; title?: string; Steps?: string[] }[];
  "maintenance-instructions"?: string;
  "health-safety-notice"?: string;
  "standards-used"?: string;
};
