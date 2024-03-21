import { TIMEOUT_SEC } from './config.js';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJson = async function (url) {
  try {
    const fetchPromise = fetch(url);
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (res.ok === false) throw new Error(data.message);

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJson = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (res.ok === false) throw new Error(data.message);

    return data;
  } catch (err) {
    throw err;
  }
};

export const deleteJson = async function (url, id, key) {
  try {
    const fetchPromise = fetch(`${url}${id}?key=${key}`, {
      method: 'DELETE',
    });
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (res.ok === false) throw new Error(data.message);

    return data;
  } catch (err) {
    throw err;
  }
};
