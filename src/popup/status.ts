import { StorageData } from '../types';

export function updateStatus(lastPingTime: string | null, status: StorageData['status'], lastError?: string) {
  const statusBox = document.getElementById("statusBox");
  const lastPingTimeEl = document.getElementById("lastPingTime");
  const statusEl = document.getElementById("status");
  const retryCountEl = document.getElementById("retryCount");
  const nextPingTimeEl = document.getElementById("nextPingTime");

  if (!statusBox || !lastPingTimeEl || !statusEl) return;

  lastPingTimeEl.textContent = lastPingTime || "-";
  statusEl.textContent = status === "success" ? "正常" : lastError || "未知错误";
  statusBox.className = "status " + (status === "success" ? "success" : "error");

  if (retryCountEl) {
    chrome.storage.local.get("retryCount", (data) => {
      retryCountEl.textContent = (data.retryCount || 0).toString();
    });
  }

  if (nextPingTimeEl) {
    chrome.storage.local.get(["interval", "lastPingTime"], (data) => {
      if (data.lastPingTime && data.interval) {
        const nextTime = new Date(data.lastPingTime);
        nextTime.setMinutes(nextTime.getMinutes() + data.interval);
        nextPingTimeEl.textContent = nextTime.toLocaleString();
      } else {
        nextPingTimeEl.textContent = "-";
      }
    });
  }
} 