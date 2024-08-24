
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
    // await page.goto('https://drou-electronics-store.myshopify.com/collections/all');
    await page.goto('https://rt-barberry.myshopify.com/collections/all?type=hidden-sidebar&view=grid-4');
}

const collectLinks = async () => {
    await page.waitForSelector('.product__link:not([collected])');
    const products = await page.evaluate(()=>{
        return [...document.querySelectorAll('.product__link:not([collected])')].map(
            (product) => {
                product.setAttribute("collected", true);
                return {
                    title:product.getAttribute('title'),
                    link:product.href,
                };
            }
        );
    })
    return products;
}

const paginate = async () => {
    const nextBtn = await page.$('.loadmore:not(.disabled) a');
    if(!nextBtn) return false;
    await nextBtn.evaluate(btn => btn.click());
    return true;
}

await navigate();

while(true){
    console.log(await collectLinks());
    if(!(await paginate())) break;
}

await page.close();
await browser.close();