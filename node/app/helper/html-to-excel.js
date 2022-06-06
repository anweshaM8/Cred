const util = require('util')
const fs = require('fs')
const conversionFactory = require('html-to-xlsx')
const puppeteer = require('puppeteer')
const chromeEval = require('chrome-page-eval')({ puppeteer })
const writeFileAsync = util.promisify(fs.writeFile)


let path  = require('path')
const htmlToExcel = conversionFactory({
  extract: async ({ html, ...restOptions }) => {
      console.log('path.basename(',path);
    const tmpHtmlPath = path.join(path.resolve('./log'), 'input.html')
    //const tmpHtmlPath = Public(`images/invoice/input.html`);

    //console.log('tmpHtmlPath',tmpHtmlPath);
    await writeFileAsync(tmpHtmlPath, html)

    const result = await chromeEval({
      ...restOptions,
      html: tmpHtmlPath,
      scriptFn: conversionFactory.getScriptFn()
    })

    const tables = Array.isArray(result) ? result : [result]

    return tables.map((table) => ({
      name: table.name,
      getRows: async (rowCb) => {
        table.rows.forEach((row) => {
          rowCb(row)
        })
      },
      rowsCount: table.rows.length
    }))
  }
})

module.exports = htmlToExcel;

