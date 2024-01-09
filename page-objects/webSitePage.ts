import { Page, expect, test } from "@playwright/test";
import { HelperBase } from "./helperBase";
import { WebSitePageLocators } from "./webSiteLocators";

export class WebSitePage extends HelperBase {

    locators: WebSitePageLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new WebSitePageLocators();
    }

    async createDomain(name: string) {
        await test.step('Click new Domain button', async () => {
            await this.page.click(this.locators.newDomainButton);
            await this.page.waitForTimeout(500);
        });

        await test.step('Set new domain value', async () => {
            await this.page.fill(this.locators.domainNameInput, name);
            await this.page.click(this.locators.submitButton);
        });

        await test.step('Verify is created', async () => {
            await expect(this.page.locator(this.locators.domainHeader)).toBeVisible();
        });
    }

    async deleteDomain(name: string) {
        await this.page.click(this.locators.getDropdownButtonXpath(name));
        await this.page.click(this.locators.getDeleteButtonXpath(name));
        await this.page.click(this.locators.deleteConfirmationButton);

        await expect(this.page.locator(this.locators.successNotification)).toBeVisible();
        await expect(this.page.locator(this.locators.successNotification)).toBeHidden();
    }

}