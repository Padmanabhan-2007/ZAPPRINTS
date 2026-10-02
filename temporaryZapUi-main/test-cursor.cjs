const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE_ERROR:', error));

  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);
  
  // Wiggle mouse
  await page.mouse.move(100, 100);
  await page.waitForTimeout(100);
  await page.mouse.move(500, 500);
  await page.waitForTimeout(100);
  
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('.glow-cursor-canvas-wrapper canvas');
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(canvas.parentElement);
    return {
      width: rect.width,
      height: rect.height,
      zIndex: style.zIndex,
      pointerEvents: style.pointerEvents,
      opacity: style.opacity,
      display: style.display,
      parentDisplay: canvas.parentElement.style.display
    };
  });
  console.log('CANVAS_INFO:', canvasInfo);
  
  await browser.close();
})();
