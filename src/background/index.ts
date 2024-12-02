import { setupAlarm, handleAlarm } from './alarm';
import { pingVPN } from './ping';
import { initializeStorage } from '../utils/storage';

// 初始化配置
chrome.runtime.onInstalled.addListener(() => {
  initializeStorage();
  setupAlarm();
});

// 处理定时器事件
chrome.alarms.onAlarm.addListener(handleAlarm);

// 添加消息监听
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'resetAlarm') {
    chrome.alarms.clear('vpnKeeper', async () => {
      await pingVPN();
      await setupAlarm(message.interval);
      sendResponse({ success: true });
    });
    return true; // 保持消息通道开放
  }
}); 