// assertiontest.spec.js - assertion test demo (linuka)

import { test, expect } from '@playwright/test';

const URL = 'https://www.saucedemo.com';

test.describe('SauceDemo Assertion Tests', () => {

    test('login page elements are visible', async ({ page }) => {
        await page.goto(URL);

        // check that username, password fields and login button are visible
        await expect(page.locator('#user-name')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.locator('#login-button')).toBeVisible();

        // check login button is enabled
        await expect(page.locator('#login-button')).toBeEnabled();
    });

    test('inventory items have correct titles', async ({ page }) => {
        await page.goto(URL);

        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        // check first inventory item title
        const firstItem = page.locator('.inventory_item_name').first();
        await expect(firstItem).toHaveText('Sauce Labs Backpack');

        // check total number of inventory items
        const itemCount = await page.locator('.inventory_item').count();
        await expect(itemCount).toBeGreaterThan(0);
    });

    test('add to cart button works', async ({ page }) => {
        await page.goto(URL);

        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        const addToCartBtn = page.locator('.inventory_item:first-child button');
        await addToCartBtn.click();

        // check cart badge updates
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });

});