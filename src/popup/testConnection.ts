export async function testConnection() {
  const { pingUrl } = await chrome.storage.local.get("pingUrl");
  if (!pingUrl) {
    throw new Error("请先配置心跳地址");
  }

  const response = await fetch(pingUrl, {
    method: "GET",
    cache: "no-cache",
  });

  return response.ok;
} 