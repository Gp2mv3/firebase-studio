import { getConfig } from "./configManager";


async function internal(page, method = 'get', body = undefined) {
  const { url, secret } = await getConfig();
  return fetch(`${url}/${page}`, {
    method,
    headers: { secret, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => { // TODO: Create something better to report errors
    if (r.status === 401) alert(`The secret token doesn't match the proxy configuration. `);
    else if (r.status !== 200) alert(`Error while requesting ${url}/${page}: Status ${r.status}.`);
    return r;
  }).then((r) => r.json());
}



export function fetchGet(page) {
  return internal(page);
}

export function fetchPost(page, body) {
  return internal(page, 'post', body);
}

export function fetchDelete(page) {
  return internal(page, 'delete');

}