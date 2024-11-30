
export const initializeStorage = async () => {
  const { pingUrl } = await chrome.storage.local.get('pingUrl');
  if (!pingUrl) {
    await chrome.storage.local.set({
      pingUrl: ''
    });
  }
  
  await chrome.storage.local.set({
    isEnabled: true,
    interval: 10,
    lastPingTime: null,
    status: 'running'
  });
}; 