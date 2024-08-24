
import puppeteer from "puppeteer";

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
    await page.goto('https://drou-electronics-store.myshopify.com/collections/all')
}

const collectLinks = async () => {
    await page.waitForSelector('h2 a')
    const products = await page.evaluate(()=>{
        return [...document.querySelectorAll('h2 a')].map(e => ({link:e.href, title: e.textContent}))
    })
    return products
}

const paginate = async () => {
    const nextBtn = await page.$('li.next:not(.disabled) a')
    if(!nextBtn) return false;
    await nextBtn.evaluate(btn => btn.click());
    return true;
}

await navigate()

while(true){
    console.log(await collectLinks());
    if(!(await paginate())) break;
}

await page.close();
await browser.close();