import { expect, test } from '@playwright/test';
import { generateAuthToken } from '../test-utils/generateAuthToken';
import { readDataFile } from '../data/data-util';
import { formatDate } from '../data/date-utils';


const DOMAIN_ENDPOINT = '/domains';
const DOMAIN_CREATE_JSON = 'domain-create.json';

const generateHeaders = (endpoint, method, data) => generateAuthToken(process.env.APIKEY, process.env.APISECRET, endpoint, method, data);

const parseJsonResponse = async (response) => {
    const responseBodyBuffer = await response.body();
    return JSON.parse(responseBodyBuffer.toString());
};


test.describe('Domain CRUD operation suite @API', () => {

    let dataBody;

    test.beforeEach(async () => {
        dataBody = await readDataFile(DOMAIN_CREATE_JSON);
    })

    test('Verify POST /domains with missing data', async ({ request }) => {

        delete dataBody.name;

        const headers = generateHeaders('domains', 'POST', JSON.stringify(dataBody));

        const response = await request.post(DOMAIN_ENDPOINT, {
            headers,
            data: JSON.stringify(dataBody),
        });

        await expect(response.status()).toEqual(400);

        const responseBody = await parseJsonResponse(response);

        expect.soft(responseBody.error).toBe(true);
        expect.soft(responseBody.violationList[0].message).toEqual('addwebsite.invalid_domain');
        expect.soft(responseBody.warningList).toEqual([]);
        expect.soft(responseBody.data).toEqual([]);
    });

    test('Verify POST /domains with invalid data', async ({ request }) => {

        dataBody.autoUpdate = 'invalid';

        const headers = generateHeaders('domains', 'POST', JSON.stringify(dataBody));

        const response = await request.post(DOMAIN_ENDPOINT, {
            headers,
            data: JSON.stringify(dataBody),
        });

        await expect(response.status()).toEqual(400);

        const responseBody = await parseJsonResponse(response);

        expect.soft(responseBody.error).toBe(true);
        expect.soft(responseBody.violationList[0].propertyPath).toEqual('autoUpdate');
        expect.soft(responseBody.violationList[0].message).toEqual('This value should be of type boolean.');
        expect.soft(responseBody.warningList).toEqual([]);
        expect.soft(responseBody.data).toEqual([]);
    });

    test('Verify POST /domains', async ({ request }) => {

        const headers = generateHeaders('domains', 'POST', JSON.stringify(dataBody));

        const response = await request.post(DOMAIN_ENDPOINT, {
            headers,
            data: JSON.stringify(dataBody),
        });

        await expect(response.status()).toEqual(201);

        const responseBody = await parseJsonResponse(response);
        const domainData = responseBody.data[0];

        expect.soft(responseBody.error).toBe(false);
        expect.soft(responseBody.violationList).toEqual([]);
        expect.soft(responseBody.warningList).toEqual([]);

        const expectedData = {
            objectType: 'DomainVO',
            name: dataBody.name,
            autoUpdate: dataBody.autoUpdate,
            maintenance: false,
            organizationId: 1000001,
            dnsRecords: [],
            environment: 'live',
            reversed: false,
            id: expect.anything(),
            modified: expect.anything(),
            created: expect.anything(),
            label: dataBody.name,
        };

        expect.soft(domainData).toMatchObject(expectedData);
        expect.soft(domainData.id).not.toBeNull();
        expect.soft(domainData.modified).not.toBeNull();
        expect.soft(domainData.created).not.toBeNull();
        expect.soft(domainData.label).toEqual(dataBody.name);

    });

    test('Verify GET /domains', async ({ request }) => {
        const headers = generateHeaders('domains', 'GET', '');

        const response = await request.get(DOMAIN_ENDPOINT, {
            headers
        });

        // Validate response status
        expect(response.status()).toEqual(200);

        // Parse the response body
        const responseBody = await parseJsonResponse(response);

        // Assertions based on the structure of the response body
        expect.soft(responseBody.error).toBe(false);
        expect.soft(responseBody.violationList).toEqual([])
        expect.soft(responseBody.warningList).toEqual([])
        expect.soft(responseBody.data).toBeInstanceOf(Array)
        expect.soft(responseBody.data.length).toBeGreaterThan(0)

        for (const domain of responseBody.data) {
            expect.soft(domain.objectType).toBe('DomainVO')
            expect.soft(domain.name).not.toBeNull()
            expect.soft(domain.autoUpdate).toBe(true)
            expect.soft(domain.maintenance).toBe(false)
            expect.soft(domain.organizationId).toBe(1000001)
            expect.soft(domain.dnsRecords).toEqual([])
            expect.soft(domain.environment).toEqual('live')
            expect.soft(domain.reversed).toBe(false)
            expect.soft(domain.locked).toBe(false)
            expect.soft(domain.id).not.toBeNull()
            expect.soft(domain.modified).not.toBeNull()
            expect.soft(domain.created).not.toBeNull()
        }

        expect.soft(responseBody.page).toBe(1);
        expect.soft(responseBody.count).toBe(responseBody.data.length);
        expect.soft(responseBody.pageSize).toBe(50);
    });


    const invalidModifiedDates = [
        { date: 'invalidDate', description: 'Invalid date format' },
        { date: '2022-13-01T00:00:00Z', description: 'Invalid date value' },
    ];

    invalidModifiedDates.forEach((data) => {
        test(`Verify PUT /domains - Negative Test - ${data.description}`, async ({ request }) => {
            let headers = generateHeaders('domains', 'GET', '');

            const response = await request.get(DOMAIN_ENDPOINT, {
                headers,
            });

            expect(response.status()).toEqual(200);

            const responseBody = await parseJsonResponse(response);
            const domainItem = responseBody.data.find(item => item.name === dataBody.name);

            expect(domainItem).toBeDefined();

            const { id: domainId } = domainItem;
            const domainLastModifiedDate = data.date;
            const modifiedDate = new Date(domainLastModifiedDate);
            const pausedUntilDate = new Date(modifiedDate.getTime() + 10 * 60 * 1000);
            const pausedUntilDateString: string = formatDate(pausedUntilDate);

            const requestData = {
                id: domainId,
                modified: domainLastModifiedDate,
                autoUpdate: false,
                paused: true,
                pausedUntil: pausedUntilDateString,
            };

            headers = generateHeaders(`domains/${domainId}`, 'PUT', JSON.stringify(requestData));

            const updateResponse = await request.put(`${DOMAIN_ENDPOINT}/${domainId}`, {
                headers,
                data: JSON.stringify(requestData),
            });

            expect(updateResponse.status()).toBeGreaterThanOrEqual(400);
            expect(updateResponse.status()).toBeLessThan(500);

        });
    });


    test('Verify PUT /domains', async ({ request }) => {

        let headers = generateHeaders('domains', 'GET', '');
        const response = await request.get(DOMAIN_ENDPOINT, {
            headers,
        });

        expect(response.status()).toEqual(200);

        const responseBody = await parseJsonResponse(response);
        const domainItem = responseBody.data.find(item => item.name === dataBody.name);

        expect(domainItem).toBeDefined();

        const { id: domainId, modified: domainLastModifiedDate } = domainItem;
        const modifiedDate = new Date(domainLastModifiedDate);
        const pausedUntilDate = new Date(modifiedDate.getTime() + 10 * 60 * 1000);
        const pausedUntilDateString: string = formatDate(pausedUntilDate);

        const requestData = {
            id: domainId,
            modified: domainLastModifiedDate,
            autoUpdate: false,
            paused: true,
            pausedUntil: pausedUntilDateString,
        };

        headers = generateHeaders(`domains/${domainId}`, 'PUT', JSON.stringify(requestData));

        const updateResponse = await request.put(`${DOMAIN_ENDPOINT}/${domainId}`, {
            headers,
            data: JSON.stringify(requestData),
        });

        expect(updateResponse.status()).toEqual(200);

        const updatesResponseBody = await parseJsonResponse(updateResponse);

        const updatedDomainData = updatesResponseBody.data[0];
        const expectedUpdatedData = {
            objectType: 'DomainVO',
            name: dataBody.name,
            autoUpdate: false,
            maintenance: false,
            organizationId: 1000001,
            dnsRecords: [],
            environment: 'live',
            reversed: false,
            id: domainId,
            modified: expect.anything(),
            created: expect.anything(),
            label: dataBody.name,
            pausedUntil: pausedUntilDateString,
        };

        expect.soft(updatedDomainData).toMatchObject(expectedUpdatedData);
        expect.soft(updatedDomainData.modified).not.toBeNull();
        expect.soft(updatedDomainData.created).not.toBeNull();
    });


    test('Verify DELETE /domains', async ({ request }) => {

        let headers = generateHeaders('domains', 'GET', '');

        const response = await request.get(DOMAIN_ENDPOINT, {
            headers,
        });

        expect(response.status()).toEqual(200);

        const responseBody = await parseJsonResponse(response);
        const domainItem = responseBody.data.find(item => item.name === dataBody.name);

        expect(domainItem).toBeDefined();

        const domainId = domainItem.id;
        headers = generateHeaders(`domains/${domainId}`, 'DELETE', '');

        const deleteResponse = await request.delete(`/domains/${domainId}`, {
            headers,
        });

        expect(deleteResponse.status()).toEqual(204);
    });

});