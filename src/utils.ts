export interface HlsParserOptions {
  strictMode?: boolean;
  silent?: boolean;
}

let options: HlsParserOptions = {};

function THROW(err: Error) {
  if (!options.strictMode) {
    if (!options.silent) {
      console.error(err.message);
    }
    return;
  }
  throw err;
}

function ASSERT(msg, ...options: [string, ...boolean[]]): void {
  for (const [index, param] of options.entries()) {
    if (!param) {
      THROW(new Error(`${msg} : Failed at [${index}]`));
    }
  }
}

function CONDITIONALASSERT(...options: [boolean, any][]): void {
  for (const [index, [cond, param]] of options.entries()) {
    if (!cond) {
      continue;
    }
    if (!param) {
      THROW(new Error(`Conditional Assert : Failed at [${index}]`));
    }
  }
}

function PARAMCHECK(...options: boolean[]): void {
  for (const [index, param] of options.entries()) {
    if (param === undefined) {
      THROW(new Error(`Param Check : Failed at [${index}]`));
    }
  }
}

function CONDITIONALPARAMCHECK(...options: [boolean, any][]): void {
  for (const [index, [cond, param]] of options.entries()) {
    if (!cond) {
      continue;
    }
    if (param === undefined) {
      THROW(new Error(`Conditional Param Check : Failed at [${index}]`));
    }
  }
}

function INVALIDPLAYLIST(msg: string): void {
  THROW(new Error(`Invalid Playlist : ${msg}`));
}

function toNumber(str: string, radix = 10): number {
  if (typeof str === 'number') {
    return str;
  }
  const num = radix === 10 ? Number.parseFloat(str) : Number.parseInt(str, radix);
  if (Number.isNaN(num)) {
    return 0;
  }
  return num;
}

function hexToByteSequence(str: string): Buffer {
  if (str.startsWith('0x') || str.startsWith('0X')) {
    str = str.slice(2);
  }
  const numArray: number[] = [];
  for (let i = 0; i < str.length; i += 2) {
    numArray.push(toNumber(str.slice(i, i + 2), 16));
  }
  return Buffer.from(numArray);
}

function byteSequenceToHex(sequence: Buffer, start = 0, end = sequence.length): string {
  if (end <= start) {
    THROW(new Error(`end must be larger than start : start=${start}, end=${end}`));
  }
  const array = [];
  for (let i = start; i < end; i++) {
    array.push(`0${(sequence[i] & 0xFF).toString(16).toUpperCase()}`.slice(-2));
  }
  return `0x${array.join('')}`;
}

export type BodyHandler = () => string
export type ErrorHandler = (Error) => void

function tryCatch(body: () => string, errorHandler: ErrorHandler): ReturnType<BodyHandler | ErrorHandler> {
  try {
    return body();
  } catch (err) {
    return errorHandler(err);
  }
}

function splitAt(str:string, delimiter: string, index = 0): string[] | [string] {
  let lastDelimiterPos: number = -1;
  for (let i = 0, j = 0; i < str.length; i++) {
    if (str[i] === delimiter) {
      if (j++ === index) {
        return [str.slice(0, i), str.slice(i + 1)];
      }
      lastDelimiterPos = i;
    }
  }
  if (lastDelimiterPos !== -1) {
    return [str.slice(0, lastDelimiterPos), str.slice(lastDelimiterPos + 1)];
  }
  return [str];
}

function trim(str: string, char = ' '): string {
  if (!str) {
    return str;
  }
  str = str.trim();
  if (char === ' ') {
    return str;
  }
  if (str.startsWith(char)) {
    str = str.slice(1);
  }
  if (str.endsWith(char)) {
    str = str.slice(0, -1);
  }
  return str;
}

function splitByCommaWithPreservingQuotes(str: string): string[] {
  const list: string[] = [];
  let doParse: boolean = true;
  let start: number = 0;
  const prevQuotes = [];
  for (let i = 0; i < str.length; i++) {
    const curr = str[i];
    if (doParse && curr === ',') {
      list.push(str.slice(start, i).trim());
      start = i + 1;
      continue;
    }
    if (curr === '"' || curr === '\'') {
      if (doParse) {
        prevQuotes.push(curr);
        doParse = false;
      } else if (curr === prevQuotes[prevQuotes.length - 1]) {
        prevQuotes.pop();
        doParse = true;
      } else {
        prevQuotes.push(curr);
      }
    }
  }
  list.push(str.slice(start).trim());
  return list;
}

function camelify(str): string {
  const array: string[] = [];
  let nextUpper: boolean = false;
  for (const ch of str) {
    if (ch === '-' || ch === '_') {
      nextUpper = true;
      continue;
    }
    if (nextUpper) {
      array.push(ch.toUpperCase());
      nextUpper = false;
      continue;
    }
    array.push(ch.toLowerCase());
  }
  return array.join('');
}

function formatDate(date: Date): string {
  const YYYY = date.getUTCFullYear();
  const MM = ('0' + (date.getUTCMonth() + 1)).slice(-2);
  const DD = ('0' + date.getUTCDate()).slice(-2);
  const hh = ('0' + date.getUTCHours()).slice(-2);
  const mm = ('0' + date.getUTCMinutes()).slice(-2);
  const ss = ('0' + date.getUTCSeconds()).slice(-2);
  const msc = ('00' + date.getUTCMilliseconds()).slice(-3);
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}.${msc}Z`;
}

type Callable = (...any:any[]) => any
function hasOwnProp<T extends Record<string, Callable>, K extends keyof T>(obj: T, propName: K): ReturnType<T[K]> {
  return Object.hasOwnProperty.call(obj, propName);
}

function setOptions(newOptions = {}) {
  options = Object.assign(options, newOptions);
}

function getOptions() {
  return Object.assign({}, options);
}

module.exports = {
  THROW,
  ASSERT,
  CONDITIONALASSERT,
  PARAMCHECK,
  CONDITIONALPARAMCHECK,
  INVALIDPLAYLIST,
  toNumber,
  hexToByteSequence,
  byteSequenceToHex,
  tryCatch,
  splitAt,
  trim,
  splitByCommaWithPreservingQuotes,
  camelify,
  formatDate,
  hasOwnProp,
  setOptions,
  getOptions
};
