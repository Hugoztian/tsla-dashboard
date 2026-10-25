/* English only */
const LANG = 'en';
const tl = en => en;
const I18N = {apply() {}, s: x => x, zhTok: x => x, tvLocale: () => 'en', chartCfg: c => c};
/* Tesla (TSLA) Dashboard · © 2026 Hugo Tian. All rights reserved. Data from data.js (build_data.py), x_feed.js (build_x.py). */
'use strict';
const D = window.TSLA_DATA;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = (v, d = 0) => v == null || isNaN(v) ? 'n/a' : Number(v).toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const dlong = iso => { if (!iso) return ''; const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return `${d} ${MON[m-1]} ${y}`; };
const pct = (v, d = 1) => v == null || isNaN(v) ? 'n/a' : (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d) + '%';
const pcls = v => v == null ? 'mut' : v >= 0 ? 'pos' : 'neg';
const money = (v, d = 1) => v == null ? 'n/a' : (v < 0 ? '−$' : '$') + fmt(Math.abs(v), d) + 'm';
const qshort = q => q.replace(/^Q(\d) (\d{2})(\d{2})$/, "Q$1'$3");
const linkify = s => esc(s).replace(/(https?:\/\/[^\s;,)]+)/g, (u) => `<a href="${u}" target="_blank" rel="noopener">${u.length > 60 || /\/status\/\d/.test(u) ? u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] + ' ↗' : u}</a>`);
const isDark = () => { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); };
const info = (k, extra = '') => `<i class="i" tabindex="0" data-tip="${esc('<b>' + esc(k) + '</b>' + (extra ? ' — ' + esc(extra) : ''))}">i</i>`;
(function tips() {
  const tip = $('#tip'); let cur = null;
  const show = el => { cur = el; tip.innerHTML = el.dataset.tip; tip.classList.add('on'); const r = el.getBoundingClientRect(); const w = Math.min(300, innerWidth - 16);
    tip.style.maxWidth = w + 'px'; const tw = tip.offsetWidth, th = tip.offsetHeight; let x = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), innerWidth - tw - 8); let y = r.top - th - 8; if (y < 56) y = r.bottom + 8;
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; };
  const hide = () => { cur = null; tip.classList.remove('on'); };
  document.addEventListener('mouseover', e => { const el = e.target.closest('[data-tip]'); if (el && el !== cur) show(el); else if (!el && cur) hide(); });
  document.addEventListener('focusin', e => { const el = e.target.closest('[data-tip]'); if (el) show(el); });
  document.addEventListener('focusout', e => { if (!e.relatedTarget || !e.relatedTarget.closest('[data-tip]')) hide(); });
  document.addEventListener('click', e => { const el = e.target.closest('[data-tip]'); if (el) show(el); else hide(); }, true);
  addEventListener('scroll', hide, {passive: true});
})();
let TID = 0;
const BAD = /cost of revenue|development|administrative|liabilit|capex|preferred/i;
function cellFmt(v, col) {
  if (v == null || v === '') return ['', ''];
  if (typeof v === 'number') { const h = String(col || ''); let s;
    if (/%/.test(h) && !Number.isInteger(v)) s = fmt(v, 1);
    else if (Number.isInteger(v)) s = Math.abs(v) >= 10000 ? fmt(v, 0) : String(v);
    else s = fmt(v, Math.abs(v) < 10 ? 2 : 1);
    return [s, v < 0 ? 'neg-num' : '']; }
  const s = String(v); if (/^(n\/a|n\/m|n\/p)$/i.test(s)) return [s, 'na'];
  return [s, ''];
}
/* long notes and source lines sit behind a quiet disclosure */
function fnote(lines, label = 'Notes & sources', raw = false) { lines = (lines || []).filter(x => x != null && String(x).trim() !== ''); if (!lines.length) return '';
  return `<details class="fn"><summary>${esc(label)} <span class="fnn">${lines.length}</span></summary><ul class="notes">${lines.map(n => `<li>${raw ? n : linkify(n)}</li>`).join('')}</ul></details>`; }
