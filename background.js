async function showNotification(title, message) {
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon.png',
    title,
    message
  });
}

// 初始化配置
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    isEnabled: true,
    interval: 10, // 默认10分钟
    lastPingTime: null,
    status: "running",
    pingUrl: "http://10.3.4.193:10001/websso/tpaas-auth/locale/list" // 默认地址
  });
  setupAlarm();
});

// 设置定时器
async function setupAlarm(interval = 10) {
  chrome.alarms.create("vpnKeeper", {
    periodInMinutes: interval,
  });
}

// 处理定时器事件
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "vpnKeeper") {
    pingVPN();
  }
});

// 发送请求保持VPN连接
async function pingVPN(retryCount = 0) {
  try {
    const { isEnabled, pingUrl } = await chrome.storage.local.get(["isEnabled", "pingUrl"]);
    if (!isEnabled) return;
    if (!pingUrl) {
      throw new Error("心跳地址未配置");
    }

    // 验证URL格式
    new URL(pingUrl);

    const response = await fetch(
      pingUrl,
      {
        method: "GET",
        cache: "no-cache",
      }
    );

    const now = new Date().toLocaleString();
    await chrome.storage.local.set({
      lastPingTime: now,
      status: response.ok ? "success" : "error",
      lastError: response.ok ? null : `HTTP ${response.status}`,
      retryCount: 0 // 重置重试次数
    });
  } catch (error) {
    const maxRetries = 3;
    if (retryCount < maxRetries) {
      // 延迟重试
      setTimeout(() => {
        pingVPN(retryCount + 1);
      }, 1000 * (retryCount + 1)); // 递增延迟
      return;
    }

    await chrome.storage.local.set({
      status: "error",
      lastError: error.message,
      retryCount
    });

    if (retryCount >= maxRetries) {
      showNotification(
        'VPN连接异常', 
        `连接失败，请检查VPN状态。错误信息：${error.message}`
      );
    }
  }
}


// 添加消息监听
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
 if (message.action === 'resetAlarm') {
   // 先清除现有的定时器
   chrome.alarms.clear('vpnKeeper', () => {
     // 立即执行一次ping
     pingVPN();
     // 重新设置定时器
     setupAlarm(message.interval);
   });
 }
});

async function logEvent(type, details) {
  const logs = (await chrome.storage.local.get('logs')).logs || [];
  logs.unshift({
    time: new Date().toISOString(),
    type,
    details
  });
  
  // 只保留最近100条日志
  if (logs.length > 100) logs.length = 100;
  
  await chrome.storage.local.set({ logs });
}

// 在popup.js中添加日志显示功能

// 使用防抖处理频繁的状态更新
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const updateStatus = debounce(async (status) => {
  await chrome.storage.local.set({ status });
}, 1000);