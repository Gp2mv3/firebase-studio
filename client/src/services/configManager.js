// TODO: If using localStorage: Encrypt !

export async function storeConfig(url, secret) {
  localStorage.setItem("proxySecret", secret);
  localStorage.setItem("proxyAddress", url);
}

export async function getConfig() {
  const secret = await localStorage.getItem("proxySecret");
  const url = await localStorage.getItem("proxyAddress");
  return { url, secret, isSetup: !!(url?.length) };
}

export async function clearConfig() {
  localStorage.removeItem("proxySecret");
  localStorage.removeItem("proxyAddress");
}