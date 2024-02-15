import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async webSitesPage() {
        await this.page.goto('https://'+ process.env.PREFIX +'-dashboard.test.com/'+ process.env.LOC +'/my-websites')
      //  await expect(this.page.locator('div.row:nth-of-type(1) > div.pagination:nth-of-type(1) > a[href$="/your-website-initial/"].btn.btn-primary')).toBeVisible()
    }

}