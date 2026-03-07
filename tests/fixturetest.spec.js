//fixturetest.spec.js - fixture test demo (adeesha)
//used fixtures in demo - {page <- built in, login <- custom}

import { test as base, expect, chromium } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; //pom import - login ui interactions

//demo site used for the test - saucedemo.com, reqres.in
//saw it here - https://www.linkedin.com/pulse/best-test-demo-sites-practicing-software-automation-mark-nicoll-bjsme

const URL = 'https://www.saucedemo.com'; 

const test = base.extend({
    //custom loginpage fixture - this sets up the page without ui interactions, which is handled by the loginpage page object
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await page.goto(URL);

        await use(loginPage);
    },

    //custom login fixture
    login: async ({ page }, use) => {
        // navigate to login page
        await page.goto(URL);

        // perform login steps
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        //a simple assert to confirm login - asserting again in the test anyway but ehh
        await expect(page).toHaveURL(/inventory/);

        await use(page);
    }
});

test.describe('Fixture Demo Tests', () => {
    //test using the page fixture - built in fixture {page} demo - 1
    test('login test using Playwright page fixture', async ({ page }) => {

        await page.goto(URL);

        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page).toHaveURL(/inventory/); //a simple assertion test

    });

    //test using the custom login fixture  - 2
    test('login test custom login fixture', async ({ login }) => {
        const page = login;

        await expect(page.locator('.inventory_list')).toBeVisible();

    }); 

    //more realistic custom login fixture with loginpage object - 3
    test('login test custom login fixture & loginpage POM', async ({ loginPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');

        await expect(loginPage.page).toHaveURL(/inventory/);
    });   

    //test without using the page fixture - built in fixture demo - 4
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
        await page.waitForTimeout(5000);
        
        // manual teardown
        await browser.close();
    });
});

//6 tests using 7 workers - wow 67 nowaying