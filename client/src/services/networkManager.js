import { getConfig } from "./configManager";


async function internal(page, method = 'get', body = undefined) {
  const { url, secret } = await getConfig();
  return fetch(`${url}/${page}`, {
    method,
    headers: { secret, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
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