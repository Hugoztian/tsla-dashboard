/* ---------- language: English ⇄ Simplified Chinese (localStorage 'tsla-lang'; html[data-lang]) ----------
   Rendering stays English; when LANG==='zh' I18N.apply(root) translates each text "unit" (a block whose children are only inline
   elements) via window.TSLA_ZH (built by build_i18n.py from i18n/zh.json). Inline tags become placeholders ⟨a⟩…⟨/a⟩ and every number/date
   becomes a slot ⟦i⟧, so a sentence keeps translating when its numbers change. Quotes are translated as "English original, then 译文：…".
   Strings written by code (live price box, countdown, row counts…) use L(en, zh). */
let LANG = document.documentElement.dataset.lang === 'zh' ? 'zh' : 'en';
const tl = (en, zh) => LANG === 'zh' ? zh : en;
const I18N = (() => {
  const ZH = window.TSLA_ZH || {};
  const M = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec';
  const TOK = new RegExp(`\\b(\\d{1,2}) (${M}) '(\\d{2})\\b|\\b(\\d{1,2}) (${M}) (\\d{4})\\b|\\b(${M})[a-z]*\\.? (\\d{1,2}), (\\d{4})\\b|\\b(${M}) (\\d{4})\\b|\\b(${M}) (\\d{1,2})\\b|\\b(\\d{1,2}) (${M})\\b|\\d+(?:[.,]\\d+)*`, 'g');
  const MI = m => M.split('|').indexOf(m) + 1;
  const zhTok = t => { let r;
    if ((r = t.match(new RegExp(`^(\\d{1,2}) (${M}) (\\d{4})$`)))) return `${r[3]}年${MI(r[2])}月${+r[1]}日`;
    if ((r = t.match(new RegExp(`^(\\d{1,2}) (${M}) '(\\d{2})$`)))) return `20${r[3]}年${MI(r[2])}月${+r[1]}日`;
    if ((r = t.match(new RegExp(`^(${M})[a-z]*\\.? (\\d{1,2}), (\\d{4})$`)))) return `${r[3]}年${MI(r[1])}月${+r[2]}日`;
    if ((r = t.match(new RegExp(`^(${M}) (\\d{4})$`)))) return `${r[2]}年${MI(r[1])}月`;
    if ((r = t.match(new RegExp(`^(${M}) (\\d{1,2})$`)))) return `${MI(r[1])}月${+r[2]}日`;
    if ((r = t.match(new RegExp(`^(\\d{1,2}) (${M})$`)))) return `${MI(r[2])}月${+r[1]}日`;
    return t; };
  const key = s => s.replace(TOK, '⟦⟧');
  const toks = s => s.match(TOK) || [];
  const fill = (tpl, s) => { const v = toks(s); return tpl.replace(/⟦(\d+)⟧/g, (_, i) => v[+i] != null ? zhTok(v[+i]) : ''); };
  const INLINE = new Set(['A', 'B', 'STRONG', 'I', 'EM', 'SPAN', 'SMALL', 'SUP', 'SUB', 'BR', 'CODE', 'ABBR', 'U', 'S', 'MARK', 'TIME']);
  const SKIP = 'script,style,canvas,svg,.tradingview-widget-container,.tvq,#tvchart,.notr,#foot,#updated,.zhq,input,textarea,select,[data-cd],#lq-k,#lq-px,#lq-ch,#lq-sub,#lq-cap,#ipo-v,#lfstat,#muskcd,#themebtn,#langbtn';
  const ph = i => { let s = ''; i++; while (i > 0) { const r = (i - 1) % 26; s = String.fromCharCode(97 + r) + s; i = Math.floor((i - 1) / 26); } return s; };
  const escT = s => s.replace(/[&<>]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;'}[c]));
  const voidish = el => el.matches('i.i,[data-tip]') || el.matches(SKIP) || (!el.childNodes.length);
  /* element -> {src: English HTML with placeholders, tags: [[open, close] | [whole]]} */
  function unitOf(el) {
    const tags = []; const walk = n => { let s = '';
      n.childNodes.forEach(c => {
        if (c.nodeType === 3) s += escT(c.nodeValue);
        else if (c.nodeType === 1) { const i = tags.length;
          if (voidish(c)) { tags.push([c.outerHTML]); s += `⟨${ph(i)}/⟩`; }
          else { const o = c.outerHTML, inner = c.innerHTML; const open = o.slice(0, o.length - inner.length - c.tagName.length - 3); tags.push([open, `</${c.tagName.toLowerCase()}>`]); s += `⟨${ph(i)}⟩` + walk(c) + `⟨/${ph(i)}⟩`; } } });
      return s; };
    return {src: walk(el), tags};
  }
  function rebuild(tpl, tags) {
    return tpl.replace(/⟨(\/?)([a-z]+)(\/?)⟩/g, (m, cl, id, vo) => { let i = 0; for (const ch of id) i = i * 26 + (ch.charCodeAt(0) - 96); const t = tags[i - 1]; if (!t) return '';
      return vo ? t[0] : cl ? (t[1] || '') : t[0]; });
  }
  const norm = s => s.replace(/\s+/g, ' ').trim();
  const fmtQ = h => h.replace(/\n译文：([\s\S]*)$/, '<br><span class="zhq">译文：$1</span>').replace(/\n/g, '<br>');
  const COL = window.__I18N_COLLECT = window.__I18N_COLLECT || null, MISS = window.__I18N_MISS = new Set();
  function look(src) { const k = key(src); if (COL) COL.add(src); const t = ZH[k]; if (t == null) { if (/[A-Za-z]{2}/.test(src.replace(/⟨[^⟩]*⟩/g, ''))) MISS.add(src); return null; } return t === '=' ? null : fill(t, src).replace('{EN}', () => src); }
  function trUnit(el) {
    const u = unitOf(el); const lead = u.src.match(/^\s*/)[0], trail = u.src.match(/\s*$/)[0]; const src = norm(u.src);
    if (!/[A-Za-z]{2}/.test(src.replace(/⟨[^⟩]*⟩/g, ''))) return;
    const t = look(src); if (t == null) return;
    let h = rebuild(fmtQ(t), u.tags); const i = h.indexOf('<br><span class="zhq">');
    if (i >= 0 && el.matches('blockquote')) h = `<span class="qen">${h.slice(0, i)}</span>${h.slice(i + 4)}`;
    el.innerHTML = lead + h + trail;
  }
  function trText(n) { const s = n.nodeValue; const src = norm(escT(s)); if (!/[A-Za-z]{2}/.test(src)) return; const t = look(src); if (t == null) return;
    const span = document.createElement('span'); span.innerHTML = (s.match(/^\s*/)[0] ? ' ' : '') + fmtQ(t) + (s.match(/\s*$/)[0] ? ' ' : ''); n.replaceWith(...span.childNodes); }
  const isBlockish = el => [...el.querySelectorAll('*')].some(d => !INLINE.has(d.tagName) && !d.closest('i.i,[data-tip]'));
  function visit(el) {
    if (el.nodeType !== 1 || el.matches(SKIP)) return;
    if (el.dataset && el.dataset.tip) trTip(el);
    if (!isBlockish(el) && /[A-Za-z]{2}/.test(el.textContent)) { el.querySelectorAll('[data-tip]').forEach(trTip); if (!el.matches('[data-tip]')) trUnit(el); return; }
    [...el.childNodes].forEach(c => { if (c.nodeType === 3) { if (/[A-Za-z]{2}/.test(c.nodeValue)) trText(c); } else visit(c); });
  }
  function trTip(el) { if (el.dataset.tipDone) return; const tpl = document.createElement('div'); tpl.innerHTML = el.dataset.tip; const u = unitOf(tpl); const src = norm(u.src); const t = look(src); el.dataset.tipDone = 1; if (t != null) el.dataset.tip = rebuild(fmtQ(t), u.tags); }
  function attrs(root) { root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el => ['placeholder', 'title', 'aria-label'].forEach(a => { const v = el.getAttribute(a); if (!v || !/[A-Za-z]{2}/.test(v) || el.closest('.tradingview-widget-container')) return; const t = look(norm(escT(v))); if (t != null) { const d = document.createElement('textarea'); d.innerHTML = t.replace(/\n译文：[\s\S]*$/, ''); el.setAttribute(a, d.value); } })); }
  function apply(root) { if (!root || (LANG !== 'zh' && !COL)) return; if (LANG !== 'zh') { collectOnly(root); return; } visit(root); attrs(root); }
  function collectOnly(root) { /* English pass that only records units (for build_i18n.py) */
    const walk = el => { if (el.nodeType !== 1 || el.matches(SKIP)) return; if (el.dataset && el.dataset.tip) { const d = document.createElement('div'); d.innerHTML = el.dataset.tip; COL.add(norm(unitOf(d).src)); }
      if (!isBlockish(el) && /[A-Za-z]{2}/.test(el.textContent)) { el.querySelectorAll('[data-tip]').forEach(x => { const d = document.createElement('div'); d.innerHTML = x.dataset.tip; COL.add(norm(unitOf(d).src)); }); if (!el.matches('[data-tip]')) { const s = norm(unitOf(el).src); if (/[A-Za-z]{2}/.test(s.replace(/⟨[^⟩]*⟩/g, ''))) COL.add(s); } return; }
      [...el.childNodes].forEach(c => { if (c.nodeType === 3) { const s = norm(escT(c.nodeValue)); if (/[A-Za-z]{2}/.test(s)) COL.add(s); } else walk(c); }); };
    walk(root); root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el => ['placeholder', 'title', 'aria-label'].forEach(a => { const v = el.getAttribute(a); if (v && /[A-Za-z]{2}/.test(v) && !el.closest('.tradingview-widget-container')) COL.add(norm(escT(v))); })); }
  /* plain strings (chart labels, titles) */
  function s(str) { if (str == null || typeof str !== 'string') return str; if (COL) COL.add(norm(escT(str))); if (LANG !== 'zh') return str; const src = norm(escT(str)); const t = look(src); if (t == null) return str; const d = document.createElement('textarea'); d.innerHTML = t.replace(/\n译文：[\s\S]*$/, ''); return d.value; }
  function chartCfg(cfg) { if (LANG !== 'zh' && !COL) return cfg; const d = cfg.data || {};
    if (Array.isArray(d.labels)) d.labels = d.labels.map(x => Array.isArray(x) ? x.map(s) : s(x));
    (d.datasets || []).forEach(ds => { ds.label = s(ds.label); });
    const o = cfg.options || {}; const p = o.plugins || {}; if (p.title && p.title.text) p.title.text = s(p.title.text);
    Object.values(o.scales || {}).forEach(sc => { if (sc.title && sc.title.text) sc.title.text = s(sc.title.text); });
    return cfg; }
  return {apply, s, chartCfg, key, toks, zhTok, tvLocale: () => LANG === 'zh' ? 'zh_CN' : 'en'};
})();
