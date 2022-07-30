const puppeteer = require("puppeteer");
const Standings = require("./scrapers/standings");
const Email = require("./utils/email");

/**
 * Run Standings
 */
(async () => {
  let browser;
  let page;

  try {
    browser = await puppeteer.launch({
      headless: false,
    });

    page = await browser.newPage();

    const standings = await new Standings(browser, page).main();

    // Make sure to uncomment the email code if you want to test out the email functionality.
    // Just remember to add your e-mail credentials in utils/email first.

    // await Email.send(
    //   `<ul style="list-style:none;">
    //     ${standings.map(
    //       ([coin, price, marketcap, volume24h], i) =>
    //         `<li>${coin}: $${price} $${marketcap} $${volume24h}</li>`
    //     )}
    //   </ul>`.replace(/\,/g, "")
    // );
  } catch (error) {
    // await Email.send(error.stack, true);
  }

  await browser.close();
})();
