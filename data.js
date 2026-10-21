// Tesla dashboard data. Every figure carries a source link. "pending" = not disclosed / not yet reported.
const S={
 q3pdd:'https://ir.tesla.com/press-release/tesla-third-quarter-2026-production-deliveries-and-deployments',
 q1deck:'https://assets-ir.tesla.com/tesla-contents/IR/TSLA-Q1-2026-Update.pdf',
 q2deck:'https://assets-ir.tesla.com/tesla-contents/IR/TSLA-Q2-2026-Update.pdf',
 q4pdd:'https://www.sec.gov/Archives/edgar/data/1318605/000162828026000016/exhibit9914.htm',
 cnbcq3:'https://www.cnbc.com/2026/10/02/tesla-tsla-q3-2026-vehicle-delivery-production.html',
 reutq2:'https://ca.investing.com/news/stock-market-news/elon-musks-tesla-posts-cash-burn-as-capex-surges-on-ai-robotaxi-push-4747467',
 yahooq2:'https://finance.yahoo.com/markets/stocks/articles/tesla-q2-2026-earnings-revenue-203906234.html',
 evwire:'https://evwire.com/p/tesla-fsd-record-attach-rate-q2-2026',
 fsdtrk:'https://finebutwhy.com/fsd/',
 cnchina:'https://carnewschina.com/2026/05/21/tesla-officially-confirms-fsd-supervised-support-for-china-market/',
 nhtsa:'https://static.nhtsa.gov/odi/inv/2026/INOA-EA26002-10023.pdf',
 nhtsa2:'https://teslarobotaxi.com/nhtsa-fsd-visibility-probe-still-open/',
 tnorth:'https://teslanorth.com/2026/10/19/tesla-q3-2026-top-investor-questions/',
 electrekOpt:'https://electrek.co/2026/08/20/tesla-jpmorgan-fremont-fsd-v15-hw4-optimus-2027/',
 cabDallas:'https://eletric-vehicles.com/tesla/teslas-cybercab-is-coming-to-dallas-soon-exec-says/',
 cnbcCab:'https://www.cnbc.com/2026/10/03/tesla-cybercab-pressure-to-expand-after-rocky-first-month-in-austin.html',
 batman:'https://www.batmangarage.com/news/tesla-robotaxi-cybercab.html',
 si:'https://www.marketbeat.com/stocks/NASDAQ/TSLA/short-interest/',
 taneja:'https://www.stocktitan.net/sec-filings/TSLA/form-4-tesla-inc-insider-trading-activity-67686d1b95c9.html',
 merger:'https://techcrunch.com/2026/10/20/spacex-and-tesla-boards-form-special-committees-to-review-merger/',
 lookup:'https://www.lookupaplate.com/blog/tesla-fsd-statistics/'
};
const Q=['Q1-25','Q2-25','Q3-25','Q4-25','Q1-26','Q2-26','Q3-26'];
const D={
 prod:[362615,410244,447450,434358,408386,null,464391],
 deliv:[336681,384122,497099,418227,358023,480126,486532],
 prodSrc:[S.q1deck,S.q1deck,S.q1deck,S.q1deck,S.q1deck,null,S.q3pdd],
 storage:[10.4,9.6,12.5,14.2,8.8,13.5,13.7],
 fsdSubs:[0.85,0.95,1.04,1.10,1.28,1.48,null],
 si:{dates:['2026-01-15','2026-01-30','2026-02-13','2026-02-27','2026-03-13','2026-03-31','2026-04-15','2026-04-30','2026-05-15','2026-05-29','2026-06-15','2026-06-30','2026-07-15','2026-07-31','2026-08-14','2026-08-31','2026-09-15','2026-09-30'],
     m:[64.41,64.37,64.82,61.84,60.86,65.60,71.11,76.67,75.19,76.95,78.18,79.11,70.65,68.50,69.20,74.23,68.86,70.93]},
 fin:{cols:['Q3-25','Q4-25','Q1-26','Q2-26','Q3-26'],
  rows:[['Total revenue ($m)','总收入（百万美元）',[28095,24901,22387,28236,null]],
   ['Automotive revenue ($m)','汽车收入',[21205,17693,16234,20516,null]],
   ['Energy gen. & storage revenue ($m)','能源发电与储能收入',[3415,3837,2408,3139,null]],
   ['Services & other ($m)','服务及其他',[3475,3371,3745,4581,null]],
   ['Total GAAP gross margin','GAAP 总毛利率',['18.0%','20.1%','21.1%','16.8%',null]],
   ['Operating margin','营业利润率',['5.8%','5.7%','4.2%','1.4%',null]],
   ['GAAP net income ($m)','GAAP 净利润',[1373,840,477,1114,null]],
   ['Non-GAAP EPS (diluted)','非 GAAP 每股收益',[0.50,0.50,0.41,0.33,null]],
   ['Operating cash flow ($m)','经营现金流',[6238,3813,3937,4697,null]],
   ['Capex ($m)','资本开支',[-2248,-2393,-2493,-5789,null]],
   ['Free cash flow ($m)','自由现金流',[3990,1420,1444,-1092,null]],
   ['Cash & ST investments ($m)','现金及短期投资',[41647,44059,44743,43524,null]]]}
};
// Elon / Tesla dated promises vs reality
const PROMISES=[
 {d:'2024-10-10',w:'Cybercab unveiled at We, Robot; production "before 2027" / about two years out',r:'Cybercab production started at Giga Texas (stated on Q2-26 call); paid public rides in Austin from 2026-09-04',st:'met',src:S.cabDallas},
 {d:'2026-01 (Q4-25 deck)',w:'Unsupervised Robotaxi in seven US cities in 1H-2026',r:'Six cities by Jul-2026: Austin, Dallas, Houston (18 Apr), Miami (3 Jul), Orlando, Tampa (21 Jul)',st:'behind',src:S.batman},
 {d:'2026-04-23 (Q1 call)',w:'CFO: aim for full FSD approval in China by Q3-2026',r:'No customer rollout or monthly subscription in China as of Oct-2026',st:'behind',src:S.cnchina},
 {d:'Earlier (Musk)',w:'5,000 Optimus robots built "last year" (2025)',r:'Only a few test robots; Gen 3 reveal repeatedly pushed; external sales "as early as" 2H-2027',st:'missed',src:S.electrekOpt},
 {d:'2026-10-10',w:'Ashok Elluswamy: Cybercab to Dallas "soon"',r:'No date; tracker shows 0 Cybercabs in Dallas (67 Model Ys)',st:'pending',src:S.cabDallas}
];
const QUOTES=[
 {who:'Ashok Elluswamy',role:'VP AI Software',d:'2026-10-10',t:'Two years since the 10/10 Cybercab WeRobot event, the cabs are everywhere in Austin now. Dallas soon.',zh:'距 10/10 Cybercab WeRobot 发布会已两年，如今奥斯汀到处都是 Cybercab。达拉斯即将上线。',u:'https://x.com/aelluswamy/status/2108986941127696515'},
 {who:'Ashok Elluswamy',role:'VP AI Software',d:'2026-10-10',t:'Announced that the Cybercab will be here in two years exactly two years ago this day. We are learning to be on time 😂',zh:'两年前的今天我们宣布 Cybercab 将在两年内到来。我们正在学会准时 😂',u:'https://x.com/aelluswamy/status/2108984867417657648'},
 {who:'Elon Musk',role:'CEO',d:'2026-10-03',t:'Robotaxi operating hours moved from 10pm to 11pm. The main thing we’re trying to solve is making sure that we don’t run over pets when they’re hard to see at night.',zh:'Robotaxi 运营时间从晚上10点延长到11点。我们主要在解决夜间难以看清宠物时不碾压它们的问题。',u:'https://x.com/elonmusk/status/2106239692866019479'},
 {who:'Elon Musk',role:'CEO',d:'2026-10-11',t:'Cybercab is scaling',zh:'Cybercab 正在规模化',u:'https://x.com/elonmusk/status/2109262612303314986'},
 {who:'Elon Musk',role:'CEO',d:'2026-10-16',t:'Tesla supervised self-driving approved in Slovakia 🇸🇰',zh:'特斯拉监督式自动驾驶在斯洛伐克获批 🇸🇰',u:'https://x.com/elonmusk/status/2111131436191199660'},
 {who:'Elon Musk',role:'CEO',d:'2026-10-18',t:'The new Tesla Roadster accelerates faster than a fighter jet taking off from an aircraft carrier',zh:'新款 Tesla Roadster 的加速比从航母起飞的战斗机还快',u:'https://x.com/elonmusk/status/2111838943016833235'},
 {who:'Ashok Elluswamy',role:'VP AI Software',d:'2026-10-04',t:'Tesla self-driving not only maintains safe distance to obstacles proactively, but also reacts to other people cutting into your path with super-human response times.',zh:'特斯拉自动驾驶不仅主动与障碍物保持安全距离，还能以超人的反应速度应对他人加塞。',u:'https://x.com/aelluswamy/status/2106574360182227269'},
 {who:'Lars Moravy',role:'VP Vehicle Engineering',d:'2026-09-24',t:'Super excited for Tesla Semi ROLLOUT!!!',zh:'对 Tesla Semi 量产交付超级兴奋！！！',u:'https://x.com/larsmoravy/status/2103199150779338825'},
 {who:'Elon Musk',role:'CEO (Q2-26 call)',d:'2026-07-22',t:'If we injure even one person, it will be worldwide headline news. (on scaling robotaxi carefully)',zh:'哪怕伤到一个人，都会成为全球头条。（谈审慎扩张 Robotaxi）',u:S.tnorth},
 {who:'Elon Musk',role:'CEO (Q2-26 call)',d:'2026-07-22',t:'Optimus is going to be the hardest product to scale manufacturing that we’ve ever made at Tesla … the early part of the production ramp will be quite flat and long.',zh:'Optimus 将是特斯拉有史以来最难规模化生产的产品……产能爬坡初期会相当平缓且漫长。',u:S.tnorth},
 {who:'Vaibhav Taneja',role:'CFO (Q1-26 call)',d:'2026-04-23',t:'Working closely with Chinese regulators, targeting comprehensive FSD approval in China by Q3-2026 (paraphrase, per CarNewsChina).',zh:'正与中国监管部门密切合作，目标在 2026 年第三季度前在中国获得 FSD 全面批准（转述）。',u:S.cnchina},
 {who:'Robyn Denholm',role:'Board Chair',d:'—',t:'Pending: no dated public comment captured yet in this build.',zh:'待补充：本版本尚未收录带日期的公开发言。',u:''}
];
