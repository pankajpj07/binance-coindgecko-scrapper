const writeFileSync = require("fs").writeFileSync;

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
            case 3:
              temp = team.querySelector(`td:nth-child(${child})>div`);
              break;
            case 5:
              temp = team.querySelector(`td:nth-child(${child})>div`);
              break;
            case 9:
              temp = team.querySelector(`td:nth-child(${child})>div`);
              break;
            case 4:
              temp = team.querySelector(`td:nth-child(${child})>a`);
              break;
            default:
              break;
          }
          return temp ? temp.innerHTML : 0;
        };

        return [getData(4), getData(5), getData(3), getData(9)];
      })
    );
    this.dataWithoutNull = this.standings.filter((item) => item[0] !== 0);
    this.structuredData = this.dataWithoutNull.map((item) => [
      item[0].replace(/\n/g, "").trim(),
      parseFloat(item[1].replace(/[$,]/g, "")),
      parseFloat(item[2].replace(/[$,]/g, "")),
      parseFloat(item[3].replace(/[\n$,]/g, "")),
    ]);
    this.finalData = this.structuredData.filter((item) => item[2] < item[3]);
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
