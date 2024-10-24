export type n09 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type n19 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type YYYY = `${19 | 20}${n09}${n09}`;
export type MM = `0${n19}` | `1${0 | 1 | 2}`;
export type DD = `${0 | 1 | 2 | 3}{n09}`;
export type YYYY_MM_DD = `${YYYY}-${MM}-${DD}`;
export type VERSION_TYPE =
  | number
  | `${number}.${number}`
  | `${number}.${number}.${number}`;
export type emailType = `${string}@${string}.${string}`;

export type CONTACT_TYPE = {
  name: string;
  affiliation: string;
  email: emailType;
};

// Atom example
// {
//   identifier: Q13229680
//   description: chocolate chips
//   link: https://www.wikidata.org/wiki/Q1329680
// }

// Perhaps use a library to handle this TODO look up libraries
export type URL_TYPE = `http${"" | "s"}://${
  | ""
  | `${string}.`}${string}.${string}`;
