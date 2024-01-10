import { Page } from "@playwright/test";
import { NavigationPage } from "./navigationPage";
import { WebSitePage } from "./webSitePage";
import { DnsRecordsPage } from "./dnsPage";


export class PageManger {

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly webSitePage: WebSitePage
    private readonly dnsRecordsPage: DnsRecordsPage

    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.webSitePage = new WebSitePage(this.page)
        this.dnsRecordsPage = new DnsRecordsPage(this.page)
    }

    navigateTo() {
        return this.navigationPage
    }

    onWebSitePage() {
        return this.webSitePage
    }

    onDNSRecordsPage() {
        return this.dnsRecordsPage
    }

}