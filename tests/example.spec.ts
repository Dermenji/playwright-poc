import { test } from '../test-options'
import { readDataFile } from '../data/data-util';


test.describe('Domain creation suite @UI', () => {

  let data

  test.beforeAll(async () => {
    data = await readDataFile('domain-create.json')
  });

  test('Create new domain', async ({ pageManager }) => {

    await test.step('Navigate to Websites page', async () => {
      await pageManager.navigateTo().webSitesPage()
    })

    await test.step('Create domain', async () => {
      await pageManager.onWebSitePage().createDomain(data.name)
    })

  });

  test('Delete domain', async ({ pageManager }) => {

    await test.step('Navigate to Websites page', async () => {
      await pageManager.navigateTo().webSitesPage()
    })

    await test.step('Delete domain', async () => {
      await pageManager.onWebSitePage().deleteDomain(data.name)
    })

  });

});


