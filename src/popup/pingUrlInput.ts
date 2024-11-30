import { testConnection } from "./testConnection";


export function setupPingUrlInput(pingUrl: string, isEnabled: boolean) {
  const pingUrlInput = document.getElementById("pingUrlInput") as HTMLInputElement;
  if (pingUrlInput) {
    pingUrlInput.value = pingUrl || "";

    pingUrlInput.addEventListener("change", async (e) => {
      const target = e.target as HTMLInputElement;
      const newUrl = target.value.trim();
      if (newUrl) {
        try {
          new URL(newUrl); // Validate URL format
          await chrome.storage.local.set({ pingUrl: newUrl });
          if (isEnabled) {
            await testConnection(); // Ensure testConnection is imported
          }
        } catch (error) {
          alert("请输入有效的URL地址");
          pingUrlInput.value = pingUrl || ""; // Restore original value
        }
      }
    });
  }
} 