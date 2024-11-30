import { StorageData } from '../types';

export function updateStatus(lastPingTime: string | null, status: StorageData['status'], lastError?: string) {
  const statusBox = document.getElementById("statusBox");
  const lastPingTimeEl = document.getElementById("lastPingTime");
  const statusEl = document.getElementById("status");

  if (!statusBox || !lastPingTimeEl || !statusEl) return;

  lastPingTimeEl.textContent = lastPingTime || "-";
  statusEl.textContent = status === "success" ? "正常" : lastError || "未知错误";

  statusBox.className = "status " + (status === "success" ? "success" : "error");
} 