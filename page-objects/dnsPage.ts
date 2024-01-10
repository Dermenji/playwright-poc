import { Page, expect, test } from "@playwright/test";
import { HelperBase } from "./helperBase";
import { DnsRecordsPageLocators } from "./dnsRecordsLocators";

export class DnsRecordsPage extends HelperBase {

    locators: DnsRecordsPageLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new DnsRecordsPageLocators();
    }

    async createDomain(name: string) {
        await test.step('DNS recors values', async () => {
            await this.page.selectOption(this.locators.type, {value: 'CNAME'});
            await this.page.fill(this.locators.name, 'test2');
            await this.page.fill(this.locators.value, '	www.techsupport.com');
            await this.page.selectOption(this.locators.ttl, 'number:600');
            await this.page.click(this.locators.saveButton);
        });

        await test.step('Validate DNS created', async () => {
            await expect(this.page.locator(this.locators.successNotification)).toBeVisible();
            await expect(this.page.locator(this.locators.successNotification)).toBeHidden();
        });

  
    }

}