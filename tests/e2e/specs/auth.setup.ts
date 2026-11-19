import { test as setup } from '@playwright/test';
import { DeveloperLoginPage } from '../pages/DeveloperLoginPage';

const authFile = 'playwright/.auth/developer.json';

setup('authenticate developer and store session', async ({ page }) => {
  const loginPage = new DeveloperLoginPage(page);
  await loginPage.goto();
  await loginPage.login('developer@gmail.com', '123456');
  await loginPage.verifyLoginSuccess();
  await page.context().storageState({ path: authFile });
});
