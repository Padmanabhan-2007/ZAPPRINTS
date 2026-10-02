// Throwaway mock of the ZapPrints API so the redesigned UI can be exercised without the real backend.
import http from 'node:http';

const cfg = {
  pricingRules: [
    { ruleKey: 'bw_page', price: 3 },
    { ruleKey: 'color_page', price: 12 },
    { ruleKey: 'SOFT_BINDING', price: 35 },
  ],
  workingCalendar: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
  deliveryLocations: [{ id: 'l1', name: 'Java Canteen' }, { id: 'l2', name: 'Tech Park Gate' }],
  deliverySlots: [
    { id: 's1', startTime: '07:00', endTime: '07:50' },
    { id: 's2', startTime: '12:00', endTime: '12:30' },
  ],
  slotLocationMap: { s1: ['l1'], s2: ['l1', 'l2'] },
  deliveryEstimation: { isToday: true, formattedDate: 'Tomorrow' },
  activeBanner: { title: 'Exam week', message: 'Free delivery on orders above ₹35.', offerValue: 'FREE DELIVERY', ctaText: 'Print now', ctaLink: '/order', offerType: 'PROMO' },
};

const items = {};
let n = 0;
const price = (i) => {
  let p = 0;
  if (i.printMode === 'SPECIFIC_PAGES' && i.pageRanges && i.pageRanges.length > 0) {
    for (const r of i.pageRanges) {
      p += (r.colorMode === 'COLOR' ? 12 : 3) * (Math.max(0, r.end - r.start + 1)) * r.copies;
    }
  } else {
    p = (i.colorMode === 'COLOR' ? 12 : 3) * i.pages * i.copies;
  }
  return p + (i.serviceType === 'SOFT_BINDING' ? 35 * i.copies : 0);
};

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const json = (o, c = 200) => { res.writeHead(c, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
  let body = '';
  req.on('data', (d) => {
    if (!req.url.includes('/files/upload')) {
      body += d;
    }
  });
  req.on('end', () => {
    const u = req.url.replace(/^\/api/, '');
    if (u === '/config') return json(cfg);
    if (u === '/files/upload') { const id = 'f' + ++n; items[id] = { pages: 2, colorMode: 'B_AND_W', copies: 1, serviceType: 'A4_DOCUMENT' }; return json({ id, status: 'READY', pageCount: 2 }); }
    let m;
    if ((m = u.match(/^\/order-items\/(.+)\/config$/))) {
      const it = items[m[1]] || (items[m[1]] = { pages: 2, colorMode: 'B_AND_W', copies: 1 });
      Object.assign(it, JSON.parse(body || '{}'));
      return json({ liveEstimate: price(it) });
    }
    if (u === '/delivery-slots/capacity') return json({ isCurrentBatchFull: false });
    if (u === '/checkout/validate') return json({ id: 'o1', subtotal: 12, deliveryFee: 5, totalAmount: 17, orderFlag: 'NORMAL' });
    json({ error: 'not mocked: ' + u }, 404);
  });
}).listen(3001, () => console.log('mock api on 3001'));
