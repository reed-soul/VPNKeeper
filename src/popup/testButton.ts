import { testConnection } from './testConnection';
import { updateStatus } from './status';

export function setupTestButton() {
  const testButton = document.getElementById("testButton") as HTMLButtonElement;
  const testResult = document.getElementById("testResult");
  
  if (testButton) {
    testButton.addEventListener("click", async () => {
      try {
        testButton.disabled = true;
        const success = await testConnection();
        const now = new Date().toLocaleString();
        
        // 更新状态
        await chrome.storage.local.set({
          lastPingTime: now,
          status: success ? "success" : "error",
          lastError: success ? null : "连接失败"
        });
        
        // 更新UI
        updateStatus(now, success ? "success" : "error");
        if (testResult) {
          testResult.textContent = success ? "连接成功" : "连接失败";
          testResult.style.color = success ? "#4CAF50" : "#f44336";
        }
      } catch (error) {
        if (testResult) {
          testResult.textContent = error.message;
          testResult.style.color = "#f44336";
        }
      } finally {
        testButton.disabled = false;
      }
    });
  }
} 