import { equal } from 'node:assert';
import path from 'node:path';
import process from 'node:process';

import { findpath } from 'nw';
import selenium from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('NW.js Selenium ServiceBuilder test suite', async () => {
    let driver = undefined;

    /* Setup Selenium driver. */
    beforeAll(async function () {
        /* Initialise Chrome options */
        const options = new chrome.Options();

        const seleniumArguments = [
            'nwapp=' + path.resolve('js', 'selenium', 'service_builder')
        ];

        /* Run in headless mode when in CI environment. */
        if (process.env.CI) {
            seleniumArguments.push('headless=new');
        }

        options.addArguments(seleniumArguments);

        /* Pass file path of NW.js ChromeDriver to ServiceBuilder */
        const service = new chrome.ServiceBuilder(findpath('chromedriver')).build();

        /* Create a new session using the Chromium options and DriverService defined above. */
        driver = chrome.Driver.createSession(options, service);
    });

    /**
     * Get text via element's ID and assert it is equal.
     */
    it('Hello, World! text by ID', async function () {
        const textElement = await driver.findElement(selenium.By.id('test'));

        const text = await textElement.getText();

        expect(text).toEqual('Hello, World!');
    }, { timeout: Infinity });

    /**
     * Quit Selenium driver.
     */
    afterAll(() => {
        driver.quit();
    });
});
