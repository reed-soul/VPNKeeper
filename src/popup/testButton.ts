import { testConnection } from './testConnection';

export function setupTestButton() {
  const testButton = document.getElementById("testButton") as HTMLButtonElement;
  if (testButton) {
    testButton.addEventListener("click", async () => {
      // Call the test connection function here
      await testConnection();
    });
  }
} 