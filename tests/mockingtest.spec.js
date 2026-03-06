// mockingtest.spec.js - fixed mocking test demo (gavindu)

import { test, expect } from '@playwright/test';

const REQRES_BASE = 'https://reqres.in/api'; //from what i found doing actual requests gets flagged for bot prot.. bruh </3
const REQRES_USER = 'https://jsonplaceholder.typicode.com/users/1';

test.describe('Mocking Tests with ReqRes', () => {

    test('mock successful login request', async ({ page }) => {
        // intercept browser request and provide fake token
        await page.route(`${REQRES_BASE}/login`, route =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ token: 'mocked_token_123' }),
        })
        );

        // make the request inside page context
        const token = await page.evaluate(async () => {
        const res = await fetch('https://reqres.in/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'eve.holt@reqres.in', password: 'cityslicka' }),
        });
        const data = await res.json();
        return data.token;
        });

        expect(token).toBe('mocked_token_123');
    });

    test('mock failed login request', async ({ page }) => {
        await page.route(`${REQRES_BASE}/login`, route =>
        route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Missing password' }),
        })
        );

        const error = await page.evaluate(async () => {
        const res = await fetch('https://reqres.in/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'eve.holt@reqres.in' }),
        });
        const data = await res.json();
        return data.error;
        });

        expect(error).toBe('Missing password');
    });

    //real user request to compare with mocking wow - prolly could go near the top ig
    test('real user request', async ({ request }) => {

        const res = await request.get(REQRES_USER);
        const data = await res.json();

        console.log('Request Name:', data.name);

        expect(data.name).toBeTruthy();
    });

    test('mock user request', async ({ page }) => {

        await page.route(REQRES_USER, route =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 1,
                    name: 'Mock User',
                    email: 'user@mock.com'
                })
            })
        );

        
        await page.goto('about:blank'); //req for page.evaluate

        const data = await page.evaluate(async () => {
            const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
            return res.json();
        });

        console.log('Mocked name:', data.name);
        expect(data.name).toBe('Mock User'); //simple assertion to pass the test
    });

});