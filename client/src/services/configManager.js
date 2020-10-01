// TODO: If using localStorage: Encrypt !

export async function storeConfig(url, file) {
  localStorage.setItem("configFile", btoa(JSON.stringify(JSON.parse(file))));
  localStorage.setItem("proxyAddress", url);
  return;
}

export async function getConfig() {
  const credentials = await localStorage.getItem("configFile");
  const url = await localStorage.getItem("proxyAddress");
  return { url, credentials };
}
