import { StorageData } from '../types';
import { showNotification } from '../utils/notification';

export async function pingVPN(retryCount = 0) {
  try {
    const { isEnabled, pingUrl } = await chrome.storage.local.get(["isEnabled", "pingUrl"]);
    if (!isEnabled) return;
    if (!pingUrl) {
      throw new Error("心跳地址未配置");
    }

    new URL(pingUrl); // 验证URL格式

    const response = await fetch(pingUrl, {
      method: "GET",
      cache: "no-cache",
    });

    const now = new Date().toLocaleString();
    const { interval } = await chrome.storage.local.get("interval");
    const nextPingTime = new Date();
    nextPingTime.setMinutes(nextPingTime.getMinutes() + (interval || 10));

    await chrome.storage.local.set({
      lastPingTime: now,
      status: response.ok ? "success" : "error",
      lastError: response.ok ? null : `HTTP ${response.status}`,
      retryCount: 0,
      nextPingTime: nextPingTime.toLocaleString()
    });
  } catch (error) {
    const maxRetries = 3;
    if (retryCount < maxRetries) {
      await chrome.storage.local.set({ retryCount: retryCount + 1 });
      setTimeout(() => {
        pingVPN(retryCount + 1);
      }, 1000 * (retryCount + 1));
      return;
    }

    await chrome.storage.local.set({
      status: "error",
      lastError: error instanceof Error ? error.message : String(error),
      retryCount
    });
  }
} 