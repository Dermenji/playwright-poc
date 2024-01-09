import { Page } from "@playwright/test";
import { NavigationPage } from "./navigationPage";
import { WebSitePage } from "./webSitePage";


export class PageManger {

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly webSitePage: WebSitePage

    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.webSitePage = new WebSitePage(this.page)
    }

    navigateTo() {
        return this.navigationPage
    }

    onWebSitePage() {
        return this.webSitePage
    }

}