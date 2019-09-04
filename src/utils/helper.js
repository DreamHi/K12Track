import uuid from 'uuid/v4';
import moment from 'moment';

export function bytesToSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const strSize = (bytes / Math.pow(k, i)).toPrecision(3);
  return `${strSize} ${sizes[i]}`;
}

export function fixedNumber(number, digits = 2, isFixed = true) {
  if (isFixed) {
    return number.toFixed(digits);
  }
  return number;
}

export function generateUUID() {
  return uuid();
}

export function formattedNumber(number) {
  return `${number}`.replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
}

export function formatDate(date) {
  return moment(date).format('YYYY/MM/DD HH:mm');
}

export function objectEquals(a, b) {
  if (a === b) {
    return true;
  }
  const bKeys = Object.keys(b).sort();

  const wrongIndex = bKeys.findIndex(value => {
    return a[value] !== b[value];
  });
  return wrongIndex === -1;
}

export function forEach(obj, iteratee) {
  if (Array.isArray(obj)) {
    const { length } = obj;
    for (let i = 0; i < length; i += 1) {
      iteratee(obj[i], i, obj);
    }
  } else {
    const keys = Object.keys(obj);
    const { length } = keys;
    for (let i = 0; i < length; i += 1) {
      iteratee(obj[keys[i]], keys[i], obj);
    }
  }
  return obj;
}

export function filter(arr, func) {
  if (!arr || arr.length === 0) return [];
  return arr.filter(func);
}

export function find(arr, obj) {
  if (!arr || arr.length === 0) return [];
  return arr.find(a => objectEquals(a, obj));
}
