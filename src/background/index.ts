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
chrome.runtime.onMessage.addListener((message,) => {
  if (message.action === 'resetAlarm') {
    chrome.alarms.clear('vpnKeeper', () => {
      pingVPN();
      setupAlarm(message.interval);
    });
  }
}); 