// 更新状态显示函数
function updateStatus(lastPingTime, status, lastError) {
  const statusBox = document.getElementById("statusBox");
  const lastPingTimeEl = document.getElementById("lastPingTime");
  const statusEl = document.getElementById("status");

  lastPingTimeEl.textContent = lastPingTime || "-";
  statusEl.textContent =
    status === "success" ? "正常" : lastError || "未知错误";

  statusBox.className =
    "status " + (status === "success" ? "success" : "error");
}

// 测试连接函数
async function testConnection() {
  const testButton = document.getElementById("testButton");
  const testResult = document.getElementById("testResult");

  // 禁用按钮，显示加载状态
  testButton.disabled = true;
  testButton.textContent = "测试中...";
  testResult.textContent = "";

  try {
    const { pingUrl } = await chrome.storage.local.get("pingUrl");
    if (!pingUrl) {
      throw new Error("请先配置心跳地址");
    }

    const startTime = performance.now();
    const response = await fetch(
      pingUrl,
      {
        method: "GET",
        cache: "no-cache",
      }
    );
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    const now = new Date().toLocaleString();
    const newStatus = response.ok ? "success" : "error";
    const newError = response.ok ? null : `HTTP ${response.status}`;

    // 更新存储
    await chrome.storage.local.set({
      lastPingTime: now,
      status: newStatus,
      lastError: newError,
    });

    // 更新状态显示
    updateStatus(now, newStatus, newError);

    if (response.ok) {
      testResult.innerHTML = `
        <span style="color: green;">✓ 连接成功</span><br>
        响应时间: ${duration}ms<br>
        状态码: ${response.status}
      `;
      testResult.style.backgroundColor = "#e6ffe6";
    } else {
      testResult.innerHTML = `
        <span style="color: red;">✗ 请求失败</span><br>
        状态码: ${response.status}<br>
        错误信息: ${response.statusText}
      `;
      testResult.style.backgroundColor = "#ffe6e6";
    }
  } catch (error) {
    const now = new Date().toLocaleString();
    // 更新存储
    await chrome.storage.local.set({
      lastPingTime: now,
      status: "error",
      lastError: error.message,
    });

    // 更新状态显示
    updateStatus(now, "error", error.message);

    testResult.innerHTML = `
      <span style="color: red;">✗ 连接错误</span><br>
      错误信息: ${error.message}
    `;
    testResult.style.backgroundColor = "#ffe6e6";
  } finally {
    // 恢复按钮状态
    testButton.disabled = false;
    testButton.textContent = "测试连接";
  }
}

// 初始化
document.addEventListener("DOMContentLoaded", async () => {
  // 加载当前状态
  const { isEnabled, lastPingTime, status, lastError, pingUrl, interval } =
    await chrome.storage.local.get([
      "isEnabled",
      "lastPingTime",
      "status",
      "lastError",
      "pingUrl",
      "interval"
    ]);

  // 更新开关状态
  const toggle = document.getElementById("enableToggle");
  toggle.checked = isEnabled;
  document.getElementById("statusText").textContent = isEnabled
    ? "启用中"
    : "已停用";

  // 更新状态显示
  updateStatus(lastPingTime, status, lastError);

  // 更新心跳地址输入框
  const pingUrlInput = document.getElementById("pingUrlInput");
  pingUrlInput.value = pingUrl || "";

  // 更新间隔时间输入框
  const intervalInput = document.getElementById("intervalInput");
  intervalInput.value = interval || 10;

  // 监听心跳地址变化
  pingUrlInput.addEventListener("change", async (e) => {
    const newUrl = e.target.value.trim();
    if (newUrl) {
      try {
        new URL(newUrl); // 验证URL格式
        await chrome.storage.local.set({ pingUrl: newUrl });
        // 如果启用状态，立即测试新地址
        if (isEnabled) {
          await testConnection();
        }
      } catch (error) {
        alert("请输入有效的URL地址");
        e.target.value = pingUrl || ""; // 恢复原值
      }
    }
  });

  // 监听开关变化
  toggle.addEventListener("change", async (e) => {
    const isEnabled = e.target.checked;
    await chrome.storage.local.set({ isEnabled });
    document.getElementById("statusText").textContent = isEnabled
      ? "启用中"
      : "已停用";

    // 如果是启用状态，立即触发一次请求
    if (isEnabled) {
      await testConnection();
      // 通知background.js重新设置定时器
      chrome.runtime.sendMessage({ action: "resetAlarm" });
    }
  });

  // 测试按钮点击事件
  const testButton = document.getElementById("testButton");
  testButton.addEventListener("click", testConnection);

  // 在popup.js中添加interval设置的处理
  document.getElementById('intervalInput').addEventListener('change', async (e) => {
    const interval = parseInt(e.target.value, 10);
    await chrome.storage.local.set({ interval });
    chrome.runtime.sendMessage({ action: 'resetAlarm', interval });
  });
});
