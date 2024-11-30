import { StorageData } from '../types';
import { updateStatus } from './status';
import { testConnection } from './testConnection';
import { setupPingUrlInput } from './pingUrlInput';
import { setupIntervalInput } from './intervalInput';
import { setupTestButton } from './testButton';

export async function setupEventListeners() {
  const { isEnabled, lastPingTime, status, lastError, pingUrl, interval } =
    await chrome.storage.local.get([
      "isEnabled",
      "lastPingTime",
      "status",
      "lastError",
      "pingUrl",
      "interval"
    ]) as StorageData;

  setupToggle(isEnabled);
  setupPingUrlInput(pingUrl, isEnabled);
  setupIntervalInput(interval);
  setupTestButton();
  
  updateStatus(lastPingTime, status, lastError);
}

function setupToggle(isEnabled: boolean) {
  const toggle = document.getElementById("enableToggle") as HTMLInputElement;
  if (!toggle) return;

  toggle.checked = isEnabled;
  const statusText = document.getElementById("statusText");
  if (statusText) {
    statusText.textContent = isEnabled ? "启用中" : "已停用";
  }

  toggle.addEventListener("change", async (e) => {
    const target = e.target as HTMLInputElement;
    const isEnabled = target.checked;
    await chrome.storage.local.set({ isEnabled });
    if (statusText) {
      statusText.textContent = isEnabled ? "启用中" : "已停用";
    }

    if (isEnabled) {
      await testConnection();
      chrome.runtime.sendMessage({ action: "resetAlarm" });
    }
  });
}

// ... 其他事件处理函数 