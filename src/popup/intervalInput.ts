export function setupIntervalInput(interval: number) {
  const intervalInput = document.getElementById("intervalInput") as HTMLInputElement;
  if (intervalInput) {
    intervalInput.value = interval.toString();

    intervalInput.addEventListener("change", async (e) => {
      const newInterval = parseInt(e.target.value, 10);
      if (!isNaN(newInterval) && newInterval >= 1 && newInterval <= 60) {
        await chrome.storage.local.set({ interval: newInterval });
        // Optionally, reset the alarm with the new interval
        chrome.runtime.sendMessage({ action: 'resetAlarm', interval: newInterval });
      } else {
        alert("请输入有效的心跳间隔（1-60分钟）");
        intervalInput.value = interval.toString(); // Restore original value
      }
    });
  }
} 