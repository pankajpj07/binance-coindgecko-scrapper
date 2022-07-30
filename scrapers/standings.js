const writeFileSync = require("fs").writeFileSync;
const onlyUSDT = false;
const volPercent = 50;
/**
 * @class Standings
 */
module.exports = class Standings {
  /**
   * @constructor
   */
  constructor(browser, page) {
    this.browser = browser;
    this.page = page;

    this.standings = [];
    this.url = "https://www.coingecko.com/en/exchanges/binance";
  }

  /**
   * @method main
   */
  async main() {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
    await this.page.waitFor(2000);

    // Decided to add more data for fun. Notice how I also refactored to cut down on some boilerplate
    // by adding a reusable function inside of the map statement.
    this.standings = await this.page.evaluate(() =>
      Array.from(document.querySelectorAll("tbody > tr")).map((team) => {
        const getData = (child) => {
          let temp = [];
          switch (child) {
            case 4:
            case 2:
              temp = team.querySelector(`td:nth-child(${child})>a`);
              break;
            default:
              temp = team.querySelector(`td:nth-child(${child})>div`);
              break;
          }
          return temp ? temp.innerHTML : 0;
        };

        return [getData(2), getData(4), getData(5), getData(3), getData(9)];
      })
    );
    this.dataWithoutNull = this.standings.filter((coin) => coin[1] !== 0);
    console.log(this.dataWithoutNull);
    this.structuredData = this.dataWithoutNull.map((coin) => [
      coin[0].replace("...", "").trim(),
      coin[1].replace(/\n/g, "").trim(),
      parseFloat(coin[2].replace(/[$,]/g, "")),
      parseFloat(coin[3].replace(/[$,]/g, "")),
      parseFloat(coin[4].replace(/[\n$,]/g, "")),
    ]);
    this.finalData = this.structuredData.filter(
      (coin) => (coin[4] / coin[3]) * 100 > volPercent && coin[3] !== 0
    );
    if (onlyUSDT) {
      this.finalData = this.finalData.filter((coin) =>
        coin[1].includes("USDT")
      );
    }
    this.finalData.sort((a, b) => a[2] - b[2]);
    this.writeToJson();
    return this.finalData;
  }

  /**
   * @method writeToJson
   */
  writeToJson() {
    writeFileSync(
      "./data/structuredData.json",
      JSON.stringify(this.structuredData)
    );
    writeFileSync("./data/toTheMoon.json", JSON.stringify(this.finalData));
  }
};
