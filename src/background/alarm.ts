import { pingVPN } from './ping';

export async function setupAlarm(interval = 10) {
  await chrome.alarms.create("vpnKeeper", {
    periodInMinutes: interval,
  });
}

export function handleAlarm(alarm: chrome.alarms.Alarm) {
  if (alarm.name === "vpnKeeper") {
    pingVPN();
  }
} 