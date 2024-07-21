//긁어오기
const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

const processForSiteCode = async (siteCode) => {
    const driver = await new Builder().forBrowser('chrome').build();
    const desktopDriver = await new Builder().forBrowser('chrome').build();
    const url = `https://www.samsung.com/${siteCode}`;

    try {
        // 모바일 페이지 설정
        await driver.manage().window().setRect({ width: 360, height: 1000 });
        await driver.get(url);

        // 데스크탑 페이지 설정
        await desktopDriver.manage().window().setRect({ width: 1440, height: 1000 });
        await desktopDriver.get(url);

        const response = [];

        // 모바일 페이지 요소 처리
        const mobileElements = await driver.executeScript(() => {
            const elements = document.querySelectorAll(`.showcase-card-tab-card__product-name--mobile, .showcase-card-tab-card__product-description--mobile, .key-feature-tab__headline, .key-feature-tab__disclaimer, .home-kv-carousel__headline, .home-kv-carousel__desc`);
            const elementsWithEllipsis = [];
            elements.forEach(element => {
                const style = window.getComputedStyle(element);
                const defaultHeight = element.getBoundingClientRect().height;

                element.style.webkitLineClamp = '9999';
                element.style.maxHeight = '99999px';

                const afterHeight = element.getBoundingClientRect().height;
                const hasEllipsis = defaultHeight < afterHeight;

                if (hasEllipsis) {
                    elementsWithEllipsis.push({
                        'guide': 17,
                        'contents': element.innerHTML.trim().split('<br>')[0],
                        'device': 'Mobile',
                        'defaultHeight': defaultHeight,
                        'afterHeight': afterHeight
                    });
                }
            });
            return elementsWithEllipsis;
        });

        response.push(...mobileElements);

        // 터미널에 결과 출력
        console.log(`Results for site code: ${siteCode}`);
        response.forEach((element, index) => {
            console.log(`Element ${index + 1}:`);
            console.log(`  Device: ${element.device}`);
            console.log(`  Default Height: ${element.defaultHeight}`);
            console.log(`  After Height: ${element.afterHeight}`);
            console.log(`  Contents: ${element.contents}`);
            console.log(`  Guide: ${element.guide}`);
            console.log('');
        });

        return response;
    } finally {
        await driver.quit();
        await desktopDriver.quit();
    }
}

// 국가 코드 예시로 호출
const siteCodes = ['us']; // 원하는 국가 코드 배열
siteCodes.forEach(siteCode => {
    processForSiteCode(siteCode).then(response => {
        // 추가적인 처리나 데이터 저장을 위해 여기에 코드를 작성할 수 있습니다.
    });
});
