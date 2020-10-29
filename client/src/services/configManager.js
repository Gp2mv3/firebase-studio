// TODO: If using localStorage: Encrypt !

export async function storeConfig(url, secret) {
  localStorage.setItem("proxySecret", secret);
  localStorage.setItem("proxyAddress", url);
  return;
}

export async function getConfig() {
  const secret = await localStorage.getItem("proxySecret");
  const url = await localStorage.getItem("proxyAddress");
  return { url, secret };
}
