export class DnsRecordsPageLocators {
    type = 'td.tabledata-responsive:nth-of-type(2) > select.form-control.input-sized:nth-of-type(1)';
    name = 'tbody:nth-of-type(1) input[placeholder="Name"]';
    value = 'tbody:nth-of-type(1) input[name="value"]';;
    ttl = 'tbody:nth-of-type(1) td.cell > select[data-ng-model="r.ttl"]';
    comment = '.visible-xs-block [data-ng-model="r.comment"]';
    saveButton = '.btn-success[data-ng-click=\'save(r)\']';
    successNotification = '.myra-notification.type-success';

}