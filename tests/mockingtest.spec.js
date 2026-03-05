// mockingtest.spec.js - fixed mocking test demo (gavindu)
import { test, expect } from '@playwright/test';

const REQRES_BASE = 'https://reqres.in/api';

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

    test('mock user list', async ({ page }) => {
        await page.route(`${REQRES_BASE}/users?page=2`, route =>
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
            page: 2,
            per_page: 6,
            total: 12,
            total_pages: 2,
            data: [
                { id: 7, email: 'mocked.user@reqres.in', first_name: 'Mock', last_name: 'User', avatar: 'https://reqres.in/img/faces/7-image.jpg' }
            ]
            }),
        })
        );

        const firstName = await page.evaluate(async () => {
        const res = await fetch('https://reqres.in/api/users?page=2');
        const data = await res.json();
        return data.data[0].first_name;
        });

        expect(firstName).toBe('Mock');
    });

});