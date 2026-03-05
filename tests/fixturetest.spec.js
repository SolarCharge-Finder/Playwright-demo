//fixturetest.spec.js - fixture test demo (adeesha)
//used fixtures in demo - {page <- built in, login <- custom}

import { test as base, expect, chromium } from '@playwright/test';

//demo site used for the test - saucedemo.com,
//saw it here - https://www.linkedin.com/pulse/best-test-demo-sites-practicing-software-automation-mark-nicoll-bjsme

const URL = 'https://www.saucedemo.com'; 

//custom login fixture
const test = base.extend({
    login: async ({ page }, use) => {
        // navigate to login page
        await page.goto(URL);

        // perform login steps
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        //confirm login
        await expect(page).toHaveURL(/inventory/);

        await use(page);
    },
});

//formatted to BDD syntax
test.describe('Fixture Demo Tests', () => {
    //test using the page fixture - built in fixture {page} demo
    test('login test using Playwright page fixture', async ({ page }) => {

        await page.goto(URL);

        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page).toHaveURL(/inventory/); //a simple assertion test

    });

    //test using the custom login fixture 
    test('login test custom login fixture', async ({ login }) => {
        const page = login;

        await expect(page.locator('.inventory_list')).toBeVisible();

    }); 

    //test without using the page fixture - built in fixture demo
    test('login test without Playwright fixture', async () => {

        // manual page setup 
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.goto(URL);

        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page).toHaveURL(/inventory/); //a simple assertion test 

        // ui wait timeout for demo
        //await page.waitForTimeout(5000);
        
        // manual teardown
        await browser.close();
    });



});

//6 tests using 7 workers - wow 67 nowaying