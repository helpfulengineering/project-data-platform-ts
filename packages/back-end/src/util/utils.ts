import fs from 'fs';
import { jsonType } from '../types/generalTypes';

const JSON_FILE_PATH = __dirname + '/../storage/';
console.log('JSON_FILE_PATH', JSON_FILE_PATH);

export function saveJSON(name: string, data: any): boolean {
  // this needs work to divide the okh and okw files into two folders
  const path = JSON_FILE_PATH + name;
  console.log('saveJSON');
  try {
    let res = fs.writeFileSync(path, JSON.stringify(data), 'utf8');
    console.log('res', res);
  } catch (err) {
    return false;
  }

  return true;
}

export function loadAsJSON(name: string): jsonType | null {
  const path = JSON_FILE_PATH + name + '.json';
  try {
    const data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
    return JSON.parse(data);
  } catch (err) {
    console.log('error when trying to access file:', name);
  }
  // this needs work to divide the okh and okw files into two folders
  return null;
}

export function loadAllAsJSON(names: string[]) {
  let result: jsonType[] = [];
  for (let n of names) {
    let file = loadAsJSON(n);
    if (file) result.push();
  }
  return result;
}
