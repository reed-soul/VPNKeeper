import { StorageData } from '../types';
import { showNotification } from '../utils/notification';

export async function pingVPN(retryCount = 0) {
  try {
    const { isEnabled, pingUrl } = await chrome.storage.local.get(["isEnabled", "pingUrl"]) as Pick<StorageData, 'isEnabled' | 'pingUrl'>;
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
    await chrome.storage.local.set({
      lastPingTime: now,
      status: response.ok ? "success" : "error",
      lastError: response.ok ? null : `HTTP ${response.status}`,
      retryCount: 0
    });
  } catch (error) {
    const maxRetries = 3;
    if (retryCount < maxRetries) {
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

    showNotification(
      'VPN连接异常',
      `连接失败，请检查VPN状态。错误信息：${error instanceof Error ? error.message : String(error)}`
    );
  }
} 