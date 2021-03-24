// Tests/DefaultTest.js

const {Builder, By, until} = require('selenium-webdriver');



(async function example() {
    const driver = await new Builder().forBrowser('chrome').build();
    var locationCount = 0;
    var IsGoogleMaps= false
    var LocationData = new Array();
    var coockies = new Array()
    try {
        await driver.get('https://contentsquare.com/en/');
    

        //get coockies
        coockies = driver.manage().getCookies().then(function (cookies) {
           // console.log(cookies);
        }); 
        //find location amount
        await driver.findElement(By.className('footer__locations-list'))
        await driver.findElements(By.xpath("//*[contains(@class, 'footer__locations-list')]/li")).then(function(elements){
            elements.forEach(function (element) {
                locationCount++
                element.getText().then(function(text){
                    //console.log(text);
                });
            });
        });
       // console.log("location amount in CS live site: ", locationCount)

        //expand location 
        await driver.findElement(By.xpath("//*[contains(@class, 'footer__locations-toggle-text')]")).click()
        //get the href for googlemap.
        await driver.findElements(By.xpath("//*[contains(@class, 'footer__locations-list')]/li/a")).then(function(elements){
            elements.forEach(function (element) {
                element.getText().then(function(text){
                    //console.log(text);
                     const p = new Promise((resolve, reject) => {
                        resolve(element.getAttribute('href'))
                      })
                      //console log each googleURL and namelocation
                       p.then(function (resp){ 
                        LocationData.push({name: JSON.stringify(text), link: JSON.stringify(resp)});
                        })
                });
            });
        });
        const originalWindow = await driver.getWindowHandle();
        //click on one of the location
        var locationIndex= Math.floor(Math.random() * 7)+ 1// choose a number betwen 1 - 7
        await (await driver.findElement(By.xpath("(//*[contains(@class, 'footer__locations-list')]/li/a)["+locationIndex+"]"))).click()
        await driver.wait(
            async () => (await driver.getAllWindowHandles()).length === 2,
            10000
          );
        
        //Loop through until we find a new window handle
        const windows = await driver.getAllWindowHandles();
        windows.forEach(async handle => {
          if (handle !== originalWindow) {
            await driver.switchTo().window(handle);
          }
        });
        //google mpas tab check
        IsGoogleMaps = await driver.wait(until.urlContains('google.com/maps/'), 10000);
        await driver.close();
        //back to main site
        await driver.switchTo().window(originalWindow);
        
    } finally {
        console.log("done automation")
        console.log(LocationData)// prints the object withh all the link location
        console.log("location amount in CS live site: ", locationCount)
        console.log("Google Maps Test result: ",IsGoogleMaps)// Prints if google maps was opened 
        //await driver.quit();
    }
})();
