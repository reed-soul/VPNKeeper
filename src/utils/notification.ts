export async function showNotification(title: string, message: string) {
  await chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon.png',
    title,
    message
  });
} 