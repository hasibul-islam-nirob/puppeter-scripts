
import puppeteer from "puppeteer";
import {setTimeout} from 'timers/promises';

const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
        width: 1080,
        height: 1024
    },
    // slowMo: 250,
    userDataDir: "temporary",
});

const page = await browser.newPage();

const navigate = async () => {
    await page.goto('https://apps.shopify.com/infinite-scroll-pro-1');
    await page.click('a[href*="demo"]')
    await page.waitForNetworkIdle()

    await page.goto('https://infinity-scroll-pro-demo.myshopify.com/collections/foodie');
    await page.bringToFront();
    await page.waitForSelector('.grid__item')
}

const collectLinks = async () => {

    const productElement = await page.waitForSelector('.grid__item')
    if(!productElement) return false;

    await productElement.scrollIntoView();
    const productData = await productElement.evaluate(product => {
        const collectedData = {
            title: product.querySelector('a').innerText.trim(),
            link: product.querySelector('a').href
        }
        // product.remove();
        return collectedData;
    })

    await productElement.evaluate((product) => product.remove());
    return productData;
}

await navigate();

let productInfo;
while(productInfo = await collectLinks()){
    await setTimeout(200)
    if(!productInfo) break;
    console.log(productInfo);
}

await page.close();
await browser.close();