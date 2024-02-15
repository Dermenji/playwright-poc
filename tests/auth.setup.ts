import { expect, request, test as setup } from '@playwright/test';
import { generateAuthToken } from '../test-utils/generateAuthToken';

const authFile = '.auth/user.json'

setup('authentication', async ({ page }) => {
    await page.goto('/')
    await page.locator("[data-id='loginForm-input-name'], input[type='email']").fill('test@test.com')
    await page.locator("[data-id='loginForm-input-password'], input[type='password']").fill('TestPassword!')
    await page.locator("[data-id='loginForm-button-submit'], button[type='submit']").click()
    await expect(page.locator("#tfa-code")).toBeVisible()

    await page.waitForTimeout(3000)


    const context = await request.newContext({
        baseURL: 'https://' + process.env.PREFIX + '-users.test.com',
    });


    const headers = generateAuthToken(process.env.APIKEY_UI, process.env.APISECRET_UI, 'user/1002668/tfa/backup/generate', 'POST');

    const response = await context.post('/apiv2/user/1002668/tfa/backup/generate', {
        headers: headers
    });

    await expect(response).toBeOK();

    let backupCode = await response.body().then(b => {
        let data = JSON.parse(b.toString());
        return data.data[0];
    });


    await page.locator("#tfa-code, div[data-cy='text-input-div']>input").fill(backupCode)
    await page.locator("[type='submit']").click()

    await page.waitForTimeout(3000)

    await page.context().storageState({ path: authFile })
})

