
import puppeteer from 'puppeteer';

(async () => {
	// Launch the browser and open a new blank page
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
	page.setDefaultNavigationTimeout(60000);

	await page.goto('https:/duckduckgo.com', {
		waitUntill: 'networkidle2'
	})
	const searchBoxHandler = await page.waitForSelector('#searchbox_input')
	await searchBoxHandler.type('studioneat')

	const searchButtonHandler = await page.waitForSelector("button[aria-label='Search']")
	await searchButtonHandler.click()

	const firstResult = await page.waitForSelector('[data-testid="result-title-a"]')
	await firstResult.click()

	var productPage = await page.waitForSelector('.product-title a')
	// const itemsLink = await page.evaluate( () => {
	//      return [...document.querySelectorAll('.product-title a')].map(e => e.href)
	// })

	const itemsData = await page.evaluate(() => {
		const items = [...document.querySelectorAll('.product-title a')];
		return items.map(item => ({
			href: item.href,
			innerHTML: item.innerHTML
		}));
	});

	for (const item of itemsData) {
		if (item.innerHTML == 'Mark Two') {
			// console.log(item.href);
			// console.log(item.innerHTML);
			// await itemsData.click();
			await page.goto(item.href);
			await page.waitForSelector('#productPrice')
			const productPrice = await page.evaluate(() => {
				return document.querySelector('#productPrice').innerHTML;
			});
			console.log(productPrice);
			await page.screenshot({
				path: `${item.innerHTML}.png`
			});
			break
		} else {
			continue
		}
	}
	// console.log(markTwoItem);
	await browser.close();
})();