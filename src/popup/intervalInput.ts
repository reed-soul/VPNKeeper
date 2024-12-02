export function setupIntervalInput(interval: number) {
  const intervalInput = document.getElementById("intervalInput") as HTMLInputElement;
  if (intervalInput) {
    intervalInput.value = interval.toString();

    intervalInput.addEventListener("change", async (e) => {
      const target = e.target as HTMLInputElement;
      const newInterval = parseInt(target.value, 10);
      if (!isNaN(newInterval) && newInterval >= 1 && newInterval <= 60) {
        await chrome.storage.local.set({ interval: newInterval });
        // 重置定时器
        chrome.runtime.sendMessage({ 
          action: 'resetAlarm', 
          interval: newInterval 
        });
        
        // 更新下次请求时间显示
        const nextPingTimeEl = document.getElementById("nextPingTime");
        if (nextPingTimeEl) {
          const now = new Date();
          now.setMinutes(now.getMinutes() + newInterval);
          nextPingTimeEl.textContent = now.toLocaleString();
        }
      } else {
        alert("请输入有效的心跳间隔（1-60分钟）");
        intervalInput.value = interval.toString();
      }
    });
  }
} 