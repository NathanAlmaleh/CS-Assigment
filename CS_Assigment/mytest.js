const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

const driver = new Builder().forBrowser('chrome').build();


  const officeAdresse = {};
  officeAdresse['Tokyo'] = 'Tokyo +81-3-5989-0492 2-4-1 Nishishinjuku Shinjuku, NS building 6F,Shinjuku-ku , Tokyo-to, 163-0806 Japan';
var locationCount = 0;
var IsGoogleMaps= false
var LocationData = new Array();
var coockies = new Array()

describe('Open cs URL', () => {
    it('should go to contentsquare.com and check the title', async () => {
        await driver.get('https://contentsquare.com/en/');
        const title = await driver.getTitle();
        expect(title).to.equal('Contentsquare | Digital Experience Analytics - DXP Analytics');
    });

    after(async () => {
      console.log("done navigation to CS test")
      //driver.quit()
    });
});

describe('find location amount', () => {
  it('should count the amount of locations', async () => {
      await driver.findElement(By.className('footer__locations-list'))
      await driver.findElements(By.xpath("//*[contains(@class, 'footer__locations-list')]/li")).then(function(elements){
          elements.forEach(function (element) {
              locationCount++
              element.getText().then(function(text){
                 // console.log(text);//print office adresse
                  expect(officeAdresse).to.include(text);
              });
          });
      });
      expect(locationCount).to.equal(7);
  });

  after(async () => {
    console.log("done location amount test")
    //driver.quit()
  });
});

describe('save URL maps and name location', () => {
  it('array size should have 7 locations', async () => {
           //expand location 
           await driver.findElement(By.xpath("//*[contains(@class, 'footer__locations-toggle-text')]")).click()
           //get the href for googlemap.
           await driver.findElements(By.xpath("//*[contains(@class, 'footer__locations-list')]/li/a")).then(function(elements){
               elements.forEach(function (element) {
                   element.getText().then(function(text){
                        const p = new Promise((resolve, reject) => {
                           resolve(element.getAttribute('href'))
                         })
                         //console log each googleURL and namelocation
                          p.then(function (resp){ 
                           LocationData.push({name: JSON.stringify(text), link: JSON.stringify(resp)});
                           }).then(expect(locationCount.length).to.equal(7))
                   });
               });
           });
      //expect(locationCount.length).to.equal(7);
  });

  after(async () => {
    //console.log(LocationData)
    console.log("done saving to array URL and Name Location test")
    //driver.quit()
  });
});

describe('Open google map location', () => {
  it('should open one of the location site ', async () => {
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
   expect(IsGoogleMaps).to.be.true;
      await driver.close();
      //back to main site
      await driver.switchTo().window(originalWindow);
  });

  after(async () => {
    console.log("done google maps tab test")
    driver.quit()
  });
});
/**
b. Implement 5 tests regarding 
pid - project id
uu - user id, unique id per visitor
pn - page number, incremental number being increased on each new page
load

1) check first loading page has all the variable
2)open a different tab and check all variable are the same and check the pn is incremented by 1
3)open and close a different tab and check all variable are the same and check the pn is incremented by 1 and hasnt dercremented
4)close tab and reopen and see if the uu is still the same
5) close session delete all coockies and cache and check that the uu is different from the last session
6)check different PID number for two different domains

Implement a script that loads contentsquare.com website and prints the http requests going out to contentsquare.net.
 */