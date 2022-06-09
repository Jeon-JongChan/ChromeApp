const puppeteer = require('puppeteer-core');

const BROSER_PATH=process.env.BROWSER_PATH;
const IPARK_ID=process.env.INTERPARK_ID;
const IPARK_PASSWORD=process.env.INTERPARK_PASSWORD;

const macro = {
    browser   : null,
    page      : null,
    reloadCnt : 0,
    start : async () => {
      const browser = macro.browser || await puppeteer.launch({
        headless: false,
        executablePath: BROSER_PATH
      });
      macro.browser = browser
      // console.log("macro browser : ",macro.browser);
      macro.page = await browser.newPage();
      await macro.page.goto('https://ticket.interpark.com');

      macro.macro();
    },
    macro : async () => {
      let page = await macro.getPage();
      if(!page) return;
      /* 로그인 여부를 확인하고 해야한다면 로그인을 실행한다. */
      // 로그인 텍스트가 로딩 될 때까지 시간지연 필요
      await page.waitForSelector('#imgLogin');
      let loginText = await page.$eval('#imgLogin', (dom)=> {
        return dom.innerText;
      })
      if(loginText === '로그인') macro.login()
      
    },
    login : async (page) => {
      /* 로그인을 시도한다. */
      await page.goto('https://ticket.interpark.com/Gate/TPLogin.asp?CPage=B&MN=Y&tid1=main_gnb&tid2=right_top&tid3=login&tid4=login');
      // ID와 PASSWORD 를 입력 후 클릭한다.
      await page.evaluate((id,password)=>{
        let login = document.querySelector('iframe').contentDocument;
        login.querySelector('#userId').value = id;
        login.querySelector('#userPwd').value = password
        login.querySelector('#btn_login').click();
      }, IPARK_ID,IPARK_PASSWORD)
    },
    close : async () => {
      // console.log("macro browser : ",macro.browser);
      let ret = macro.browser ? macro.browser.close() : false;
      macro.browser = null;
      macro.page = null;
    },
    getPage : async () => {
      if(!macro.page && macro.reloadCnt < 3) {
        macro.reloadCnt += 1; 
        console.log('page is null - macro.macro() line 1. reload count : ', macro.reloadCnt);
        macro.start();
        return;
      }
      else if(!macro.page && reloadCnt >= 3) return;
      macro.reloadCnt = 0;
      return macro.page;
    }
};

export default macro;