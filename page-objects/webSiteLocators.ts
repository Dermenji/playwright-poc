export class WebSitePageLocators {
    newDomainButton = 'div.row:nth-of-type(1) > div.pagination:nth-of-type(1) > a[href$="/your-website-initial/"].btn.btn-primary';
    domainNameInput = '#add_website_name';
    submitButton = "button[type='submit']";
    domainHeader = '.clearfix header>h1';
    successNotification = '.myra-notification.type-success';
    deleteConfirmationButton = '.btn-danger';
    getDropdownButtonXpath(name: string) {
        return `//*[contains(text(), '${name}')]/..//button[@data-toggle='dropdown']`;
    }
    getDeleteButtonXpath(name: string) {
        return `//*[contains (text(), '${name}')]/..//*[contains (@data-delete-url, '/rapi/domains')]`;
    }

    getEditDnsXpath(name: string) {
        return `//*[contains(text(), '${name}')]/..//li/a[contains (@href, '/edit-dns/')]`;
    }
}