function tableBlock(t, o = {}) {
  const id = o.id || ('t' + (++TID)); const cols = t.columns; const qcols = cols.map((c, i) => /^Q[1-4]\s?'?\d{2}/.test(String(c)) ? i : -1).filter(i => i >= 0);
  const lastQ = o.noLatest ? -1 : qcols.length ? qcols[qcols.length - 1] : -1, prevQ = qcols.length > 1 ? qcols[qcols.length - 2] : -1;
  let h = '';
  if (t.title && !o.notitle) h += `<h3>${esc(t.title)}</h3>`;
  const pre = [...(o.pre || []), ...(t.pre || [])];
  h += `<div class="tbar"><input type="search" placeholder="Filter" aria-label="Filter table rows" data-t="${id}"><span class="tcount" id="${id}-n"></span><button class="lnk" data-csv="${id}" title="Download this table as CSV">CSV ↓</button></div>`;
  h += `<div class="tblwrap" style="${o.maxh ? 'max-height:' + o.maxh + 'px' : ''}"><table id="${id}" class="${o.wrap ? 'wrapt' : ''} ${o.cls || ''}" data-title="${esc(o.csvname || t.title || o.id || 'table')}"><thead><tr>${cols.map((c, i) => `<th data-i="${i}" class="${i === lastQ ? 'latest' : ''}">${o.headTip && i === 0 ? '' : ''}${esc(c)}</th>`).join('')}</tr></thead><tbody>`;
  t.rows.forEach((r, ri) => {
    if (!Array.isArray(r)) { h += `<tr class="sec"><td colspan="${cols.length}">${esc(r.section)}</td></tr>`; return; }
    const label = r[0]; let trend = '';
    if (o.colorLatest && lastQ > 0 && typeof r[lastQ] === 'number' && typeof r[prevQ] === 'number' && r[lastQ] !== r[prevQ]) { const up = r[lastQ] > r[prevQ]; const good = BAD.test(label) ? !up : up; trend = good ? 'up' : 'dn'; }
    const xd = o.expand ? o.expand(r, ri) : null;
    h += `<tr data-ri="${ri}" class="${xd ? 'xrow' : ''}">` + r.map((c, i) => { const [s, cl] = cellFmt(c, cols[i]); const w = (String(s).length > 44 || o.wrap) ? ' wrap' : '';
      const body = linkify(s);
      return `<td class="${cl}${w}${i === lastQ ? ' latest ' + trend : ''}">${body}</td>`; }).join('') + '</tr>';
    if (xd) h += `<tr class="xdetail" data-for="${ri}" hidden><td colspan="${cols.length}">${xd}</td></tr>`;
  });
  h += '</tbody></table></div>';
  const notes = [...pre, ...(t.notes || []), ...(o.notes || [])]; h += fnote(notes);
  return h;
}
function wireTables(root) {
  $$('table', root).forEach(tb => {
    if (tb.dataset.wired) return; tb.dataset.wired = 1;
    const body = tb.tBodies[0]; const orig = [...body.rows];
    const n = document.getElementById(tb.id + '-n'); const total = orig.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail')).length;
    const count = () => { if (n) { const vis = orig.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail') && !r.hidden).length; n.textContent = vis === total ? tl(`${total} rows`) : tl(`${vis} of ${total} rows`); } };
    count();
    // expandable rows
    orig.filter(r => r.classList.contains('xrow')).forEach(r => r.addEventListener('click', e => { if (e.target.closest('a,[data-tip]')) return; const d = body.querySelector(`tr.xdetail[data-for="${r.dataset.ri}"]`); if (!d) return; d.hidden = !d.hidden; r.classList.toggle('open', !d.hidden); }));
    // sort
    tb.querySelectorAll('th').forEach(th => th.addEventListener('click', () => {
      const i = +th.dataset.i; const cur = th.dataset.dir; tb.querySelectorAll('th').forEach(x => delete x.dataset.dir);
      const dir = cur === 'a' ? 'd' : cur === 'd' ? null : 'a';
      const val = r => { const t = (r.cells[i]?.innerText || '').replace(/[$,%+▸▾×x]/g, '').replace('−', '-').trim(); const m = t.match(/^\(?-?[\d.]+/); const f = m ? parseFloat(m[0].replace('(', '-')) : NaN; return isNaN(f) ? t.toLowerCase() : f; };
      const data = orig.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail'));
      if (!dir) { orig.forEach(r => body.appendChild(r)); orig.filter(r => r.classList.contains('sec')).forEach(r => r.style.display = ''); return; }
      th.dataset.dir = dir;
      data.sort((a, b) => { const x = val(a), y = val(b); if (typeof x !== typeof y) return typeof x === 'number' ? -1 : 1; return (x > y ? 1 : x < y ? -1 : 0) * (dir === 'a' ? 1 : -1); });
      orig.filter(r => r.classList.contains('sec')).forEach(r => r.style.display = 'none');
      data.forEach(r => { body.appendChild(r); const d = body.querySelector(`tr.xdetail[data-for="${r.dataset.ri}"]`); if (d) body.appendChild(d); });
    }));
  });
  $$('input[data-t]', root).forEach(inp => { if (inp.dataset.wired) return; inp.dataset.wired = 1; inp.addEventListener('input', () => filterTable(inp.dataset.t, inp.value)); });
  $$('[data-csv]', root).forEach(b => { if (b.dataset.wired) return; b.dataset.wired = 1; b.onclick = () => csv(b.dataset.csv); });
  tightCols(root);
}
function filterTable(id, q) {
  const tb = document.getElementById(id); if (!tb) return; q = q.trim().toLowerCase(); let sec = null, secHit = false;
  const rows = [...tb.tBodies[0].rows];
  rows.forEach(r => {
    if (r.classList.contains('sec')) { if (sec) sec.hidden = !secHit && !!q; sec = r; secHit = false; return; }
    if (r.classList.contains('xdetail')) { if (q) r.hidden = true; return; }
    const hit = !q || r.innerText.toLowerCase().includes(q); r.hidden = !hit; if (hit) secHit = true; if (!hit) r.classList.remove('open');
  });
  if (sec) sec.hidden = !secHit && !!q;
  const n = document.getElementById(id + '-n'); if (n) { const d = rows.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail')); const v = d.filter(r => !r.hidden).length; n.textContent = v === d.length ? tl(`${d.length} rows`) : tl(`${v} of ${d.length} rows`); }
}
function csv(id) {
  const tb = document.getElementById(id); if (!tb) return;
  const q = s => { s = String(s).replace(/\s+/g, ' ').replace(/^[▸▾]\s*/, '').trim(); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const lines = [[...tb.tHead.rows[0].cells].map(c => q(c.innerText))];
  [...tb.tBodies[0].rows].filter(r => !r.hidden && r.style.display !== 'none' && !r.classList.contains('xdetail')).forEach(r => lines.push([...r.cells].map(c => q(c.innerText))));
  const blob = new Blob(['\ufeff' + lines.map(l => l.join(',')).join('\n')], {type: 'text/csv;charset=utf-8'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'TSLA_' + (tb.dataset.title || id).replace(/[^\w]+/g, '_').replace(/^_|_$/g, '').slice(0, 60) + '.csv'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
/* narrow short-code columns; dates never wrap */
const CODE_HDR = /^(form|code|ticker|symbol|type|d\/i|10b5-1|role|rating|quarter|q)$/i;
const DATE_RES = [/^\d{4}-\d{2}-\d{2}$/, /^\d{1,2}\s[A-Z][a-z]{2,8}\s\d{4}$/, /^~?Q[1-4]\s?'?\d{2,4}$/, /^Q[1-4] \d{4}$/, /^[A-Z][a-z]{2,8}[- ]\d{4}$/];
function tightCols(root) {
  $$('table', root).forEach(tb => { const head = tb.tHead && tb.tHead.rows[0]; if (!head) return; const n = head.cells.length; const rows = [...tb.tBodies[0].rows].filter(r => r.cells.length === n);
    rows.forEach(r => [...r.cells].forEach(c => { if (DATE_RES.some(re => re.test(c.textContent.trim()))) c.classList.add('dt'); }));
    [...head.cells].forEach(c => { if (DATE_RES.some(re => re.test(c.textContent.trim()))) c.classList.add('dt'); });
    for (let i = 0; i < n; i++) { const vals = rows.map(r => r.cells[i].textContent.trim()).filter(v => v && !/^n\/a$/i.test(v)); const hdr = head.cells[i].textContent.trim();
      let code = CODE_HDR.test(hdr); if (!code && vals.length) { const mx = Math.max(...vals.map(v => v.length)); code = mx <= 6 && vals.every(v => /^[A-Za-z][A-Za-z.]*$/.test(v)); }
      if (!code) continue; head.cells[i].classList.add('code'); rows.forEach(r => r.cells[i].classList.add('code')); if (i === 0) tb.classList.add('c0tight'); } });
}
function details(title, body, sm = '', open = false) { return `<details class="x"${open ? ' open' : ''}><summary><span>${title}${sm ? ` <span class="sm">${sm}</span>` : ''}</span></summary><div class="xb">${body}</div></details>`; }
function xallBtns() { return `<div class="xall"><button class="lnk" data-xall="1">Expand all</button><button class="lnk" data-xall="0">Collapse all</button></div>`; }
function wireXall(root) { $$('[data-xall]', root).forEach(b => b.onclick = () => { const scope = b.closest('.xscope') || root; $$('details.x', scope).forEach(d => d.open = b.dataset.xall === '1'); }); }
/* ---------------- TradingView (keyless free widgets, delayed quote) ---------------- */
const TV_SYM = 'NASDAQ:TSLA';
function tvEmbed(el, widget, cfg, onFail) {
  if (!el) return; el.innerHTML = '';
  const box = document.createElement('div'); box.className = 'tradingview-widget-container'; box.style.height = '100%';
  const inner = document.createElement('div'); inner.className = 'tradingview-widget-container__widget'; inner.style.height = '100%'; box.appendChild(inner);
  const sc = document.createElement('script'); sc.type = 'text/javascript'; sc.async = true; sc.src = 'https://s3.tradingview.com/external-embedding/embed-widget-' + widget + '.js'; sc.textContent = JSON.stringify(cfg);
  let failed = false; const fail = why => { if (failed) return; failed = true; onFail && onFail(why); };
  sc.onerror = () => fail('script blocked or offline'); box.appendChild(sc); el.appendChild(box);
  setTimeout(() => { if (!el.querySelector('iframe')) fail('widget did not load within 12 s'); }, 12000);
}
const tvTheme = () => isDark() ? 'dark' : 'light';
/* ---------- real-time quote (Micron method): own quote endpoint polled every 15 s while visible; TradingView delayed widget when it is empty or failing ---------- */
const QUOTE_API = (new URLSearchParams(location.search).get('quoteapi')) || 'https://micron-dashboard.cashcache.workers.dev/api/quote?symbol=TSLA';  /* shared Cloudflare Worker (Robinhood real-time, Nasdaq.com backup). NOTE: the Worker allow-list must include TSLA; until then the TradingView delayed quote is shown. */
const LQ = {timer: null, fails: 0, ok: false, last: null, tv: false, prev: null, vis: false};
const usd = v => v == null ? 'n/a' : '$' + fmt(v, 2);
const sgn = (v, d = 2) => (v >= 0 ? '+' : '−') + fmt(Math.abs(v), d);
const mdy = d => { if (!d) return ''; const t = new Date(String(d).slice(0, 10) + 'T12:00:00Z'); return t.toLocaleDateString('en-US', {month: 'short', day: 'numeric', timeZone: 'UTC'}); };
const tET = ms => new Date(ms).toLocaleTimeString('en-US', {timeZone: 'America/New_York', hour12: false});
const tSG = ms => new Date(ms).toLocaleTimeString('en-GB', {timeZone: 'Asia/Singapore', hour12: false});
function tvFallback(on) {
  const w = $('#tvwrap'), lq = $('#lq'); if (!w || !lq) return;
  w.style.display = on ? 'flex' : 'none'; lq.style.display = on ? 'none' : 'block';
  if (on && !LQ.tv) { LQ.tv = true; const el = $('#tvq'); const P = D.price;
    tvEmbed(el, 'single-quote', {symbol: TV_SYM, width: '100%', isTransparent: true, colorTheme: tvTheme(), locale: I18N.tvLocale()}, why => {
      el.style.height = 'auto'; el.innerHTML = `<div class="tvfail" title="${esc(why)}">${tl('Live quote unavailable')}</div><div class="snap"><span class="snapv">$${fmt(P.close, 2)}</span><span class="snaps">${tl('Build-time snapshot · close')} ${esc(tl(dlong(P.close_date)))} · ${tl('not live')}</span></div>`;
      const c = $('#tvqcap'); if (c) c.textContent = tl('Static snapshot (not live)'); }); }
}
function renderQuote(q) {
  const m = q.main || {}, ref = q.ref_close || {}, reg = q.session === 'regular';
  const box = $('#lq'); if (!box) return; box.classList.toggle('reg', reg); box.classList.toggle('stale', !!q.stale);
  const SESS = {};
  const sessZh = x => SESS[String(x || '').toLowerCase()] || SESS[String(q.session || '').toLowerCase()] || String(x || '');
  $('#lq-sl').textContent = reg ? tl('Live · regular session') : (q.session === 'closed' ? tl('Market closed') : tl(`${q.session_label || q.session} session`)) + (q.session === 'overnight' ? tl(' (8 PM–4 AM ET)') : '');
  $('#lq-k').textContent = m.kind === 'regular' ? '' : tl(m.label || '');
  const px = $('#lq-px'); px.textContent = m.price != null ? usd(m.price) : 'n/a';
  if (LQ.prev != null && m.price != null && m.price !== LQ.prev) { px.classList.remove('up', 'dn'); void px.offsetWidth; px.classList.add(m.price > LQ.prev ? 'up' : 'dn'); }
  LQ.prev = m.price;
  const ch = $('#lq-ch');
  if (m.change != null) { ch.className = 'lq-ch ' + (m.change >= 0 ? 'pos' : 'neg'); ch.textContent = `${sgn(m.change)} (${sgn(m.pct)}%)${reg ? '' : tl(' vs close')}`; }
  else { ch.className = 'lq-ch mut'; ch.textContent = ''; }
  const pc = (reg ? q.prev_close : ref) || {};
  let sub = `${tl('Prev close')} ${usd(pc.price)}${pc.date ? ` · ${tl(mdy(pc.date))}` : ''}`;
  if (!reg && q.ext && m.kind === 'close') sub += ` · ${tl(q.ext.label)} ${usd(q.ext.price)} (${sgn(q.ext.pct)}%)`;
  if (reg && q.bid && q.ask) sub += ` · ${tl('Bid')} ${usd(q.bid)} / ${tl('Ask')} ${usd(q.ask)}`;
  $('#lq-sub').textContent = sub;
  const RH = q.source === 'Robinhood public quote', CN = q.source === 'CNBC quote feed';
  const venue = CN ? tl('CNBC quote feed (Nasdaq last sale)') : m.kind === 'regular' ? (RH ? tl('Nasdaq last sale via Robinhood') : q.source) : ((q.ext && q.ext.venue) ? tl(`${q.ext.venue} via Robinhood 24-hour feed`) : (RH ? tl('Robinhood extended-hours feed') : q.source));
  const fresh = CN ? (q.source_note === 'real-time' ? tl('real-time') : tl('may be delayed')) : q.source === 'Nasdaq.com quote API' && !/real-time/i.test(q.source_note || '') ? tl('may be delayed') : tl('real-time');
  $('#lq-cap').textContent = (m.time ? tl(`as of ${tET(m.time)} ET (${tSG(m.time)} SGT)`) : (m.time_et ? tl(`last trade ${m.time_et}`) : '')) + ` · ${venue} · ${fresh}` + (q.stale ? tl(' · last good update, retrying') : tl(' · refreshes every 15 s'));
  /* vs-IPO box follows the live regular-session price */
  const rp = q.regular && q.regular.price; if (rp) { const v = $('#mc-v'); if (v) v.textContent = 'US$' + fmt(rp * D.price.shares_bn / 1000, 2) + 'tn'; const s1 = $('#mc-s'); if (s1) s1.textContent = tl(`${fmt(D.price.shares_bn, 2)}bn shares × ${usd(rp)} (${reg ? 'live' : 'last regular close'}, calc.)`); }

}
/* primary: CNBC free quote feed fetched straight from the browser (same approach as the META dashboard), mapped to the Worker's quote shape; Worker then TradingView as fallbacks */
const CNBC_URL = 'https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=TSLA&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1';
async function cnbcQuote() {
  const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 7000);
  const r = await fetch(CNBC_URL, {cache: 'no-store', signal: ctl.signal}); clearTimeout(to);
  const c = ((await r.json()).FormattedQuoteResult || {}).FormattedQuote[0]; if (!c || !c.last) throw new Error('empty');
  const n = v => v == null || v === '' ? null : parseFloat(String(v).replace(/[,%+]/g, ''));
  const tm = v => { if (!v || !String(v).includes('T')) return null; const t = Date.parse(v); return isNaN(t) ? null : t; };
  const et = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})), mins = et.getHours() * 60 + et.getMinutes(), wkday = et.getDay() > 0 && et.getDay() < 6;
  const st = (c.curmktstatus === 'REG_MKT' && !(wkday && mins >= 570 && mins < 960)) ? 'CLOSED' : c.curmktstatus, reg = st === 'REG_MKT', x = c.ExtendedMktQuote, last = n(c.last), chg = n(c.change);
  const lbl = {PRE_MKT: 'Pre-market', POST_MKT: 'After-hours', CLOSED: 'Closed'};
  const q = {ok: true, source: 'CNBC quote feed', source_note: c.realTime === 'true' ? 'real-time' : 'may be delayed', session: reg ? 'regular' : st === 'PRE_MKT' ? 'pre' : st === 'POST_MKT' ? 'after' : 'closed', session_label: lbl[st] || st,
    regular: {price: last}, prev_close: {price: +(last - chg).toFixed(2)}, ref_close: {price: last}, bid: n(c.bid), ask: n(c.ask), stale: false, cnbc_time: c.last_timedate};
  if (reg || !x || !x.last) q.main = {kind: reg ? 'regular' : 'close', label: 'Close', price: last, change: chg, pct: n(c.change_pct), time: tm(c.last_time), time_et: c.last_timedate};
  else { q.main = {kind: 'ext', label: lbl[x.type] || x.type, price: n(x.last), change: n(x.change), pct: n(x.change_pct), time: tm(x.last_time), time_et: x.last_timedate}; q.ext = {label: q.main.label, price: q.main.price, pct: q.main.pct}; }
  return q;
}
async function pollQuote() {
  if (document.visibilityState === 'hidden') return;
  try {
    const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 8000);
    let q = null;
    try { q = await cnbcQuote(); } catch (e1) { /* own CNBC feed failed: fall back to the shared Worker */ }
    if (!q) { const r = await fetch(QUOTE_API + (QUOTE_API.includes('?') ? '&' : '?') + 't=' + Date.now(), {cache: 'no-store', signal: ctl.signal}); q = await r.json(); }
    clearTimeout(to); if (!q || !q.ok || !q.main) throw new Error('bad quote');
    LQ.fails = 0; LQ.ok = true; LQ.last = q; tvFallback(false); renderQuote(q); { const e = document.getElementById('lfstat'); if (e) e.textContent = tl(`Last tick $${Number((q.main || {}).price).toFixed(2)} at ${(q.main || {}).time_et || ''} · ${q.session_label || q.session || ''}`); }
  } catch (e) {
    LQ.fails++;
    if (!LQ.ok || LQ.fails >= 4) tvFallback(true);
    else if (LQ.last) renderQuote({...LQ.last, stale: true});
  }
}
function liveQuote() {
  LQ.tv = false; clearTimeout(LQ.timer);
  if (!QUOTE_API) { tvFallback(true); return; }  /* no endpoint yet: TradingView delayed widget */
  if (LQ.last) { tvFallback(false); renderQuote(LQ.last); }
  /* 15 s while the endpoint answers; back off to 30–60 s while it is unreachable (TradingView fallback shown meanwhile) */
  const loop = async () => { await pollQuote(); const d = LQ.fails === 0 ? 15000 : Math.min(60000, 15000 * 2 ** Math.min(LQ.fails, 2)); LQ.timer = setTimeout(loop, d); };
  loop();
  if (!LQ.vis) { LQ.vis = true; document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { clearTimeout(LQ.timer); loop(); } }); }
}
/* ---------------- palette & charts ---------------- */
let C = {};
function palette() {
  C = isDark() ? {acc: '#ff5a52', acc3: 'rgba(255,90,82,.18)', g: '#d1d1d6', g2: '#636366', g3: '#3a3a3c', up: '#30d158', dn: '#ff453a', grid: 'rgba(255,255,255,.06)', txt: '#8e8e93'}
               : {acc: '#cc0000', acc3: 'rgba(204,0,0,.10)', g: '#1d1d1f', g2: '#8e8e93', g3: '#d1d1d6', up: '#1d8a3a', dn: '#d70015', grid: 'rgba(0,0,0,.05)', txt: '#86868b'};
  const d = Chart.defaults; d.font.family = '-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Arial,sans-serif'; d.font.size = 11; d.color = C.txt; d.borderColor = C.grid;
  d.elements.bar.borderRadius = 5; d.elements.bar.borderSkipped = false; d.datasets.bar.maxBarThickness = 34; d.elements.line.tension = .3;
  Object.assign(d.plugins.legend.labels, {usePointStyle: true, pointStyle: 'circle', boxWidth: 6, boxHeight: 6, padding: 14});
  Object.assign(d.plugins.tooltip, {backgroundColor: isDark() ? 'rgba(58,58,60,.97)' : 'rgba(29,29,31,.93)', cornerRadius: 10, padding: 10, usePointStyle: true});
  d.scale.border = {display: false}; d.scales.category.grid = {display: false}; d.scales.linear.grid = {color: C.grid, drawTicks: false}; d.scales.linear.ticks = {maxTicksLimit: 6, padding: 8};
}
const charts = {}; window.__charts = charts;
function chart(id, cfg) { const el = document.getElementById(id); if (!el) return null; if (charts[id]) charts[id].destroy(); cfg.options = Object.assign({responsive: true, maintainAspectRatio: false, plugins: {legend: {position: 'bottom'}}}, cfg.options || {}); charts[id] = new Chart(el, I18N.chartCfg(cfg)); return charts[id]; }
const ccard = (id, title, sub = '', h = 290) => `<div class="card ccard"><div class="chead"><div class="ct">${esc(title)}</div>${sub ? `<div class="mut" style="font-size:11.5px">${sub}</div>` : ''}</div><div class="chartbox" style="height:${h}px"><canvas id="${id}" role="img" aria-label="${esc(title)}"></canvas></div></div>`;
const bn = v => v == null ? 'n/a' : (v < 0 ? '−' : '') + 'US$' + fmt(Math.abs(v) / 1000, 2) + 'bn';
const mm = v => v == null ? 'n/a' : (v < 0 ? '−' : '') + 'US$' + fmt(Math.abs(v), 0) + 'm';
const row = (arr, name) => (arr.find(r => Array.isArray(r) && r[0] === name) || []).slice(1);
const ext = (u, t = 'source') => u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>` : '';
const kpi = (l, v, s, u) => `<div class="card kpi"><div class="l">${esc(l)}</div><div class="v">${v}</div><div class="s">${s}${u ? ' · ' + ext(u) : ''}</div></div>`;
/* ======================= Tesla tabs ======================= */
const O = D.ops, F = D.fin, U = D.U;
const qs = q => q.replace(/^Q(\d) 20(\d{2})$/, "Q$1'$2");
const nz = v => v == null ? null : v;
const pctf = (v, d = 1) => v == null ? 'pending' : fmt(v, d) + '%';
const sec = id => $('#s-' + id);
const card = (id, title, sub, body) => `<div class="card" id="${id}" style="margin:16px 0"><h3 style="margin-top:0">${esc(title)} ${sub ? `<span class="mut">${esc(sub)}</span>` : ''}</h3>${body}</div>`;
const ul = (rows) => `<ul class="lst">${rows.map(r => `<li>${r}</li>`).join('')}</ul>`;
const scoreCls = s => /^Met/.test(s) ? 'ok' : /^Behind/.test(s) ? 'bad' : 'mut';
const egm = i => F.energy[i] == null ? null : +((F.energy[i] - F.energy_cogs[i]) / F.energy[i] * 100).toFixed(1);
const sgm = i => F.services[i] == null ? null : +((F.services[i] - F.services_cogs_safe(i)) / F.services[i] * 100).toFixed(1);
F.services_cogs_safe = i => F.serv_cogs[i];
const hiDPR = {devicePixelRatio: Math.max(2, window.devicePixelRatio || 1)};
Chart.defaults.devicePixelRatio = hiDPR.devicePixelRatio;

function weekCard() {
  const src = (lab, u) => `${esc(lab)} <span style="font-size:12px">${ext(u)}</span>`;
  const li = D.week.map(r => `<li><span class="mut" style="font-size:12px">${esc(r[0])} · ${esc(r[1])}</span><br>${src(r[2], r[3])}</li>`).join('');
  const nx = D.next.map(r => `<li><b>${esc(r[0])}</b> · ${esc(r[1])}</li>`).join('');
  return card('wk', 'What changed this week', '26 Oct 2026 · last 7 days · newest first', `<div class="grid g2"><div><ul class="lst">${li}</ul></div><div><h3 style="margin-top:0">Coming up</h3><ul class="lst">${nx}</ul></div></div>`);
}
function videoCard(n) {
  const V = D.videos || {rows: []}; const rows = n ? V.rows.slice(0, n) : V.rows;
  const li = rows.map(r => `<li><span class="mut" style="font-size:12px">${esc(r[0])} · ${esc(r[1])}</span><br><a href="${esc(r[3])}" target="_blank" rel="noopener">${esc(r[2])}</a><br><span style="font-size:13px">${esc(r[4])}</span></li>`).join('') || '<li class="na">No material videos captured.</li>';
  return card('yt', 'YouTube / video', `material segments · newest first · as of ${V.asof || 'n/a'}`, `<ul class="lst">${li}</ul><div class="mut" style="font-size:11.5px;margin-top:8px">Takeaways are drawn from each video’s captions/transcript or its YouTube description, not from watching it. Commentary and opinions are the speakers’ own${n && V.rows.length > n ? ` · <a href="#video">all ${V.rows.length} videos</a>` : ''}.</div>`);
}
function videoTab() { sec('video').innerHTML = `<h2>YouTube / video <span class="mut">earnings follow-ups, exec interviews, TV segments, analyst channels</span></h2>${videoCard()}`; }
function promiseCard(filter) {
  const rows = D.promises.filter(r => !filter || filter.includes(r[2]));
  const n = k => rows.filter(r => r[5].startsWith(k)).length;
  return card('promise' + (filter ? filter[0].replace(/\W/g, '') : ''), filter ? 'Promises vs reality' : 'Elon & Tesla promise tracker', 'dated claims scored 22 Oct 2026',
    `<div class="grid g3" style="margin-bottom:12px">${kpi('Met', String(n('Met')), 'of ' + rows.length + ' claims')}${kpi('Behind', String(n('Behind')), 'missed or off track')}${kpi('Pending', String(n('Pending')), 'deadline still ahead')}</div>` +
    tableBlock({columns: ['Said', 'Claim', 'Topic', 'Deadline', 'Where it stands', 'Score', 'Source'], rows}, {wrap: true, notes: ['Claims are paraphrased from the cited source unless quoted. “Met (late)” = delivered after the stated date.']}));
}

/* ---------------- hero ---------------- */
function hero() {
  const P = D.price;
  $('#updated').innerHTML = `© 2026 Hugo Tian. All rights reserved.`;
  $('#hero4').innerHTML = [
    `<div class="hcard live"><div id="lq" class="lq" aria-live="polite" style="display:none"><div class="lq-top"><span class="lq-sess"><i class="lq-dot"></i><span id="lq-sl">Connecting to live quote…</span></span><span class="lq-sym">TSLA · Nasdaq</span></div>
       <div class="lq-row"><span class="lq-k" id="lq-k"></span><span class="lq-px" id="lq-px">—</span><span class="lq-ch" id="lq-ch"></span></div><div class="lq-sub" id="lq-sub"></div><div class="lq-cap" id="lq-cap"></div></div>
     <div id="tvwrap" class="tvwrap" style="display:none"><div class="l" style="padding:2px 4px 0"><i class="livedot"></i> Live stock price ${info('Live price', 'Real-time box via the shared quote relay, refreshed every 15 s; if it is unavailable, TradingView\'s delayed (~15 min) quote is shown instead.')}</div><div class="tvq" id="tvq"></div><div class="cap" id="tvqcap" style="padding:0 4px">Nasdaq: TSLA · delayed ~15 min · TradingView</div></div></div>`,
    `<div class="hcard"><div class="l">Q3 2026 results ${info('Earnings', D.meta.next_earnings)}</div><div class="v">US$${fmt(F.rev[5] / 1000, 2)}bn</div><div class="ch">Non-GAAP EPS US$${fmt(F.eps_ng[5], 2)} vs ~US$${fmt(D.actual.street_eps, 2)} Street</div><div class="s">Gross margin ${F.tgm[5]}% · op. margin ${F.opm[5]}% · FCF ${mm(F.fcf[5])}</div><div class="asof">Reported 21 Oct 2026 · ${ext(U.q3deck, 'Q3 update')}</div></div>`,
    `<div class="hcard"><div class="l">Market cap</div><div class="v" id="mc-v">US$${fmt(P.mcap_bn / 1000, 2)}tn</div><div class="ch mut">EV US$${fmt(P.ev_bn / 1000, 2)}tn · P/E ${fmt(P.pe, 0)}x</div><div class="s" id="mc-s">${fmt(P.shares_bn, 2)}bn shares × US$${fmt(P.close, 2)}</div><div class="asof">Close ${esc(dlong(P.close_date))} · ${ext(P.src, 'StockAnalysis')}</div></div>`,
    `<div class="hcard"><div class="l">Q3 2026 deliveries</div><div class="v">${fmt(O.deliv[6])}</div><div class="ch neg">${pct((O.deliv[6] / O.deliv[2] - 1) * 100)} YoY</div><div class="s">${pct((O.deliv[6] / O.deliv[5] - 1) * 100)} QoQ · production ${fmt(O.prod[6])} · storage ${O.storage[6]} GWh</div><div class="asof">P&D release, 2 Oct 2026</div></div>`].join('');
  $('#hero2').innerHTML = [
    `<div class="mini"><div class="l">Active FSD subscriptions</div><div class="v">1.74m</div><div class="s">Q3 2026 · +67% YoY · &gt;75% NA paid attach</div></div>`,
    `<div class="mini"><div class="l">Cybercabs in Austin</div><div class="v">300+</div><div class="s">10 Oct 2026 · 8x in 30 days · <a href="#robotaxi">Robotaxi tab</a></div></div>`,
    `<div class="mini"><div class="l">Elon Musk stake</div><div class="v">${fmt(D.musk.own_pct, 2)}%</div><div class="s">${fmt(D.musk.own_m, 1)}m shares · plus 423.7m-share 2025 award · <a href="#own">Ownership</a></div></div>`,
    `<div class="mini"><div class="l">SpaceX–Tesla merger</div><div class="v">Under review</div><div class="s">Special committees formed 20 Oct · no terms</div></div>`].join('');
  try { I18N.apply($('#hero4')); I18N.apply($('#hero2')); } catch (e) { console.error('i18n hero', e); }
  clearInterval(CDT);
  liveQuote();
}

/* ---------------- overview ---------------- */
function overview() {
  const P = D.price, i = 5;
  const keyRows = [
    ['Share price / market cap / EV', `US$${fmt(P.close, 2)} / US$${fmt(P.mcap_bn)}bn / US$${fmt(P.ev_bn)}bn`, `Close ${dlong(P.close_date)}`],
    ['Q3 2026 deliveries / production', `${fmt(O.deliv[6])} / ${fmt(O.prod[6])}`, 'P&D release, 2 Oct 2026'],
    ['Q3 2026 storage deployed', `${O.storage[6]} GWh (record 14.2 GWh in Q4 2025)`, 'P&D release'],
    ['Q3 2026 revenue / GAAP net income', `${mm(F.rev[i])} (${pct((F.rev[i] / F.rev[1] - 1) * 100)} YoY) / ${mm(F.ni[i])}`, 'Q3 2026 update'],
    ['Q3 2026 EPS diluted (GAAP / non-GAAP)', `US$${fmt(F.eps[i], 2)} / US$${fmt(F.eps_ng[i], 2)}`, 'Q3 2026 update'],
    ['Q3 2026 auto gross margin ex-credits', `${F.agm_x[i]}% (GAAP ${F.agm[i]}%)`, 'Q3 2026 update'],
    ['Q3 2026 operating margin / free cash flow', `${F.opm[i]}% / ${mm(F.fcf[i])}`, 'Q3 2026 update'],
    ['Cash & short-term investments', mm(F.cash[i]), '30 Sep 2026'],
    ['Active FSD subscriptions', '1.74m', 'Q3 2026'],
    ['P/E (trailing / forward) · EV/sales', `${fmt(P.pe, 0)}x / ${fmt(P.fpe, 0)}x · ${P.evs}x`, `Close ${dlong(P.close_date)}`],
    ['Analysts (TipRanks, third-party)', `Moderate Buy · avg target US$${D.street.tip.avg} (${D.street.tip.buy} buy / ${D.street.tip.hold} hold / ${D.street.tip.sell} sell)`, 'Oct 2026'],
    ['Elon Musk', `${D.musk.own_pct}% of shares (${fmt(D.musk.own_m, 1)}m) + 2025 CEO award of 423.7m restricted shares`, 'Jun 2026']];
  sec('overview').innerHTML = `<h2>Overview</h2>
  <p class="lead">Tesla makes EVs (Model 3/Y, Cybertruck, Semi), energy storage (Megapack, Powerwall) and is betting its valuation on <b>autonomy</b> (FSD, Robotaxi, Cybercab) and <b>Optimus</b> robots. Car volumes are recovering but margins are thin and capex has surged; regulators and the new <b>SpaceX merger review</b> are the swing factors.</p>
  <div class="grid g2" style="margin-bottom:16px">
    <div class="card"><h3>Key numbers (with dates)</h3>${tableBlock({columns: ['Metric', 'Value', 'As of'], rows: keyRows}, {id: 'tKey', csvname: 'Key numbers', wrap: true, cls: 'keyt'})}</div>
    <div class="card"><h3>Key takeaways</h3><ul class="lst">${D.takeaways.map(t => `<li>${esc(t)}</li>`).join('')}</ul><div class="mut" style="font-size:11.5px;margin-top:8px">Sources: Tesla quarterly updates, P&D releases and the tabs of this dashboard.</div></div></div>
  ${weekCard()}
  ${videoCard(4)}
  <div class="card" style="margin:16px 0;border-left:3px solid var(--acc)"><h3 style="margin-top:0">SpaceX–Tesla merger review</h3>${tableBlock({columns: ['Item', 'Status'], rows: [['Status', D.merger.status], ['Terms / exchange ratio', 'pending (not disclosed)'], ['Approval needed', D.merger.vote], ['Source', D.merger.src]]}, {id: 'tMerge', wrap: true})}</div>
  <div class="grid g2" style="margin-bottom:16px">${ccard('ovDel', 'Deliveries and production by quarter', 'Tesla P&D releases')}${ccard('ovRev', 'Revenue by segment (US$m)', 'Tesla quarterly updates')}</div>
  <div class="card"><h3 style="margin-top:0">TSLA live chart <span class="mut" style="font-size:12px;font-weight:400">${TV_SYM} · TradingView</span></h3><div class="tvchart" id="tvchart"></div></div>`;
  delivChart('ovDel'); revChart('ovRev');
  tvEmbed($('#tvchart'), 'advanced-chart', {autosize: true, symbol: TV_SYM, interval: 'D', range: '6M', timezone: 'Asia/Singapore', theme: tvTheme(), style: '1', locale: I18N.tvLocale(),
    backgroundColor: isDark() ? 'rgba(22,22,23,1)' : 'rgba(255,255,255,1)', gridColor: isDark() ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.035)', allow_symbol_change: false, hide_side_toolbar: true, calendar: false, support_host: 'https://www.tradingview.com'},
    why => { $('#tvchart').innerHTML = `<div class="tvfail">Live chart unavailable (${esc(why)}).</div><div class="mut" style="font-size:12px">Snapshot: close US$${fmt(D.price.close, 2)} on ${esc(dlong(D.price.close_date))} · not live</div>`; $('#tvchart').style.height = 'auto'; });
}
function delivChart(id) { chart(id, {type: 'bar', data: {labels: D.Q.map(qs), datasets: [{label: 'Deliveries', data: O.deliv, backgroundColor: C.acc}, {label: 'Production', data: O.prod, backgroundColor: C.g3}]}, options: {plugins: {tooltip: {callbacks: {label: c => `${c.dataset.label}: ${fmt(c.raw)}`}}}}}); }
function revChart(id) { chart(id, {type: 'bar', data: {labels: D.fcols.map(qs), datasets: [{label: 'Automotive', data: F.auto, backgroundColor: C.acc}, {label: 'Energy generation & storage', data: F.energy, backgroundColor: C.g2}, {label: 'Services & other', data: F.services, backgroundColor: C.g3}]},
  options: {scales: {x: {stacked: true}, y: {stacked: true}}, plugins: {tooltip: {callbacks: {label: c => `${c.dataset.label}: ${mm(c.raw)}`}}}}}); }

/* ---------------- autos ---------------- */
function autosTab() {
  const i = 5, A = D.asp_calc;
  const rows = [['Total production', ...O.prod], ['Total deliveries', ...O.deliv], ['Model 3/Y deliveries', ...O.deliv3y], ['Other models deliveries', ...O.deliv.map((v, k) => v - O.deliv3y[k])], ['Inventory (days of supply)', ...O.dos], ['Cumulative deliveries (m)', ...O.cum_deliv], ['Supercharger stations', ...O.sc_st], ['Supercharger connectors', ...O.sc_con]];
  sec('autos').innerHTML = `<h2>Autos <span class="mut">volumes, margins, regulatory credits, pricing</span></h2>
  <div class="grid g4" style="margin-bottom:16px">
    ${kpi('Q3 2026 deliveries', fmt(O.deliv[6]), `${pct((O.deliv[6] / O.deliv[2] - 1) * 100)} YoY · beat ~462k consensus`, U.q3pdd)}
    ${kpi('Auto gross margin ex-credits', F.agm_x[i] + '%', `Q3 2026 · GAAP ${F.agm[i]}% · Q2 ${F.agm_x[i - 1]}%`, U.q3deck)}
    ${kpi('Regulatory credit revenue', mm(F.credits[i]), `Q3 2026 · vs ${mm(F.credits[1])} a year earlier`, U.q3deck)}
    ${kpi('Auto sales revenue per vehicle (calc.)', 'US$' + fmt(A.q3), `Q3 2026 · Q2 US$${fmt(A.q2)} · Q3 2025 US$${fmt(A.q3_25)} · excl. leased units`, A.src)}</div>
  <div class="grid g2" style="margin-bottom:16px">${ccard('auDel', 'Deliveries vs production', 'units per quarter')}${ccard('auGm', 'Automotive gross margin (%) and regulatory credits (US$m)', 'GAAP vs ex-credits (non-GAAP)')}</div>
  ${tableBlock({title: 'Operational summary', columns: ['Metric', ...D.Q], rows}, {id: 'tOps', csvname: 'TSLA operational summary', notes: ['Sources: Tesla Q1 2026 update (Q1 2025) ' + U.q1deck + ' ; Q2 2026 update (Q2 2025–Q2 2026) ' + U.q2deck + ' ; Q3 2026 production & deliveries release ' + U.q3pdd, 'Q3 2026: Tesla Q3 2026 update ' + U.q3deck]})}
  ${tableBlock({title: 'Automotive revenue and margin', columns: ['US$m', ...D.fcols], rows: [['Automotive sales', ...F.auto_sales], ['Regulatory credits', ...F.credits], ['Leasing', ...F.leasing], ['Total automotive revenue', ...F.auto], ['Automotive cost of revenue', ...F.auto_cogs], ['Auto gross margin (GAAP)', ...F.agm.map(v => v == null ? null : v + '%')], ['Auto gross margin ex-credits', ...F.agm_x.map(v => v == null ? null : v + '%')]]}, {id: 'tAuto', csvname: 'TSLA automotive', notes: ['Source: Tesla Q3 2026 update (Q3 2025–Q3 2026), statement of operations and GAAP-to-non-GAAP reconciliation ' + U.q3deck + ' ; Q2 2025 from the Q2 2026 update ' + U.q2deck, 'Revenue per vehicle (calc.) = automotive sales revenue ÷ (deliveries − deliveries under operating lease); it includes FSD and other ancillary sales, so it is not Tesla’s own ASP (Tesla does not disclose one).']})}
  ${tableBlock({title: 'Installed annual capacity (Tesla, Q3 2026)', columns: ['Region', 'Product', 'Capacity', 'Status'], rows: D.capacity}, {id: 'tCap', notes: ['Source: Tesla Q3 2026 update, p. 6 ' + U.q3deck + ' · installed capacity ≠ current production rate.']})}`;
  delivChart('auDel');
  chart('auGm', {data: {labels: D.fcols.map(qs), datasets: [{type: 'line', label: 'Auto GM (GAAP) %', data: F.agm, borderColor: C.g2, backgroundColor: C.g2, yAxisID: 'y'}, {type: 'line', label: 'Auto GM ex-credits %', data: F.agm_x, borderColor: C.acc, backgroundColor: C.acc, yAxisID: 'y'}, {type: 'bar', label: 'Regulatory credits (US$m)', data: F.credits, backgroundColor: C.g3, yAxisID: 'y1'}]},
    options: {scales: {y: {ticks: {callback: v => v + '%'}}, y1: {position: 'right', grid: {display: false}}}}});
}

/* ---------------- energy ---------------- */
function energyTab() {
  const em = D.fcols.map((_, k) => egm(k));
  sec('energy').innerHTML = `<h2>Energy <span class="mut">Megapack, Megablock and Powerwall</span></h2>
  <div class="grid g4" style="margin-bottom:16px">
    ${kpi('Q3 2026 storage deployed', O.storage[6] + ' GWh', `2nd-best quarter · ${pct((O.storage[6] / O.storage[2] - 1) * 100)} YoY · consensus ~15.9 GWh`, U.q3pdd)}
    ${kpi('2025 deployments', '46.7 GWh', 'full year (record)', U.q4pdd)}
    ${kpi('Energy revenue', mm(F.energy[5]), `Q3 2026 · ${pct((F.energy[5] / F.energy[1] - 1) * 100)} YoY · tariff-related refunds`, U.q3deck)}
    ${kpi('Energy gross margin (calc.)', em[5] + '%', `Q3 2026 · ${em[4]}% in Q2 · tariff refunds and vendor warranty true-down`, U.q3call)}</div>
  <div class="grid g2" style="margin-bottom:16px">${ccard('enDep', 'Storage deployed (GWh)', 'per quarter')}${ccard('enRev', 'Energy revenue (US$m) and gross margin (%)', 'margin calculated from the statement of operations')}</div>
  ${tableBlock({title: 'Energy generation & storage', columns: ['US$m', ...D.fcols], rows: [['Revenue', ...F.energy], ['Cost of revenue', ...F.energy_cogs], ['Gross profit (calc.)', ...F.energy.map((v, k) => v == null ? null : v - F.energy_cogs[k])], ['Gross margin (calc.)', ...em.map(v => v == null ? null : v + '%')]]}, {id: 'tEn', notes: ['Source: Tesla Q3 2026 update, statement of operations ' + U.q3deck + ' . Q2 2026 included “increase in energy warranty-related charges due to vendor cell issue”; Q3 2026 margin was lifted by tariff refunds and a warranty true-down agreed with the cell vendor (CFO, Q3 call ' + U.q3call + ' ).', 'Capacity: Megapack 40 GWh (California), 20 GWh (Shanghai), 50 GWh Megafactory Texas (production began Q3 2026); Powerwall >6 GWh (Nevada).']})}`;
  chart('enDep', {type: 'bar', data: {labels: D.Q.map(qs), datasets: [{label: 'Storage deployed (GWh)', data: O.storage, backgroundColor: C.acc}]}, options: {plugins: {legend: {display: false}}}});
  chart('enRev', {data: {labels: D.fcols.map(qs), datasets: [{type: 'bar', label: 'Energy revenue (US$m)', data: F.energy, backgroundColor: C.g3, yAxisID: 'y'}, {type: 'line', label: 'Energy gross margin %', data: em, borderColor: C.acc, backgroundColor: C.acc, yAxisID: 'y1'}]}, options: {scales: {y1: {position: 'right', grid: {display: false}, ticks: {callback: v => v + '%'}}}}});
}

/* ---------------- robotaxi & cybercab ---------------- */
function robotaxiTab() {
  sec('robotaxi').innerHTML = `<h2>Cybercab & Robotaxi <span class="mut">production, cities, permits, deadlines</span></h2>
  <div class="grid g4" style="margin-bottom:16px">
    ${kpi('Cybercab production', 'Started', 'Giga Texas · installed capacity >125,000/yr', U.q3deck)}
    ${kpi('Cybercabs serving Austin', '300+', '10 Oct 2026 · 8x in 30 days (Tesla Robotaxi on X)', U.cab)}
    ${kpi('Robotaxi metros', '7', '6 ramping unsupervised + Bay Area with safety driver', U.q2deck)}
    ${kpi('Cumulative unsupervised miles', '~2m', 'end of Q3 2026 · up 8x in the quarter (Tesla)', U.q3deck)}</div>
  ${tableBlock({title: 'Robotaxi service by metro', columns: ['Metro', 'Launched', 'Status', 'Source'], rows: D.robotaxi}, {id: 'tRT', wrap: true, notes: ['Status per Tesla Q2 2026 update (“Ramping Unsupervised” / “Safety Driver”) plus later company posts. Fleet counts from community trackers are not used.']})}
  <div class="grid g2" style="margin:16px 0">
    <div class="card"><h3 style="margin-top:0">Cybercab facts</h3>${ul([`Public paid rides in Austin since <b>4 Sep 2026</b>, the day after the launch event. ${ext(U.cab)}`, `No steering wheel or pedals; 48 kWh battery, 219 hp motor (EPA filing). ${ext(U.cab)}`, `Engineering test drives on public roads and employee rides at Giga Texas began in Q2/July 2026. ${ext(U.q2deck)}`, `Next city: Dallas “soon” (Ashok Elluswamy, 10 Oct); no date. ${ext('https://x.com/aelluswamy/status/2108986941127696515')}`])}</div>
    <div class="card"><h3 style="margin-top:0">Regulatory</h3>${ul([`<b>NHTSA:</b> Tesla must explain under oath by <b>30 Oct 2026</b> how a car with no steering wheel or pedals was certified. ${ext(U.tnorth)}`, `<b>NHTSA rulemaking (23 Oct 2026):</b> proposed FMVSS 108 update adds optional cyan ADS marker lamps and drops manual lighting-control requirements for driverless vehicles. ${ext(U.fmvss108)}`, `<b>California:</b> Bay Area runs FSD (Supervised) with safety drivers under CPUC TCP permit TCP0046782-A; no driverless deployment permit from the CPUC or DMV disclosed. ${ext(U.q2deck)}`, `<b>Texas / Florida:</b> unsupervised service in 6 metros (no state ride-hail permit required in Tesla’s disclosures). ${ext(U.q2deck)}`])}</div></div>
  ${promiseCard(['Cybercab', 'Robotaxi'])}`;
}

/* ---------------- FSD ---------------- */
function fsdTab() {
  const S = D.safety;
  sec('fsd').innerHTML = `<h2>FSD (Supervised) <span class="mut">adoption, safety, approvals, investigations</span></h2>
  <div class="grid g4" style="margin-bottom:16px">
    ${kpi('Active FSD subscriptions', '1.74m', 'Q3 2026 · +67% YoY · incl. upfront purchases, excl. trials', U.q3deck)}
    ${kpi('North America attach rate', '>75%', 'of new deliveries signed up for paid FSD (Q3 2026; >55% in Q2)', U.q3deck)}
    ${kpi('Miles per major collision (FSD)', fmt(S.rows[0][1]), `vs ${fmt(S.rows[3][1])} U.S. average (Tesla estimate)`, S.src)}
    ${kpi('US price', 'US$99/mo', 'subscription only since 14 Feb 2026', 'https://www.tesla.com/support/fsd-subscriptions')}</div>
  <div class="grid g2" style="margin-bottom:16px">${ccard('fsdSub', 'Active FSD subscriptions (m)', 'Tesla quarterly updates')}${ccard('fsdSafe', 'Miles per major collision (Tesla Vehicle Safety Report)', S.period)}</div>
  ${tableBlock({title: 'Tesla Vehicle Safety Report', columns: ['Group', 'Miles per major collision', 'Major collisions', 'Miles logged'], rows: S.rows}, {id: 'tSafe', notes: ['Source: Tesla, FSD (Supervised) Vehicle Safety Report ' + S.src + ' (figures as tabulated by Learn My EV ' + S.src2 + ' ). “Major” = airbag or other non-reversible restraint deployed; a crash counts as FSD if it was active within 5 s before impact. Tesla does not attribute fault.', 'Caveat: the like-for-like comparison is FSD vs the same fleet driven manually with active safety (≈2.7x), not vs the U.S. average (≈8x), which is an older fleet.']})}
  ${tableBlock({title: 'Approvals by market', columns: ['Market', 'Status', 'Detail', 'Source'], rows: D.fsd_mkts}, {id: 'tMk', wrap: true, notes: ['EU-wide approval needs a qualified majority: 15 of 27 member states representing 65% of the EU population.']})}
  <div class="grid g2" style="margin:16px 0"><div>${tableBlock({title: 'Software versions', columns: ['Version', 'Where', 'Source'], rows: D.fsd_ver}, {id: 'tVer', wrap: true})}</div>
  <div>${tableBlock({title: 'NHTSA investigations', columns: ['Case', 'Opened', 'Status', 'Subject', 'Source'], rows: D.probes}, {id: 'tPr', wrap: true})}</div></div>
  ${promiseCard(['FSD Europe', 'FSD China'])}`;
  chart('fsdSub', {type: 'bar', data: {labels: D.Q.map(qs), datasets: [{label: 'Active FSD subscriptions (m)', data: O.fsd, backgroundColor: C.acc}]}, options: {plugins: {legend: {display: false}}}});
  chart('fsdSafe', {type: 'bar', data: {labels: S.rows.map(r => r[0].replace(/ \(.*\)/, '')), datasets: [{label: 'Miles per major collision', data: S.rows.map(r => r[1]), backgroundColor: [C.acc, C.g2, C.g3, C.g3]}]}, options: {indexAxis: 'y', plugins: {legend: {display: false}}}});
}

/* ---------------- Optimus ---------------- */
function optimusTab() {
  sec('optimus').innerHTML = `<h2>Optimus <span class="mut">humanoid robot</span></h2>
  <div class="grid g4" style="margin-bottom:16px">
    ${kpi('Production line', 'Fremont', 'early production on the high-volume line (Q3 2026)', U.q3deck)}
    ${kpi('Gen 3 design', 'Finalized', 'per Tesla to JPMorgan (Aug 2026); public reveal pending', U.electrekOpt)}
    ${kpi('External sales', 'End-2027', 'Musk on the Q3 call · no price or customer disclosed', U.q3call)}
    ${kpi('Long-term capacity goal', '1m + 10m', 'per year · Fremont + Texas', U.electrekOpt)}</div>
  ${tableBlock({title: 'Optimus timeline', columns: ['Date', 'What happened', 'Source'], rows: D.optimus}, {id: 'tOpt', wrap: true})}
  ${promiseCard(['Optimus'])}`;
}

/* ---------------- key people ---------------- */
function peopleTab() {
  const X = window.XFEED || {posts: []};
  const topics = ['All', ...new Set(X.posts.map(p => p.topic))];
  const M = D.musk;
  sec('people').innerHTML = `<h2>Key people <span class="mut">what Elon Musk and Tesla executives say, with dates</span></h2>
  <div class="grid g2">
    <div class="card"><h3 style="margin-top:0">Elon Musk on X: Tesla posts <span class="mut">newest first · SGT · ${X.posts.length} posts</span></h3>
      <div class="chips" id="xchips">${topics.map((t, i) => `<button class="btn ${i ? '' : 'on'}" data-x="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      <div id="xlist" style="max-height:900px;overflow:auto">${X.posts.map(p => `<div class="xpost" data-topic="${esc(p.topic)}"><div class="t notr">${esc(p.text)}</div><div class="m notr">${esc(dlong(p.sgt))} ${esc(p.sgt.slice(11))} SGT · ${esc(p.kind)} · ${esc(p.topic)}${p.likes != null ? ' · ' + fmt(p.likes) + ' likes' : ''} · <a href="${esc(p.url)}" target="_blank" rel="noopener">open on X</a></div></div>`).join('') || '<div class="na">n/a — X feed not loaded</div>'}</div>
      <ul class="notes"><li>${esc(X.source || '')} · ${esc(X.window || '')} · fetched ${esc(X.fetched_sgt || 'n/a')}. Text is verbatim (links trimmed). Refresh with build_x.py.</li></ul></div>
    <div><div class="card" style="margin-bottom:16px"><h3 style="margin-top:0">Executives and board</h3>${D.quotes.map(q => `<div class="rule"><b>${esc(q[0])}</b> <span class="mut">${esc(q[1])} · ${esc(q[2])}</span><blockquote>${esc(q[3])}</blockquote><div class="w">${q[4] ? ext(q[4], 'source') : 'pending'}</div></div>`).join('')}</div>
      <div class="card"><h3 style="margin-top:0">Musk’s stake and 2025 CEO Performance Award</h3>
      <div class="grid g2" style="margin-bottom:10px">${kpi('Shares owned', fmt(M.own_m, 1) + 'm', `${M.own_pct}% of shares out · ${M.own_date}`, M.own_src)}${kpi('2025 award', '423.7m', '12 tranches × 35.3m restricted shares', U.award)}</div>
      ${tableBlock({columns: ['Operational milestone', 'Where Tesla is', 'Award target'], rows: M.status}, {id: 'tAw', wrap: true, notes: ['Each tranche needs a market-cap milestone (US$2.0tn up to US$8.5tn) plus one operational milestone; tranches 11–12 also need an approved CEO succession framework. Source: award agreement ' + U.award + ' and Tesla proxy video ' + U.award_vid, 'Stake: third-party aggregation of SEC filings (StocksGuide) ' + M.own_src]})}</div></div></div>
  ${promiseCard()}`;
  $$('#xchips button').forEach(b => b.onclick = () => { $$('#xchips button').forEach(x => x.classList.toggle('on', x === b)); $$('#xlist .xpost').forEach(p => p.hidden = b.dataset.x !== 'All' && p.dataset.topic !== b.dataset.x); });
}

/* ---------------- financials ---------------- */
function finTab() {
  const r = (l, a) => [l, ...a];
  const rows = [r('Total revenue', F.rev), r('Automotive revenue', F.auto), r('Energy generation & storage revenue', F.energy), r('Services & other revenue', F.services), r('Gross profit', F.gp), r('Total GAAP gross margin', F.tgm.map(v => v == null ? null : v + '%')),
    r('Research & development', F.rd), r('SG&A', F.sga), r('Income from operations', F.opinc), r('Operating margin', F.opm.map(v => v == null ? null : v + '%')), r('Adjusted EBITDA (non-GAAP)', F.ebitda), r('Net income (GAAP)', F.ni), r('Net income (non-GAAP)', F.ni_ng), r('EPS diluted (GAAP)', F.eps), r('EPS diluted (non-GAAP)', F.eps_ng),
    {section: 'Cash flow & balance sheet'}, r('Operating cash flow', F.ocf), r('Capital expenditures', F.capex), r('Free cash flow', F.fcf), r('Cash & short-term investments', F.cash), r('Property, plant & equipment, net', F.ppe), r('Inventory', F.inv), r('Diluted shares (m)', F.dil_sh)];
  const C3 = D.consensus;
  sec('fin').innerHTML = `<h2>Financials <span class="mut">segments and cash flow · US$m</span></h2>
  <div class="grid g4" style="margin-bottom:16px">
    ${kpi('Q3 2026 revenue', mm(F.rev[5]), `${pct((F.rev[5] / F.rev[1] - 1) * 100)} YoY · Tesla consensus US$28,341m`, U.q3deck)}${kpi('Q3 2026 operating margin', F.opm[5] + '%', `vs ${F.opm[1]}% a year earlier · consensus 2.5%`, U.q3deck)}${kpi('Q3 2026 capex', mm(-F.capex[5]), `${pct((F.capex[5] / F.capex[1] - 1) * 100)} YoY · 2026 guide ~US$20bn`, U.q3call)}${kpi('Q3 2026 free cash flow', mm(F.fcf[5]), `cash ${bn(F.cash[5])}`, U.q3deck)}</div>
  <div class="grid g2" style="margin-bottom:16px">${ccard('fiCf', 'Operating cash flow, capex and free cash flow (US$m)', 'per quarter')}${ccard('fiMg', 'Margins (%)', 'gross, auto ex-credits, operating')}</div>
  ${tableBlock({title: 'Income statement, cash flow and balance sheet', columns: ['US$m', ...D.fcols], rows}, {id: 'tFin', csvname: 'TSLA financials', colorLatest: true, noLatest: true, notes: ['Source: Tesla Q3 2026 update (financial summary, statement of operations, balance sheet, cash flows; Q3 2025–Q3 2026) ' + U.q3deck + ' ; also filed as 8-K exhibit 99.1 ' + U.q3_8k + ' . Q2 2025 from the Q2 2026 update ' + U.q2deck, 'Figures are from the unaudited update deck; the Q3 2026 10-Q was filed 21 Oct 2026 ' + U.q3_10q]})}
  ${tableBlock({title: `Q3 2026 and FY2026 consensus (company-compiled, ${C3.n} analysts, ${C3.asof})`, columns: ['Line', 'Q3 2026 average', 'Q3 2026 actual', 'FY2026 average'], rows: C3.rows.map((r, k) => [r[0], r[1], D.actual.q3[k], r[2]])}, {id: 'tCons', notes: ['Source: Tesla IR “Q3 2026 Earnings Consensus” ' + C3.src + ' . Tesla does not endorse these estimates. Actuals: Q3 2026 update ' + U.q3deck + ' . Street (third-party) consensus per Investing.com: non-GAAP EPS US$0.45, revenue US$27.92bn ' + D.actual.street_src]})}`;
  chart('fiCf', {type: 'bar', data: {labels: D.fcols.map(qs), datasets: [{label: 'Operating cash flow', data: F.ocf, backgroundColor: C.g3}, {label: 'Capex', data: F.capex, backgroundColor: C.g2}, {label: 'Free cash flow', data: F.fcf, backgroundColor: C.acc}]}, options: {plugins: {tooltip: {callbacks: {label: c => `${c.dataset.label}: ${mm(c.raw)}`}}}}});
  chart('fiMg', {type: 'line', data: {labels: D.fcols.map(qs), datasets: [{label: 'Total gross margin', data: F.tgm, borderColor: C.g2, backgroundColor: C.g2}, {label: 'Auto GM ex-credits', data: F.agm_x, borderColor: C.acc, backgroundColor: C.acc}, {label: 'Operating margin', data: F.opm, borderColor: C.g, backgroundColor: C.g}]}, options: {scales: {y: {ticks: {callback: v => v + '%'}}}}});
}

/* ---------------- valuation & street ---------------- */
function valTab() {
  const P = D.price, S = D.street;
  sec('val').innerHTML = `<h2>Valuation & Street <span class="mut">multiples vs peers, analyst targets</span></h2>
  <div class="grid g4" style="margin-bottom:16px">
    ${kpi('P/E trailing / forward', `${fmt(P.pe, 0)}x / ${fmt(P.fpe, 0)}x`, `close ${dlong(P.close_date)}`, P.src)}${kpi('EV / sales · EV / EBITDA', `${P.evs}x · ${fmt(P.eve, 0)}x`, 'LTM', P.src)}
    ${kpi('Average price target', 'US$' + S.tip.avg, `TipRanks · ${S.tip.buy} buy / ${S.tip.hold} hold / ${S.tip.sell} sell`, S.tip.src)}${kpi('Options-implied move', '±' + S.implied_move + '%', 'around Q3 results (TipRanks)', S.tip.src)}</div>
  <div class="grid g2" style="margin-bottom:16px">${ccard('vaEv', 'EV / sales vs peers (x)', 'LTM · StockAnalysis (S&P Global MI)')}${ccard('vaPe', 'Forward P/E vs peers (x)', 'n/a for loss-making Rivian')}</div>
  ${tableBlock({title: 'Peer multiples', columns: ['Company', 'Market cap', 'P/E (ttm)', 'P/E (fwd)', 'EV/sales', 'EV/EBITDA', 'Gross margin %', 'Price', 'Source'], rows: D.peers}, {id: 'tPeer', notes: ['Source: StockAnalysis.com statistics pages (data from S&P Global Market Intelligence), checked 21 Oct 2026 (SGT). Third-party; BYD in HKD.']})}
  ${tableBlock({title: 'Recent analyst actions', columns: ['Date', 'Firm', 'Rating', 'Target', 'Source'], rows: S.actions}, {id: 'tAn', notes: [`Third-party compilations: TeslaNewsWire ${S.src} and TipRanks ${S.tip.src} . Range of targets in MarketBeat data: US$${S.lo} (GLJ Research) to US$${S.hi} (Morgan Stanley, rating unconfirmed). StockAnalysis: average US$${D.street.sa.avg} from ${D.street.sa.n} analysts.`]})}`;
  const pr = D.peers;
  chart('vaEv', {type: 'bar', data: {labels: pr.map(r => r[0]), datasets: [{label: 'EV / sales', data: pr.map(r => r[4]), backgroundColor: pr.map((r, k) => k ? C.g3 : C.acc)}]}, options: {indexAxis: 'y', plugins: {legend: {display: false}}, scales: {x: {type: 'logarithmic'}}}});
  chart('vaPe', {type: 'bar', data: {labels: pr.map(r => r[0]), datasets: [{label: 'Forward P/E', data: pr.map(r => r[3]), backgroundColor: pr.map((r, k) => k ? C.g3 : C.acc)}]}, options: {indexAxis: 'y', plugins: {legend: {display: false}}, scales: {x: {type: 'logarithmic'}}}});
}

/* ---------------- ownership, insiders, short interest ---------------- */
function ownTab() {
  const H = D.holders, S = D.si, n = S.m.length - 1;
  sec('own').innerHTML = `<h2>Ownership <span class="mut">holders, insiders, short interest</span></h2>
  <div class="grid g4" style="margin-bottom:16px">
    ${kpi('Elon Musk', D.musk.own_pct + '%', fmt(D.musk.own_m, 1) + 'm shares', D.musk.own_src)}${kpi('Institutions / insiders', `${H.inst_pct}% / ${H.ins_pct}%`, 'StockAnalysis (S&P Global MI)', U.sa)}
    ${kpi('Short interest', fmt(S.m[n], 1) + 'm', `${S.pct[n]}% of float · ${S.dtc[n]} days to cover · ${dlong(S.dates[n])}`, S.src)}${kpi('Change vs prior report', pct((S.m[n] / S.m[n - 1] - 1) * 100), `${fmt(S.m[n - 1], 1)}m on ${dlong(S.dates[n - 1])}`, S.src)}</div>
  <div class="grid g2" style="margin-bottom:16px">${ccard('owHold', 'Largest holders (% of shares outstanding)', H.asof)}${ccard('owSi', 'Short interest (m shares) and days to cover', 'twice-monthly settlement dates')}</div>
  ${tableBlock({title: 'Major holders', columns: ['Holder', 'Shares (m)', '% of shares out', 'Filing date'], rows: H.rows}, {id: 'tHold', notes: ['Source: StocksGuide aggregation of 13F/13D/Form 4 filings ' + H.src + ' (third-party). 13F positions are as of quarter end, not current.']})}
  ${tableBlock({title: 'Insider transactions (2026)', columns: ['Date', 'Insider', 'Code', 'Shares', 'Price', 'Note', 'Source'], rows: D.insiders}, {id: 'tIns', wrap: true, notes: ['All Tesla Form 4 filings: ' + U.taneja]})}
  ${tableBlock({title: 'Short interest history', columns: ['Settlement', 'Short interest (m)', '% of float', 'Days to cover'], rows: S.dates.map((d, k) => [dlong(d), S.m[k], S.pct[k] + '%', S.dtc[k]]).reverse()}, {id: 'tSI', notes: ['Source: MarketBeat, from FINRA exchange short-interest data ' + S.src + ' ; FINRA catalog ' + U.finra]})}`;
  chart('owHold', {type: 'bar', data: {labels: H.rows.slice(0, 10).map(r => r[0]), datasets: [{label: '% of shares out', data: H.rows.slice(0, 10).map(r => r[2]), backgroundColor: H.rows.slice(0, 10).map((r, k) => k ? C.g3 : C.acc)}]}, options: {indexAxis: 'y', plugins: {legend: {display: false}}}});
  chart('owSi', {data: {labels: S.dates.map(d => dlong(d).replace(' 20', " '")), datasets: [{type: 'bar', label: 'Short interest (m)', data: S.m, backgroundColor: C.acc, yAxisID: 'y'}, {type: 'line', label: 'Days to cover', data: S.dtc, borderColor: C.g2, backgroundColor: C.g2, yAxisID: 'y1'}]}, options: {scales: {y1: {position: 'right', grid: {display: false}}}}});
}

/* ---------------- competition ---------------- */
function compTab() {
  const K = D.comp;
  sec('comp').innerHTML = `<h2>China & competition <span class="mut">BYD and the Chinese NEV market</span></h2>
  <div class="grid g4" style="margin-bottom:16px">
    ${kpi('BYD Q3 2026 passenger BEVs', fmt(K.q3[0][1]), `${K.q3[0][2]} · ${fmt(K.q3[0][1] / K.q3[1][1], 2)}x Tesla’s deliveries`, U.byd)}
    ${kpi('Tesla China share (Sep)', '6.0%', 'NEV retail, 4th place · 64,837 units', U.cpca)}
    ${kpi('BYD China share (Sep)', '22.8%', 'NEV retail · 246,816 units', U.cpca)}
    ${kpi('BYD BEV passenger sales (Sep)', fmt(K.bydsep_bev), '+33.2% YoY · 9M NEV total ' + fmt(K.byd9m), U.bydsep)}</div>
  <div class="grid g2" style="margin-bottom:16px">${ccard('coQ3', 'Q3 2026 battery-electric volumes', 'BYD passenger BEV vs Tesla deliveries')}${ccard('coCn', 'China NEV retail share, September 2026 (%)', 'CPCA · domestic retail, excl. exports')}</div>
  ${tableBlock({title: 'China NEV retail, September 2026 (CPCA)', columns: ['Maker / group', 'Retail sales', 'Share %'], rows: K.cn_sep}, {id: 'tCn', notes: [`Total NEV retail ${K.cn_total}m (−16.7% YoY). Source: CPCA via CnEVPost ${U.cpca} . CPCA ranks groups, domestic retail only.`]})}
  ${tableBlock({title: 'Valuation gap', columns: ['Company', 'Market cap', 'P/E (ttm)', 'P/E (fwd)', 'EV/sales', 'EV/EBITDA', 'Gross margin %', 'Price', 'Source'], rows: D.peers.slice(0, 2)}, {id: 'tGap'})}`;
  chart('coQ3', {type: 'bar', data: {labels: K.q3.map(r => r[0]), datasets: [{label: 'Units', data: K.q3.map(r => r[1]), backgroundColor: [C.g2, C.acc]}]}, options: {plugins: {legend: {display: false}}}});
  chart('coCn', {type: 'bar', data: {labels: K.cn_sep.filter(r => r[2] != null).map(r => r[0]), datasets: [{label: 'Share %', data: K.cn_sep.filter(r => r[2] != null).map(r => r[2]), backgroundColor: K.cn_sep.filter(r => r[2] != null).map(r => /Tesla/.test(r[0]) ? C.acc : C.g3)}]}, options: {indexAxis: 'y', plugins: {legend: {display: false}}}});
}

/* ---------------- catalysts ---------------- */
function catTab() {
  const now = new Date().toISOString().slice(0, 10);
  sec('catalysts').innerHTML = `<h2>Catalyst calendar <span class="mut">upcoming dated events</span></h2>
  <div class="card"><ul class="lt">${D.catalysts.map(c => `<li class="${c[0] < now && /^\d{4}-\d{2}-\d{2}$/.test(c[0]) ? 'st-passed' : ''}"><div class="h"><b>${/^\d{4}-\d{2}-\d{2}$/.test(c[0]) ? esc(dlong(c[0])) : esc(c[0])}</b><span class="pill upcoming">${esc(c[1])}</span></div><div>${esc(c[2])} · ${ext(c[3])}</div></li>`).join('')}</ul></div>
  ${weekCard()}`;
}

/* ---------------- sources ---------------- */
function sources() {
  const L = Object.entries(D.U).map(([k, u]) => [k, u]);
  sec('sources').innerHTML = `<h2>Sources <span class="mut">every link used in this build</span></h2>
  ${tableBlock({columns: ['Key', 'URL'], rows: L}, {id: 'tSrc', wrap: true, notes: ['Primary sources: Tesla IR updates and SEC filings, NHTSA, tesla.com, company X accounts. Third-party sources (StockAnalysis, MarketBeat, StocksGuide, TipRanks, CnEVPost, news sites) are labelled where used.', `Data built ${D.meta.built_sgt}. X feed fetched ${(window.XFEED || {}).fetched_sgt || 'n/a'}.`]})}`;
}

/* ---------------- router & theme ---------------- */
const TABS = [['overview', 'Overview', overview], ['autos', 'Autos', autosTab], ['energy', 'Energy', energyTab], ['robotaxi', 'Cybercab & Robotaxi', robotaxiTab], ['fsd', 'FSD', fsdTab], ['optimus', 'Optimus', optimusTab],
  ['people', 'Key people', peopleTab], ['fin', 'Financials', finTab], ['val', 'Valuation & Street', valTab], ['own', 'Ownership', ownTab], ['comp', 'China & competition', compTab], ['catalysts', 'Catalysts', catTab], ['video', 'YouTube / video', videoTab], ['sources', 'Sources', sources]];
const NAVL = {overview: 'Overview', autos: 'Autos', energy: 'Energy', robotaxi: 'Cybercab', fsd: 'FSD', optimus: 'Optimus', people: 'Key people', fin: 'Financials', val: 'Valuation', own: 'Ownership', comp: 'Competition', catalysts: 'Catalysts', video: 'Video', sources: 'Sources'};
const done = {}; let CDT = null;
function cdText(t) { let s = Math.max(0, Math.floor((t - new Date()) / 1000)); const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
  const u = ['d', 'h', 'm', 's'];
  return `${d}<small>${u[0]}</small>${String(h).padStart(2, '0')}<small>${u[1]}</small>${String(m).padStart(2, '0')}<small>${u[2]}</small>${String(s).padStart(2, '0')}<small>${u[3]}</small>`; }
function route() {
  let id = (location.hash || '#overview').slice(1).split('/')[0]; if (!TABS.some(t => t[0] === id)) id = 'overview';
  $$('#nav a').forEach(a => { const on = a.dataset.t === id; a.classList.toggle('on', on); if (on) a.scrollIntoView({block: 'nearest', inline: 'center'}); });
  $$('main section').forEach(s => s.classList.toggle('on', s.id === 's-' + id));
  const t = TABS.find(t => t[0] === id);
  if (!done[id]) { try { t[2](); } catch (e) { console.error('render ' + id, e); sec(id).insertAdjacentHTML('beforeend', `<div class="tvfail">This tab could not render: ${esc(e.message)}</div>`); } done[id] = 1; wireTables(sec(id)); wireXall(sec(id)); try { I18N.apply(sec(id)); } catch (e) { console.error('i18n ' + id, e); } }
  document.title = tl(`${t[1]} · Tesla (TSLA) Dashboard · © 2026 Hugo Tian`);
}
function buildNav() { $('#nav').innerHTML = TABS.map(([id, l]) => `<a href="#${id}" data-t="${id}" title="${esc(l)}">${esc(NAVL[id] || l)}</a>`).join(''); $('#main').innerHTML = TABS.map(([id]) => `<section id="s-${id}"></section>`).join(''); I18N.apply($('#nav')); chrome(); }
function chrome() {
  $('.hero h1').innerHTML = tl('Tesla <span class="tk">$TSLA</span> Dashboard'); $('.brand .bn').textContent = tl('Dashboard');
  $('.brand').setAttribute('aria-label', tl('Tesla dashboard home'));


  $('#themebtn').title = tl('Theme: follows your system until you pick one'); }
function applyTheme(rerender) {
  const t = document.documentElement.dataset.theme || 'auto';
  $('#themelbl').textContent = t === 'auto' ? tl('Auto') : t === 'dark' ? tl('Dark') : tl('Light'); $('#themeic').textContent = t === 'auto' ? '◐' : t === 'dark' ? '☾' : '☀';
  if (!rerender) return; palette(); Object.keys(charts).forEach(k => { try { charts[k].destroy(); } catch (e) {} delete charts[k]; }); for (const k in done) delete done[k]; buildNav(); hero(); route();
}
$('#themebtn').onclick = () => { const cur = document.documentElement.dataset.theme || 'auto'; const nx = cur === 'auto' ? (isDark() ? 'light' : 'dark') : cur === 'dark' ? 'light' : 'auto';
  if (nx === 'auto') { delete document.documentElement.dataset.theme; try { localStorage.removeItem('tsla-theme'); } catch (e) {} } else { document.documentElement.dataset.theme = nx; try { localStorage.setItem('tsla-theme', nx); } catch (e) {} } applyTheme(true); };


if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!document.documentElement.dataset.theme) applyTheme(true); });
$('#foot').innerHTML = `© 2026 Hugo Tian. All rights reserved. · Not investment advice.`;
palette(); Chart.defaults.devicePixelRatio = Math.max(2, window.devicePixelRatio || 1); buildNav(); applyTheme(false); hero(); route(); addEventListener('hashchange', route);
