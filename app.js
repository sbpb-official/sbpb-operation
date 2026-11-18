/* ---------- page shell + public snapshot block ---------- */
const PAGE_HEAD="<title>SBPB 운영실<\/title>\n<meta name=\"claude:viewport-fit-sides\" content=\"cover\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..100,500..800&family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap\">\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js\"><\/script>\n";
const SHELL="\n<header class=\"top\">\n  <div class=\"top-in\">\n    <a class=\"brand\" href=\"#home\" aria-label=\"SBPB 운영실 대시보드\"><img src=\"logo-t-dark.png\" alt=\"SBPB Tennis Club\" width=\"87\" height=\"58\"><div class=\"sub\"><b>운영실<\/b>사방팔방<\/div><\/a>\n    <nav class=\"tabs\" id=\"tabs\">\n      <a href=\"#home\">대시보드<\/a>\n      <a href=\"#members\">회원<\/a>\n      <a href=\"#draw\">대진표<\/a>\n      <a href=\"#events\">이벤트<\/a>\n      <a href=\"#courts\">코트<\/a>\n      <a href=\"#money\">정산<\/a>\n      <a href=\"#settings\">설정<\/a>\n    <\/nav>\n    <div class=\"conn\" id=\"conn\"><i><\/i><span>연결 중<\/span><\/div>\n  <\/div>\n<\/header>\n<main id=\"view\"><\/main>\n<div id=\"gate\" class=\"gate\" hidden><form class=\"gate-card\" id=\"gate-form\"><img src=\"logo-g-xl.png\" alt=\"SBPB Tennis Club\" width=\"260\" height=\"173\"><div><h2>사방팔방 운영실<\/h2><p>운영진 비밀번호 입력<\/p><\/div><div class=\"pwrow\"><input class=\"in\" type=\"password\" id=\"gate-pw\" autocomplete=\"current-password\" placeholder=\"비밀번호\" aria-label=\"비밀번호\"><button type=\"button\" class=\"btn\" id=\"gate-eye\" aria-label=\"비밀번호 보기\">보기<\/button><\/div><button class=\"btn pri\" type=\"submit\" style=\"padding:10px\">입장하기<\/button><div class=\"err\" id=\"gate-err\" role=\"alert\"><\/div><p>2시간 미사용 시 재입력 필요<\/p><\/form><\/div>\n<div id=\"modal-root\"><\/div>\n<button type=\"button\" class=\"theme-fab\" id=\"theme-fab\" data-act=\"theme\" aria-label=\"화면 모드 전환\"><svg class=\"i-sun\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4.2\"/><path d=\"M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6\"/><\/svg><svg class=\"i-moon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z\"/><\/svg><\/button>\n\n";
const SKEL='<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>';
document.body.insertAdjacentHTML('afterbegin',SHELL);
(function(){if(!/iPhone|iPad|iPod/.test(navigator.userAgent)&&!(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))return;
  let m=document.querySelector('meta[name=viewport]');if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m)}
  m.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover,interactive-widget=overlays-content')})();
(function(){try{const t=localStorage.getItem('sbpb-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}})();
(function(){const r=document.documentElement;function sync(){const v=window.visualViewport;if(!v)return;r.style.setProperty('--vvh',v.height+'px');r.style.setProperty('--vvt',v.offsetTop+'px')}
  if(window.visualViewport){visualViewport.addEventListener('resize',sync);visualViewport.addEventListener('scroll',sync)}sync()})();
const WEB=!!window.SBPB_WEB;
// show what broke instead of a blank page (send a screenshot of this box)
function showFatal(msg){try{const v=document.getElementById('view');const box=`<div class="banner" style="border-color:var(--bad);white-space:pre-wrap;word-break:break-all"><b>화면 오류</b> · 이 화면을 캡처해서 보내 주세요<br>${String(msg).replace(/[<>&]/g,'')}<br><button class="btn sm" onclick="location.reload()">새로고침</button></div>`;if(v&&!v.querySelector('.fatal')){v.insertAdjacentHTML('afterbegin','<div class="fatal">'+box+'</div>')}}catch(e){}}
// only errors from this app's own code (browsers hide other sites' script errors as "Script error.")
window.addEventListener('error',e=>{if(!e.filename||!/\/app\.js/.test(e.filename))return;showFatal((e.message||'오류')+' @app.js:'+e.lineno)});   // standalone web app (Firebase) — window.SBPB_WEB is set by index.html
let PUB={};try{PUB=window.SBPB_PUB||JSON.parse(document.getElementById('sbpb-pub').textContent||'{}')}catch(e){PUB={}}
// publish the encrypted public snapshot: web → Firestore doc, artifact → republish the page
async function savePub(pub){if(WEB){await window.SBPB_WEB.savePub(pub);PUB=pub;setConn();render();return}return art.publish(buildPage(pub))}
function buildPage(pub){
  return SKEL+'\n'+PAGE_HEAD+'<style id="css">'+document.getElementById('css').textContent+'</style>\n<script type="application/json" id="sbpb-pub">'+JSON.stringify(pub).replace(/</g,'\\u003c')+'<\/script>\n<script id="app">'+document.getElementById('app').textContent+'<\/script>\n</body></html>';
}
/* ---------- crypto (PBKDF2 -> AES-GCM) ---------- */
const TE=new TextEncoder(),TD=new TextDecoder();
function u8b64(u8){let s='';for(let i=0;i<u8.length;i+=0x8000)s+=String.fromCharCode.apply(null,u8.subarray(i,i+0x8000));return btoa(s)}
function b64u8(b){const s=atob(b);const u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
async function deriveKey(pw,saltB64){const base=await crypto.subtle.importKey('raw',TE.encode(pw),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:b64u8(saltB64),iterations:200000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},true,['encrypt','decrypt'])}
async function exportKey(k){return u8b64(new Uint8Array(await crypto.subtle.exportKey('raw',k)))}
async function importKey(b){return crypto.subtle.importKey('raw',b64u8(b),{name:'AES-GCM'},false,['decrypt','encrypt'])}
async function encryptJSON(obj,key){const iv=crypto.getRandomValues(new Uint8Array(12));const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,TE.encode(JSON.stringify(obj)));return {iv:u8b64(iv),ct:u8b64(new Uint8Array(ct))}}
async function decryptJSON(snap,key){const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64u8(snap.iv)},key,b64u8(snap.ct));return JSON.parse(TD.decode(pt))}

/* ---------- utils ---------- */
const $=s=>document.querySelector(s);
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseYmd=s=>{if(!s)return null;const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const today0=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const WD=['일','월','화','수','목','금','토'];
const fmtD=s=>{const d=parseYmd(s);return d?`${d.getMonth()+1}.${d.getDate()} (${WD[d.getDay()]})`:''};
const fmtFull=s=>{const d=parseYmd(s);return d?`${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} (${WD[d.getDay()]})`:''};
const diffDays=s=>Math.round((parseYmd(s)-today0())/864e5);
/* square date box: month (small, grey) · day (large) · weekday (Sat blue, Sun red) */
const dateBox=ds=>{const d=ds?parseYmd(ds):null;if(!d||isNaN(d))return '<div class="datebox"><b>?</b></div>';const w=d.getDay();return `<div class="datebox"><span class="db-m">${d.getMonth()+1}월</span><b>${d.getDate()}</b><span class="db-w${w===0?' sun':w===6?' sat':''}">${WD[w]}요일</span></div>`};
/* 운영진: 연도별 임기 (staffYears {연도: 직책}). 화면 표시는 올해 기준, 내년만 정해진 경우 흐린 배지 */
const curY=()=>new Date().getFullYear();
const staffMap=m=>(m&&m.staffYears)||{};
const isStaff=(m,y=curY())=>Object.prototype.hasOwnProperty.call(staffMap(m),String(y));
const staffRole=(m,y=curY())=>staffMap(m)[String(y)]||'';
const nextStaff=m=>!isStaff(m)&&isStaff(m,curY()+1);
const staffChip=m=>isStaff(m)?` <span class="chip staff">${h((staffRole(m)||'운영진').slice(0,2))}</span>`:nextStaff(m)?` <span class="chip staff next" title="${curY()+1}년 운영진">${h((staffRole(m,curY()+1)||'운영진').slice(0,2))}</span>`:'';
const ddayLabel=s=>{const n=diffDays(s);return n===0?'D-DAY':n>0?`D-${n}`:`D+${-n}`};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const SEOUL=['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'];
/* 경기도 시 · 군 전체 (가나다순) */
const NEAR=['가평군','고양시','과천시','광명시','광주시','구리시','군포시','김포시','남양주시','동두천시','부천시','성남시','수원시','시흥시','안산시','안성시','안양시','양주시','양평군','여주시','연천군','오산시','용인시','의왕시','의정부시','이천시','파주시','평택시','포천시','하남시','화성시'];
const EV_TYPES=['정기모임','내부대회','교류전','MT','개인대회','기타'];
const EV_STATUS=['기획중','확정','완료','취소'];
const REG={weekday:6,start:'09:00',end:'12:00',gameStart:'09:30',place:'서울시립대',title:'SBPB 정기모임'};
function nextRegNow(){const n=new Date();const t=today0();if(n.getDay()===REG.weekday&&n.getHours()*60+n.getMinutes()>=REG.end.split(':').reduce((h,m)=>h*60+ +m,0))t.setDate(t.getDate()+1);return nextReg(t)}
function nextReg(from=today0()){const d=new Date(from);while(d.getDay()!==REG.weekday)d.setDate(d.getDate()+1);return ymd(d)}
const NOTE_KIND={yellow:'회의',pink:'할 일',sky:'아이디어',green:'결정'};
/* 전화번호: 숫자만 남겨 010-1234-5678 형태로 · 누르면 전화 연결 */
const telDigits=s=>String(s||'').replace(/[^0-9+]/g,'');
const fmtPhone=s=>{const d=telDigits(s);if(/^02\d{7,8}$/.test(d))return d.replace(/^(02)(\d{3,4})(\d{4})$/,'$1-$2-$3');if(/^0\d{9,10}$/.test(d))return d.replace(/^(0\d{2})(\d{3,4})(\d{4})$/,'$1-$2-$3');return String(s||'').trim()};
const telLink=s=>s?`<a class="tel" href="tel:${h(telDigits(s))}" data-act="tel">${h(fmtPhone(s))}</a>`:'';
const normArea=s=>String(s||'').trim().replace(/\s+/g,'');
/* 거주지 표시: 서울은 "서울시 ○○구", 경기는 "경기도 ○○시" (저장 값은 구·시 그대로) */
const areaLabel=v=>{v=String(v||'').trim();if(!v||/^(서울|경기)/.test(v))return v;if(SEOUL.includes(v))return '서울시 '+v;if(NEAR.includes(v)||/시$/.test(v))return '경기도 '+v;return v};
function stars(lv){if(lv===null||lv===undefined||lv==='')return '<span class="muted small">레벨 모름</span>';lv=Number(lv)||0;let o='';for(let i=1;i<=5;i++){o+= lv>=i?'★':(lv>=i-.5?'<span class="half">★</span>':'<span class="off">★</span>')}return `<span class="stars" title="레벨 ${lv}">${o}</span>`}
function ageOf(b){const d=parseYmd(b);if(!d)return null;const t=today0();let a=t.getFullYear()-d.getFullYear();if(t.getMonth()<d.getMonth()||(t.getMonth()===d.getMonth()&&t.getDate()<d.getDate()))a--;return a}
function bdayIn(b,year){const d=parseYmd(b);if(!d)return null;let m=d.getMonth(),dd=d.getDate();if(m===1&&dd===29&&new Date(year,1,29).getMonth()!==1)dd=28;return `${year}-${pad(m+1)}-${pad(dd)}`}
function nextBday(b){const t=today0();let s=bdayIn(b,t.getFullYear());if(s&&parseYmd(s)<t)s=bdayIn(b,t.getFullYear()+1);return s}
function career(ym){if(!ym)return '';const [y,m]=ym.split('-').map(Number);const n=new Date();let mo=(n.getFullYear()-y)*12+(n.getMonth()+1-m);if(mo<0)return '';const yy=Math.floor(mo/12),mm=mo%12;return yy?`${yy}년${mm?' '+mm+'개월':''}`:`${mm}개월`}
const numOf=v=>Math.max(0,parseInt(String(v||'').replace(/[^\d]/g,''),10)||0);
document.addEventListener('input',e=>{const t=e.target;if(!t.dataset||!t.dataset.comma)return;const before=t.value.length-(t.selectionEnd||0);const n=String(t.value).replace(/[^\d]/g,'');t.value=n?Number(n).toLocaleString('ko-KR'):'';try{const p=Math.max(0,t.value.length-before);t.setSelectionRange(p,p)}catch(err){}});
function toast(msg){document.querySelectorAll('.toast').forEach(o=>o.remove());const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}
function lsGet(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(e){return f}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}

/* ---------- star picker ---------- */
function starPicker(name,val,allowUnknown){
  return `<div class="starpick" data-sp="${name}"><input type="hidden" name="${name}" value="${val===null||val===undefined?'':val}"><div class="sp-stars" role="radiogroup" aria-label="실력 레벨">${[1,2,3,4,5].map(i=>`<span class="sp-star"><button type="button" class="sp-h l" data-act="sp" data-v="${i===1?1:i-0.5}" aria-label="별 ${i===1?1:i-0.5}개"></button><button type="button" class="sp-h r" data-act="sp" data-v="${i}" aria-label="별 ${i}개"></button><span class="sp-g" aria-hidden="true">★</span></span>`).join('')}</div>${allowUnknown?`<button type="button" class="sp-unk" data-act="sp" data-v="">모름</button>`:''}<span class="sp-desc"></span></div>`;
}
function paintPicker(el){const v=el.querySelector('input').value;const n=v===''?null:Number(v);el.querySelectorAll('.sp-star').forEach((st,i)=>{st.className='sp-star '+(n===null?'off':n>=i+1?'full':n>=i+0.5?'half':'off')});el.querySelector('.sp-desc').textContent=n===null?'레벨 모름 · 대진 편성 시 중간 레벨로 계산':(LEVEL_DESC[n]||'');const u=el.querySelector('.sp-unk');if(u)u.setAttribute('aria-pressed',String(n===null))}
const ACT={noop:()=>{}};
/* ---------- level dropdown (custom so the half star can be drawn) ---------- */
function levelSelect(name,val,allowUnknown){
  const opts=(allowUnknown?[null]:[]).concat(LEVELS);
  return `<div class="lvsel"><input type="hidden" name="${name}" value="${val===null||val===undefined?'':val}"><button type="button" class="in lv-btn" data-act="lv-open" aria-haspopup="listbox" aria-expanded="false"></button><div class="lv-pop" role="listbox" hidden>${opts.map(v=>`<button type="button" role="option" data-act="lv-pick" data-v="${v===null?'':v}">${v===null?'<span class="lv-unk">모름</span><span class="lv-d">레벨 모름 · 대진 편성 시 중간 레벨로 계산</span>':`${stars(v)}<span class="lv-n">${v.toFixed(1)}</span><span class="lv-d">${LEVEL_DESC[v]}</span>`}</button>`).join('')}</div></div>`;
}
function paintLv(el){const v=el.querySelector('input').value;const n=v===''?null:Number(v);el.querySelector('.lv-btn').innerHTML=(n===null?'<span class="lv-unk">모름</span><span class="lv-d">레벨 모름</span>':`${stars(n)}<span class="lv-n">${n.toFixed(1)}</span><span class="lv-d">${LEVEL_DESC[n]||''}</span>`)+'<span class="lv-caret" aria-hidden="true">▾</span>';el.querySelectorAll('.lv-pop button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.v===v)))}
/* simple custom dropdown (one choice from a short list) */
function optSel(name,val,opts,ph='선택',{label=v=>v,none=true}={}){const list=[...opts];if(val&&!list.includes(val))list.push(val);
  return `<div class="lvsel optsel"><input type="hidden" name="${name}" value="${h(val||'')}"><button type="button" class="in pickbtn lv-btn${val?'':' ph'}" data-act="lv-open" data-ph="${h(ph)}" aria-haspopup="listbox" aria-expanded="false">${h(val?label(val):ph)}<span class="lv-caret" aria-hidden="true">▾</span></button><div class="lv-pop" role="listbox" hidden>${(none?['',...list]:list).map(v=>`<button type="button" role="option" data-act="opt-pick" data-v="${h(v)}" data-l="${h(v?label(v):'')}" aria-selected="${String(v===(val||''))}">${v?h(label(v)):'선택 안 함'}</button>`).join('')}</div></div>`}
ACT['opt-pick']=t=>{const el=t.closest('.optsel');const v=t.dataset.v;el.querySelector('input').value=v;const b=el.querySelector('.lv-btn');b.classList.toggle('ph',!v);b.innerHTML=h(v?(t.dataset.l||v):b.dataset.ph)+'<span class="lv-caret" aria-hidden="true">▾</span>';el.querySelectorAll('.lv-pop button').forEach(x=>x.setAttribute('aria-selected',String(x===t)));closeLv()};
/* long memo: preview in the form, edit in a larger window above the modal */
function bigMemo(name,val,ph,title){return `<div class="bigmemo"><textarea name="${name}" hidden>${h(val||'')}</textarea><button type="button" class="in memo-prev${val?'':' ph'}" data-act="memo-big" data-title="${h(title)}" data-ph="${h(ph)}">${h(val||ph)}</button></div>`}
ACT['memo-big']=t=>{const ta=t.closest('.bigmemo').querySelector('textarea');closeLv();
  const ov=document.createElement('div');ov.className='me-ov';ov.id='memoed';
  ov.innerHTML=`<div class="me-box" role="dialog" aria-modal="true" aria-label="${h(t.dataset.title)}"><div class="me-bar"><button type="button" class="btn ghost" data-act="me-cancel">취소</button><b>${h(t.dataset.title)}</b><button type="button" class="btn pri" data-act="me-done">완료</button></div><textarea class="in me-ta" placeholder="${h(t.dataset.ph)}"></textarea></div>`;
  ov._ta=ta;ov._btn=t;document.body.appendChild(ov);const e=ov.querySelector('.me-ta');e.value=ta.value;e.focus();e.setSelectionRange(e.value.length,e.value.length);e.scrollTop=e.scrollHeight};
ACT['me-cancel']=()=>{const ov=$('#memoed');if(ov)ov.remove()};
ACT['me-done']=()=>{const ov=$('#memoed');if(!ov)return;const v=ov.querySelector('.me-ta').value;ov._ta.value=v;const b=ov._btn;b.textContent=v||b.dataset.ph;b.classList.toggle('ph',!v);ov.remove()};
/* price and count fields: tapping again selects the whole number, so typing replaces it */
document.addEventListener('focusin',e=>{const t=e.target;if(!t.dataset||!(t.dataset.comma||t.dataset.selall))return;t._selAt=Date.now();setTimeout(()=>{try{t.setSelectionRange(0,t.value.length)}catch(_){t.select()}},30)});
document.addEventListener('mouseup',e=>{const t=e.target;if(t.dataset&&(t.dataset.comma||t.dataset.selall)&&t._selAt&&Date.now()-t._selAt<500){e.preventDefault();try{t.setSelectionRange(0,t.value.length)}catch(_){}}},true);
/* ---------- 업데이트 내역 ----------
   화면·기능이 바뀌는 배포마다 맨 위에 항목 추가 (id는 겹치지 않게, 날짜순).
   기기마다 마지막으로 본 id를 기억해, 다음 접속 때 그 이후 항목만 '업데이트' 창으로 보여 줌. 설정 탭에는 버전별 전체 기록 */
const NEWS=[
  {id:'2026-11-18',v:'1.6',date:'2026-11-18',items:[
    {k:'memtbl',t:'PC 회원 표: 전화번호가 이름 아래에 붙어 있음 · 거주지 말줄임 · 메모 칸 넓음 → 직장 다음 전화번호 칸, 그다음 상태 · 메모 칸 좁게 · 거주 · 직장 칸 넓게'},
    {k:'balls',t:'정산 › 공 재고: 없음 → 구매(몇 구짜리 몇 통 · 금액) · 사용(개봉 통 수, 쓴 공은 연습구로) · 연습구 조정 기록, 새 공 재고 · 연습구 개수 · 연간 구매 · 사용 요약'},
    {k:'manualdraw',t:'행사 대진 만들기: 자동 생성만 → 직접 입력 선택 (리그 · 토너먼트는 등록한 페어 · 선수를 조 칸 또는 1라운드 대진 칸에 끌어다 놓기 · 빈 칸 눌러 선택, 타임표 행사는 대진표 화면의 "빈 대진표로 직접 입력")'},
    {k:'fmtsync',t:'대회 형식 변경: 형식만 바뀌고 아래 대진은 그대로 → 형식을 바꾸면 대진도 새 형식으로 다시 만들지 선택 (참가자가 준비되면 바로 생성, 아니면 기존 대진 정리 후 안내)'},
    {k:'pecell',t:'페어 칸: 끌어다 놓기만 → 채워진 칸을 누르면 빠짐 · 빈 칸을 누르면 남은 인원 목록에서 선택'},
    {k:'pairsave',t:'페어 설정 저장: "저장 실패 (invalid-argument)" 오류 → 정상 저장'},
    {k:'evsetup',t:'이벤트 행사 상세 › 행사 대진 · 결과: 결과 기록만 → 대회 형식 선택(프리셋 · 옵션) → 팀 설정 또는 페어 설정(확정 인원 이름을 페어 칸에 끌어다 놓기 · 누르고 칸 누르기 · 무작위 남녀 혼합) → 대진 만들기 (타임표는 대진표 화면으로 이어짐, 리그 · 토너먼트는 행사에 바로 생성) · 끝난 행사의 토너먼트는 대진 히스토리에도 표시'},
    {k:'areaall',t:'회원 거주지 · 직장 선택 목록: 경기 12개 시 · 직접 입력 후 목록으로 돌아갈 수 없음 → 경기도 시 · 군 31곳 전체(가나다순), 직접 입력 칸 옆 "목록" 버튼으로 다시 선택'},
    {k:'evdraw',t:'대진표 모임 설정: 정기모임 기본값만 → "행사 대진" 버튼 (행사 선택 후 형식 프리셋 선택 또는 옵션 직접 조합: 참가 단위 개인 로테이션 · 고정 페어 · 단식 / 진행 방식 타임표 · 리그 · 토너먼트 · 리그 → 토너먼트 / 팀전 / 조 · 진출 수), 프리셋 추가 · 수정 · 삭제, 팀이 있는 타임표는 같은 팀끼리 페어 · 다른 팀과 대결로 자동 생성'},
    {k:'trtree',t:'행사 리그 · 토너먼트: 목록 → 본선은 나뭇가지 대진표(라운드별 칸 · 우승 칸), 리그 경기 목록(⋮⋮ 끌어서 진행 순서 변경), 점수 입력 시 승수 → 득실로 조 순위 자동 계산 · 점수 없이 승자만 기록 가능(지난 행사용), 결과 없으면 조 순위 직접 입력'},
    {k:'tourney',t:'행사 토너먼트: 없음 → 우승 · 본선(4강 · 결승) · 조별 예선 순위 기록 (이긴 팀을 누르거나 점수 입력으로 승자 기록, 결승 승자는 우승으로 표시) · 파일로 조 편성 · 결과 · 시상 가져오기'},
    {k:'evgames',t:'행사(MT · 내부대회) 대진: 없음 → 이벤트 상세에 "행사 대진 · 결과" (팀 설정(이름 · 색) · 행사 대진 보기 · 점수 입력 · 팀 승수 → 동점이면 득실로 순위 · 시상 기록), 대진표에 팀 색 표시 · 점수 표시, 행사 대진은 정기모임 출석률 · 페어 통계에서 제외'},
    {k:'attdays',t:'정기모임 출석률: 비율 · 횟수만 표시 → 줄을 누르면 출석한 날짜 · 결석한 날짜 펼침 (다시 누르면 접힘)'}]},
  {id:'2026-11-17c',alias:['2026-11-17b','2026-11-16e','2026-11-16b','2026-11-16c','2026-11-16d'],v:'1.5',date:'2026-11-17',items:[
    {k:'evbtn',t:'이벤트 상단 버튼: 대회 출전 기록 · 행사 추가 → 행사 추가만 (대회 출전 기록은 행사 추가에서 종류를 개인 대회로 선택)'},
    {k:'statpick',t:'페어 통계 사람 선택: 기록에 나온 모든 사람(게스트 · 미등록 포함) → 현 회원만'},
    {k:'attendvote',t:'대진표 없는 정기모임 출석: 모두 결석으로 계산 → 출석 투표 기록 파일을 가져오면 그날 출석으로 반영 (대진 기록이 있는 날 · 취소된 날은 제외)'},
    {k:'drawstats',t:'대진 통계: 없음 → 대진표 탭에 "대진 통계" 섹션 (정기모임 출석률: 취소되지 않은 정기모임 기준 · 가입일 이후 · 기록 없는 모임 표시 / 페어 통계: 전체 기록 기준 페어 많이 한 순 · 아직 페어 못 한 회원 · 1회만 한 회원 · 맞대결 많이 한 순)'},
    {k:'genhist',t:'대진 자동 생성: 그날 안에서만 같은 페어 반복을 피함 → 최근 10회 정기모임에서 덜 붙은 페어를 조금 우선 (실력 밸런스가 항상 1순위)'},
    {k:'mergepick',t:'미등록 이름 › 다른 이름과 합치기 목록: 회원 · 게스트 · 미등록 이름이 가나다순으로 섞여 표시 → 게스트(가나다순) 다음 미등록 이름(가나다순)만 표시, 회원 제외'},
    {k:'mcard2',t:'휴대폰 회원 명단 카드: 나이 · 구력 · 거주지 · 직장 · 전화번호 · 상태가 한 줄에 이어져 줄바꿈 위치가 제각각 → 첫 줄 나이 · 구력 · 상태, 둘째 줄 거주지 · 직장 · 전화번호'},
    {k:'phone',t:'회원 전화번호: 없음 → 회원 정보에 입력(010-0000-0000 형태로 자동 정리), 회원 명단에서 번호를 누르면 휴대폰 전화 연결, 엑셀 백업에 포함'},
    {k:'arealabel',t:'회원 거주지 · 직장 표시: "성동구" · "성남시"(선택 목록은 "서울 성동구" · "경기 성남시") → 어디서나 "서울시 성동구" · "경기도 성남시" (회원 명단 · 선택 목록 · 코트 회원 거주지 · 엑셀 백업)'},
    {k:'memberinfo',t:'회원 생년월일 · 거주지 일괄 입력: 한 명씩 수정 → 설정 › 데이터 백업 › 데이터 가져오기에 회원 정보 파일을 넣으면 이름으로 찾아 빈 칸 입력, 앱 값과 다른 항목은 목록으로 보여주고 체크한 것만 변경'},
    {k:'mixfix',t:'지난 대진 기록 경기 종류: 캡처 · PDF에 적힌 종류 그대로(남남 대 여여도 혼복 등) → 선수 성별을 모두 알면 성별로 판단(남남 대 여여 · 남남 대 남여는 잡복, 넷 다 여자면 여복)'},
    {k:'singles',t:'대진표 단식 경기: 표시 불가(복식만) → 남단 · 여단 · 혼단 경기 한 명씩 표시(지난 대진 기록용), 색은 같은 성별 복식과 같은 계열'},
    {k:'resbox',t:'코트 카드 오픈 상자 색: 주민 우선 · 일반 모두 초록, 하루 안으로 다가오면 주황 → 주민 우선 오픈은 항상 주황(테두리 · 이름 · D-day · 배경), 일반 오픈은 항상 초록'},
    {k:'resdday',t:'주민 우선 예약 오픈 D-day 색: 대시보드 예약 오픈 목록은 기본 글자색 · 코트 › 45일 내 예약 오픈은 진한 주황 → 둘 다 주민 우선 배지와 같은 주황'},
    {k:'chipgap2',t:'행사 목록 종류 배지 · 진행 상태: 사이 간격 약 12px · 제목에 바로 붙음 · 세로 중심 어긋남 → 사이 간격 8px로 일정, 제목과 배지 사이 4px, 배지와 진행 상태 세로 가운데 맞춤'},
    {k:'tempguest',t:'미등록 이름 표시 이름: "일회성"(일회성으로 표시 · 일회성 게스트 · 일회성 해제) → "임시 게스트"(임시 게스트로 표시 · 임시 게스트 · 임시 게스트 해제), 안내 문구 "한 번 온 사람은 일회성으로 표시" → "정규 게스트가 아니면 임시 게스트로 표시"'},
    {k:'unregsort',t:'미등록 이름 목록 순서: 많이 온 순 → 가나다순'},
    {k:'choicewrap',t:'선택 창 버튼 설명: 긴 문구가 창 밖으로 넘쳐 잘림 → 버튼 안에서 줄바꿈'},
    {k:'mergenick',t:'미등록 이름 합치기: 합친 이름은 사라짐 · 되돌릴 수 없음 → 합칠 때 본명 선택(게스트는 이름 변경 가능), 나머지 이름은 닉네임으로 저장(여러 개는 쉼표로) · 방문 횟수 · 마지막 방문일 반영, 미등록 이름 › 합친 이름에서 되돌리기(대진 기록 · 게스트 정보 복원)'},
    {k:'tabs7',t:'휴대폰 탭: 6개 → 설정 탭 추가로 7개, 한 화면에 모두 보이게 간격 조정'},
    {k:'unregreview',t:'미등록 이름 검수: 목록만 표시(검수는 대화로 요청) → 이름마다 게스트로 등록(지난 기록 자동 연결) · 다른 이름과 합치기 · 일회성으로 표시, 일회성 게스트는 별도 묶음에 기록 보관 · 다시 오면 "N회째 방문" 표시'},
    {k:'bracketcopy',t:'지난 대진 활용: 불러와서 수정만 가능(날짜를 바꾸면 원래 기록이 그 날짜로 옮겨짐) → "새 대진으로 복사"로 원본은 두고 다음 정기모임 새 초안 생성, 불러온 기록의 날짜를 바꾸면 "새 대진으로 복사 · 원본 날짜 수정" 중 선택 (테마 선택 창)'},
    {k:'blank',t:'대진표 확정 · 이미지 다운로드: 빈자리가 있으면 불가 → 기본은 그대로, "공란 허용"을 켜면 빈자리를 – 로 두고 확정 · 다운로드 가능 (현장에서 채우는 날용)'},
    {k:'archive',t:'대진표 기록: 참석자 섹션에 붙은 "대진표 기록" · 앱에서 만든 대진표만 → 대진표 탭의 별도 섹션 "대진 히스토리", 지난 대진표(이미지) 기록 가져오기 · "이전 기록" 표시, 대시보드 캘린더 정기모임 날짜에서도 보기, 회원 · 게스트 목록에 없는 이름은 "미등록 이름"(횟수 · 날짜 · 페어)으로 정리, 나중에 같은 이름으로 등록하면 지난 기록에 자동 연결'},
    {k:'historyui',t:'업데이트 기록: 11.14부터 · 배포마다 잘게 나뉜 버전 · 긴 목록 → 최초 요청(11.12 Claude 아티팩트 시기)부터 실제 배포 날짜 · 시간대 기준 기록, 같은 날 배포는 한 버전으로 묶음(하루 20개 안팎을 넘으면 나눔), 고정 높이 상자 안에서 페이지 넘겨 보기'},
    {k:'news',t:'업데이트 안내: 접속 때 바뀐 내용 전체를 창에 표시 → 버전과 바뀐 항목 수만 짧게 안내, 상세 내역은 설정 › 업데이트 기록 (상세 보기 버튼)'},
    {k:'staff',t:'운영진: 체크 하나로 즉시 바뀜(연도 구분 없음) → 회원 수정 › 운영진 체크 후 임기 연도 선택, 지난 임기 기록 보존, 내년 운영진은 명단에 흐린 배지 (8월부터 다음 해 선택 가능)'},
    {k:'partner',t:'개인대회 외부 파트너: 글자로 직접 입력 → 등록된 게스트 선택 또는 새 이름 추가, 이벤트 목록 · 멤버 대회 소식에도 이름 옆 G 표시'},
    {k:'datebox',t:'날짜 박스: 날짜 · 월만 표시 → 월 · 날짜 · 요일 순 표시 (요일은 \"토요일\"처럼 전체 표기, 토요일은 차분한 파랑 · 일요일은 차분한 빨강)'},
    {k:'settings',t:'설정 탭: 없음(로그아웃 · 데이터 백업 버튼은 대시보드에 있음) → 정산 다음에 설정 탭, 현재 버전 · 업데이트 기록(버전별) · 데이터 백업 · 로그아웃을 이곳으로 이동'}]},
  {id:'2026-11-16a',v:'1.4',date:'2026-11-16',items:[
    {k:'cfxlabel',t:'확정 인원 추가 표시: 게스트 · 지인 구분, 배지 글자 치우침 → 모두 "게스트", 배지 글자 가로 · 세로 가운데 정렬'},
    {k:'dateboxcenter',t:'날짜 박스 글자: 위로 치우침 → 박스 가운데 정렬'},
    {k:'court-imun',t:'코트 추가: 이문체육문화센터 테니스장 (동대문구, 매월 19일 구민 · 20일 일반 오픈)'},
    {k:'courtform',t:'코트 수정: 면 수 · 요금 · 바닥 자유 입력 → 면 수 · 요금 숫자 입력(1시간당 / 2시간당), 바닥 · 실내외 버튼 선택(중복 가능), 메모는 큰 창에서 편집'},
    {k:'inputcolor',t:'입력 칸: 직접 입력한 값도 회색 → 입력한 값은 본문 글자색, 단위 · 안내만 회색'},
    {k:'priceselect',t:'금액 칸: 누른 자리에 숫자가 끼어 들어감 → 누르면 전체 선택되어 새로 입력하면 교체'},
    {k:'calendar',t:'달력: 작은 화살표, 아이폰에서 월 이동 시 닫히는 문제 → 큰 이전 · 다음 버튼, 좌우로 밀어 월 이동'},
    {k:'confirmed',t:'행사 확정 인원: 없음 → 예상 인원 아래 확정 멤버 체크, + 로 게스트 추가 (등록된 게스트 또는 새 이름)'},
    {k:'dues',t:'정산 › 월 회비: 납부 · 미납 · 면제 → 납부 · 미납 (이미 면제로 표시된 달만 면제 버튼 유지)'},
    {k:'birthday',t:'대시보드 30일 내 생일: 날짜 · 나이 줄 따로 표시 → 이름 옆에 날짜(요일) 크게 표시, 나이 줄 삭제'},
    {k:'bracketmenu',t:'대진표 이름 메뉴: 바깥을 눌러야 닫힘 → 같은 이름을 다시 눌러도 닫힘'},
    {k:'inviter',t:'게스트 목록: 전 회원 게스트는 초대한 회원 대신 \"전 회원\"만 표시 → \"전 회원\" 표시와 초대한 회원 함께 표시'},
    {k:'guestreset',t:'게스트 전 회원 표시: 지울 방법 없음 → 게스트 수정 창에서 전 회원 기록 초기화'},
    {k:'chipgap',t:'이벤트 목록: 종류 배지와 뒤 글자가 붙어 보임 → 배지 뒤 간격 확보'},
    {k:'result',t:'대회 결과: 모든 결과에 배지 모양(앞에 빈 공간) → 우승 · 입상만 색 배지, 그 외(8강 · 예선 등)는 글자만'}]},
  {id:'2026-11-15',alias:['2026-11-14'],v:'1.3',date:'2026-11-15',items:[
    {k:'court-yongma',t:'코트 추가: 용마폭포공원 테니스장 (공단 이용안내 기준 요금 · 매주 월요일 구민 우선 · 수요일 일반)'},
    {k:'court-jungnang',t:'코트 추가: 중랑구립테니스장 (용마와 같은 예약 사이트 · 같은 예약 순위)'},
    {k:'court-myeonmok',t:'코트 추가: 면목구립테니스장 (2주 후 1주 이용분 사전예약 · 2시간 단위)'}]},
  {id:'2026-11-14c',alias:['2026-11-14b'],v:'1.2',date:'2026-11-14',part:'오후',items:[
    {k:'manualcal',t:'코트 오픈 규칙 "날짜 직접": 글자로 날짜 입력 → 달력에서 선택 (그 방식일 때만 표시)'},
    {k:'emptyrule',t:'코트 오픈 규칙: 비워 두고 저장하면 "매월 1일 10:00"이 들어감 → 비워 두면 규칙 없음'},
    {k:'feeclean',t:'코트 요금 · 메모: "고비용" · "엠무브는 엠무브 사이트" 등 예약처 안내 문구 → 삭제, 요금 모르면 "-"'},
    {k:'courtsync',t:'코트 정보 자동 반영: 기기에 저장된 데이터가 서버와 같으면 반영 안 됨 → 서버 확인 후 항상 반영'},
    {k:'mapname',t:'코트 지도 링크: 주소가 없으면 링크 없음 → "지도에서 위치 보기"(코트 이름으로 네이버 지도 검색)'},
    {k:'timeinput',t:'시각 · 회비 시작 월 입력: 기본 입력 칸 → 휠 (시각은 시 · 10분 단위)'},
    {k:'ledgercal',t:'행사 정산 표 날짜: 달력이 표 안에서 잘림 → 표 밖으로 온전히 표시'},
    {k:'accordion',t:'접기 · 펼치기 섹션: 제목 글자를 정확히 눌러야 동작 → 제목줄 어디를 눌러도 동작, 펼치기 · 접기 표시 통일, 연간 납부 현황은 기본 접힘'},
    {k:'dashnext',t:'대시보드 다음 정기모임: 당일 내내 오늘 모임 표시 → 종료 시각 이후 다음 모임 표시, 행사 대체 시 해당 행사 표시'},
    {k:'drawdate',t:'대진표 날짜: 당일 내내 오늘 날짜 → 정기모임 종료 후 다음 주 날짜로 준비'},
    {k:'courtlist',t:'코트 목록: 예약처별 묶음 → 공공 코트 · 사설 코트 구분, 예약 오픈이 가까운 순 정렬(스매시 앱 코트는 맨 아래, 같으면 가나다순), 예약 오픈 일정 크게 표시'},
    {k:'courtcard',t:'코트 카드: 회색 글자 한 줄 → 구 · 바닥 · 실내외 색 배지(잔디 초록 · 하드 파랑 · 클레이 주황), 도로명주소 누르면 네이버 지도 연결'},
    {k:'courtadd',t:'코트 추가 · 정리: 아차산배수지 · 보라매(이용일 14일 전 09:00) · 계남 · TS · 엠무브 예약 링크와 주소, 요금 모르면 \"-\" 표시'},
    {k:'drawsort',t:'대진표 참석자: 등록 순 → 가나다순'},
    {k:'evfilter',t:'이벤트 목록: 대회 · 교류전 · MT 등 종류별 필터 → 전체 · 예정 · 지난 이벤트, 예정은 가까운 순 · 지난 이벤트는 최근 3건 후 펼치기 · 접기'},
    {k:'joined',t:'회원 가입일: 비어 있음 → 현 회원 가입일 2026.01.01 일괄 적용'},
    {k:'guestpair',t:'대진 생성: 게스트끼리 같은 팀이 될 수 있음 → 게스트끼리 같은 팀 지양 (생성 로직에 \"게스트 분산\" 추가)'},
    {k:'swapcand',t:'대진표 자리 변경: 미참석자도 후보, 창 높이가 계속 바뀜 → 참석자만 후보, 창 높이 고정 · 목록만 스크롤'},
    {k:'modal',t:'입력 창: 창마다 크기 제각각, 키보드가 열리면 창이 줄어듦 → 모든 창 같은 크기(내부 스크롤), 키보드가 창을 덮고 크기 유지 (정기모임 취소 창만 작게)'},
    {k:'dropdown',t:'선택 목록: 위로 열리거나 저장 버튼 줄에 가림 → 항상 누른 자리 아래로 펼침, 공간이 부족하면 자동으로 내려 줌'},
    {k:'dateinput',t:'날짜 입력: 기본 날짜 칸 → 일정은 요일이 보이는 달력, 생년월일 · 테니스 시작 연월 · 가입일은 휠'}]},
  {id:'2026-11-14a',v:'1.1',date:'2026-11-14',part:'오전',items:[
    {k:'relogin',t:'로그인 유지: 한 번 로그인하면 계속 유지 → 하루 1회 비밀번호 재입력 (날짜가 바뀌면 다시 입력)'},
    {k:'autoupdate',t:'홈 화면 앱: 예전 화면이 남아 있음 → 새 버전이 있으면 입력 중이 아닐 때 자동 새로고침, 열 때마다 최신 화면'},
    {k:'cancelreason',t:'정기모임 취소 사유: 인원 부족 포함 → 우천 취소 · 코트 측 취소 · 행사 대체 · 기타 (기존 인원 부족 기록은 기타로 표시)'},
    {k:'errors',t:'오류 시 빈 화면 · 원인 모를 저장 실패 → 오류 내용 표시, 저장 실패 원인 표시, 빈 값 때문에 저장이 거절되던 문제 해결'},
    {k:'memo3',t:'이벤트 메모: 전체가 길게 표시 · \"줄글\" 보기 → 3줄까지 표시 후 말줄임(누르면 전체), 보기 전환 \"스티커 · 목록\"'},
    {k:'toast',t:'저장 완료 등 안내 문구: 화면 가장자리 → 화면 중앙'},
    {k:'cheer',t:'지난 대회 응원단: 전체 회원 버튼 → 응원 간 멤버만 표시 (추가 · 수정은 수정 창에서)'}]},
  {id:'2026-11-13',v:'1.0',date:'2026-11-13',items:[
    {k:'webapp',t:'운영 방식: Claude 대화 안의 화면(아티팩트) → 독립 웹사이트(sbpb-official.github.io), 휴대폰 · PC 실시간 연동, 홈 화면에 앱처럼 추가 가능, 운영 비용 0원'},
    {k:'login',t:'입장: 각자 구글 로그인 → 운영진 공용 비밀번호 하나로 입장 · 편집 (서버에서 확인)'},
    {k:'migrate',t:'데이터: 아티팩트에 저장된 회원 · 행사 · 메모 · 코트 · 대진표 · 게스트 · 정산 기록 전체를 새 사이트로 이전'}]},
  {id:'a-1112-3',alias:['a12','a11','a10','a9','a8','a7','a6','a5','a4','a3','a2','a1'],v:'0.4',date:'2026-11-12',part:'저녁 · Claude 아티팩트',items:[
    {k:'duecomma',t:'회비 설정 금액: 쉼표 없음 → 천 단위 쉼표'},
    {k:'ledgerfirst',t:'행사 정산 표: 빈 표에서 행 추가부터 → 첫 줄 기본 제공'},
    {k:'ledgerpick',t:'행사 정산 항목 · 결제 담당: 직접 입력 → 칸 아래에서 펼쳐지는 선택 목록'},
    {k:'ledgerpick2',t:'분류 · 결제 담당 선택 목록: 누르자마자 사라짐 → 목록 안에서 스크롤 · 선택 후 닫힘'},
    {k:'bank',t:'모임 통장: 없음 → 이월 잔액(다음 해 자동 이월), 수입 · 지출 합계와 비율, 분류별 구성, 월별 흐름, 통장 실잔액 대조'}]},
  {id:'a-1112-2',v:'0.3',date:'2026-11-12',part:'오전 · Claude 아티팩트',items:[
    {k:'zoom',t:'휴대폰 입력: 입력 칸을 누르면 화면 전체가 확대되고 돌아오지 않음 → 입력 글자 16px로 확대 방지'},
    {k:'prelim',t:'개인 대회 결과: "예선 탈락" → "예선"'},
    {k:'years',t:'회원 등록 연도: 없음 → 2026 · 2027 등록 기록, 매년 연장 관리(연장 · 게스트 · 탈퇴), 회원 ↔ 게스트 전환 (탈퇴해도 활동 연도 기록 유지)'},
    {k:'makeup',t:'정기대관 코트 측 취소: 취소만 기록 → 대체일 지정(취소할 때 또는 나중에), 대체일 사용 시 정상 청구 · 미사용 시 비용 없음, 분기별 정산'},
    {k:'money',t:'정산 탭: 없음 → 월 회비 납부 체크 · 연간 납부 현황, 행사별 정산 기록'},
    {k:'duemsg',t:'미납 안내 문구: 없음 → 게스트 모집 문구처럼 미리보기 · 복사'},
    {k:'ledgersheet',t:'행사 정산 입력: + 눌러 추가 창 → 행사를 누르면 펼쳐지는 엑셀식 표(칸에 바로 입력, + 행 추가)'},
    {k:'wording',t:'안내 문구: "왼쪽에서" 등 위치 표현 → "참석자 목록에서"처럼 섹션 이름으로 지칭 (전체 화면 검수)'},
    {k:'dashclock',t:'대시보드: 오늘 날짜만 크게 표시 → 실시간 시계, 오늘 날짜는 작게 · 다음 정기모임 카드 크게(D-day, 취소 시 취소선)'}]},
  {id:'a-1112-1b',v:'0.2',date:'2026-11-12',part:'새벽 2 · Claude 아티팩트',items:[
    {k:'regcancel',t:'정기모임: 취소 기능 없음 → 캘린더에서 취소(우천 · 코트 측 등 사유 선택, 회색 처리, 사유 기록) · 삭제'},
    {k:'courttab',t:'코트 예약 탭 → "코트" 탭: 정기대관 코트 관리(사용 현황 · 취소 기록) · 추가 코트 예약 섹션으로 구분'},
    {k:'mixgray',t:'대진표 잡복: 다른 색 → 회색'},
    {k:'modal0',t:'휴대폰 입력 창: 화면에 꽉 차 저장 · 닫기 버튼을 못 누름 → 고정 창 안에서 세로 스크롤, 닫기 버튼, 좌우 스크롤 없음'},
    {k:'pickjump',t:'대진표 참석자 체크: 누를 때마다 목록 맨 처음으로 이동 → 위치 유지'},
    {k:'guestpool',t:'게스트: 없음 → 회원 탭에 게스트 명단(닉네임), 대진표 참석자에서 바로 선택'},
    {k:'gbadge',t:'대진표 게스트 표시: 없음 → 이름 옆 연한 회색 원 안의 G 배지'},
    {k:'guestbtn',t:'대진표 게스트 추가 버튼: "게스트 추가" → "신규 게스트 추가"'},
    {k:'benchrows',t:'대진표 벤치: 한 줄 나열 → 4명 이상이면 두 줄(짝수는 반반, 홀수는 윗줄이 한 명 적게)'},
    {k:'backup',t:'데이터 백업 · 화면 모드: 없음 → 엑셀(.xlsx) · 전체 데이터(.json) 백업, 라이트 · 다크 모드 전환 버튼'},
    {k:'daypop',t:'캘린더 날짜 팝업: 화면 아래에 떠서 밀림 → 가운데 팝업, 일정 추가는 회원 입력과 같은 창'},
    {k:'evtoggle',t:'이벤트 메모: 펼치기 글자를 눌러야 열림 · 스티커만 → 행사를 누르면 펼침 · 접힘, 줄글(목록) 보기 추가'},
    {k:'entsort',t:'개인 대회 입력: 출전 멤버 순서 무작위 · 단식 하나 → 가나다순, 출전 멤버는 응원 선택 불가(회색), 남자단식 · 여자단식 구분'},
    {k:'guestcols',t:'게스트 명단: 회원과 다른 열 순서 · 닉네임 별도 열 → 회원과 같은 열 순서, 닉네임은 이름 옆 괄호(5글자 넘으면 말줄임), 열 폭 고정'},
    {k:'pinch',t:'휴대폰 확대: 화면 전체가 커짐 → 헤더 고정, 본문만 확대 · 축소'},
    {k:'courts0',t:'코트 예약: 기본 목록 → 예약처별(서울시 공공서비스예약 · 올림픽공원 · 네이버 · 사설) 코트 · 오픈 규칙(매월 특정일 · 말일 · 이용일 N일 전) · 요금 · 45일 내 오픈 일정'},
    {k:'cancelsmall',t:'정기모임 취소 창: 큰 창 → 작은 팝업, 취소 처리 후 바로 원래 화면'}]},
  {id:'a-1112-1',v:'0.1',date:'2026-11-12',part:'새벽 1 · Claude 아티팩트',items:[
    {k:'start',t:'첫 버전: 없음 → 대시보드(연간 캘린더 · 다가오는 행사 · 회원 개요) · 회원 · 대진표 · 이벤트 · 테니스장 예약 화면'},
    {k:'brand',t:'디자인: 기본 색 → 로고(왼쪽 위)와 딥그린 헤더, 넓은 면은 중립 회색(순백 · 순흑 미사용), 초록은 포인트로만'},
    {k:'bracket0',t:'대진표: 없음 → 카카오톡 공지 형식(타임 · 코트 · 벤치) 자동 생성 · 이미지 저장, 타임별 시간 표시(9:30부터 30분 단위), 남복 하늘 · 여복 코랄 · 혼복 연초록 색 태그'},
    {k:'logic0',t:'대진표 생성 로직 안내: 해요체 · 노란 배경 · 긴 줄 → 제목 "대진표 생성 로직", 명사형 문구, 연한 배경, 제목 아래 내용 · 자연스러운 줄바꿈, 경기 종류 순환 항목 삭제'},
    {k:'gate',t:'입장: 누구나 열람 → 비밀번호 입장(2시간 미사용 시 재입력), 로그인 화면 로고(베이지 바탕 초록 로고)'},
    {k:'staff0',t:'회원 운영진: 없음 → 운영진 체크(체크 시 직책 선택: 회장 · 부회장 · 총무 · 홍보부장 · 운영팀장), 명단 배지는 앞 두 글자'},
    {k:'birth',t:'회원 생년월일: 없음 → 생년월일 · 만 나이, 캘린더에 생일 표시, 입력은 굴려서 고르는 휠'},
    {k:'level0',t:'회원 레벨: 숫자 1/2 표시 · 별 클릭 → 반 별 모양 표시, 설명이 붙은 선택 목록'},
    {k:'area0',t:'회원 거주지: 직접 입력 → 누른 자리에서 펼쳐지는 목록'},
    {k:'numcol',t:'회원 명단: 번호 없음 → 맨 앞 번호 열'},
    {k:'events0',t:'이벤트: 없음 → 행사 기록, 스티커 메모, 멤버 개인 대회 출전 기록(대회 · 조건 · 결과) · 응원단'},
    {k:'regmark',t:'대시보드 정기모임 표시: 날짜 밑 손톱 모양 → 캘린더 정기모임 표시 정리'},
    {k:'overview',t:'대시보드 회원 개요: 칙칙한 초록 · 주황 → 화면과 어울리는 차분한 색'},
    {k:'drawdate0',t:'대진표 날짜: 매번 직접 입력 → 가장 가까운 정기모임 날짜 자동, 게스트 모집 문구 미리보기'},
    {k:'calpop0',t:'캘린더 날짜: 마우스를 올려야 작은 글씨 → 누르면 일정 요약 · 일정 추가 · 삭제'}]}
];
const NEWS_KEY='sbpb-news-seen';
/* 본 상태는 "id#항목수"로 저장: 같은 날 항목이 추가되면 그만큼만 새로 안내 */
const newsMark=()=>NEWS[0].id+'#'+NEWS[0].items.length;
const verLabel=n=>n.date?fmtFull(n.date)+(n.part?' '+n.part:''):(n.period||'');
function newsUnseen(){const raw=lsGet(NEWS_KEY,null);let n=0;const vs=[];
  if(!raw){const cut=new Date();cut.setDate(cut.getDate()-14);NEWS.filter(x=>x.date&&parseYmd(x.date)>=cut).forEach(x=>{n+=x.items.length;vs.push(x.v)});return {n,vs}}
  const [sid,sn]=String(raw).split('#');const i=NEWS.findIndex(x=>x.id===sid||(x.alias||[]).includes(sid));
  const full=i<0?NEWS:NEWS.slice(0,i);full.forEach(x=>{n+=x.items.length;vs.push(x.v)});
  if(i>=0&&sn!==undefined&&NEWS[i].id===sid){const extra=NEWS[i].items.length-Number(sn);if(extra>0){n+=extra;vs.push(NEWS[i].v)}}
  return {n,vs}}
function maybeShowNews(){if(RO||!NEWS.length)return;const {n,vs}=newsUnseen();
  if(!n){lsSet(NEWS_KEY,newsMark());return}
  if($('#modal-root').innerHTML){setTimeout(maybeShowNews,4000);return}
  /* 접속 때는 짧은 안내만: 상세는 설정 › 업데이트 기록 */
  const u=[...new Set(vs)];
  openModal('업데이트',`<div class="upd-note"><b class="upd-v">v${h(NEWS[0].v)}</b><p>${u.length>1?`v${h(u[u.length-1])}부터 v${h(u[0])}까지 `:''}${n}개 항목 변경</p><p class="muted">상세 내역은 설정 › 업데이트 기록에서 확인</p></div>`,()=>{},`<button type="button" class="btn" data-act="news-open">상세 보기</button>`,'sm');
  const f=$('#mform');if(f){f.querySelectorAll('.acts button:not([type=submit]):not([data-act=news-open])').forEach(b=>b.hidden=true);const s=f.querySelector('button[type=submit]');if(s)s.textContent='확인'}
  lsSet(NEWS_KEY,newsMark())/* 확인이든 × 든 한 번 보면 끝 */}
/* 설정 › 업데이트 기록: 고정 높이 상자 + 페이지 */
const VER_PER=2;let verPage=0;
function verBox(){const pages=Math.max(1,Math.ceil(NEWS.length/VER_PER));verPage=Math.min(Math.max(0,verPage),pages-1);
  const list=NEWS.slice(verPage*VER_PER,verPage*VER_PER+VER_PER);
  return `<div class="vers" id="vers">${list.map(n=>`<div class="ver"><div class="ver-h"><b>v${h(n.v||'')}</b><span>${h(verLabel(n))}</span><span class="ver-n">${n.items.length}개 항목</span></div><ul>${n.items.map(it=>`<li>${h(it.t||it)}</li>`).join('')}</ul></div>`).join('')}</div>
  <div class="ver-pg"><button type="button" class="btn sm" data-act="ver-pg" data-v="-1"${verPage===0?' disabled':''} aria-label="최신 쪽">‹ 최신</button><span class="num">${verPage+1} / ${pages}</span><button type="button" class="btn sm" data-act="ver-pg" data-v="1"${verPage>=pages-1?' disabled':''} aria-label="이전 버전 쪽">이전 ›</button></div>`}
ACT['ver-pg']=t=>{verPage+=Number(t.dataset.v);const w=$('#verwrap');if(w){w.innerHTML=verBox();const v=$('#vers');if(v)v.scrollTop=0}};
ACT['news-open']=()=>{closeModal();verPage=0;location.hash='#settings'};
const APP_V=()=>NEWS.length?'v'+NEWS[0].v:'';
function closeLv(){if(typeof releaseRoom==='function')releaseRoom();document.querySelectorAll('.lv-pop').forEach(p=>{p.hidden=true;const w=p._wrap;if(w){delete p._wrap;if(w.isConnected){w.appendChild(p);w.querySelector('.dbtn').setAttribute('aria-expanded','false')}else p.remove();return}p.previousElementSibling&&p.previousElementSibling.setAttribute('aria-expanded','false')})}
document.addEventListener('click',e=>{if(!e.target.closest('.lvsel,.calpop'))closeLv()},true);
/* a popup inside a <label> must not re-trigger the label's button (it reset the calendar to the selected month) */
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('.lv-pop')&&e.target.closest('label'))e.preventDefault()},true);
/* ---------- wheel picker (bottom sheet, scroll-snap columns) ---------- */
const WH=44;
function openWheel(title,cols,onDone,onChange){
  closeWheel();
  const ov=document.createElement('div');ov.className='wh-ov';ov.id='wheel';
  ov.innerHTML=`<div class="wh-sheet" role="dialog" aria-modal="true" aria-label="${h(title)}"><div class="wh-bar"><button type="button" class="btn ghost" data-act="wh-cancel">취소</button><b>${h(title)}</b><button type="button" class="btn pri" data-act="wh-done">완료</button></div><div class="wh-cols"><div class="wh-band" aria-hidden="true"></div>${cols.map((c,i)=>`<div class="wh-col" data-i="${i}" tabindex="0" style="flex:${c.flex||1}"></div>`).join('')}</div></div>`;
  document.body.appendChild(ov);
  const state={cols,onDone,onChange,el:ov};ov._st=state;
  cols.forEach((c,i)=>fillCol(ov,i,c.items,c.index||0));
  ov.addEventListener('click',e=>{if(e.target===ov)closeWheel()});
  ov.querySelectorAll('.wh-col').forEach(col=>{let t;col.addEventListener('scroll',()=>{clearTimeout(t);t=setTimeout(()=>settle(col),90)},{passive:true});
    col.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const i=Math.round(col.scrollTop/WH)+(e.key==='ArrowDown'?1:-1);col.scrollTo({top:i*WH,behavior:'smooth'})}});
    col.addEventListener('click',e=>{const it=e.target.closest('.wh-it');if(it)col.scrollTo({top:+it.dataset.i*WH,behavior:'smooth'})})});
}
function fillCol(ov,i,items,idx){const col=ov.querySelector(`.wh-col[data-i="${i}"]`);ov._st.cols[i].items=items;col.innerHTML=`<div class="wh-pad"></div>${items.map((it,j)=>`<div class="wh-it" data-i="${j}">${h(it.l)}</div>`).join('')}<div class="wh-pad"></div>`;idx=Math.max(0,Math.min(items.length-1,idx));col.scrollTop=idx*WH;ov._st.cols[i].index=idx;markCol(col,idx)}
function markCol(col,idx){col.querySelectorAll('.wh-it').forEach((x,j)=>x.classList.toggle('on',j===idx))}
function settle(col){const ov=$('#wheel');if(!ov)return;const i=+col.dataset.i;const c=ov._st.cols[i];const idx=Math.max(0,Math.min(c.items.length-1,Math.round(col.scrollTop/WH)));if(Math.abs(col.scrollTop-idx*WH)>1)col.scrollTo({top:idx*WH,behavior:'smooth'});c.index=idx;markCol(col,idx);ov._st.onChange&&ov._st.onChange(ov,i)}
function closeWheel(){const w=$('#wheel');if(w)w.remove()}
ACT['wh-cancel']=closeWheel;
ACT['wh-done']=()=>{const ov=$('#wheel');if(!ov)return;ov.querySelectorAll('.wh-col').forEach(col=>{const i=+col.dataset.i;ov._st.cols[i].index=Math.max(0,Math.min(ov._st.cols[i].items.length-1,Math.round(col.scrollTop/WH)))});const vals=ov._st.cols.map(c=>c.items[c.index].v);const f=ov._st.onDone;closeWheel();f(vals)};
/* birth date: typed (YYYY.MM.DD) or wheel */
function fmtBirth(b){return b?b.replace(/-/g,'.'):''}
function setBirth(iso){const hid=$('#birth-val'),txt=$('#birth-txt'),o=$('#age-out');if(!hid)return;hid.value=iso||'';if(txt)txt.value=fmtBirth(iso);if(o)o.value=iso?'만 '+ageOf(iso)+'세':''}
function birthDays(y,m){return new Date(y,m,0).getDate()}
ACT['birth-wheel']=()=>{
  const cur=parseYmd($('#birth-val').value)||new Date(1990,0,1);const ty=today0().getFullYear();
  const years=[];for(let y=ty;y>=1940;y--)years.push({v:y,l:y+'년'});
  const months=Array.from({length:12},(_,i)=>({v:i+1,l:(i+1)+'월'}));
  const days=(y,m)=>Array.from({length:birthDays(y,m)},(_,i)=>({v:i+1,l:(i+1)+'일'}));
  openWheel('생년월일',[{items:years,index:ty-cur.getFullYear(),flex:1.3},{items:months,index:cur.getMonth()},{items:days(cur.getFullYear(),cur.getMonth()+1),index:cur.getDate()-1}],
    vals=>{const [y,m,d]=vals;setBirth(`${y}-${pad(m)}-${pad(d)}`)},
    (ov,i)=>{if(i===2)return;const st=ov._st;const y=st.cols[0].items[st.cols[0].index].v,m=st.cols[1].items[st.cols[1].index].v;const n=birthDays(y,m);if(st.cols[2].items.length!==n)fillCol(ov,2,days(y,m),Math.min(st.cols[2].index,n-1))});
};
document.addEventListener('input',e=>{
  if(e.target.id!=='birth-txt')return;
  const d=e.target.value.replace(/\D/g,'').slice(0,8);let out=d.slice(0,4);if(d.length>4)out+='.'+d.slice(4,6);if(d.length>6)out+='.'+d.slice(6,8);e.target.value=out;
  const hid=$('#birth-val'),o=$('#age-out');
  if(d.length===8){const y=+d.slice(0,4),m=+d.slice(4,6),dd=+d.slice(6,8);const dt=new Date(y,m-1,dd);const ok=dt.getFullYear()===y&&dt.getMonth()===m-1&&dt.getDate()===dd&&dt<=today0()&&y>=1900;
    e.target.setCustomValidity(ok?'':'올바른 날짜 입력 필요');if(ok){const iso=`${y}-${pad(m)}-${pad(dd)}`;hid.value=iso;if(o)o.value='만 '+ageOf(iso)+'세'}else{hid.value='';if(o)o.value=''}}
  else{e.target.setCustomValidity(d.length?'8자리 숫자로 입력 (예: 19900115)':'');hid.value='';if(o)o.value=''}
});

/* ---------- date fields ----------
   달력: 일정 날짜 (요일이 보이도록) · 휠: 기본 정보 날짜 (생년월일·테니스 시작 연월·가입일) */
const fmtCal=(s,short)=>s?(short?fmtD(s):fmtFull(s)):'';
function calField(val,{name='',id='',extra='',cell=false,required=false,ph='날짜 선택'}={}){
  return `<div class="lvsel dfield${cell?' dcell':''}"${required?' data-required="1"':''} data-short="${cell?1:''}"><input type="hidden"${name?` name="${name}"`:''}${id?` id="${id}"`:''} ${extra} value="${h(val||'')}"><button type="button" class="${cell?'cell':'in'} pickbtn dbtn${val?'':' ph'}" data-act="cal-open" aria-haspopup="dialog">${val?fmtCal(val,cell):ph}<span class="lv-caret" aria-hidden="true">▾</span></button><div class="lv-pop calpop" hidden></div></div>`}
const calWrap=el=>{const p=el.closest('.calpop');return (p&&p._wrap)||el.closest('.dfield')};
let lastDown=null;document.addEventListener('pointerdown',e=>{lastDown=e.target},true);
function calHtml(pop){const wrap=calWrap(pop);const val=wrap.querySelector('input').value;const [y,m]=pop.dataset.ym.split('-').map(Number);
  const first=new Date(y,m-1,1),days=new Date(y,m,0).getDate(),td=ymd(today0());let cells=WD.map((w,i)=>`<span class="${i===0?'sun':i===6?'sat':''}">${w}</span>`).join('');
  for(let i=0;i<first.getDay();i++)cells+='<span></span>';
  for(let d=1;d<=days;d++){const ds=`${y}-${pad(m)}-${pad(d)}`;const wd=new Date(y,m-1,d).getDay();cells+=`<button type="button" data-act="cal-pick" data-v="${ds}" class="${wd===0?'sun':wd===6?'sat':''}${ds===td?' today':''}${ds===val?' sel':''}">${d}</button>`}
  return `<div class="cal-h"><button type="button" data-act="cal-nav" data-v="-1" aria-label="이전 달">‹</button><b>${y}년 ${m}월</b><button type="button" data-act="cal-nav" data-v="1" aria-label="다음 달">›</button></div><div class="cal-g">${cells}</div><div class="cal-f"><button type="button" data-act="cal-pick" data-v="${td}">오늘</button>${wrap.dataset.required?'':'<button type="button" data-act="cal-pick" data-v="">지우기</button>'}</div>`}
ACT['cal-open']=t=>{if(lastDown&&lastDown.isConnected!==undefined&&lastDown.closest&&lastDown.closest('.calpop'))return;const wrap=t.closest('.dfield');const pop=wrap.querySelector('.calpop')||[...document.querySelectorAll('body>.calpop')].find(p=>p._wrap===wrap);const open=pop.hidden;closeLv();if(!open)return;
  if(wrap.classList.contains('dcell')){pop._wrap=wrap;document.body.appendChild(pop)}/* table cells clip popups: show it at page level */
  const v=wrap.querySelector('input').value||ymd(today0());pop.dataset.ym=v.slice(0,7);pop.innerHTML=calHtml(pop);pop.hidden=false;t.setAttribute('aria-expanded','true');placePop(t,pop)};
/* swipe left/right on the calendar to change month */
document.addEventListener('touchstart',e=>{const g=e.target.closest&&e.target.closest('.calpop .cal-g');if(!g)return;const t0=e.touches[0];g._sw={x:t0.clientX,y:t0.clientY}},{passive:true});
document.addEventListener('touchend',e=>{const g=e.target.closest&&e.target.closest('.calpop .cal-g');if(!g||!g._sw)return;const t1=e.changedTouches[0];const dx=t1.clientX-g._sw.x,dy=t1.clientY-g._sw.y;g._sw=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5){const b=g.closest('.calpop').querySelector(`[data-act=cal-nav][data-v="${dx<0?1:-1}"]`);if(b)ACT['cal-nav'](b)}},{passive:true});
ACT['cal-nav']=t=>{const pop=t.closest('.calpop');let [y,m]=pop.dataset.ym.split('-').map(Number);m+=+t.dataset.v;if(m<1){m=12;y--}if(m>12){m=1;y++}pop.dataset.ym=`${y}-${pad(m)}`;const tmp=document.createElement('div');tmp.innerHTML=calHtml(pop);pop.querySelector('.cal-h b').textContent=tmp.querySelector('.cal-h b').textContent;pop.querySelector('.cal-g').replaceWith(tmp.querySelector('.cal-g'))};
ACT['cal-pick']=t=>{const wrap=calWrap(t);const inp=wrap.querySelector('input');const btn=wrap.querySelector('.dbtn');const v=t.dataset.v;
  inp.value=v;btn.classList.toggle('ph',!v);btn.innerHTML=(v?fmtCal(v,!!wrap.dataset.short):'날짜 선택')+'<span class="lv-caret" aria-hidden="true">▾</span>';closeLv();
  inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}))};
function wheelText(v,kind){if(!v)return '';const [y,m,d]=v.split('-').map(Number);return kind==='ym'?`${y}년 ${m}월`:`${y}.${pad(m)}.${pad(d)}`}
function wheelField(val,name,kind,title){return `<div class="wfield"><input type="hidden" name="${name}" value="${h(val||'')}"><button type="button" class="in pickbtn${val?'':' ph'}" data-act="wheel-open" data-kind="${kind}" data-title="${h(title)}">${val?wheelText(val,kind):'선택'}<span class="lv-caret" aria-hidden="true">▾</span></button></div>`}
ACT['wheel-open']=t=>{const wrap=t.closest('.wfield');const inp=wrap.querySelector('input');const kind=t.dataset.kind;const ty=today0().getFullYear();
  const cur=inp.value?inp.value.split('-').map(Number):[ty,today0().getMonth()+1,today0().getDate()];
  const top=kind==='ym'&&t.dataset.title!=='회비 시작 월'?ty:ty+1,bottom=kind==='ym'?1970:2015;const years=[];for(let y=top;y>=bottom;y--)years.push({v:y,l:y+'년'});
  const months=Array.from({length:12},(_,i)=>({v:i+1,l:(i+1)+'월'}));const days=(y,m)=>Array.from({length:birthDays(y,m)},(_,i)=>({v:i+1,l:(i+1)+'일'}));
  const cols=[{items:years,index:Math.max(0,top-cur[0]),flex:1.3},{items:months,index:(cur[1]||1)-1}];if(kind==='ymd')cols.push({items:days(cur[0],cur[1]||1),index:(cur[2]||1)-1});
  openWheel(t.dataset.title,cols,vals=>{const v=kind==='ym'?`${vals[0]}-${pad(vals[1])}`:`${vals[0]}-${pad(vals[1])}-${pad(vals[2])}`;inp.value=v;t.classList.remove('ph');t.innerHTML=wheelText(v,kind)+'<span class="lv-caret" aria-hidden="true">▾</span>'},
    kind==='ymd'?(ov,i)=>{if(i===2)return;const st=ov._st;const y=st.cols[0].items[st.cols[0].index].v,m=st.cols[1].items[st.cols[1].index].v;const n=birthDays(y,m);if(st.cols[2].items.length!==n)fillCol(ov,2,days(y,m),Math.min(st.cols[2].index,n-1))}:undefined)};


/* time: wheel (시 · 10분 단위) */
function timeField(val,{name='',id='',extra='',title='시각'}={}){return `<div class="wfield tfield"><input type="hidden"${name?` name="${name}"`:''}${id?` id="${id}"`:''} ${extra} value="${h(val||'')}"><button type="button" class="in pickbtn${val?'':' ph'}" data-act="time-open" data-title="${h(title)}">${val?h(val):'선택'}<span class="lv-caret" aria-hidden="true">▾</span></button></div>`}
ACT['time-open']=t=>{const inp=t.closest('.tfield').querySelector('input');const [hh,mm]=(inp.value||'10:00').split(':').map(Number);
  const hours=Array.from({length:24},(_,i)=>({v:i,l:pad(i)+'시'}));const ms=[0,10,20,30,40,50];if(!ms.includes(mm||0))ms.push(mm);ms.sort((x,y)=>x-y);const mins=ms.map(m=>({v:m,l:pad(m)+'분'}));
  openWheel(t.dataset.title,[{items:hours,index:hh||0},{items:mins,index:ms.indexOf(mm||0)}],vals=>{const v=`${pad(vals[0])}:${pad(vals[1])}`;inp.value=v;t.classList.remove('ph');t.innerHTML=h(v)+'<span class="lv-caret" aria-hidden="true">▾</span>';
    inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}))})};
/* court rule: 방식에 따라 일/요일 입력 또는 달력 */
document.addEventListener('change',e=>{const s=e.target;if(!s.matches||!s.matches('select[name$="type"]'))return;const g=s.closest('.grid3');if(!g||!g.querySelector('.rv-date'))return;
  const man=s.value==='manual';g.querySelector('.rv-text').hidden=man;g.querySelector('.rv-date').hidden=!man});

/* area: wheel with "직접 입력" */
const AREA_ITEMS=()=>[{v:'',l:'선택 안 함'},...SEOUL.map(a=>({v:a,l:areaLabel(a)})),...NEAR.map(a=>({v:a,l:areaLabel(a)})),{v:'__custom',l:'직접 입력'}];
function areaField(name,val,ph){
  const known=!val||SEOUL.includes(val)||NEAR.includes(val);
  const opt=(v,l)=>`<button type="button" role="option" data-act="area-pick" data-v="${h(v)}" aria-selected="${String(v===val)}">${h(l)}</button>`;
  return `<div class="areaf lvsel" data-area="${name}" data-ph="${h(ph)}"><button type="button" class="in pickbtn${val?'':' ph'}" data-act="area-open" aria-haspopup="listbox" aria-expanded="false"${known?'':' hidden'}>${h(val?areaLabel(val):ph)}<span class="lv-caret" aria-hidden="true">▾</span></button><div class="lv-pop" role="listbox" hidden>${opt('','선택 안 함')}<div class="lv-grp">서울</div>${SEOUL.map(a=>opt(a,a)).join('')}<div class="lv-grp">경기</div>${NEAR.map(a=>opt(a,a)).join('')}<div class="lv-grp">목록에 없으면</div><button type="button" role="option" data-act="area-pick" data-v="__custom">직접 입력</button></div><div class="area-cust"${known?' hidden':''}><input class="in" type="text" name="${name}" value="${h(val)}" placeholder="예: 세종시 · 인천 부평구"><button type="button" class="btn" data-act="area-open" aria-haspopup="listbox" aria-expanded="false">목록</button></div></div>`;
}
// dropdown lists (level, area): float over the form at the button, always fully on screen with their own scroll
// all custom dropdowns: open DOWNWARD from the pressed control, list scrolls inside.
// if there is not enough room below, the form (or page) scrolls up first to make room.
const POP_MIN=240;
function scrollBoxOf(el){return el.closest('.m-body')||el.closest('.modal')||null}
function roomBelow(btn,box){const vv=window.visualViewport;const vb=(vv?vv.offsetTop+vv.height:innerHeight);const lo=Math.min(vb,box?box.getBoundingClientRect().bottom:vb);return lo-btn.getBoundingClientRect().bottom-8}
function makeRoom(btn,need){const box=scrollBoxOf(btn);let below=roomBelow(btn,box);if(below>=need)return below;
  const d=need-below;
  if(box){const max=box.scrollHeight-box.clientHeight-box.scrollTop;if(max<d){box.dataset.padx=box.dataset.padx||box.style.paddingBottom||'';box.style.paddingBottom=(parseFloat(getComputedStyle(box).paddingBottom)+d-max+8)+'px'}box.scrollTop+=d}
  else{const b=document.body,max=document.documentElement.scrollHeight-innerHeight-scrollY;if(max<d){b.dataset.padx=b.dataset.padx||b.style.paddingBottom||'';b.style.paddingBottom=(parseFloat(getComputedStyle(b).paddingBottom)+d-max+8)+'px'}window.scrollBy(0,d)}
  return roomBelow(btn,box)}
function placePop(btn,pop){pop.style.maxHeight='none';const cal=pop.classList.contains('calpop');const cap=cal?460:360;const want=Math.min(pop.scrollHeight+2,cap);/* +border */
  const below=makeRoom(btn,cal?want:Math.min(want,POP_MIN));/* a calendar is shown whole */const r=btn.getBoundingClientRect();
  const w=Math.min(Math.max(r.width,240),innerWidth-16);const left=Math.max(8,Math.min(r.left,innerWidth-w-8));
  Object.assign(pop.style,{position:'fixed',left:left+'px',right:'auto',width:w+'px',minWidth:'0',maxHeight:Math.max(120,Math.min(cap,below))+'px',zIndex:'45',top:(r.bottom+4)+'px'})}
function releaseRoom(){document.querySelectorAll('[data-padx]').forEach(b=>{b.style.paddingBottom=b.dataset.padx;delete b.dataset.padx})}
function placeOpenPop(e){const p=document.querySelector('.lv-pop:not([hidden])');if(!p||(e&&e.target&&e.target.nodeType===1&&p.contains(e.target)))return;const b=p._wrap?p._wrap.querySelector('.dbtn'):p.previousElementSibling;if(b&&b.offsetParent)placePop(b,p);else closeLv()}
document.addEventListener('scroll',placeOpenPop,true);window.addEventListener('resize',()=>placeOpenPop());if(window.visualViewport)visualViewport.addEventListener('resize',()=>placeOpenPop());
ACT['area-open']=t=>{const wrap=t.closest('.areaf');const pop=wrap.querySelector('.lv-pop');const open=pop.hidden;closeLv();pop.hidden=!open;t.setAttribute('aria-expanded',String(open));if(open){placePop(t,pop);const s=pop.querySelector('[aria-selected="true"]');if(s)pop.scrollTop=s.offsetTop-pop.clientHeight/2+s.offsetHeight/2}};
ACT['area-pick']=t=>{const wrap=t.closest('.areaf');const btn=wrap.querySelector('.pickbtn');const inp=wrap.querySelector('input');const v=t.dataset.v;closeLv();
  const cust=wrap.querySelector('.area-cust');
  if(v==='__custom'){btn.hidden=true;cust.hidden=false;inp.value='';inp.focus();return}
  btn.hidden=false;cust.hidden=true;inp.value=v;btn.classList.toggle('ph',!v);btn.innerHTML=h(v?areaLabel(v):wrap.dataset.ph)+'<span class="lv-caret" aria-hidden="true">▾</span>';
  wrap.querySelectorAll('.lv-pop [data-act="area-pick"]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.v===v)));btn.focus()};
/* ---------- store ---------- */
const COLS=['members','events','notes','courts','brackets','guests','regstat','rentals','dues','ledger','names','attend','presets','balls'];
const S={members:[],events:[],notes:[],courts:[],brackets:[],guests:[],regstat:[],rentals:[],dues:[],ledger:[],names:[],attend:[],presets:[],balls:[]};
const CANCEL_REASONS=['우천 취소','코트 측 취소','행사 대체','기타'];
const regStat=ds=>S.regstat.find(x=>x.id===ds);
const COURT_CX='코트 측 취소';
const isCourtCx=rs=>!!rs&&rs.status==='취소'&&rs.reason===COURT_CX;
// 대체일 상태: 미정 → 예정 → 사용 (지난 날짜) / 미사용 (표시 시)
const mkState=rs=>!rs?'미정':rs.mkUnused?'미사용':!rs.mkDate?'미정':diffDays(rs.mkDate)<0?'사용':'예정';
const mkOn=ds=>S.regstat.find(r=>isCourtCx(r)&&r.mkDate===ds&&!r.mkUnused);
const MK_CLS={'미정':'st-plan','예정':'st-plan','사용':'st-used','미사용':'st-del'};
function mkInfo(rs){if(!isCourtCx(rs))return '';const st=mkState(rs);
  return `<div class="mk-info">대체일 ${rs.mkDate?`<b>${fmtD(rs.mkDate)} ${h(rs.mkStart||REG.start)}–${h(rs.mkEnd||REG.end)}</b>`:'미정'} <span class="st ${MK_CLS[st]}">${st==='미정'?'지정 전':st==='미사용'?'미사용 · 비용 없음':st}</span></div>`}
function mkFields(rs){return `<div class="grid3"><label class="f">대체일${calField(rs.mkDate,{name:'mkDate'})}</label><label class="f">시작${timeField(rs.mkStart||REG.start,{name:'mkStart',title:'대체일 시작'})}</label><label class="f">종료${timeField(rs.mkEnd||REG.end,{name:'mkEnd',title:'대체일 종료'})}</label></div>`}
let db=null,userCap=null,myId=null,dl=null,mode='connecting',slow=false,RO=false,art=null,snapKey=null;
const loaded=new Set();
const names={};
function loadLocal(){const d=lsGet('sbpb-local',null);if(d)COLS.forEach(c=>S[c]=d[c]||[])}
function saveLocal(){const o={};COLS.forEach(c=>o[c]=S[c]);lsSet('sbpb-local',o)}
function errMsg(e){const c=e&&e.code;if(WEB){const why=String(c||e&&e.message||'').replace(/^firestore\//,'');return why==='permission-denied'?'저장 권한 없음. 로그아웃 후 다시 로그인 필요 ('+why+')':why==='unavailable'?'인터넷 연결 확인 필요 ('+why+')':'저장 실패 ('+(why||'원인 미상')+')'}return c==='quota_exceeded'?'저장 공간 부족. 오래된 항목 삭제 후 재시도 필요':c==='invalid_argument'?'저장 권한 없음. 아티팩트 소유자에게 편집 권한 요청 필요':'저장 실패. 잠시 후 재시도 필요'}
async function put(col,id,data){
  if(RO){toast('보기 전용 화면에서는 수정 불가');throw new Error('read-only')}
  const body={...data,updatedAt:Date.now()};delete body.id;
  if(db){try{await db.collection(col).doc(id).set(body)}catch(e){toast(errMsg(e));throw e}}
  else{const i=S[col].findIndex(x=>x.id===id);const v={id,...body};if(i>=0)S[col][i]=v;else S[col].push(v);saveLocal();render()}
}
async function del(col,id){
  if(RO){toast('보기 전용 화면에서는 수정 불가');throw new Error('read-only')}
  if(db){try{await db.collection(col).doc(id).delete()}catch(e){toast(errMsg(e));throw e}}
  else{S[col]=S[col].filter(x=>x.id!==id);saveLocal();render()}
}
const pendingCount=()=>{const at=(PUB.snap&&PUB.snap.at)||0;return COLS.reduce((n,c)=>n+S[c].filter(x=>(x.updatedAt||0)>at).length,0)};
function setConn(){const c=$('#conn');const sp=c.querySelector('span');c.removeAttribute('data-act');c.removeAttribute('role');c.removeAttribute('tabindex');
  if(mode==='db'){c.className='conn on';const p=pendingCount();sp.textContent=slow?'동기화 지연':(art?`공개본 갱신${p?` · 변경 ${p}건`:''}`:'운영진 편집 모드');if(art){c.dataset.act='pub-open';c.setAttribute('role','button');c.setAttribute('tabindex','0');c.classList.add('click')}}
  else if(mode==='ro'&&WEB){c.className='conn click';sp.textContent='운영진 로그인';c.dataset.act='web-login';c.setAttribute('role','button');c.setAttribute('tabindex','0')}
  else if(mode==='ro'){c.className='conn';sp.textContent=PUB.snap?`보기 전용 · ${new Date(PUB.snap.at).toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'})} 기준`:'보기 전용'}
  else if(mode==='local'){c.className='conn';sp.textContent='이 기기에만 저장'}}
async function resolveNames(ids){
  if(!userCap)return;const miss=[...new Set(ids)].filter(i=>i&&!(i in names));if(!miss.length)return;
  try{const ps=await userCap.profiles(miss);miss.forEach(i=>names[i]=(ps&&ps[i]&&ps[i].name)||'');render()}catch(e){}
}
async function boot(){
  const timer=setTimeout(()=>{if(mode==='db'&&loaded.size<COLS.length){slow=true;setConn();render()}},10000);
  const c=window.claude;
  if(!c||!c.use){mode='local';loadLocal();setConn();render();return}
  const [d,u]=await Promise.all([c.use('db'),c.use('user')]);
  userCap=u;let canWrite=null;
  if(u){try{canWrite=await u.can('data.write')}catch(e){}try{myId=await u.id()}catch(e){}}
  c.use('downloads').then(x=>{dl=x});
  if(!d||canWrite===false){clearTimeout(timer);await enterRO();if(WEB&&window.SBPB_WEB.user())toast('운영진 권한 없는 계정. 운영진 계정에 이메일 등록 필요');return}
  db=d;mode='db';setConn();setTimeout(maybeShowNews,1800);
  c.use('artifact').then(x=>{art=x;setConn();render()});
  const fresh=new Set();let migRan=false;
  COLS.forEach(col=>{
    db.collection(col).onSnapshot(snap=>{
      S[col]=snap.docs.map(d=>({id:d.id,...d.data()}));
      loaded.add(col);
      if(!snap.metadata.fromCache)fresh.add(col);if(fresh.size===COLS.length&&!migRan){migRan=true;clearTimeout(timer);if(slow){slow=false}runMigrations()}
      if(col==='notes')resolveNames(S.notes.map(n=>n.authorId));
      setConn();render();
    },err=>{loaded.add(col);toast('데이터 불러오기 실패: '+col);render()});
  });
  render();
}
// one-time data fixes, run once by the first operator who loads the data (a flag doc prevents re-runs)
let migBusy=false;
async function runMigrations(){
  setTimeout(()=>relinkArchive(),1500);/* 매 접속: 새로 등록된 회원 · 게스트를 지난 대진 기록에 연결 */
  if(migBusy||RO||!db)return;
  const F='mig-joined-2026';                         // 2026-11-14: 현 회원 22명 가입일을 2026-01-01로 일괄 적용 (덮어쓰기)
  const F2='mig-court-achasan';                      // 2026-11-14: 아차산배수지 테니스장 코트 정보 추가 (같은 이름 코트가 있으면 건너뜀)
  const F3='mig-court-ts';
  const F4='mig-court-addr';
  const F5='mig-court-boramae-mmove';
  const F6='mig-court-boramae-addr';
  const F7='mig-court-ts-link';
  const F8='mig-court-gyenam';
  const F9='mig-court-ts-naver';
  const F10='mig-court-yongma';
  const F11='mig-court-yongma-info';
  const F12='mig-court-jungnang';
  const F13='mig-court-myeonmok';
  const F14='mig-court-imun';
  const F15='mig-court-fee-num';
  const F16='mig-staff-years';                       // 2026-11-16: 지금 운영진 3명은 2027년 임기로 기록 (2026년 운영진은 직접 입력)                     // 2026-11-16: 요금을 숫자+단위로 (단위가 분명한 코트만) · 상세 요금은 메모로 · 이문 요금표 반영                        // 2026-11-16: 이문체육문화센터 테니스장 (동대문구) 추가                    // 2026-11-15: 면목구립테니스장 추가 (공단 이용안내 기준)                    // 2026-11-15: 중랑구립테니스장 추가 (예약 링크·순위는 용마와 같은 공단 규정)                 // 2026-11-15: 용마 테니스장 공단 이용안내 반영 (요금·예약 순위·예약 사이트)                      // 2026-11-15: 용마폭포공원 테니스장 (중랑구) 추가                     // 2026-11-14: TS는 네이버 링크 예약 (스매시 아님) · 메모의 '○○에서 예약' 안내 문구 제거                       // 2026-11-14: 계남테니스장 (구로구) 추가                      // 2026-11-14: TS 예약·지도 링크 보정(이름이 다른 TS 코트 포함), 요금·메모의 '고비용'·'엠무브 사이트' 안내 문구 제거                 // 2026-11-14: 보라매 도로명주소 (비어 있을 때만)                // 2026-11-14: 보라매 예약 오픈 규칙(14일 전 09시), 엠무브 주소·지도 링크, TS 지도 링크                         // 2026-11-14: 주소 칸 추가에 맞춰 기존 코트·정기대관 주소 채움 (비어 있을 때만)
  const TS_MEMO='예약 링크는 네이버 지도 · 9호선 둔촌오륜역 1번 출구 도보 약 860m\n대관료 (개장 당시): 평일 야간·주말 주간 35,000원 · 주말 야간 40,000원\n※ 현재 요금·예약 오픈 방식은 네이버 지도 업체 정보로 확인 필요';                           // 2026-11-14: TS SPORT TENNIS CLUB (하남) 코트 정보 추가
  const has=id=>S.dues.find(d=>d.id===id);
  if(has(F)&&has(F2)&&has(F3)&&has(F4)&&has(F5)&&has(F6)&&has(F7)&&has(F8)&&has(F9)&&has(F10)&&has(F11)&&has(F12)&&has(F13)&&has(F14)&&has(F15)&&has(F16))return;
  migBusy=true;
  try{if(!has(F)){const targets=S.members.filter(m=>isCur(m)&&!m.sample);
    for(const m of targets)if(m.joined!=='2026-01-01')await put('members',m.id,{...m,joined:'2026-01-01'});
    await put('dues',F,{done:true,count:targets.length,at:Date.now()});
    toast(`가입일 일괄 적용 완료 (${targets.length}명 · 2026.01.01)`)}
  if(!has(F2)){const dup=S.courts.some(c=>/아차산/.test(c.name||''));
    if(!dup)await put('courts','c-achasan',{name:'아차산배수지체육공원 테니스장',district:'광진구',address:'서울 광진구 천호대로 731',courts:'',surface:'',fee:'시간당 주간 8,000원 · 야간 10,400원 (2022년 기준)',
      url:'https://booking.gwangjin.or.kr/fmcs/3',platform:'etc',
      genRule:{type:'monthly',day:'25',time:'09:00'},resident:true,resRule:{type:'monthly',day:'20',time:'09:00'},area:'광진구',workers:false,
      memo:'광진구통합예약시스템 · 이용 전월에 신청\n구민 우선 접수 20~21일 (주민등록 주소지 기준, 마이페이지 거주지 인증 필요 · 타구민 신청은 관리자 취소 가능)\n일반 접수 25일 09:00\n운영 06:00~23:00 · 1회 최대 4시간\n당일 예약: 빈 코트만, 운영 사무실 전화 02-3437-7234 (09~18시, 이용 1시간 전까지 결제)\n※ 면 수·바닥·구민 우선 시각·현재 요금은 공단 공지로 확인 필요',createdAt:Date.now()});
    await put('dues',F2,{done:true,skipped:dup,at:Date.now()});
    if(!dup)toast('코트 추가 완료 · 아차산배수지 테니스장')}
  if(!has(F3)){const dup=S.courts.some(c=>/TS\s*SPORT|TS\s*테니스/i.test(c.name||''));
    if(!dup)await put('courts','c-ts-hanam',{name:'TS SPORT TENNIS CLUB',district:'하남시',address:'경기 하남시 서하남로 9-16',courts:'5면',surface:'하드',fee:'시간당 35,000~40,000원 (2021년 개장 당시 기준)',url:'https://naver.me/xKy8BCdY',platform:'naver',
      resident:false,area:'',workers:false,memo:TS_MEMO,createdAt:Date.now()});
    await put('dues',F3,{done:true,skipped:dup,at:Date.now()});
    if(!dup)toast('코트 추가 완료 · TS SPORT TENNIS CLUB')}
  if(!has(F4)){let n=0;const fix=async(col,id,patch)=>{const cur=(col==='courts'?S.courts:S.rentals).find(x=>x.id===id);if(cur&&!cur.address){await put(col,id,{...cur,...patch});n++}};
    await fix('courts','c-achasan',{address:'서울 광진구 천호대로 731'});
    {const cur=S.courts.find(x=>x.id==='c-ts-hanam');if(cur&&!cur.address)await fix('courts','c-ts-hanam',{address:'경기 하남시 서하남로 9-16',courts:cur.courts||'5면',surface:cur.surface||'하드',fee:cur.fee||'시간당 35,000~40,000원 (2021년 개장 당시 기준)',memo:TS_MEMO})}
    if(S.rentals.find(x=>x.id==='main'))await fix('rentals','main',{address:'서울 동대문구 서울시립대로 163'});
    await put('dues',F4,{done:true,count:n,at:Date.now()});
    if(n)toast(`코트 주소 입력 완료 (${n}곳)`)}
  if(!has(F5)){const done=[];const BM_NOTE='예약 가능: 이용일 14일 전 09:00 ~ 이용 당일 20:00 (예: 11.30 이용분은 11.16 09:00부터)';
    const bm=S.courts.filter(c=>/보라매/.test(c.name||''));
    for(const c of bm){await put('courts',c.id,{...c,genRule:{type:'rolling',days:14,time:'09:00'},memo:/14일 전/.test(c.memo||'')?c.memo:[c.memo,BM_NOTE].filter(Boolean).join('\n')});done.push('보라매')}
    if(!bm.length){await put('courts','c-boramae',{name:'보라매공원 테니스장',district:'동작구',address:'서울 동작구 여의대방로20길 33',courts:'',surface:'',fee:'',url:'',platform:'seoul',genRule:{type:'rolling',days:14,time:'09:00'},resident:false,area:'',workers:false,memo:BM_NOTE,createdAt:Date.now()});done.push('보라매 (새로 추가)')}
    const MV={address:'서울 중랑구 망우로70길 103',map:'https://naver.me/FbV4sRlZ'};const mv=S.courts.filter(c=>/엠무브|mmove/i.test(c.name||''));
    for(const c of mv){await put('courts',c.id,{...c,...MV,district:c.district||'중랑구'});done.push('엠무브')}
    if(!mv.length){await put('courts','c-mmove',{name:'엠무브테니스 용마점',district:'중랑구',...MV,courts:'',surface:'',fee:'',url:MMOVE,platform:'smash',resident:false,area:'',workers:false,memo:'',createdAt:Date.now()});done.push('엠무브 (새로 추가)')}
    const ts=S.courts.find(c=>c.id==='c-ts-hanam');if(ts&&!ts.map)await put('courts',ts.id,{...ts,map:ts.url||'https://naver.me/xKy8BCdY'});
    await put('dues',F5,{done:true,list:done,at:Date.now()});
    toast('코트 정보 반영 완료 · '+done.join(', '))}
  if(!has(F6)){const bm=S.courts.filter(c=>/보라매/.test(c.name||'')&&!c.address);
    for(const c of bm)await put('courts',c.id,{...c,address:'서울 동작구 여의대방로20길 33'});
    await put('dues',F6,{done:true,count:bm.length,at:Date.now()})}
  if(!has(F7)){let n=0;const TS='https://naver.me/xKy8BCdY';
    const clean=s=>String(s||'').split('\n').map(l=>l.replace(/\(?\s*고비용\s*\)?/g,'').replace(/\(?\s*엠무브는\s*엠무브\s*사이트\s*\)?/g,'').trim()).filter(Boolean).join('\n');
    for(const c of S.courts){const isTS=/^\s*TS\b|TS\s*SPORT|TS\s*스포츠|TS\s*테니스/i.test(c.name||'');
      const next={...c,fee:clean(c.fee),memo:clean(c.memo)};if(isTS){if(!next.url)next.url=TS;if(!next.map)next.map=TS;if(!next.address)next.address='경기 하남시 서하남로 9-16'}
      if(JSON.stringify(next)!==JSON.stringify(c)){await put('courts',c.id,next);n++}}
    await put('dues',F7,{done:true,count:n,at:Date.now()})}
  if(!has(F8)){const dup=S.courts.some(c=>/계남/.test(c.name||''));
    if(!dup)await put('courts','c-gyenam',{name:'계남테니스장',district:'구로구',address:'서울 구로구 고척동 산6-1 (계남근린공원)',map:mapUrl('계남테니스장'),courts:'',surface:'',indoor:true,outdoor:true,
      fee:'실내 평일 30,000원 · 주말·공휴일 39,000원 / 실외 평일 10,000원 · 주말·공휴일 13,000원 · 실외 야간 조명 1시간 3,000원',url:'',platform:'seoul',kind:'public',
      genRule:{type:'monthly',day:'25',time:'07:00'},resident:false,resRule:{},area:'',workers:false,
      memo:'서울시 공공서비스예약 · 다음 달 일일 대관 매월 25일 07:00부터 신청\n1인·1팀 최대 1코트 2시간 · 당일 신청 불가 · 공휴일 휴관\n문의 구로구시설관리공단 02-2611-9007\n※ 요금 단위(1회 2시간 추정)·면 수·바닥은 예약 페이지로 확인 필요',createdAt:Date.now()});
    await put('dues',F8,{done:true,skipped:dup,at:Date.now()});
    if(!dup)toast('코트 추가 완료 · 계남테니스장')}
  if(!has(F9)){let n=0;const drop=s=>String(s||'').split('\n').filter(l=>!/^\s*(스매시\s*앱|엠무브\s*사이트)에서\s*예약\s*$/.test(l)).join('\n').trim();
    for(const c0 of S.courts){const c=S.courts.find(x=>x.id===c0.id);const isTS=/^\s*TS\b|TS\s*SPORT|TS\s*스포츠|TS\s*테니스/i.test(c.name||'');
      const next={...c,memo:drop(c.memo)};if(/고비용/.test(next.fee||''))next.fee=String(next.fee).replace(/\(?\s*고비용\s*\)?/g,'').trim();
      if(isTS){next.smash=false;next.kind='private';if(!next.url)next.url='https://naver.me/xKy8BCdY';if(!next.map)next.map=next.url;if(!next.address)next.address='경기 하남시 서하남로 9-16'}
      if(JSON.stringify(next)!==JSON.stringify(c)){await put('courts',c.id,next);n++}}
    await put('dues',F9,{done:true,count:n,at:Date.now()});if(n)toast(`코트 정보 정리 완료 (${n}곳)`)}
  if(!has(F10)){const dup=S.courts.some(c=>/용마폭포/.test(c.name||''));
    if(!dup)await put('courts','c-yongma',{name:'용마폭포공원 테니스장',district:'중랑구',address:'서울 중랑구 용마산로 250-12',map:'',courts:'3면',surface:'인조잔디',indoor:false,outdoor:true,
      fee:'2시간 주간 평일 8,000원 · 주말·공휴일 10,400원',url:'https://www.jungnangimc.or.kr/html/01100100',platform:'etc',kind:'public',smash:false,
      genRule:{},resident:false,resRule:{},area:'',workers:false,
      memo:'중랑구시설관리공단 대관신청 · 운영 06:00~22:00 (야간 조명)\n경로(65세 이상) 30%, 청소년·장애인·국가유공자 50% 감면\n주차 10분당 200원 · 문의 02-437-2949\n※ 예약 오픈일은 공단 대관신청 안내로 확인 필요',createdAt:Date.now()});
    await put('dues',F10,{done:true,skipped:dup,at:Date.now()});
    if(!dup)toast('코트 추가 완료 · 용마폭포공원 테니스장')}
  if(!has(F11)){const ym=S.courts.filter(c=>/용마폭포|용마\s*테니스/.test(c.name||''));
    for(const c of ym)await put('courts',c.id,{...c,
      fee:'1시간 기준 · 평일 주간 5,000원 · 야간 6,500원 / 토·일·공휴일 6,500원 · 야간 조명 1시간 3,000원',
      url:c.url&&!/jungnangimc\.or\.kr\/html\/01100100/.test(c.url)?c.url:'https://jnrent2.jungnangimc.or.kr/',
      genRule:{type:'weekly',weekday:3,time:'00:00'},resident:true,area:'중랑구',workers:false,resRule:{type:'weekly',weekday:1,time:'09:00'},
      memo:'예약 우선순위 (매주)\n· 1순위 월요일 09:00~18:00: 팀원 3명 이상 중랑구민\n· 2순위 화요일 09:00~18:00: 팀원 2명 이상 중랑구민\n· 3순위 수요일~일요일: 누구나 (24시간)\n예약 제한 1일 1회(2시간) · 1주 2회(4시간) · 취소된 빈자리는 누구나 실시간 신청\n운영 매일 06:00~22:00 (주간 ~18:00 · 야간 18:00~22:00) · 설·추석 연휴 휴관\n할인: 중랑구민 10% · 경로 30% · 장애인·기초수급·국가유공자 50% · 다자녀 (코트당 이용자 50% 이상 대상일 때)\n문의 02-433-2949'});
    await put('dues',F11,{done:true,count:ym.length,at:Date.now()});if(ym.length)toast('용마폭포공원 테니스장 정보 업데이트 완료')}
  if(!has(F12)){const dup=S.courts.some(c=>/중랑\s*구립/.test(c.name||''));
    const ym=S.courts.find(c=>/용마폭포|용마\s*테니스/.test(c.name||''));
    if(!dup)await put('courts','c-jungnang',{name:'중랑구립테니스장',district:'중랑구',address:'',map:mapUrl('중랑구립테니스장'),courts:'',surface:'',indoor:false,outdoor:false,
      fee:'1면 1시간 기준 · 평일 주간 5,000원 · 야간 6,500원 / 토·일·공휴일 6,500원 · 야간 조명 1시간 3,000원',
      url:(ym&&ym.url)||'https://jnrent2.jungnangimc.or.kr/',platform:'etc',kind:'public',smash:false,
      genRule:{type:'weekly',weekday:3,time:'00:00'},resident:true,area:'중랑구',workers:false,resRule:{type:'weekly',weekday:1,time:'09:00'},
      memo:'예약 우선순위 (매주)\n· 1순위 월요일 09:00~18:00: 팀원 3명 이상 중랑구민\n· 2순위 화요일 09:00~18:00: 팀원 2명 이상 중랑구민\n· 3순위 수요일~일요일: 누구나 (24시간)\n예약 제한 1일 1회(2시간) · 1주 2회(4시간) · 취소된 빈자리는 누구나 실시간 신청\n운영 매일 06:00~22:00 (주간 ~18:00 · 야간 18:00~22:00) · 설·추석 연휴 휴관\n할인: 중랑구민 10% · 경로 30% · 장애인·기초수급·국가유공자 50% · 다자녀 (코트당 이용자 50% 이상 대상일 때)\n위치: 신내동 중랑IC 고가 하부 · ※ 주소·면 수·바닥 확인 필요',createdAt:Date.now()});
    await put('dues',F12,{done:true,skipped:dup,at:Date.now()});
    if(!dup)toast('코트 추가 완료 · 중랑구립테니스장')}
  if(!has(F13)){const dup=S.courts.some(c=>/면목/.test(c.name||''));
    if(!dup)await put('courts','c-myeonmok',{name:'면목구립테니스장',district:'중랑구',address:'',map:mapUrl('면목구립테니스장'),courts:'',surface:'',indoor:false,outdoor:false,
      fee:'1코트 2시간 (휴장 10분 포함) · 평일 10,000원 · 토·일·공휴일 13,000원',
      url:'https://tennis.jungnangimc.or.kr/',platform:'etc',kind:'public',smash:false,
      genRule:{type:'weekly',weekday:3,time:'00:00'},resident:true,area:'중랑구',workers:false,resRule:{type:'weekly',weekday:1,time:'09:00'},
      memo:'2주 후 1주(월~일) 이용분 사전예약 · 온라인 결제만 (현장결제 불가) · 팀 2~4명\n예약 우선순위 (매주)\n· 1순위 월요일 09:00~18:00: 팀원 3명 이상 중랑구민\n· 2순위 화요일 09:00~18:00: 팀원 2명 이상 중랑구민\n· 3순위 수요일~일요일: 누구나 (24시간)\n예약 제한: 평일 제한 없음 · 주말 1일 1회(2시간) · 1주 2회(4시간) · 취소된 빈자리는 누구나 실시간 신청\n운영 2시간 단위 (10분 휴장 포함): 4~9월 1부 07:00 ~ 6부 18:50 · 10~3월 1부 08:00 ~ 5부 17:00 · 일출·일몰에 따라 탄력 운영\n휴장: 신정·설·추석 당일, 12월 1일 (공단 창립기념일), 우천·폭설·행사 시\n할인: 중랑구민 10% · 경로 30% · 장애인·기초수급·국가유공자 50% · 다자녀 (코트당 이용자 50% 이상 대상일 때 최저 할인율) · 할인 신분증 지참\n취소: 이용 1일 전까지 (당일 불가) · 7일 전 카드취소 · 6~4일 전 5% · 3~1일 전 10% 공제 환불 · 이용월 취소 2회당 1개월 이용 제한\n※ 주소·면 수·바닥 확인 필요',createdAt:Date.now()});
    await put('dues',F13,{done:true,skipped:dup,at:Date.now()});
    if(!dup)toast('코트 추가 완료 · 면목구립테니스장')}
  if(!has(F14)){const dup=S.courts.some(c=>/이문/.test(c.name||''));
    if(!dup)await put('courts','c-imun',{name:'이문체육문화센터 테니스장',district:'동대문구',address:'서울 동대문구 이문동 189',map:'',courts:'',surface:'',indoor:false,outdoor:false,
      fee:'',url:'https://www.dfmc.kr:8443/course/sports/fmcs/14',platform:'etc',kind:'public',smash:false,
      genRule:{type:'monthly',day:'20',time:'09:00'},resident:true,area:'동대문구',workers:false,resRule:{type:'monthly',day:'19',time:'09:00'},
      memo:'다음 달 대관 신청: 매월 19일 09:00 동대문구민 한정 · 20일 09:00 누구나 · 말일까지\n대관 시간: 화·수 12:00~15:00 · 주말 09:00~18:00 (계절·기상·센터 사정에 따라 변경 가능)\n1시간 단위 신청 · 인터넷 예약 후 카드결제 (승인 후 3시간 안에 미결제 시 자동 취소)',createdAt:Date.now()});
    await put('dues',F14,{done:true,skipped:dup,at:Date.now()});
    if(!dup)toast('코트 추가 완료 · 이문체육문화센터 테니스장')}
  if(!has(F15)){let n=0;const conv=[[/이문/,4500,'1시간'],[/용마폭포|용마\s*테니스/,5000,'1시간'],[/중랑\s*구립/,5000,'1시간'],[/면목/,10000,'2시간'],[/아차산/,8000,'1시간'],[/^\s*TS\b|TS\s*SPORT|TS\s*스포츠|TS\s*테니스/i,35000,'1시간']];
    for(const c of S.courts){if(c.feeN)continue;const hit=conv.find(([re])=>re.test(c.name||''));if(!hit)continue;
      let memo=c.memo||'';
      if(/이문/.test(c.name||''))memo=memo.split('\n').filter(l=>!/^대관 시간/.test(l)).concat(['요금·시간: 화·수 12:00~15:00 시간당 4,500원 · 일 09:00~12:00, 12:00~15:00 시간당 9,500원','매월 넷째 일요일 정기 휴관 · 계절·기상 여건에 따라 운영시간 변경 가능']).join('\n');
      else if(c.fee)memo=['요금 상세: '+c.fee,memo].filter(Boolean).join('\n');
      await put('courts',c.id,{...c,feeN:hit[1],feeUnit:hit[2],fee:'',memo});n++}
    await put('dues',F15,{done:true,count:n,at:Date.now()})}
  if(!has(F16)){let n=0;for(const m of S.members){if(m.staff&&!m.staffYears){await put('members',m.id,{...m,staffYears:{'2027':m.role||''}});n++}}
    await put('dues',F16,{done:true,count:n,at:Date.now()});if(n)toast(`운영진 ${n}명 2027년 임기로 기록 완료`)}}
  catch(e){}
  migBusy=false;
}
async function getSnapKey(){if(snapKey)return snapKey;const s=lsGet('sbpb-k',null);if(s&&PUB.snap&&s.salt===PUB.snap.salt){try{snapKey=await importKey(s.k);return snapKey}catch(e){}}return null}
async function enterRO(){
  RO=true;mode='ro';document.body.classList.add('ro');
  if(PUB.snap){const k=await getSnapKey();if(!k){lock('공개본 열람을 위해 비밀번호 재입력 필요');return}
    try{const data=await decryptJSON(PUB.snap,k);COLS.forEach(c=>S[c]=data[c]||[])}catch(e){snapKey=null;lock('공개본 열기 실패. 비밀번호 재입력 필요');return}}
  setConn();render();
}

/* ---------- derived ---------- */
const CLUB_Y=2026;
const ST=m=>m.status||'활동';
const isCur=m=>!['게스트','탈퇴'].includes(ST(m));            // 현 회원 (활동·휴면)
const activeMembers=()=>S.members.filter(m=>ST(m)==='활동');
const yearsOf=m=>Array.isArray(m.years)?m.years.map(Number):(m.id?[CLUB_Y]:[new Date().getFullYear()]);
const regYears=()=>{const mx=Math.max(new Date().getFullYear(),...S.members.flatMap(m=>yearsOf(m)));const o=[];for(let y=CLUB_Y;y<=mx;y++)o.push(y);return o};
const yrsHtml=m=>{const ys=yearsOf(m).slice().sort();return ys.length?`<span class="yrs" title="등록 연도 ${ys.join(', ')}">${ys.map(y=>"'"+String(y).slice(2)).join(' ')}</span>`:''};
const ST_LABEL={'활동':'활동','휴면':'휴면','게스트':'게스트 전환','탈퇴':'탈퇴'};
const stChip=m=>{const s=ST(m);return `<span class="chip${s==='활동'?' ok':s==='탈퇴'?' out':''}">${ST_LABEL[s]||h(s)}</span>`};
const memberById=id=>S.members.find(m=>m.id===id);
function nextOpen(rule,from=new Date()){
  if(!rule||!rule.type)return null;
  const [hh,mi]=(rule.time||'00:00').split(':').map(Number);
  if(rule.type==='monthly'){
    const days=String(rule.day||1).split(',').map(x=>x.trim()==='L'?99:Number(x)).filter(n=>(n>=1&&n<=31)||n===99).sort((a,b)=>a-b);
    for(let k=0;k<3;k++){const y=from.getFullYear(),m=from.getMonth()+k;const last=new Date(y,m+1,0).getDate();for(const day of days){const d=new Date(y,m,Math.min(day,last),hh,mi);if(d>=from)return d}}
  }
  if(rule.type==='weekly'){
    const wd=Number(rule.weekday)||0;for(let k=0;k<8;k++){const d=new Date(from.getFullYear(),from.getMonth(),from.getDate()+k,hh,mi);if(d.getDay()===wd&&d>=from)return d}
  }
  if(rule.type==='manual'&&rule.date){const d=parseYmd(rule.date);d.setHours(hh,mi);return d}
  return null;
}
function ruleText(rule){
  if(!rule||!rule.type)return '미입력';
  const t=rule.time?` ${rule.time}`:'';
  if(rule.type==='monthly')return `매월 ${String(rule.day).split(',').map(x=>x.trim()==='L'?'말':x).join('·')}일${t}`;
  if(rule.type==='rolling')return `이용일 ${rule.days}일 전${t}`;
  if(rule.type==='weekly')return `매주 ${WD[rule.weekday||0]}요일${t}`;
  if(rule.type==='manual')return rule.date?`${fmtFull(rule.date)}${t}`:'오픈일 미확인';
  return '';
}
function openings(rangeDays=60){
  const out=[];const end=new Date();end.setDate(end.getDate()+rangeDays);
  S.courts.forEach(c=>{
    [['res',c.resRule],['gen',c.genRule]].forEach(([k,r])=>{
      if(k==='res'&&!c.resident)return;
      let from=new Date();from.setHours(0,0,0,0);
      if(r&&r.type==='rolling')return;
      for(let i=0;i<4;i++){const d=nextOpen(r,from);if(!d||d>end)break;out.push({court:c,kind:k,date:d});if(r.type==='manual')break;from=new Date(d.getTime()+60000)}
    });
  });
  return out.sort((a,b)=>a.date-b.date);
}
function priorityMembers(c){
  if(!c.resident)return [];
  const area=normArea(c.area||c.district);if(!area)return [];
  return activeMembers().filter(m=>normArea(m.district)===area||(c.workers&&normArea(m.work)===area)).map(m=>({m,why:normArea(m.district)===area?'거주':'직장'}));
}

/* ---------- render core ---------- */
let route='home';
function render(){
  S.events.forEach(e=>{if(e.result==='예선 탈락')e.result='예선';if(e.cancelReason==='인원 부족')e.cancelReason='기타'});S.regstat.forEach(r=>{if(r.reason==='인원 부족')r.reason='기타'});
  const v=$('#view');const ae=document.activeElement;let keep=null;
  if(ae&&ae.id&&v.contains(ae)){let s=null,e2=null;try{s=ae.selectionStart;e2=ae.selectionEnd}catch(err){}keep={id:ae.id,s,e:e2,top:ae.scrollTop,val:ae.dataset&&ae.dataset.led?ae.value:undefined}}
  const r=(location.hash||'#home').slice(1);route=VIEWS[r]?r:'home';
  document.querySelectorAll('#tabs a').forEach(a=>a.setAttribute('aria-current',a.getAttribute('href')==='#'+route?'page':'false'));
  let banner='';
  if(mode==='ro')banner=PUB.snap?`<div class="banner"><b>보기 전용 화면</b> · ${new Date(PUB.snap.at).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})} 기준 공개본. ${WEB?'수정은 운영진 로그인 후 가능':'수정은 Claude 로그인 운영진만 가능'}</div>`:`<div class="banner"><b>공개된 데이터 없음.</b> 운영진의 '공개본 갱신' 이후 로그인 없이 비밀번호로 열람 가능</div>`;
  else if(mode==='local')banner=`<div class="banner">공유 저장소 미연결 상태. 이 브라우저에만 저장됨</div>`;
  else if(slow)banner=`<div class="banner">저장소 응답 지연. 표시 내용이 최신이 아닐 수 있음</div>`;
  const ks={};v.querySelectorAll('[data-ks]').forEach(el=>ks[el.dataset.ks]=el.scrollTop);const wy=window.scrollY;
  try{v.innerHTML=banner+VIEWS[route]()}catch(err){v.innerHTML=banner;showFatal('화면 그리기 실패('+route+'): '+(err&&err.message)+'\n'+((err&&err.stack)||'').split('\n').slice(0,3).join('\n'));return}
  v.querySelectorAll('[data-ks]').forEach(el=>{if(ks[el.dataset.ks])el.scrollTop=ks[el.dataset.ks]});if(Math.abs(window.scrollY-wy)>1)window.scrollTo(0,wy);
  if(keep){const el=document.getElementById(keep.id);if(el){if(keep.val!==undefined)el.value=keep.val;el.focus({preventScroll:true});try{if(keep.s!=null)el.setSelectionRange(keep.s,keep.e)}catch(e){}}}
  if(typeof cz!=='undefined'&&cz!==1)v.style.zoom=String(cz);
  AFTER[route]&&AFTER[route]();
  const rb=$('#renew-body');if(rb)rb.innerHTML=renewBody();
}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});

/* ---------- modal ---------- */
let modalSubmit=null;
function openModal(title,body,onSubmit,extraActs='',cls=''){
  modalSubmit=onSubmit;
  $('#modal-root').innerHTML=`<div class="ov" data-act="ov-close"><div class="modal fm${cls?' '+cls:''}" role="dialog" aria-modal="true" aria-label="${h(title)}"><div class="m-head"><h2>${h(title)}</h2><button type="button" class="modal-x" data-act="close-modal" aria-label="닫기">×</button></div><form id="mform" novalidate><div class="m-body">${body}</div><div class="acts"><div class="row">${extraActs}</div><div class="row"><button type="button" class="btn" data-act="close-modal">취소</button><button class="btn pri" type="submit">저장</button></div></div></form></div></div>`;
  const f=$('#mform');f.querySelectorAll('.starpick').forEach(paintPicker);f.querySelectorAll('.lvsel:not(.areaf):not(.dfield):not(.optsel)').forEach(paintLv);lockPage();if(window.matchMedia&&matchMedia('(pointer:fine)').matches){const first=f.querySelector('input:not([type=hidden]),select,textarea');first&&first.focus()}
}
let lockY=0;
function lockPage(){const r=document.documentElement;if(r.classList.contains('modal-open'))return;lockY=window.scrollY;r.classList.add('modal-open');document.body.style.top=`-${lockY}px`}
function unlockPage(){const r=document.documentElement;if(!r.classList.contains('modal-open'))return;r.classList.remove('modal-open');document.body.style.top='';window.scrollTo(0,lockY)}
function closeModal(){const me=$('#memoed');if(me)me.remove();const cp=$('#cfxpick');if(cp)cp.remove();$('#modal-root').innerHTML='';modalSubmit=null;unlockPage()}
document.addEventListener('submit',async e=>{
  if(e.target.id==='mform'){e.preventDefault();const f=e.target;if(f.dataset.busy)return;
    const missD=[...f.querySelectorAll('.dfield[data-required]')].find(d=>!d.querySelector('input').value);
    if(missD){const lb=missD.closest('label.f,div.f');toast(`${lb?lb.firstChild.textContent.trim():'날짜'} 입력 필요`);missD.scrollIntoView({block:'center'});return}
    const bad=[...f.elements].find(el=>el.willValidate&&!el.disabled&&!el.checkValidity());
    if(bad){const lb=bad.closest('label.f,div.f');const nm=lb?(lb.firstChild&&lb.firstChild.nodeType===3?lb.firstChild.textContent:lb.textContent).trim().split('\n')[0]:'';toast(bad.validationMessage&&bad.validity.customError?bad.validationMessage:`${nm||'필수 항목'} 입력 필요`);bad.focus({preventScroll:true});bad.scrollIntoView({block:'center',behavior:'smooth'});return}
    const fd=Object.fromEntries(new FormData(f));f.querySelectorAll('input[type=checkbox]').forEach(cb=>fd[cb.name]=cb.checked);
    const sb=f.querySelector('button[type=submit]');const lbl=sb&&sb.textContent;f.dataset.busy='1';if(sb){sb.disabled=true;sb.textContent='처리 중…'}
    try{await modalSubmit(fd);closeModal()}catch(err){delete f.dataset.busy;if(sb&&document.body.contains(sb)){sb.disabled=false;sb.textContent=lbl}}}
});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if($('#daypop')&&!$('#modal-root').innerHTML){closeDayPop();return}if($('#wheel')){closeWheel();return}if(document.querySelector('.lv-pop:not([hidden])')){closeLv();return}if($('#modal-root').innerHTML)closeModal()});

/* ---------- actions ---------- */
const WRITE_ACTS=new Set(['admin-open','data-import','bank-cfg','rent-pay','cp-open','cp-pick','due-set','due-cfg','led-new','led-edit','led-del','led-row','reg-makeup','mk-clear','reg-mk-at','m-to-guest','g-to-member','renew-open','rn-yes','rn-undo','rn-guest','rn-out','rn-back','reg-cancel','reg-del','reg-restore','ev-cancel','ev-restore','rent-edit','m-new','m-edit','m-del','m-sample','m-clear-sample','ev-new','ev-edit','ev-del','note-add','note-del','note-edit','cheer','c-new','c-edit','c-del','gen','br-save','br-confirm','br-unconfirm','br-load','bv-del','guest-new','guest-edit','guest-del','slot','reg-defaults','reg-draw','pick-all','pick-none','court-n','pub-open']);
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('dp-it')&&e.target.dataset.act){e.preventDefault();e.target.click()}});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.id==='conn'&&e.target.dataset.act){e.preventDefault();ACT['pub-open']()}});
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]');if(!t)return;
  if(t.dataset.act==='ov-close'&&e.target!==t)return;
  if(RO&&WRITE_ACTS.has(t.dataset.act)){toast('보기 전용 화면에서는 수정 불가');return}
  ACT[t.dataset.act]&&ACT[t.dataset.act](t,e);
});
ACT['ov-close']=closeModal;
// overlays must never scroll themselves (iOS scrolls overflow:hidden ancestors when focusing inputs)
document.addEventListener('scroll',e=>{const t=e.target;if(t&&t.classList&&(t.classList.contains('ov')||t.classList.contains('wh-ov'))&&(t.scrollTop||t.scrollLeft)){t.scrollTop=0;t.scrollLeft=0}},true);
function isDark(){const t=document.documentElement.dataset.theme;return t?t==='dark':!!(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)}
function paintThemeFab(){const b=$('#theme-fab');if(!b)return;const d=isDark();b.classList.toggle('dark',d);b.setAttribute('aria-label',d?'라이트 모드로 전환':'다크 모드로 전환');b.title=d?'라이트 모드':'다크 모드'}
ACT['theme']=()=>{const next=isDark()?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('sbpb-theme',next)}catch(e){}paintThemeFab()};
setTimeout(paintThemeFab,0);if(window.matchMedia)matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',paintThemeFab);
ACT['lv-open']=t=>{const pop=t.nextElementSibling;const open=pop.hidden;closeLv();pop.hidden=!open;t.setAttribute('aria-expanded',String(open));if(open){placePop(t,pop);const s=pop.querySelector('[aria-selected="true"]');if(s)pop.scrollTop=s.offsetTop-pop.clientHeight/2+s.offsetHeight/2}};
ACT['lv-pick']=t=>{const el=t.closest('.lvsel');el.querySelector('input').value=t.dataset.v;closeLv();paintLv(el);el.querySelector('.lv-btn').focus()};
ACT['sp']=t=>{const el=t.closest('.starpick');el.querySelector('input').value=t.dataset.v;paintPicker(el)};ACT['close-modal']=closeModal;

/* =========================================================
   DASHBOARD
   ========================================================= */
let calYear=new Date().getFullYear(),calSel=null;
function eventsOn(ds){return S.events.filter(ev=>ev.date&&(ev.date===ds||(ev.endDate&&ev.date<=ds&&ds<=ev.endDate)))}
function clockText(){const d=new Date();return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`}
setInterval(()=>{const c=document.getElementById('clock');if(c)c.textContent=clockText()},1000);
let lastDay=new Date().getDate()+'|'+nextRegNow();setInterval(()=>{const d=new Date().getDate()+'|'+nextRegNow();if(d!==lastDay){lastDay=d;if(route==='home'&&!$('#modal-root').innerHTML&&!$('#daypop'))render()}},30000);
function viewHome(){
  const act=activeMembers();const M=act.filter(m=>m.gender==='M').length,F=act.filter(m=>m.gender==='F').length;
  const avg=act.length?(act.reduce((s,m)=>s+(Number(m.level)||0),0)/act.length):0;
  const up=S.events.filter(e=>e.date&&diffDays(e.endDate||e.date)>=0&&e.status!=='취소').sort((a,b)=>a.date.localeCompare(b.date));
  const ops=openings(30);const opsWeek=ops.filter(o=>(o.date-new Date())/864e5<=7);
  const t=new Date();
  const kp=`<div class="kpis">
    <div class="kpi"><div class="l">활동 회원</div><div class="v">${act.length}</div><div class="s">남 ${M} · 여 ${F} · 운영진 ${act.filter(m=>isStaff(m)).length}${S.members.filter(m=>ST(m)==='휴면').length?` · 휴면 ${S.members.filter(m=>ST(m)==='휴면').length}`:''}</div></div>
    <div class="kpi"><div class="l">평균 레벨</div><div class="v">${act.length?avg.toFixed(1):'–'}</div><div class="s">${act.length?stars(Math.round(avg*2)/2):'회원 등록 후 표시'}</div></div>
    <div class="kpi"><div class="l">다가오는 행사</div><div class="v">${up.length}</div><div class="s">${up[0]?`${h(up[0].title)} ${ddayLabel(up[0].date)}`:'예정된 행사 없음'}</div></div>
    <div class="kpi"><div class="l">7일 내 예약 오픈</div><div class="v">${opsWeek.length}</div><div class="s">${opsWeek[0]?`${h(opsWeek[0].court.name)} ${opsWeek[0].date.getMonth()+1}/${opsWeek[0].date.getDate()}`:'등록된 코트 기준'}</div></div>
  </div>`;
  // calendar
  const openSet=new Set(openings(400).map(o=>ymd(o.date)));
  const bdMap={};S.members.filter(x=>x.birth&&ST(x)==='활동').forEach(x=>{const k=bdayIn(x.birth,calYear);(bdMap[k]=bdMap[k]||[]).push(x)});
  let months='';
  for(let m=0;m<12;m++){
    const first=new Date(calYear,m,1),days=new Date(calYear,m+1,0).getDate();
    let cells=WD.map((w,i)=>`<span class="wd${i===0?' sun':''}${i===REG.weekday?' satreg':''}">${w}</span>`).join('');
    for(let i=0;i<first.getDay();i++)cells+='<span></span>';
    for(let d=1;d<=days;d++){
      const ds=`${calYear}-${pad(m+1)}-${pad(d)}`;const evs=eventsOn(ds);
      const live=evs.filter(e=>e.status!=='취소');const cls=[evs.length?'ev t-'+(live[0]||evs[0]).type+(live.length?'':' cx'):'',openSet.has(ds)?'open':'',ds===ymd(t)?'today':'',ds===calSel?'sel':'',new Date(calYear,m,d).getDay()===0&&!evs.length?'sun':''].filter(Boolean).join(' ');
      const rs=regStat(ds);const isReg=new Date(calYear,m,d).getDay()===REG.weekday&&!evs.length&&!(rs&&rs.status==='삭제');const regCx=isReg&&rs&&rs.status==='취소';const bds=bdMap[ds];
      cells+=`<button class="${cls}${isReg?(regCx?' regx':' reg'):(!evs.length&&mkOn(ds)?' reg':'')}${bds?' bd':''}" data-act="cal-day" data-d="${ds}" aria-label="${m+1}월 ${d}일${evs.length?' 행사 '+evs.length+'건':''}${bds?' 생일 '+bds.length+'명':''}">${d}</button>`;
    }
    months+=`<div class="mon${calYear===t.getFullYear()&&m===t.getMonth()?' cur':''}"><h4>${m+1}월</h4><div class="mgrid">${cells}</div></div>`;
  }
  let dayInfo='';
  if(calSel){
    const evs=eventsOn(calSel);const ops2=openings(400).filter(o=>ymd(o.date)===calSel);
    const regLi=parseYmd(calSel).getDay()===REG.weekday?`<div class="li t-정기모임"><span class="dot tdot"></span><div class="grow"><div class="ttl">정기모임</div><div class="sub">${REG.start}–${REG.end} · ${REG.place}</div></div>${diffDays(calSel)>=0?`<button class="btn sm" data-act="reg-draw" data-d="${calSel}">대진표 만들기</button>`:''}</div>`:'';
    const bdLi=(bdMap[calSel]||[]).map(x=>`<div class="li click" data-act="m-edit" data-id="${x.id}"><span class="dot" style="background:var(--t-bd)"></span><div class="grow"><div class="ttl">${h(x.name)} 생일</div><div class="sub">${parseYmd(calSel).getFullYear()-parseYmd(x.birth).getFullYear()}번째 생일 · ${x.birth.slice(0,4)}년생</div></div></div>`).join('');
    dayInfo=`<div class="dayinfo"><div class="row" style="justify-content:space-between"><h3>${fmtFull(calSel)}</h3><button class="btn sm" data-act="ev-new" data-d="${calSel}">이 날 행사 추가</button></div>
    <div class="list">${regLi}${S.brackets.filter(b=>b.cfg&&b.cfg.date===calSel).map(b=>`<div class="li click" data-act="bv-open" data-id="${b.id}"><span class="dot" style="background:var(--ball)"></span><div class="grow"><div class="ttl">대진표 · ${h(b.cfg.title)}</div><div class="sub">${h(b.status)} · ${Object.keys(b.players||{}).length}명 · 눌러서 보기</div></div></div>`).join('')}${bdLi}${evs.map(ev=>`<div class="li click t-${h(ev.type)}" data-act="ev-open" data-id="${ev.id}"><span class="dot tdot"></span><div class="grow"><div class="ttl">${h(ev.title)}</div><div class="sub">${h(ev.type)} · ${h(ev.place||'장소 미정')}</div></div></div>`).join('')}
    ${ops2.map(o=>`<div class="li"><span class="dot" style="background:var(--ball)"></span><div class="grow"><div class="ttl">${h(o.court.name)} ${o.kind==='res'?'주민 우선':'일반'} 예약 오픈</div><div class="sub">${pad(o.date.getHours())}:${pad(o.date.getMinutes())}</div></div></div>`).join('')}
    ${!regLi&&!bdLi&&!evs.length&&!ops2.length&&!S.brackets.some(b=>b.cfg&&b.cfg.date===calSel)?'<div class="li muted">일정 없음</div>':''}</div></div>`;
  }
  const cal=`<section class="panel"><div class="panel-h"><h2>${calYear} 연간 캘린더</h2><div class="row"><button class="btn sm" data-act="cal-y" data-v="-1" aria-label="이전 해">‹</button><button class="btn sm" data-act="cal-y" data-v="0">올해</button><button class="btn sm" data-act="cal-y" data-v="1" aria-label="다음 해">›</button></div></div>
    <div class="year">${months}</div>
    <div class="legend"><span><i class="swatch" style="background:color-mix(in srgb,var(--t-reg) 18%,transparent)"></i>정기모임 (매주 토 ${REG.start}–${REG.end})</span><span><i class="dot" style="background:var(--t-bd)"></i>회원 생일</span>${EV_TYPES.filter(x=>x!=='정기모임').map(x=>`<span class="t-${x}"><i class="dot tdot"></i>${x}</span>`).join('')}<span><i class="dot" style="background:var(--ball)"></i>예약 오픈일</span></div>
    </section>`;
  // side
  const upHtml=up.length?up.slice(0,5).map(ev=>`<div class="li click t-${h(ev.type)}" data-act="ev-open" data-id="${ev.id}">${dateBox(ev.date)}<div class="grow"><div class="ttl">${h(ev.title)}</div><div class="sub"><span class="chip ttag">${h(ev.type)}</span> ${h(ev.status||'')}</div></div><span class="dday">${ddayLabel(ev.date)}</span></div>`).join(''):`<div class="empty"><b>예정된 행사 없음</b>내부대회·교류전·MT 등록 가능<div class="row"><button class="btn pri sm" data-act="ev-new">행사 추가</button></div></div>`;
  const opHtml=ops.length?ops.slice(0,5).map(o=>{const pm=o.kind==='res'?priorityMembers(o.court).length:null;const ds=ymd(o.date);return `<div class="li"><div class="grow"><div class="ttl">${h(o.court.name)}</div><div class="sub">${o.date.getMonth()+1}/${o.date.getDate()} (${WD[o.date.getDay()]}) ${pad(o.date.getHours())}:${pad(o.date.getMinutes())} · ${o.kind==='res'?`<span class="chip warn">주민 우선</span> 가능 회원 ${pm}명`:'일반 오픈'}</div></div><span class="dday${o.kind==='res'?' res':''}">${ddayLabel(ds)}</span></div>`}).join(''):`<div class="empty"><b>등록된 코트 없음</b>공공 코트 등록 시 오픈일 자동 계산<div class="row"><a class="btn sm" href="#courts">코트 등록</a></div></div>`;
  // member overview
  let mo='';
  if(act.length){
    const lv={};act.forEach(m=>{const k=Math.floor(Number(m.level)||0);lv[k]=(lv[k]||0)+1});
    const maxL=Math.max(...Object.values(lv));
    const ar={};act.forEach(m=>{const k=m.district||'미입력';ar[k]=(ar[k]||0)+1});
    const topA=Object.entries(ar).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const yrs={'1년 미만':0,'1–3년':0,'3–5년':0,'5년+':0};act.forEach(m=>{if(!m.since)return;const [y,mm]=m.since.split('-').map(Number);const mo2=(t.getFullYear()-y)*12+(t.getMonth()+1-mm);const k=mo2<12?'1년 미만':mo2<36?'1–3년':mo2<60?'3–5년':'5년+';yrs[k]++});
    mo=`<div class="small muted">성비</div><div class="split"><div style="width:${M/act.length*100}%;background:var(--male)"></div><div style="width:${F/act.length*100}%;background:var(--female)"></div></div><div class="small"><span class="g-M">● 남 ${M}</span> &nbsp; <span class="g-F">● 여 ${F}</span></div>
    <div class="small muted" style="margin-top:12px;margin-bottom:6px">레벨 분포</div><div class="bars">${[5,4,3,2,1].map(k=>`<div class="bar"><span>${'★'.repeat(k)}</span><div class="tr"><div class="fl" style="width:${(lv[k]||0)/maxL*100}%"></div></div><span class="num">${lv[k]||0}</span></div>`).join('')}</div>
    <div class="small muted" style="margin-top:12px;margin-bottom:6px">구력</div><div class="chips">${Object.entries(yrs).map(([k,v])=>`<span class="chip">${k} <b class="num">${v}</b></span>`).join('')}</div>
    <div class="small muted" style="margin-top:12px;margin-bottom:6px">거주지 상위</div><div class="chips">${topA.map(([k,v])=>`<span class="chip court">${h(k)} ${v}</span>`).join('')}</div>
    ${(()=>{const ub=act.filter(m=>m.birth).map(m=>({m,d:nextBday(m.birth)})).filter(x=>diffDays(x.d)<=30).sort((a,b)=>a.d.localeCompare(b.d));return ub.length?`<div class="small muted" style="margin-top:12px;margin-bottom:6px">30일 내 생일</div><div class="list">${ub.map(x=>`<div class="li"><span class="dot" style="background:var(--t-bd)"></span><div class="grow"><div class="ttl bd-row">${h(x.m.name)}<span class="bd-date">${fmtD(x.d)}</span></div></div><span class="dday">${ddayLabel(x.d)}</span></div>`).join('')}</div>`:''})()}`;
  }else mo=`<div class="empty"><b>등록된 회원 없음</b>회원 등록 시 성별·레벨·구력·거주지 분포 표시<div class="row"><a class="btn sm" href="#members">회원 관리</a></div></div>`;
  const nr=nextRegNow(),nrs=regStat(nr),nrx=nrs&&nrs.status==='취소',dd=diffDays(nr);const nrEv=nrx&&nrs.reason==='행사 대체'?S.events.find(e=>e.date===nr&&e.status!=='취소'):null;
  return `<div class="page-head dash-head"><div class="dh-main"><div class="dh-today"><span>${t.getFullYear()}년 ${t.getMonth()+1}월 ${t.getDate()}일 ${WD[t.getDay()]}요일</span><b class="num" id="clock">${clockText()}</b></div>
    ${nrEv?`<div class="dh-next rep t-${h(nrEv.type||'기타')}" data-act="ev-open" data-id="${nrEv.id}" role="button" tabindex="0"><span class="dh-l">다음 모임 · 행사 대체</span><div class="dh-v"><b>${fmtD(nr)}</b><span>${h(nrEv.title)}</span><span class="dh-dd">${dd===0?'오늘':'D-'+dd}</span></div><span class="dh-s">${h(nrEv.place||'')}${nrEv.place?' · ':''}정기모임 대신 행사 진행</span></div>`:`<div class="dh-next${nrx?' cx':''}"><span class="dh-l">다음 정기모임</span><div class="dh-v"><b>${fmtD(nr)}</b><span class="num">${REG.start}–${REG.end}</span><span class="dh-dd">${dd===0?'오늘':'D-'+dd}</span></div><span class="dh-s">${REG.place}${nrx?` · <b>${h(nrs.reason)}</b>${isCourtCx(nrs)&&nrs.mkDate?` · 대체일 ${fmtD(nrs.mkDate)}`:''}`:''}</span></div>`}</div><div class="row">${WEB&&mode==='ro'?`<button class="btn" data-act="web-login">운영진 로그인</button>`:''}<button class="btn" data-act="reg-draw" data-d="${nextRegNow()}">이번 주 대진표 만들기</button><button class="btn pri" data-act="ev-new">행사 추가</button></div></div>
  ${kp}<div class="dash">${cal}<div class="side">
  <section class="panel"><div class="panel-h"><h2>다가오는 행사</h2><a href="#events">전체 보기</a></div><div class="list">${upHtml}</div></section>
  ${(()=>{const ts=S.events.filter(e=>e.type==='개인대회'&&e.date);if(!ts.length)return '';const up2=ts.filter(e=>diffDays(e.date)>=0).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);const past=ts.filter(e=>diffDays(e.date)<0&&e.result&&e.result!=='대기').sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
    const li=e=>`<div class="li click" data-act="ev-open" data-id="${e.id}"><div class="grow"><div class="ttl">${entLine(e)||'출전 멤버 미입력'}</div><div class="sub">${fmtD(e.date)} · ${h(e.title)}${e.division?' · '+h(e.division):''}${(e.cheer||[]).length?` · 응원 ${(e.cheer||[]).length}명`:''}</div></div>${diffDays(e.date)>=0?`<span class="dday">${ddayLabel(e.date)}</span>`:`<span class="result ${resultCls(e.result)}" style="font-size:12px">${h(e.result)}</span>`}</div>`;
    return `<section class="panel"><div class="panel-h"><h2>멤버 대회 소식</h2><a href="#events" data-act="ev-filter" data-v="all">전체 보기</a></div><div class="list">${up2.map(li).join('')}${past.map(li).join('')}</div></section>`})()}
  <section class="panel"><div class="panel-h"><h2>예약 오픈 임박</h2><a href="#courts">코트 보기</a></div><div class="list">${opHtml}</div></section>
  <section class="panel"><div class="panel-h"><h2>회원 개요</h2><a href="#members">회원 보기</a></div>${mo}</section>
  </div></div>`;
}
ACT['cal-y']=t=>{const v=Number(t.dataset.v);calYear=v?calYear+v:new Date().getFullYear();render()};
ACT['cal-day']=t=>{const d=t.dataset.d;if(calSel===d&&$('#daypop')){closeDayPop();return}calSel=d;render();openDayPop(d)};
function dayItems(ds){
  const out=[];const dt=parseYmd(ds);const future=diffDays(ds)>=0;
  if(dt.getDay()===REG.weekday){const rs=regStat(ds);
    if(rs&&rs.status==='취소')out.push({c:'var(--muted)',dim:1,t:'정기모임',s:`${rs.reason}${rs.note?' · '+rs.note:''}${isCourtCx(rs)?` · 대체일 ${rs.mkDate?fmtD(rs.mkDate):'미정'}`:''}`,btns:RO?[]:(isCourtCx(rs)?[['reg-makeup','대체일']]:[]).concat([['reg-restore','복구']]),d:ds});
    else if(rs&&rs.status==='삭제')out.push({c:'var(--muted)',dim:1,t:'정기모임 미진행',s:rs.note||'다른 일정과 겹침',btns:RO?[]:[['reg-restore','복구']],d:ds});
    else out.push({c:'var(--t-reg)',t:'정기모임',s:`${REG.start}–${REG.end} · ${REG.place}`,act:!RO&&future?'reg-draw':null,d:ds,btns:RO?[]:[['reg-cancel','취소'],['reg-del','삭제','del']]});}
  {const mk=mkOn(ds);if(mk)out.push({c:'var(--t-reg)',t:'정기모임 (대체일)',s:`${mk.mkStart||REG.start}–${mk.mkEnd||REG.end} · ${fmtD(mk.id)} 코트 측 취소분`,act:!RO&&future?'reg-draw':null,d:ds,btns:RO?[]:[['reg-mk-at','변경']]})}
  S.brackets.filter(b=>b.cfg&&b.cfg.date===ds).forEach(b=>out.push({c:'var(--court)',t:`대진표 · ${b.status}`,s:`${Object.keys(b.players||{}).length}명 참석`,act:'bv-open',id:b.id}));
  eventsOn(ds).forEach(ev=>{const cx=ev.status==='취소';out.push({c:cx?'var(--muted)':'var(--tc)',cls:'t-'+ev.type,dim:cx,t:ev.title,s:cx?`${ev.cancelReason||'취소'}${ev.cancelNote?' · '+ev.cancelNote:''}`:(ev.type==='개인대회'?'개인 대회':ev.type),act:'ev-open',id:ev.id,btns:RO?[]:cx?[['ev-restore','복구']]:[['ev-cancel','취소'],['dp-del','삭제','del']]})});
  S.members.filter(m=>m.birth&&ST(m)==='활동'&&bdayIn(m.birth,dt.getFullYear())===ds).forEach(m=>out.push({c:'var(--t-bd)',t:`${m.name} 생일`,s:`만 ${dt.getFullYear()-parseYmd(m.birth).getFullYear()}세`,act:RO?null:'m-edit',id:m.id}));
  openings(400).filter(o=>ymd(o.date)===ds).forEach(o=>out.push({c:'var(--ball)',t:`${o.court.name} 예약 오픈`,s:`${pad(o.date.getHours())}:${pad(o.date.getMinutes())} · ${o.kind==='res'?'주민 우선':'일반'}`,act:null}));
  return out;
}
function closeDayPop(){const p=$('#daypop');if(p)p.remove();const b=$('#dp-back');if(b){b.remove();if(!$('#modal-root').innerHTML)unlockPage()}}
function openDayPop(ds){
  closeDayPop();
  const anchor=document.querySelector(`.mgrid [data-d="${ds}"]`);const items=dayItems(ds);const phone=window.innerWidth<=640;
  const p=document.createElement('div');p.id='daypop';p.className='daypop'+(phone?' sheet center':'');p.setAttribute('role','dialog');p.setAttribute('aria-label',fmtFull(ds)+' 일정');
  p.innerHTML=`<div class="dp-h"><b>${fmtFull(ds)}</b><button class="dp-x" data-act="dp-close" aria-label="닫기">닫기</button></div>
  <div class="dp-list">${items.length?items.map(it=>`<div class="dp-it${it.act?' click':''}${it.dim?' dim':''} ${it.cls||''}"${it.act?` data-act="${it.act}" data-id="${it.id||''}" data-d="${it.d||''}" role="button" tabindex="0"`:''}><span class="dot" style="background:${it.c}"></span><div class="grow"><div class="dp-t">${h(it.t)}</div><div class="dp-s">${h(it.s)}</div></div>${(it.btns||[]).length?'<div class="dp-btns" data-act="noop">':''}${(it.btns||[]).map(([act,l,k])=>`<button class="dp-x${k?' '+k:''}" data-act="${act}" data-id="${it.id||''}" data-d="${ds}" aria-label="${h(it.t)} ${l}">${l}</button>`).join('')}${(it.btns||[]).length?'</div>':''}</div>`).join(''):'<div class="dp-empty">일정 없음</div>'}</div>
  ${RO?'':`<button class="btn pri dp-add" data-act="ev-new" data-d="${ds}" data-stay="1">+ 일정 추가</button>`}`;
  if(phone){const bk=document.createElement('div');bk.id='dp-back';bk.className='dp-back';bk.addEventListener('click',closeDayPop);document.body.appendChild(bk);lockPage()}
  document.body.appendChild(p);
  if(!phone&&anchor){const rc=anchor.getBoundingClientRect(),w=p.offsetWidth,hh=p.offsetHeight;let x=rc.left+rc.width/2-w/2+scrollX,y=rc.bottom+8+scrollY;x=Math.max(8+scrollX,Math.min(x,scrollX+innerWidth-w-8));if(rc.bottom+8+hh>innerHeight&&rc.top-hh-8>0)y=rc.top-hh-8+scrollY;p.style.left=x+'px';p.style.top=y+'px'}
}
function reopenPop(){closeDayPop();calSel=null;render()}
function cancelForm(withMk){return `<div class="f">취소 사유<div class="cbchips">${CANCEL_REASONS.map((r,i)=>`<label><input type="radio" name="reason" value="${r}"${i===0?' checked':''}>${r}</label>`).join('')}</div></div><label class="f">메모 (선택)<input class="in" name="note" placeholder="예: 오전 강수량 많음, 코트 보수 공사"></label><p class="small muted" style="margin:0">취소 사유는 코트 탭의 정기대관 사용 현황에 기록</p>${withMk?`<fieldset class="fs" id="mk-fields" hidden><legend>대체일 (선택 · 추후 입력 가능)</legend>${mkFields({})}<p class="small muted" style="margin:0">정기모임과 같은 시간만큼 다른 날 이용. 대체일 사용 시 정상 청구, 대체일을 쓰지 못하면 해당 회차 비용 없음</p></fieldset>`:''}`}
document.addEventListener('change',e=>{if(e.target.name==='reason'&&e.target.closest('#mform')){const f=$('#mk-fields');if(f)f.hidden=e.target.value!==COURT_CX}});
ACT['reg-cancel']=(t,e)=>{e.stopPropagation();const ds=t.dataset.d;closeDayPop();openModal(`${fmtFull(ds)} 정기모임 취소`,cancelForm(true),async fd=>{const ct=fd.reason===COURT_CX;await put('regstat',ds,{date:ds,status:'취소',reason:fd.reason||'기타',note:(fd.note||'').trim(),mkDate:ct?(fd.mkDate||''):'',mkStart:ct?(fd.mkStart||REG.start):'',mkEnd:ct?(fd.mkEnd||REG.end):'',mkUnused:false,createdAt:Date.now()});toast('정기모임 취소 처리 완료');reopenPop(ds)},'','sm');const b=$('#mform button[type=submit]');if(b)b.textContent='취소 처리'};
ACT['reg-del']=async(t,e)=>{e.stopPropagation();if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='정말 삭제';t.classList.add('on');setTimeout(()=>{if(document.body.contains(t)){delete t.dataset.confirm;t.textContent='삭제';t.classList.remove('on')}},4000);return}const ds=t.dataset.d;try{await put('regstat',ds,{date:ds,status:'삭제',reason:'일정 삭제',note:'다른 일정과 겹침',createdAt:Date.now()});toast('해당 날짜 정기모임 삭제 완료')}catch(err){return}reopenPop(ds)};
ACT['reg-restore']=async(t,e)=>{e.stopPropagation();const ds=t.dataset.d;try{await del('regstat',ds);toast('정기모임 복구 완료')}catch(err){return}reopenPop()};
ACT['reg-makeup']=(t,e)=>{e&&e.stopPropagation&&e.stopPropagation();const ds=t.dataset.d;const rs=regStat(ds);if(!rs)return;closeDayPop();
  openModal(`${fmtFull(ds)} 취소분 대체일`,`<p class="small muted" style="margin:0">코트 측 사정으로 취소된 정기모임을 같은 시간만큼 다른 날 이용</p>${mkFields(rs)}<label class="check"><input type="checkbox" name="mkUnused"${rs.mkUnused?' checked':''}> 대체일 미사용 (해당 회차 비용 없음)</label><p class="small muted" style="margin:0">대체일 사용 시 정상 청구, 미사용 시 분기 정산에서 차감</p>`,
    async fd=>{await put('regstat',ds,{...rs,mkDate:fd.mkDate||'',mkStart:fd.mkStart||REG.start,mkEnd:fd.mkEnd||REG.end,mkUnused:!!fd.mkUnused});toast(fd.mkDate?'대체일 저장 완료':'저장 완료');reopenPop()},
    rs.mkDate?`<button type="button" class="btn danger" data-act="mk-clear" data-d="${ds}">대체일 삭제</button>`:'')};
ACT['mk-clear']=async t=>{const rs=regStat(t.dataset.d);if(!rs)return;try{await put('regstat',rs.id,{...rs,mkDate:'',mkUnused:false})}catch(e){return}closeModal();toast('대체일 삭제 완료');render()};
ACT['reg-mk-at']=(t,e)=>{const r=mkOn(t.dataset.d);if(r)ACT['reg-makeup']({dataset:{d:r.id}},e)};
ACT['ev-cancel']=(t,e)=>{e.stopPropagation();const ev=S.events.find(x=>x.id===t.dataset.id);if(!ev)return;const ds=t.dataset.d;closeDayPop();openModal(`${ev.title} 취소`,cancelForm(),async fd=>{await put('events',ev.id,{...ev,status:'취소',cancelReason:fd.reason||'기타',cancelNote:(fd.note||'').trim(),cancelledAt:Date.now()});toast('행사 취소 처리 완료');reopenPop(ds)});const b=$('#mform button[type=submit]');if(b)b.textContent='취소 처리'};
ACT['ev-restore']=async(t,e)=>{e.stopPropagation();const ev=S.events.find(x=>x.id===t.dataset.id);if(!ev)return;const ds=t.dataset.d;const o={...ev,status:'확정'};delete o.cancelReason;delete o.cancelNote;delete o.cancelledAt;try{await put('events',ev.id,o);toast('행사 복구 완료')}catch(err){return}reopenPop(ds)};
ACT['dp-close']=()=>{closeDayPop();calSel=null;render()};
ACT['dp-del']=async(t,e)=>{e.stopPropagation();if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='정말 삭제';t.classList.add('on');setTimeout(()=>{if(document.body.contains(t)){delete t.dataset.confirm;t.textContent='삭제';t.classList.remove('on')}},4000);return}
  const id=t.dataset.id;const ds=calSel;try{for(const n of S.notes.filter(n=>n.eventId===id))await del('notes',n.id);await del('events',id);toast('일정 삭제 완료')}catch(err){return}
  reopenPop()};
document.addEventListener('click',e=>{const p=$('#daypop');if(p&&!p.classList.contains('sheet')&&!e.target.closest('#daypop')&&!e.target.closest('[data-act="cal-day"]'))closeDayPop()},true);
window.addEventListener('hashchange',closeDayPop);

/* =========================================================
   MEMBERS
   ========================================================= */
let mf={q:'',g:'',lv:'',area:'',st:'',yr:'',sort:'name',dir:1};
const LEVELS=[1,1.5,2,2.5,3,3.5,4,4.5,5];
const ROLES=['회장','부회장','총무','홍보부장','운영팀장'];
const LEVEL_DESC={1:'입문 (랠리 연습 중)',1.5:'입문+',2:'초급 (게임 가능)',2.5:'초급+',3:'중급 (안정적 랠리·서브)',3.5:'중급+',4:'중상급 (전략 플레이)',4.5:'상급',5:'최상급 (대회 입상권)'};
function viewMembers(){
  let list=S.members.slice();
  const q=mf.q.trim();
  if(q)list=list.filter(m=>(m.name||'').includes(q)||(m.district||'').includes(q)||(m.memo||'').includes(q));
  if(mf.g)list=list.filter(m=>m.gender===mf.g);
  if(mf.lv)list=list.filter(m=>Math.floor(Number(m.level)||0)===Number(mf.lv));
  if(mf.area)list=list.filter(m=>m.district===mf.area);
  if(mf.st==='운영진')list=list.filter(m=>(isStaff(m)||nextStaff(m))&&isCur(m));else if(mf.st==='all'){}else if(mf.st)list=list.filter(m=>ST(m)===mf.st);else list=list.filter(isCur);
  if(mf.yr)list=list.filter(m=>yearsOf(m).includes(Number(mf.yr)));
  const key={name:m=>m.name||'',gender:m=>m.gender||'',level:m=>Number(m.level)||0,since:m=>m.since||'9999',district:m=>m.district||'',work:m=>m.work||'',status:m=>m.status||'활동',staff:m=>isStaff(m)?0:nextStaff(m)?1:2}[mf.sort];
  list.sort((a,b)=>{const x=key(a),y=key(b);return (x>y?1:x<y?-1:0)*mf.dir});
  const areas=[...new Set(S.members.map(m=>m.district).filter(Boolean))].sort();
  const samples=S.members.filter(m=>m.sample).length;
  const th=(k,l)=>`<th data-act="m-sort" data-k="${k}">${l}${mf.sort===k?(mf.dir>0?' ↑':' ↓'):''}</th>`;
  const body=!S.members.length?`<div class="empty"><b>등록된 회원 없음</b>이름·성별·테니스 시작 연월·레벨·거주 구 등록 시 대진표 편성과 코트 우선예약 안내에 활용<div class="row"><button class="btn pri" data-act="m-new">회원 추가</button><button class="btn" data-act="m-sample">예시 회원 12명으로 둘러보기</button></div></div>`:
  `<div class="toolbar"><input class="in search" id="m-q" placeholder="이름·지역·메모 검색" value="${h(mf.q)}" data-mf="q">
  <select class="in" id="m-g" data-mf="g"><option value="">성별 전체</option><option value="M"${mf.g==='M'?' selected':''}>남</option><option value="F"${mf.g==='F'?' selected':''}>여</option></select>
  <select class="in" id="m-lv" data-mf="lv"><option value="">레벨 전체</option>${[5,4,3,2,1].map(k=>`<option value="${k}"${String(mf.lv)===String(k)?' selected':''}>${'★'.repeat(k)} (${k}.0–${k}.5)</option>`).join('')}</select>
  <select class="in" id="m-a" data-mf="area"><option value="">거주지 전체</option>${areas.map(a=>`<option${mf.area===a?' selected':''}>${h(a)}</option>`).join('')}</select>
  <select class="in" id="m-s" data-mf="st">${[['','현 회원'],['활동','활동'],['휴면','휴면'],['운영진','운영진'],['게스트','게스트 전환'],['탈퇴','탈퇴'],['all','전체 (전환·탈퇴 포함)']].map(([v,l])=>`<option value="${v}"${mf.st===v?' selected':''}>${l}</option>`).join('')}</select>
  <select class="in" id="m-y" data-mf="yr"><option value="">등록 연도 전체</option>${regYears().map(y=>`<option value="${y}"${String(mf.yr)===String(y)?' selected':''}>${y}년 등록</option>`).join('')}</select>
  <span class="muted small">${list.length}명 표시</span></div>
  <div class="mcards">${list.map((m,i)=>`<div class="mcard${ST(m)!=='활동'?' dim':''}" data-act="m-edit" data-id="${m.id}"><div class="top1"><div><span class="num muted small" style="margin-right:6px">${i+1}</span><b>${h(m.name)}</b> <span class="g-${m.gender} small">${m.gender==='M'?'남':'여'}</span>${staffChip(m)}${m.sample?' <span class="chip">예시</span>':''}</div>${stars(m.level)}</div><div class="meta">${m.birth?`<span>만 ${ageOf(m.birth)}세</span>`:''}<span>구력 ${h(career(m.since)||'–')}</span><span>${ST_LABEL[ST(m)]} ${yrsHtml(m)}</span></div><div class="meta">${`<span>${h(areaLabel(m.district)||'거주지 미입력')}</span>`}${m.work?`<span>직장 ${h(areaLabel(m.work))}</span>`:''}${m.phone?`<span>${telLink(m.phone)}</span>`:''}</div></div>`).join('')||'<div class="empty">조건에 맞는 회원 없음</div>'}</div>
  <div class="tbl-wrap"><table class="tbl mt">${MEM_COLS}<thead><tr><th style="cursor:default">No.</th>${th('name','이름')}${th('gender','성별·나이')}${th('level','레벨')}${th('since','구력')}${th('district','거주')}${th('work','직장')}<th style="cursor:default">전화번호</th>${th('status','상태')}<th>메모</th></tr></thead><tbody>
  ${list.map((m,i)=>`<tr class="${ST(m)!=='활동'?'dim':''}" data-act="m-edit" data-id="${m.id}" style="cursor:pointer"><td class="num muted">${i+1}</td><td><b>${h(m.name)}</b>${staffChip(m)}${m.sample?' <span class="chip">예시</span>':''}</td><td class="g-${m.gender}">${m.gender==='M'?'남':m.gender==='F'?'여':''}${m.birth?` <span class="muted small">만 ${ageOf(m.birth)}세</span>`:''}</td><td>${stars(m.level)}</td><td><span class="num">${h(career(m.since))}</span> <span class="muted small">${m.since?h(m.since.replace('-','.')):''}</span></td><td>${h(areaLabel(m.district))}</td><td class="muted">${h(areaLabel(m.work))}</td><td class="small">${m.phone?telLink(m.phone):''}</td><td>${stChip(m)}${yrsHtml(m)}</td><td class="muted small" style="max-width:220px;overflow:hidden;text-overflow:ellipsis">${h(m.memo)}</td></tr>`).join('')}
  ${!list.length?'<tr><td colspan="10" class="muted" style="text-align:center;padding:24px">조건에 맞는 회원 없음</td></tr>':''}</tbody></table></div>`;
  return `<div class="page-head"><div><h1>회원 관리</h1><p>현 회원 ${S.members.filter(isCur).length}명 · 활동 ${activeMembers().length}명 · 운영진 ${S.members.filter(m=>isStaff(m)&&isCur(m)).length}명 · ${regYears().map(y=>`${y}년 등록 ${S.members.filter(m=>yearsOf(m).includes(y)).length}명`).join(' · ')}. 항목 선택 시 수정 가능</p></div><div class="row"><button class="btn" data-act="renew-open">연장 관리</button>${samples?`<button class="btn danger" data-act="m-clear-sample">예시 회원 ${samples}명 삭제</button>`:''}<button class="btn pri" data-act="m-new">회원 추가</button></div></div>${body}
  ${guestSection()}
  <datalist id="areas">${SEOUL.concat(NEAR).map(a=>`<option value="${a}">`).join('')}</datalist>`;
}
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.mf){mf[t.dataset.mf]=t.value;render()}
});
document.addEventListener('change',e=>{
  const t=e.target;if(!t.closest||!t.closest('#mform'))return;
  if(t.name==='staff'){const r=t.form.elements.role;if(r){r.disabled=!t.checked}const st=t.form.querySelector('.staff-term');if(st){st.hidden=!t.checked;if(t.checked){const cy=new Date().getFullYear();const fut=[...st.querySelectorAll('input')].filter(i=>+i.name.slice(3)>=cy);if(!fut.some(i=>i.checked)){const c=st.querySelector(`[name=sy_${cy}]`);if(c)c.checked=true}}}}
  if(t.name==='birth'){const o=$('#age-out');if(o)o.value=t.value?'만 '+ageOf(t.value)+'세':''}
});
ACT['m-sort']=t=>{const k=t.dataset.k;if(mf.sort===k)mf.dir*=-1;else{mf.sort=k;mf.dir=1}render()};
function memberForm(m={}){
  return `<div class="grid2"><label class="f">이름<input class="in" name="name" required value="${h(m.name)}"></label>
  <label class="f">성별<select class="in" name="gender"><option value="M"${m.gender==='M'?' selected':''}>남</option><option value="F"${m.gender==='F'?' selected':''}>여</option></select></label></div>
  <div class="grid2"><div class="f">생년월일<div class="pickrow"><input class="in" id="birth-txt" inputmode="numeric" autocomplete="bday" placeholder="예: 1990.01.15" value="${h(fmtBirth(m.birth))}" aria-label="생년월일 숫자 입력"><button type="button" class="btn" data-act="birth-wheel">선택</button></div><input type="hidden" name="birth" id="birth-val" value="${h(m.birth)}"></div><label class="f">나이 (자동 계산)<input class="in" id="age-out" value="${m.birth?'만 '+ageOf(m.birth)+'세':''}" readonly tabindex="-1" placeholder="생년월일 입력 시 표시"></label></div>
  <div class="grid2"><label class="f">테니스 시작 연월${wheelField(m.since,'since','ym','테니스 시작 연월')}</label>
  <div class="f">실력 레벨${levelSelect('level',m.level??3,false)}</div></div>
  <div class="grid2"><div class="f">거주지 (구·시)${areaField('district',m.district,'선택')}</div>
  <div class="f">직장 소재지 (선택)${areaField('work',m.work,'선택 안 함')}</div></div>
  <label class="f">전화번호 (선택)<input class="in" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="010-0000-0000" value="${h(fmtPhone(m.phone))}"></label>
  <div class="grid2"><label class="f">상태<select class="in" name="status">${['활동','휴면','탈퇴'].concat(ST(m)==='게스트'?['게스트']:[]).map(s=>`<option value="${s}"${ST(m)===s?' selected':''}>${ST_LABEL[s]}</option>`).join('')}</select></label>
  <label class="f">가입일 (선택)${wheelField(m.joined,'joined','ymd','가입일')}</label></div>
  <div class="grid2"><label class="check" style="align-self:end;padding-bottom:8px"><input type="checkbox" name="staff"${(isStaff(m)||isStaff(m,curY()+1))?' checked':''}> 운영진</label>
  <label class="f">직책 (운영진 체크 시 선택)<select class="in" name="role"${(isStaff(m)||isStaff(m,curY()+1))?'':' disabled'}><option value="">선택</option>${ROLES.map(r=>`<option${(staffRole(m)||staffRole(m,curY()+1)||m.role)===r?' selected':''}>${r}</option>`).join('')}</select></label></div>
  <div class="f staff-term"${(isStaff(m)||isStaff(m,curY()+1))?'':' hidden'}><span>임기 (중복 선택 가능)</span><div class="iopick">${staffYearList(m).map(y=>`<label><input type="checkbox" name="sy_${y}"${isStaff(m,y)?' checked':''}><span>${y}년</span></label>`).join('')}</div></div>
  <div class="f">등록 연도 <span style="font-weight:500">(매년 연장 시 체크 · 탈퇴·게스트 전환 후에도 기록 유지)</span><div class="cbchips">${(()=>{const ys=yearsOf(m);const mx=Math.max(new Date().getFullYear()+1,...ys);const o=[];for(let y=CLUB_Y;y<=mx;y++)o.push(y);return o.map(y=>`<label><input type="checkbox" name="yr_${y}"${ys.includes(y)?' checked':''}>${y}년</label>`).join('')})()}</div></div>
  <label class="f">메모<textarea class="in" name="memo" placeholder="선호 포지션, 참고사항 등">${h(m.memo)}</textarea></label>
  ${m.id&&isCur(m)?`<div class="convbox"><div><b>게스트로 전환</b><span>가끔 참석하는 경우. 게스트 명단으로 이동, 등록 연도 기록 유지</span></div><button type="button" class="btn" data-act="m-to-guest" data-id="${m.id}">게스트 전환</button></div>`:''}
  <datalist id="areas-m">${SEOUL.concat(NEAR).map(a=>`<option value="${a}">`).join('')}</datalist>`;
}
/* 임기 버튼: 기록이 있는 첫 해부터 올해까지, 8월부터는 다음 해도 */
function staffYearList(m){const t=new Date(),y0=t.getFullYear(),last=t.getMonth()>=7?y0+1:y0;const ys=Object.keys(staffMap(m)).map(Number).filter(Boolean);const first=Math.min(y0,...ys),end=Math.max(last,...ys);const out=[];for(let y=first;y<=end;y++)out.push(y);return out}
function staffFromFd(fd,old){const sy={...staffMap(old)};const role=(fd.role||'').trim();
  Object.keys(fd).filter(k=>/^sy_\d{4}$/.test(k)).forEach(k=>{const y=k.slice(3);if(!fd.staff){if(y>=String(curY()))delete sy[y];return}if(fd[k]===true){if(!(y in sy)||y>=String(curY()))sy[y]=role}else delete sy[y]});/* 화면에 없는 연도는 그대로 보존 · 지난 해 직책은 유지 */
  return {staffYears:sy,staff:isStaff({staffYears:sy}),role:isStaff({staffYears:sy})?role:''}}
const memberFromFd=(fd,old={})=>({...old,name:fd.name.trim(),gender:fd.gender,since:fd.since,level:Number(fd.level),district:(fd.district||'').trim(),phone:fmtPhone(fd.phone||''),work:(fd.work||'').trim(),status:fd.status,joined:fd.joined,memo:fd.memo.trim(),...staffFromFd(fd,old),birth:fd.birth||'',years:Object.keys(fd).filter(k=>k.startsWith('yr_')&&fd[k]===true).map(k=>Number(k.slice(3))).sort(),...(fd.status!==ST(old)&&['탈퇴','게스트'].includes(fd.status)?{changedYear:new Date().getFullYear(),changedAt:Date.now()}:{})});
ACT['m-new']=()=>openModal('회원 추가',memberForm(),fd=>{const id=uid();return put('members',id,{...memberFromFd(fd),createdAt:Date.now()})});
ACT['m-edit']=t=>{closeDayPop();const m=memberById(t.dataset.id);if(!m)return;openModal(`${m.name} 정보 수정`,memberForm(m),fd=>put('members',m.id,memberFromFd(fd,m)),`<button type="button" class="btn danger" data-act="m-del" data-id="${m.id}">삭제</button>`)};
ACT['m-del']=t=>{const b=t;if(b.dataset.confirm){del('members',b.dataset.id);closeModal()}else{b.dataset.confirm='1';b.textContent='한 번 더 누르면 삭제'}};
async function memberToGuest(m,y){
  const gid=uid();
  await put('guests',gid,{name:m.name,nick:'',gender:m.gender,level:m.level??null,career:career(m.since),contact:'',inviter:'',memo:m.memo||'',memberId:m.id,visits:0,createdAt:Date.now()});
  await put('members',m.id,{...m,years:yearsOf(m),status:'게스트',staff:false,role:'',changedYear:y||new Date().getFullYear(),changedAt:Date.now()});
  cfg.picked=cfg.picked.map(x=>x===m.id?gid:x);saveCfg();
}
ACT['m-to-guest']=async t=>{if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='한 번 더 누르면 전환';return}
  const m=memberById(t.dataset.id);if(!m)return;try{await memberToGuest(m)}catch(e){return}closeModal();toast(`${m.name} 님 게스트 전환 완료. 등록 연도 기록 유지`);render()};
ACT['g-clear-member']=async t=>{if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='한 번 더 누르면 초기화';return}
  const g=S.guests.find(x=>x.id===t.dataset.id);if(!g)return;const old=g.memberId&&memberById(g.memberId);
  try{const ng={...g};delete ng.memberId;delete ng.id;await put('guests',g.id,ng);
    if(old&&old.status==='게스트')await del('members',old.id)}catch(e){return}
  closeModal();toast(`${g.name} 님 전 회원 기록 초기화 완료`);render()};
ACT['g-to-member']=async t=>{if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='한 번 더 누르면 등록';return}
  const g=S.guests.find(x=>x.id===t.dataset.id);if(!g)return;const Y=new Date().getFullYear();const old=g.memberId&&memberById(g.memberId);let mid;
  try{
    if(old){mid=old.id;await put('members',old.id,{...old,status:'활동',years:[...new Set([...yearsOf(old),Y])].sort(),guestVisits:(old.guestVisits||0)+(g.visits||0),changedYear:null,changedAt:Date.now()})}
    else{mid=uid();await put('members',mid,{name:g.name,gender:g.gender,level:g.level===null||g.level===undefined||g.level===''?3:Number(g.level),since:'',district:'',work:'',status:'활동',joined:ymd(today0()),memo:[g.nick?'닉네임 '+g.nick:'',g.memo||''].filter(Boolean).join(' · '),staff:false,role:'',birth:'',years:[Y],fromGuest:true,guestVisits:g.visits||0,createdAt:Date.now()})}
    await del('guests',g.id);
  }catch(e){return}
  cfg.picked=cfg.picked.map(x=>x===g.id?mid:x);saveCfg();closeModal();toast(`${g.name} 님 정회원 등록 완료${old?' · 기존 회원 기록 복원':' · 회원 정보 보완 필요'}`);render()};

/* ---------- yearly renewal ---------- */
let renewY=null;
function renewBody(){
  const t=new Date().getFullYear();const Y=renewY;
  const pool=S.members.filter(m=>!m.sample&&(isCur(m)||Number(m.changedYear)===Y)).sort((x,y)=>(x.name||'').localeCompare(y.name||'','ko'));
  const done=pool.filter(m=>isCur(m)&&yearsOf(m).includes(Y)),todo=pool.filter(m=>isCur(m)&&!yearsOf(m).includes(Y)),out=pool.filter(m=>!isCur(m));
  const nm=m=>`<div class="grow"><b>${h(m.name)}</b> <span class="g-${m.gender} small">${m.gender==='M'?'남':'여'}</span>${yrsHtml(m)}</div>`;
  const row=(m,btns)=>`<div class="rn-row">${nm(m)}<div class="rn-btns" data-act="noop">${btns}</div></div>`;
  const b=(act,id,l,cls='')=>`<button type="button" class="btn sm ${cls}" data-act="${act}" data-id="${id}">${l}</button>`;
  return `<div class="row" style="justify-content:space-between;margin-bottom:8px"><div class="seg">${[t,t+1].map(y=>`<button class="${y===Y?'on':''}" data-act="rn-y" data-v="${y}">${y}년</button>`).join('')}</div>
    <div class="chips"><span class="chip ok">연장 ${done.length}</span><span class="chip warn">미정 ${todo.length}</span><span class="chip">전환·탈퇴 ${out.length}</span></div></div>
    <p class="small muted" style="margin:0 0 6px">${Y}년 회원 연장 조사 결과 기록. 연장 시 ${Y}년 등록, 게스트 전환 시 게스트 명단으로 이동, 탈퇴 시 명단에서 제외. 지난 등록 연도 기록은 모두 유지</p>
    ${todo.length?`<div class="rn-h">미정 ${todo.length}</div>${todo.map(m=>row(m,b('rn-yes',m.id,'연장','pri')+b('rn-guest',m.id,'게스트')+b('rn-out',m.id,'탈퇴','danger'))).join('')}`:''}
    ${done.length?`<div class="rn-h">${Y}년 연장 ${done.length}</div>${done.map(m=>row(m,b('rn-undo',m.id,'연장 취소','ghost'))).join('')}`:''}
    ${out.length?`<div class="rn-h">${Y}년 전환·탈퇴 ${out.length}</div>${out.map(m=>row(m,`<span class="chip${ST(m)==='탈퇴'?' out':''}">${ST_LABEL[ST(m)]}</span>`+b('rn-back',m.id,'되돌리기','ghost'))).join('')}`:''}
    ${!pool.length?'<div class="muted small" style="padding:16px 0">등록된 회원 없음</div>':''}`;
}
ACT['renew-open']=()=>{const d=new Date();if(!renewY)renewY=d.getFullYear()+(d.getMonth()>=9?1:0);
  $('#modal-root').innerHTML=`<div class="ov" data-act="ov-close"><div class="modal" role="dialog" aria-modal="true" aria-label="회원 연장 관리"><div class="m-head"><h2>회원 연장 관리</h2><button type="button" class="modal-x" data-act="close-modal" aria-label="닫기">×</button></div><div id="renew-body">${renewBody()}</div></div></div>`;lockPage()};
ACT['rn-y']=t=>{renewY=+t.dataset.v;const rb=$('#renew-body');if(rb)rb.innerHTML=renewBody()};
const rnM=t=>memberById(t.dataset.id);
ACT['rn-yes']=async t=>{const m=rnM(t);if(!m)return;t.disabled=true;try{await put('members',m.id,{...m,years:[...new Set([...yearsOf(m),renewY])].sort()})}catch(e){t.disabled=false}};
ACT['rn-undo']=async t=>{const m=rnM(t);if(!m)return;t.disabled=true;try{await put('members',m.id,{...m,years:yearsOf(m).filter(y=>y!==renewY)})}catch(e){t.disabled=false}};
ACT['rn-out']=async t=>{const m=rnM(t);if(!m)return;t.disabled=true;try{await put('members',m.id,{...m,years:yearsOf(m),status:'탈퇴',staff:false,role:'',changedYear:renewY,changedAt:Date.now()});toast(`${m.name} 님 탈퇴 처리. 활동 연도 기록 유지`)}catch(e){t.disabled=false}};
ACT['rn-guest']=async t=>{const m=rnM(t);if(!m)return;t.disabled=true;try{await memberToGuest(m,renewY);toast(`${m.name} 님 게스트 전환 완료`)}catch(e){t.disabled=false}};
ACT['rn-back']=async t=>{const m=rnM(t);if(!m)return;t.disabled=true;
  try{if(ST(m)==='게스트'){for(const g of S.guests.filter(g=>g.memberId===m.id)){cfg.picked=cfg.picked.map(x=>x===g.id?m.id:x);await del('guests',g.id)}saveCfg()}
    await put('members',m.id,{...m,years:yearsOf(m),status:'활동',changedYear:null})}catch(e){t.disabled=false}};
ACT['m-sample']=async()=>{
  const smp=[['김도윤','M',4,'2018-03','송파구'],['이서연','F',3.5,'2020-05','강동구'],['박지훈','M',3,'2021-09','송파구'],['최유나','F',2.5,'2022-04','광진구'],['정민재','M',3.5,'2019-07','강남구'],['한지민','F',3,'2021-02','송파구'],['오준서','M',2,'2023-06','성동구'],['윤하은','F',2,'2023-10','강동구'],['장현우','M',4.5,'2015-04','서초구'],['임수아','F',4,'2017-08','송파구'],['강태민','M',2.5,'2022-11','광진구'],['신예린','F',1.5,'2024-08','강남구']];
  for(const [n,g,l,s,d] of smp){await put('members',uid(),{name:'(예시) '+n,gender:g,level:l,since:s,district:d,work:'',status:'활동',memo:'',sample:true,createdAt:Date.now()})}
  toast('예시 회원 12명 추가 완료. 회원 관리의 예시 회원 삭제 버튼으로 일괄 삭제 가능');
};
ACT['m-clear-sample']=async t=>{if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='한 번 더 누르면 삭제';return}for(const m of S.members.filter(m=>m.sample))await del('members',m.id);toast('예시 회원 삭제 완료')};

/* =========================================================
   BRACKET
   ========================================================= */
const MODES={balance:'레벨 균형 (기본)',mixed:'혼복 많이',same:'남복·여복 많이',tier:'비슷한 실력끼리'};
const MODE_DESC={balance:'인원 구성에 따른 경기 종류 혼합, 팀 레벨 합 균형 중심',mixed:'혼복 비중 확대',same:'남복·여복 위주 편성',tier:'레벨이 비슷한 4인 단위 코트 편성'};
const PREF={M:'남복 우선',F:'여복 우선',X:'혼복 우선','':'자유'};
const TYPE_BG={'남복':'#DCE8F5','여복':'#FBDDD0','혼복':'#E1EED8'};
const defCourts=()=>[{name:'코트 1',pref:'M'},{name:'코트 2',pref:'F'},{name:'코트 3',pref:''}];
let cfg=lsGet('sbpb-drawcfg3',null)||{title:REG.title,date:nextRegNow(),place:REG.place,start:REG.gameStart,end:REG.end,mins:30,courtList:defCourts(),mode:'balance',picked:[]};
if(!Array.isArray(cfg.courtList)||!cfg.courtList.length)cfg.courtList=defCourts();
const toMin=t=>{const [a,b]=(t||'00:00').split(':').map(Number);return a*60+b};
const fromMin=t=>`${pad(Math.floor(t/60)%24)}:${pad(t%60)}`;
function roundsOf(c){const n=Math.floor((toMin(c.end||'12:00')-toMin(c.start))/(Number(c.mins)||30));return Math.max(1,Math.min(20,n||1))}
if(!cfg.date||diffDays(cfg.date)<0||(cfg.date===nextReg()&&cfg.date!==nextRegNow()))cfg.date=nextRegNow();
let draft=lsGet('sbpb-draft3',null);
if(draft&&draft.cfg&&diffDays(draft.cfg.date)<0)draft=null; // {id,cfg,players,rounds:[{matches:[{a:[k,k],b:[k,k]}|null per court],rest:[k]}],status}
let sel=null,plq='',plf='',imgArm=0;
ACT['pl-f']=t=>{plf=t.dataset.v;render()};
function saveCfg(){lsSet('sbpb-drawcfg3',cfg)}
function saveDraft(){lsSet('sbpb-draft3',draft)}
const dn=n=>String(n||'').replace(/^\(예시\) /,'');
function rosterAll(){
  const ms=activeMembers().map(m=>({key:m.id,name:m.name,gender:m.gender,level:Number(m.level)||3,guest:false}));
  const gs=S.guests.map(g=>({key:g.id,name:g.name,nick:g.nick||'',gender:g.gender,level:g.level===null||g.level===undefined||g.level===''?3:Number(g.level),lvUnknown:g.level===null||g.level===undefined||g.level==='',guest:true,inviter:g.inviter,lastDate:g.lastDate,visits:g.visits||0}));
  return ms.concat(gs);
}
function mtype(P,m){
  if(!m)return null;
  /* 기록에 적힌 종류(m.t)가 있어도 모든 선수 성별을 알면 성별로 다시 판단: 남남 대 여여 · 남남 대 남여 등은 잡복 */
  if(m.t){const ks=[...m.a,...m.b].filter(Boolean),gs=ks.map(k=>P[k]&&P[k].gender);const known=gs.every(x=>x==='M'||x==='F');
    if(known&&m.a.length===1&&m.b.length===1&&ks.length===2)return gs[0]!==gs[1]?'혼단':gs[0]==='M'?'남단':'여단';
    if(!(known&&ks.length===4&&m.a.length===2&&m.b.length===2))return m.t}if([...m.a,...m.b].every(k=>!k))return '미정';const ks=[...m.a,...m.b];if(ks.some(k=>!k||!P[k]))return '미완성';
  const g=ks.map(k=>P[k].gender);
  if(g.every(x=>x==='M'))return '남복';if(g.every(x=>x==='F'))return '여복';
  if(P[m.a[0]].gender!==P[m.a[1]].gender&&P[m.b[0]].gender!==P[m.b[1]].gender)return '혼복';
  return '잡복';
}
function permutations(n){const out=[];const a=[...Array(n).keys()];const go=(i)=>{if(i===n){out.push(a.slice());return}for(let j=i;j<n;j++){[a[i],a[j]]=[a[j],a[i]];go(i+1);[a[i],a[j]]=[a[j],a[i]]}};go(0);return out}
function courtCost(type,pref){
  if(type===null)return 0;
  if(pref==='M')return type==='남복'?0:type==='혼복'?2.5:3;
  if(pref==='F')return type==='여복'?0:type==='혼복'?1.2:2;
  if(pref==='X')return type==='혼복'?0:1.2;
  return type==='여복'?0.3:0.5;
}
function assignCourts(ms,types,courts){
  const C=courts.length;const items=ms.map((m,i)=>({m,t:types[i]}));while(items.length<C)items.push({m:null,t:null});
  let best=null,bc=Infinity;
  const perms=C<=6?permutations(C):[[...Array(C).keys()]];
  for(const p of perms){let c=0;p.forEach((ii,ci)=>{const it=items[ii];c+=it.m?courtCost(it.t,courts[ci].pref):(C-ci)*0.01});if(c<bc){bc=c;best=p}}
  return best.map(ii=>items[ii].m);
}

/* ---------- 대진 통계: 전체 기록 기준 페어 · 맞대결 · 정기모임 출석률 ---------- */
/* 지난 정기모임 대진(확정 · 이전 기록)만, 같은 날짜가 여럿이면 직접 만든 대진 우선 */
function pastBrackets(){const today=ymd(today0());const by={};
  S.brackets.filter(b=>b.cfg&&b.cfg.date&&!b.cfg.eventId&&b.cfg.date<=today&&(b.archive||b.status==='확정')).forEach(b=>{const o=by[b.cfg.date];if(!o||(o.archive&&!b.archive))by[b.cfg.date]=b});
  return Object.values(by).sort((x,y)=>x.cfg.date.localeCompare(y.cfg.date))}
const keyName=(k,b)=>{const m=S.members.find(x=>x.id===k),g=S.guests.find(x=>x.id===k);return (m||g||{}).name||(b&&b.players&&b.players[k]&&b.players[k].name)||String(k).replace(/^n:/,'')};
/* 실제 모임이 열린 날: CLUB_Y 1월부터 지난 토요일 중 취소 · 삭제가 아닌 날 + 대진 기록이 있는 날 */
function meetDates(){const out=new Set();const n=new Date();const endMin=REG.end.split(':').reduce((h,m)=>h*60+ +m,0);
  const d=new Date(CLUB_Y,0,1);while(d.getDay()!==REG.weekday)d.setDate(d.getDate()+1);
  for(;;d.setDate(d.getDate()+7)){const ds=ymd(d);const past=d<today0()||(ds===ymd(today0())&&n.getHours()*60+n.getMinutes()>=endMin);if(!past)break;
    const rs=regStat(ds);if(rs&&(rs.status==='취소'||rs.status==='삭제'))continue;out.add(ds)}
  pastBrackets().forEach(b=>out.add(b.cfg.date));
  (S.attend||[]).forEach(x=>{const rs=regStat(x.id);if(x.id<=ymd(today0())&&!(rs&&(rs.status==='취소'||rs.status==='삭제')))out.add(x.id)});return [...out].sort()}
function drawStats(){const B=pastBrackets();const pair={},opp={},att={},games={},last={};const add=(o,k,j,ds)=>{(o[k]=o[k]||{})[j]=(o[k][j]||0)+1};
  B.forEach(b=>{const ds=b.cfg.date;const seen=new Set();
    (b.rounds||[]).forEach(R=>{(R.matches||[]).forEach(m=>{if(!m)return;const A=(m.a||[]).filter(Boolean),Bb=(m.b||[]).filter(Boolean);
      [A,Bb].forEach(t=>{t.forEach(k=>{games[k]=(games[k]||0)+1;seen.add(k)});if(t.length===2){add(pair,t[0],t[1]);add(pair,t[1],t[0]);(last[t[0]]=last[t[0]]||{})[t[1]]=ds;(last[t[1]]=last[t[1]]||{})[t[0]]=ds}});
      A.forEach(x=>Bb.forEach(y=>{add(opp,x,y);add(opp,y,x)}))});(R.rest||[]).forEach(k=>k&&seen.add(k))});
    seen.forEach(k=>(att[k]=att[k]||new Set()).add(ds))});
  const bd=new Set(B.map(b=>b.cfg.date));(S.attend||[]).forEach(x=>{if(bd.has(x.id))return;(x.keys||[]).forEach(k=>(att[k]=att[k]||new Set()).add(x.id))});
  return {B,pair,opp,att,games,last}}
const memStart=m=>m.joined||`${Math.min(...yearsOf(m))}-01-01`;
let statP=lsGet('sbpb-stat-p','');let attOpen='';
ACT['st-att-row']=t=>{attOpen=attOpen===t.dataset.id?'':t.dataset.id;render()};
function statsPanel(){const st=drawStats();const MD=meetDates();const recD=new Set(st.B.map(b=>b.cfg.date).concat((S.attend||[]).map(x=>x.id)));const noRec=MD.filter(d=>!recD.has(d));
  const mem=S.members.filter(isCur);
  const rows=mem.map(m=>{const ds=MD.filter(d=>d>=memStart(m));const on=ds.filter(d=>st.att[m.id]&&st.att[m.id].has(d));const n=on.length;return {m,n,d:ds.length,r:ds.length?n/ds.length:0,on,off:ds.filter(d=>!on.includes(d))}}).sort((x,y)=>y.r-x.r||y.n-x.n||x.m.name.localeCompare(y.m.name,'ko'));
  const attHtml=`<div class="st-att">${rows.map(o=>{const op=attOpen===o.m.id;const dl=a=>a.map(d=>fmtD(d).replace(/ \((.)\)$/,'($1)')).join(', ');return `<div class="st-row${op?' on':''}" data-act="st-att-row" data-id="${o.m.id}" role="button" tabindex="0" aria-expanded="${op}"><b>${h(o.m.name)}</b><span class="st-bar"><i style="width:${Math.round(o.r*100)}%"></i></span><span class="num">${o.d?Math.round(o.r*100)+'%':'–'}</span><span class="muted small num">${o.n}/${o.d}</span></div>${op?`<div class="st-days"><div><b>출석 ${o.n}회</b> ${o.on.length?dl(o.on):'<span class="muted">없음</span>'}</div><div class="muted"><b>결석 ${o.off.length}회</b> ${o.off.length?dl(o.off):'없음'}</div></div>`:''}`}).join('')}</div>
    <p class="small muted" style="margin:8px 0 0">분모: ${CLUB_Y}년 정기모임 중 취소되지 않은 날 ${MD.length}회 (회원별 가입일 이후)${noRec.length?` · 대진 기록 없는 모임 ${noRec.length}회(모두 결석으로 계산): ${noRec.map(fmtD).join(', ')}`:''}${(S.attend||[]).length?` · 출석 투표로 대신한 날 ${S.attend.filter(x=>!st.B.some(b=>b.cfg.date===x.id)).length}회`:''}</p>`;
  const people=byName(mem.map(m=>({key:m.id,name:m.name})));
  if(!statP||!people.some(p=>p.key===statP))statP=(people.find(p=>!p.g)||people[0]||{}).key||'';
  const me=statP;const pr=st.pair[me]||{},op=st.opp[me]||{};const gm=k=>S.members.some(m=>m.id===k)?'':' <span class="gmark">G</span>';
  const list=(o,withLast)=>Object.entries(o).sort((x,y)=>y[1]-x[1]||keyName(x[0]).localeCompare(keyName(y[0]),'ko')).map(([k,n])=>`<span class="st-chip">${h(keyName(k))}${gm(k)} <b class="num">${n}</b>${withLast&&st.last[me]&&st.last[me][k]?` <span class="muted">${fmtD(st.last[me][k]).replace(/ \(.\)$/,'')}</span>`:''}</span>`).join('')||'<span class="muted small">기록 없음</span>';
  const zero=byName(mem.filter(m=>m.id!==me&&!pr[m.id]));const one=byName(mem.filter(m=>m.id!==me&&pr[m.id]===1));
  const myAtt=st.att[me]?st.att[me].size:0;
  const pairHtml=people.length?`<label class="f" style="max-width:280px">사람 선택<select class="in" data-statp="1">${people.map(p=>`<option value="${h(p.key)}"${p.key===me?' selected':''}>${h(p.name)}</option>`).join('')}</select></label>
    <p class="small muted" style="margin:8px 0 12px">참석 ${myAtt}회 · 경기 ${st.games[me]||0}회</p>
    <h4 class="st-h">페어 많이 한 순 <span class="muted small">횟수 · 마지막 날짜</span></h4><div class="st-chips">${list(pr,true)}</div>
    <h4 class="st-h">아직 페어 못 한 회원 ${zero.length}</h4><div class="st-chips">${zero.map(m=>`<span class="st-chip">${h(m.name)}</span>`).join('')||'<span class="muted small">없음</span>'}</div>
    ${one.length?`<h4 class="st-h">1회만 한 회원 ${one.length}</h4><div class="st-chips">${one.map(m=>`<span class="st-chip">${h(m.name)}</span>`).join('')}</div>`:''}
    <h4 class="st-h">맞대결 많이 한 순</h4><div class="st-chips">${list(op,false)}</div>`:'<p class="muted small">대진 기록 없음</p>';
  return `<section class="panel stats"><div class="panel-h"><h2>대진 통계</h2><span class="small muted">전체 기록 ${st.B.length}회</span></div>
    <details class="due-yr" id="st-att"${lsGet('sbpb-st-att',true)?' open':''}><summary><h3>정기모임 출석률</h3><span class="led-tg"><span class="tg-o">펼치기</span><span class="tg-c">접기</span> <i>▾</i></span></summary>${attHtml}</details>
    <details class="due-yr" id="st-pair"${lsGet('sbpb-st-pair',true)?' open':''}><summary><h3>페어 통계</h3><span class="led-tg"><span class="tg-o">펼치기</span><span class="tg-c">접기</span> <i>▾</i></span></summary>${pairHtml}</details></section>`}
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.statp){statP=e.target.value;lsSet('sbpb-stat-p',statP);render()}});
document.addEventListener('toggle',e=>{if(e.target.id==='st-att')lsSet('sbpb-st-att',e.target.open);if(e.target.id==='st-pair')lsSet('sbpb-st-pair',e.target.open)},true);
/* 대진 생성용: 최근 정기모임에서 함께 페어한 정도 (최근일수록 크게, 최근 10회) */
function recentPairWeight(before){const B=pastBrackets().filter(b=>b.cfg.date<before).slice(-10).reverse();const w={};const pk=(a,b)=>a<b?a+'|'+b:b+'|'+a;
  B.forEach((b,i)=>{const d=Math.pow(.8,i);(b.rounds||[]).forEach(R=>(R.matches||[]).forEach(m=>{if(!m)return;[m.a,m.b].forEach(t=>{if(t&&t.length===2&&t[0]&&t[1]){const k=pk(t[0],t[1]);w[k]=(w[k]||0)+d}})}))});return w}
function generate(){
  const pool=rosterAll().filter(p=>cfg.picked.includes(p.key));
  if(pool.length<4){toast('참석자 4명 이상 선택 필요');return}
  const P={};pool.forEach(p=>P[p.key]={name:p.name,gender:p.gender,level:p.level,guest:p.guest});
  const courts=cfg.courtList,C=courts.length,R=roundsOf(cfg);
  const st={};pool.forEach(p=>st[p.key]={games:0,bench:0,last:null});
  const partner={},opp={};const pk=(a,b)=>a<b?a+'|'+b:b+'|'+a;
  /* 최근에 많이 붙은 페어는 약하게 피함: 팀당 최대 0.9점 (실력 차 0.5 = 2점보다 작게 → 실력 밸런스가 항상 우선) */
  const RW=recentPairWeight(cfg.date||ymd(today0()));
  /* 행사 팀전: 같은 팀끼리 페어, 다른 팀과 대결 */
  const EVT=cfg.eventId&&S.events.find(e=>e.id===cfg.eventId);const TM=EVT&&(EVT.teams||[]).length>=2?teamMap(EVT):null;const hist=t=>Math.min(1,(RW[pk(t[0],t[1])]||0)/3)*0.9;
  const rounds=[];
  for(let r=0;r<R;r++){
    const nC=Math.min(C,Math.floor(pool.length/4)),N=nC*4;
    const order=shuffle(pool.slice()).sort((a,b)=>(st[a.key].games-st[b.key].games)||(st[b.key].bench-st[a.key].bench));
    let play=order.slice(0,N),rest=order.slice(N);
    if(TM){const t0=order.filter(p=>TM[p.key]===0),t1=order.filter(p=>TM[p.key]===1);if(t0.length>=N/2&&t1.length>=N/2){play=t0.slice(0,N/2).concat(t1.slice(0,N/2));rest=order.filter(p=>!play.includes(p))}}
    // keep women count even so every court is 남복/여복/혼복
    if(!TM&&play.filter(p=>p.gender==='F').length%2){
      const lastIdx=g=>{for(let i=play.length-1;i>=0;i--)if(play[i].gender===g)return i;return -1};
      const firstIdx=g=>rest.findIndex(p=>p.gender===g);
      const optA=[lastIdx('F'),firstIdx('M')],optB=[lastIdx('M'),firstIdx('F')];
      const ok=o=>o[0]>=0&&o[1]>=0;
      let o=null;if(ok(optA)&&ok(optB))o=optA[1]<=optB[1]?optA:optB;else if(ok(optA))o=optA;else if(ok(optB))o=optB;
      if(o){const out=play[o[0]],inn=rest[o[1]];play[o[0]]=inn;rest[o[1]]=out}
    }
    const Ms=play.filter(p=>p.gender==='M'),Fs=play.filter(p=>p.gender==='F');
    const comps=[];
    for(let x=0;x<=nC;x++)for(let w=0;w+x<=nC;w++){const m=nC-w-x;if(4*m+2*x===Ms.length&&4*w+2*x===Fs.length)comps.push({m,w,x})}
    const generic=!comps.length;if(generic)comps.push({generic:true});
    const scoreMatch=(a,b,type,g4)=>{
      let s=(partner[pk(a[0],a[1])]||0)*12+(partner[pk(b[0],b[1])]||0)*12+hist(a)+hist(b);
      for(const x of a)for(const y of b)s+=(opp[pk(x,y)]||0)*2;
      s+=Math.abs(P[a[0]].level+P[a[1]].level-P[b[0]].level-P[b[1]].level)*4;
      if(cfg.mode==='tier'){const ls=g4.map(k=>P[k].level);s+=(Math.max(...ls)-Math.min(...ls))*3}
      if(type==='잡복')s+=8;
      // 게스트끼리 한 팀(파트너)은 되도록 피함 (불가피하면 허용)
      for(const t of [a,b])if(P[t[0]].guest&&P[t[1]].guest)s+=15;
      if(TM){if(TM[a[0]]!==TM[a[1]]||TM[b[0]]!==TM[b[1]])s+=500;else if(TM[a[0]]===TM[b[0]])s+=500}
      return s;
    };
    const bestPair=(g4,kind)=>{
      let opts;
      if(kind==='혼복'){const [m1,m2,f1,f2]=g4;opts=[[[m1,f1],[m2,f2]],[[m1,f2],[m2,f1]]]}
      else opts=[[[g4[0],g4[1]],[g4[2],g4[3]]],[[g4[0],g4[2]],[g4[1],g4[3]]],[[g4[0],g4[3]],[g4[1],g4[2]]]];
      let bm=null,bs=Infinity;
      for(const [a,b] of opts){const ty=kind||mtype(P,{a,b});const s=scoreMatch(a,b,ty,g4);if(s<bs){bs=s;bm={a,b}}}
      return [bm,bs];
    };
    const prefM=courts.some(c=>c.pref==='M'),prefF=courts.some(c=>c.pref==='F');
    let best=null,bestS=Infinity;
    for(const comp of comps){
      let cp=0;
      if(!comp.generic){
        if(cfg.mode==='mixed')cp+=(nC-comp.x)*3;
        if(cfg.mode==='same')cp+=comp.x*3;
        if(prefM&&comp.m===0&&Ms.length>=4)cp+=4;
        if(prefF&&comp.w===0&&Fs.length>=4)cp+=1.5;
      }
      for(let t=0;t<260;t++){
        const jit=arr=>cfg.mode==='tier'?arr.map(p=>[p,p.level+Math.random()*1.2]).sort((a,b)=>b[1]-a[1]).map(x=>x[0].key):shuffle(arr.map(p=>p.key));
        let score=cp;const ms=[];
        if(comp.generic){const all=jit(play);for(let c=0;c<nC;c++){const [m,s]=bestPair(all.slice(c*4,c*4+4),null);ms.push(m);score+=s}}
        else{
          const men=jit(Ms),wom=jit(Fs);let mi=0,wi=0;
          for(let i=0;i<comp.m;i++){const [m,s]=bestPair(men.slice(mi,mi+4),'남복');mi+=4;ms.push(m);score+=s}
          for(let i=0;i<comp.w;i++){const [m,s]=bestPair(wom.slice(wi,wi+4),'여복');wi+=4;ms.push(m);score+=s}
          for(let i=0;i<comp.x;i++){const [m,s]=bestPair([men[mi],men[mi+1],wom[wi],wom[wi+1]],'혼복');mi+=2;wi+=2;ms.push(m);score+=s}
        }
        if(score<bestS){bestS=score;best=ms}
      }
    }
    const types=best.map(m=>mtype(P,m));
    const placed=assignCourts(best,types,courts);
    best.forEach((m,i)=>{partner[pk(...m.a)]=(partner[pk(...m.a)]||0)+1;partner[pk(...m.b)]=(partner[pk(...m.b)]||0)+1;for(const x of m.a)for(const y of m.b)opp[pk(x,y)]=(opp[pk(x,y)]||0)+1;[...m.a,...m.b].forEach(k=>{st[k].games++;st[k].bench=0;st[k].last=types[i]})});
    rest.forEach(p=>st[p.key].bench++);
    rounds.push({matches:placed,rest:rest.map(p=>p.key)});
  }
  const {picked:_p,...cfgRest}=cfg;
  draft={id:draft&&draft.status!=='확정'?draft.id:null,cfg:JSON.parse(JSON.stringify(cfgRest)),players:P,rounds,status:'초안'};
  sel=null;saveDraft();render();
}
/* ---- slots ---- */
const SLOT_RE=/^m(\d+)([ab])(\d)$/;
function getSlot(r,slot){const R=draft.rounds[r];if(slot[0]==='r')return R.rest[+slot.slice(1)]||null;const x=slot.match(SLOT_RE);const m=R.matches[+x[1]];return m?m[x[2]][+x[3]]||null:null}
function setSlot(r,slot,k){const R=draft.rounds[r];if(slot[0]==='r'){R.rest[+slot.slice(1)]=k;return}const x=slot.match(SLOT_RE);const m=R.matches[+x[1]];m[x[2]][+x[3]]=k;if(m.t&&[...m.a,...m.b].every(q=>q&&draft.players[q]&&draft.players[q].gender))delete m.t/* 기록 대진을 고치면 경기 종류는 다시 계산 */}
function cleanBench(r){draft.rounds[r].rest=draft.rounds[r].rest.filter(Boolean)}
function slotOf(r,k){const R=draft.rounds[r];for(let c=0;c<R.matches.length;c++){const m=R.matches[c];if(!m)continue;for(const s of ['a','b'])for(let i=0;i<2;i++)if(m[s][i]===k)return `m${c}${s}${i}`}const i=R.rest.indexOf(k);return i>=0?'r'+i:null}
const emptyCount=()=>draft?draft.rounds.reduce((n,R)=>n+R.matches.reduce((a,m)=>a+(m?[...m.a,...m.b].filter(k=>!k).length:0),0),0):0;
let autoT;
function commit(){saveDraft();render();if(draft&&draft.id&&mode==='db'){clearTimeout(autoT);autoT=setTimeout(()=>{saveBracket().catch(()=>{})},1500)}}
function nm(r,slot){
  const k=getSlot(r,slot);
  if(!k)return `<span class="nm empty" role="button" tabindex="0" data-act="slot" data-r="${r}" data-slot="${slot}" title="눌러서 사람 넣기">${draft&&draft.allowBlank?'–':'빈자리'}</span>`;
  const p=draft.players[k]||{name:'?'};
  return `<span class="nm" role="button" tabindex="0" data-act="slot" data-r="${r}" data-slot="${slot}">${h(dn(p.name))}${p.guest?'<span class="gbadge" title="게스트">G</span>':''}</span>`;
}
let menuCtx=null;
function closeMenu(){const m=$('#slotmenu');if(m)m.remove();menuCtx=null;document.querySelectorAll('.nm.on').forEach(x=>x.classList.remove('on'))}
function openMenu(t){
  if(menuCtx&&menuCtx.r===+t.dataset.r&&menuCtx.slot===t.dataset.slot){closeMenu();return}/* same name again: close */
  closeMenu();
  if(draft.status==='확정'){toast('확정 해제 후 수정 가능');return}
  const r=+t.dataset.r,slot=t.dataset.slot;const k=getSlot(r,slot);
  if(!k){openPicker(r,slot);return}
  menuCtx={r,slot};t.classList.add('on');
  const inMatch=slot[0]==='m';
  const m=document.createElement('div');m.id='slotmenu';m.className='slotmenu';m.setAttribute('role','menu');
  m.innerHTML=`<div class="sm-h">${h(dn(draft.players[k]?.name))}<span>${r+1}타임 · ${inMatch?'경기':'벤치'}</span></div><button role="menuitem" data-act="sm-change">${inMatch?'변경':'경기 중인 사람과 교체'}</button>${inMatch?'<button role="menuitem" data-act="sm-delete">삭제 (빈자리로 두기)</button>':''}<button role="menuitem" class="danger" data-act="sm-out">모든 타임에서 제외</button>`;
  document.body.appendChild(m);
  const rc=t.getBoundingClientRect(),mw=m.offsetWidth,mh=m.offsetHeight;
  let x=rc.left+rc.width/2-mw/2+scrollX,y=rc.bottom+6+scrollY;
  x=Math.max(8+scrollX,Math.min(x,scrollX+innerWidth-mw-8));
  if(rc.bottom+6+mh>innerHeight&&rc.top-mh-6>0)y=rc.top-mh-6+scrollY;
  m.style.left=x+'px';m.style.top=y+'px';m.querySelector('button').focus({preventScroll:true});
}
document.addEventListener('click',e=>{if(menuCtx&&!e.target.closest('#slotmenu')&&!e.target.closest('.nm'))closeMenu()},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuCtx)closeMenu();if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('nm')){e.preventDefault();openMenu(e.target)}});
ACT['slot']=t=>openMenu(t);
ACT['sm-change']=()=>{const {r,slot}=menuCtx;closeMenu();openPicker(r,slot)};
ACT['sm-delete']=()=>{const {r,slot}=menuCtx;const k=getSlot(r,slot);setSlot(r,slot,null);draft.rounds[r].rest.push(k);closeMenu();commit()};
ACT['sm-out']=()=>{const {r,slot}=menuCtx;const k=getSlot(r,slot);closeMenu();draft.rounds.forEach((R,i)=>{const s=slotOf(i,k);if(s){setSlot(i,s,null);cleanBench(i)}});commit();toast(`${dn(draft.players[k]?.name)} 님 전체 타임 제외 완료. 빈자리 선택 후 대체 인원 지정 가능`)};
/* picker: search + gender filter */
let pickCtx=null,pickF={q:'',g:''};
function pickCandidates(){
  const {r,slot}=pickCtx;const R=draft.rounds[r];const cur=getSlot(r,slot);const toBench=slot[0]==='r';
  const courts=draft.cfg.courtList||defCourts();
  const people=[];const seen=new Set();
  Object.keys(draft.players).forEach(k=>{const s=slotOf(r,k);if(k===cur)return;seen.add(k);
    const p=draft.players[k];let st,cls;
    if(s&&s[0]==='m'){st=`${courts[+s.match(SLOT_RE)[1]]?.name||'경기'} 경기 중`;cls=''}else if(s){st='이번 타임 벤치';cls='bench'}else{st='이번 타임 제외';cls=''}
    if(toBench&&!(s&&s[0]==='m'))return;
    people.push({k,name:p.name,gender:p.gender,level:p.level,guest:p.guest,st,cls,ord:s&&s[0]==='r'?0:s?1:2});
  });
  // 이번 대진표 참석자만 후보로 표시 (미참석 회원·게스트는 제외)
  const q=pickF.q.trim();
  return people.filter(x=>(!q||x.name.includes(q)||(x.nick||'').includes(q))&&(!pickF.g||(pickF.g==='G'?x.guest:x.gender===pickF.g))).sort((a,b)=>a.ord-b.ord||a.name.localeCompare(b.name,'ko'));
}
function pickListHtml(){const list=pickCandidates();return list.length?list.map(x=>`<button class="pk-item" data-act="pick-person" data-k="${h(x.k)}"><span class="grow"><b>${h(dn(x.name))}</b> <span class="g-${x.gender} small">${x.gender==='M'?'남':'여'}</span>${x.guest?' <span class="chip">게스트</span>':''}</span>${stars(x.level)}<span class="pk-st ${x.cls}">${h(x.st)}</span></button>`).join(''):'<div class="muted small" style="padding:16px;text-align:center">조건에 맞는 인원 없음</div>'}
function openPicker(r,slot){
  pickCtx={r,slot};pickF={q:'',g:''};
  const cur=getSlot(r,slot);const toBench=slot[0]==='r';
  const title=cur?`${r+1}타임 · ${dn(draft.players[cur]?.name)} 님 자리 변경`:`${r+1}타임 빈자리 채우기`;
  const filt=[['','전체'],['M','남'],['F','여'],['G','게스트']];
  $('#modal-root').innerHTML=`<div class="ov" data-act="ov-close"><div class="modal pick" role="dialog" aria-modal="true" aria-label="${h(title)}"><div class="m-head"><h2>${h(title)}</h2><button type="button" class="modal-x" data-act="close-modal" aria-label="닫기">×</button></div>
  <p class="small muted" style="margin:-6px 0 12px">${toBench?'경기 중인 인원 선택 시 서로 자리 교체':'벤치 인원은 바로 투입, 다른 코트 경기 중인 인원은 서로 자리 교체'}</p>
  <div class="pk-tools"><input class="in" id="pk-q" placeholder="이름 검색" autocomplete="off"><div class="pk-filters">${filt.map(([v,l])=>`<button class="btn sm ${v===''?'pri':''}" data-act="pk-f" data-v="${v}">${l}</button>`).join('')}</div></div>
  <div class="pk-list" id="pk-list">${pickListHtml()}</div>
  <div class="row" style="justify-content:space-between;margin-top:14px">${toBench?'<span></span>':'<button class="btn" data-act="guest-new" data-fill="1">신규 게스트 추가</button>'}<button class="btn" data-act="close-modal">닫기</button></div></div></div>`;
  lockPage();if(window.matchMedia&&matchMedia('(pointer:fine)').matches)setTimeout(()=>{const q=$('#pk-q');q&&q.focus()},30);
}
document.addEventListener('input',e=>{if(e.target.id==='pk-q'){pickF.q=e.target.value;const l=$('#pk-list');if(l)l.innerHTML=pickListHtml()}});
ACT['pk-f']=t=>{pickF.g=t.dataset.v;document.querySelectorAll('[data-act="pk-f"]').forEach(b=>b.classList.toggle('pri',b.dataset.v===pickF.g));const l=$('#pk-list');if(l)l.innerHTML=pickListHtml()};
function placeInto(k2){
  const {r,slot}=pickCtx;const cur=getSlot(r,slot);
  if(!draft.players[k2]){const p=rosterAll().find(x=>x.key===k2);if(!p)return;draft.players[k2]={name:p.name,gender:p.gender,level:p.level,guest:p.guest};if(!cfg.picked.includes(k2)){cfg.picked.push(k2);saveCfg()}draft.rounds.forEach((R,i)=>{if(i!==r)R.rest.push(k2)})}
  const s2=slotOf(r,k2);
  if(s2&&s2[0]==='m'){setSlot(r,s2,cur);setSlot(r,slot,k2)}           // swap with a player on another court
  else{if(s2){setSlot(r,s2,null);cleanBench(r)}const ns=slotOf(r,cur)===slot?slot:slot;setSlot(r,ns,k2);if(cur&&slot[0]==='m')draft.rounds[r].rest.push(cur)}
  cleanBench(r);pickCtx=null;closeModal();commit();
}
ACT['pick-person']=t=>placeInto(t.dataset.k);
/* ---- poster ---- */
function slotIn(d,r,slot){const R=d.rounds[r];if(slot[0]==='r')return R.rest[+slot.slice(1)]||null;const x=slot.match(SLOT_RE);const m=R.matches[+x[1]];return m?m[x[2]][+x[3]]||null:null}
function nmS(d,r,slot){const k=slotIn(d,r,slot);if(!k)return `<span class="nm-s empty">${d.allowBlank?'–':'빈자리'}</span>`;const p=d.players[k]||{name:'?'};return `<span class="nm-s">${h(dn(p.name))}${p.guest?'<span class="gbadge" title="게스트">G</span>':''}</span>`}
function normB(b){const bc={...b.cfg};if(!bc.courtList){const n=Math.max(...b.rounds.map(R=>R.matches.length));bc.courtList=Array.from({length:n},(_,i)=>({name:`코트 ${i+1}`,pref:''}))}return {...b,cfg:bc}}
// bench: 4명 이상이면 두 줄. 짝수는 반반, 홀수는 윗줄이 한 명 적게
function benchHtml(names){const n=names.length;if(!n)return '–';if(n<4)return names.join(', ');const top=Math.floor(n/2);return `<span class="bl">${names.slice(0,top).join(', ')}</span><span class="bl">${names.slice(top).join(', ')}</span>`}
function posterHtml(d=draft,inter=true){
  const c=d.cfg;const courts=c.courtList||defCourts();const PEV=evOfB(d);const PTL=PEV?teamTally(PEV):null;const N=(r,slot)=>inter?nm(r,slot):nmS(d,r,slot);
  const st=toMin(c.start),mins=Number(c.mins)||30;const lastT=(d.rounds[d.rounds.length-1]||{}).time;const end=lastT?lastT.split('–')[1]:fromMin(st+d.rounds.length*mins);
  return `<div class="poster${d.allowBlank?' blank-ok':''}"${inter?' id="poster"':''}>
   <div class="p-head"><img class="p-logo" src="logo-g-lg.png" alt="SBPB Tennis Club"><div><div class="p-title">${h(c.title||'SBPB 정기모임')}</div><div class="p-meta">${fmtFull(c.date)} · ${h(c.meet||(c.start===REG.gameStart?REG.start:c.start))}–${end}${c.place?' · '+h(c.place):''}</div></div><span class="p-status${d.status==='확정'?'':' draft'}">${d.status==='확정'?'확정':'초안'}</span></div>${PEV&&(PEV.teams||[]).length?`<div class="p-teams">${PEV.teams.map((t,i)=>{const x=PTL&&PTL.rows[i];return `<span><i class="tdot" style="background:${tcol(PEV,i)}"></i><b>${h(t.name)}</b>${x&&PTL.played?` <b class="num">${x.w}승</b> <span class="p-gd">득실 ${x.gf-x.ga>0?'+':''}${x.gf-x.ga}</span>`:''}</span>`}).join('')}</div>`:''}
   <table class="p-table"><thead><tr><th style="width:84px">타임</th>${courts.map(x=>`<th>${h(x.name)}</th>`).join('')}<th style="width:180px">벤치</th></tr></thead><tbody>
   ${d.rounds.map((R,r)=>`<tr><td class="t"><b>${r+1}</b><span>${R.time?h(R.time):`${fromMin(st+r*mins)}–${fromMin(st+(r+1)*mins)}`}</span></td>${courts.map((_,ci)=>{const m=R.matches[ci];if(!m)return '<td class="c-none">코트 미사용</td>';const ty=mtype(d.players,m);return `<td class="c-${ty}"><div class="m"><span class="tag ${ty}">${ty}</span>${['a','b'].map(s=>`<div class="tm">${tdot(PEV,(m[s]||[])[0])}${(m[s]||[]).length===1?N(r,`m${ci}${s}0`):`${N(r,`m${ci}${s}0`)}<span class="amp">&amp;</span>${N(r,`m${ci}${s}1`)}`}</div>`).join(m.sc&&m.sc[0]!==''&&m.sc[1]!==''&&m.sc[0]!=null?`<div class="vs sc"><b${+m.sc[0]>+m.sc[1]?' class="w"':''}>${m.sc[0]}</b> : <b${+m.sc[1]>+m.sc[0]?' class="w"':''}>${m.sc[1]}</b></div>`:'<div class="vs">VS</div>')}</div></td>`}).join('')}<td class="bench">${benchHtml(R.rest.map((k,i)=>N(r,'r'+i)))}</td></tr>`).join('')}
   </tbody></table>
   <div class="p-foot"><div class="p-sign">사방팔방 SBPB</div></div>
  </div>`;
}
function logicHtml(){
  const courts=cfg.courtList;const R=roundsOf(cfg),st=toMin(cfg.start),mins=Number(cfg.mins)||30;
  const courtTxt=courts.map(c=>`${h(c.name)} ${PREF[c.pref]||'자유'}`).join(', ');
  const open=lsGet('sbpb-logic-open',window.innerWidth>640);
  const items=[
    ['경기 수 균등 배분','누적 경기 수가 적은 인원 우선 출전, 1인당 경기 수 차이 1경기 이내 유지'],
    ['연속 휴식 최소화','경기 수가 같으면 직전 타임 벤치 인원 우선 출전, 2타임 연속 휴식 방지'],
    ['남복·여복·혼복만 편성','타임별 출전 인원의 남녀 수를 짝수로 조정, 성비가 맞지 않는 경기 배제'],
    // 운영 메모: 1번 코트는 공이 밖으로 나가기 쉬워(공 유실 우려) 남복 우선 배정. 화면에는 표시하지 않음.
    ['코트 배정',courtTxt],
    ['레벨 균형','양 팀 레벨 합 차이가 가장 작은 조합 선택, 레벨 모름 게스트는 중간 레벨 적용'],
    ['파트너·상대 다양화','같은 파트너 재편성 회피, 같은 상대와의 반복 대결 최소화'],
    ['게스트 분산','게스트끼리 같은 팀 편성 지양, 회원과 짝을 지어 편성 (인원 구성상 불가피할 때만 허용)'],
    ['운영 시간',`첫 게임 ${h(cfg.start)} 시작, ${mins}분 단위·휴식 없음, ${fromMin(st+R*mins)}까지 총 ${R}타임`],
    ['편성 방식',`${MODES[cfg.mode]} · ${MODE_DESC[cfg.mode]}`]
  ];
  return `<details class="logic" id="logic"${open?' open':''}><summary>대진표 생성 로직 <span>${open?'접기':'펼치기'}</span></summary>
  <ol>${items.map(([t,d])=>`<li><b>${t}</b><span>${d}</span></li>`).join('')}</ol>
  <div class="edit"><b>수동 수정 방법</b><span>이름 선택 시 변경·삭제 메뉴 표시. 변경은 이름 검색과 성별 필터로 대상 선택, 삭제는 해당 자리 공석 처리(점선 표시). 공석이 남아 있으면 확정·이미지 다운로드 불가</span></div>
  </details>`;
}
document.addEventListener('toggle',e=>{if(e.target.id==='logic'){lsSet('sbpb-logic-open',e.target.open);const s=e.target.querySelector('summary span');if(s)s.textContent=e.target.open?'접기':'펼치기'}},true);
function historyPanel(list){
  const evT=S.events.filter(e=>e.tourney&&e.date&&diffDays(e.endDate||e.date)<0);const evRow=e=>`<div class="li click" data-act="ev-open" data-id="${e.id}">${dateBox(e.date)}<div class="grow"><div class="ttl">${h(e.title)}</div><div class="sub">${fmtFull(e.date)} · ${h(e.tourney.title||'토너먼트')}</div></div><span class="chip">행사</span><span class="chip ball">${(()=>{const f=e.tourney.ko&&e.tourney.ko[e.tourney.ko.length-1];return f&&f.w?'완료':'기록'})()}</span></div>`;
  const merged=list.map(b=>({d:b.cfg?.date||'',b})).concat(evT.map(e=>({d:e.date,e}))).sort((x,y)=>y.d.localeCompare(x.d));
  return `<section class="panel"><div class="panel-h"><h2>대진 히스토리</h2><span class="small muted">${merged.length}건</span></div><div class="list hist" data-ks="hist">${merged.length?merged.map(x=>x.e?evRow(x.e):[x.b].map(b=>`<div class="li click" data-act="bv-open" data-id="${b.id}">${dateBox(b.cfg?.date)}<div class="grow"><div class="ttl">${h(b.cfg?.title)}</div><div class="sub">${fmtFull(b.cfg?.date)} · ${Object.keys(b.players||{}).length}명</div></div>${b.archive?'<span class="chip">이전 기록</span>':''}${b.cfg&&b.cfg.eventId?'<span class="chip">행사</span>':''}<span class="chip ${b.status==='확정'?'ball':''}">${h(b.status)}</span></div>`).join('')).join(''):'<div class="muted small">저장된 대진표 없음. 저장 · 확정 시 대진 히스토리에 기록</div>'}</div>${unregHtml()}</section>`;
}
async function relinkArchive(){if(RO||!db)return;const ix=nameIndex();
  for(const b of S.brackets){if(!b.archive)continue;const map={};Object.keys(b.players||{}).forEach(k=>{if(k.startsWith('n:')){const p=ix[b.players[k].name];if(p&&!b.players[p.key])map[k]=p}});
    if(!Object.keys(map).length)continue;const players={...b.players};Object.entries(map).forEach(([k,p])=>{delete players[k];players[p.key]={name:p.name,gender:p.gender,level:p.level,guest:p.guest}});
    const f=k=>map[k]?map[k].key:k;const rounds=b.rounds.map(R=>({...R,matches:R.matches.map(m=>m&&{...m,a:m.a.map(f),b:m.b.map(f)}),rest:R.rest.map(f)}));
    const {id,...rest}=b;try{await put('brackets',b.id,{...rest,players,rounds})}catch(e){}}}
/* 대진표 기록 속 미등록 이름: 회원·게스트 목록에 아직 없는 이름 (몇 번 · 언제 · 누구와 페어) */
function unregList(){const ix=nameIndex();const map={};
  S.brackets.slice().sort((x,y)=>(x.cfg?.date||'').localeCompare(y.cfg?.date||'')).forEach(b=>{const P=b.players||{};const nm=k=>P[k]&&P[k].name;const isU=k=>k&&String(k).startsWith('n:')&&!ix[nm(k)];
    const touch=n=>{const o=map[n]||(map[n]={name:n,dates:[],pairs:{}});if(!o.dates.includes(b.cfg.date))o.dates.push(b.cfg.date);return o};
    (b.rounds||[]).forEach(R=>{(R.matches||[]).forEach(m=>{if(!m)return;['a','b'].forEach(s=>{const [x,y]=m[s]||[];[[x,y],[y,x]].forEach(([p,q])=>{if(isU(p)){const o=touch(nm(p));if(q){const qn=nm(q);o.pairs[qn]=(o.pairs[qn]||0)+1}}})})});(R.rest||[]).forEach(k=>{if(isU(k))touch(nm(k))})})});
  return Object.values(map).sort((x,y)=>x.name.localeCompare(y.name,'ko'))}
const nameMark=n=>(S.names||[]).find(x=>x.name===n);
const mergeLogs=()=>(S.names||[]).filter(x=>x.type==='merge').sort((x,y)=>(y.at||0)-(x.at||0));
function unregHtml(){const L=unregList();const MG=mergeLogs();if(!L.length&&!MG.length)return '';
  const one=[],pend=[];L.forEach(o=>{const mk=nameMark(o.name);if(mk&&mk.status==='oneoff'&&o.dates.length<=(mk.n||1))one.push(o);else{o.again=mk&&mk.status==='oneoff'?o.dates.length:0;pend.push(o)}});
  const row=(o,isOne)=>`<div class="ur"><div class="ur-h"><b>${h(o.name)}</b>${o.again?`<span class="chip warn">${o.again}회째 방문</span>`:''}<span>${o.dates.length}회</span></div><div class="ur-d">${o.dates.map(d=>fmtD(d)).join(', ')}</div>${Object.keys(o.pairs).length?`<div class="ur-p">페어 ${Object.entries(o.pairs).sort((x,y)=>y[1]-x[1]).map(([n,c])=>h(n)+(c>1?` ×${c}`:'')).join(', ')}</div>`:''}
    ${RO?'':`<div class="ur-acts">${isOne?`<button type="button" class="btn sm ghost" data-act="nm-undo" data-n="${h(o.name)}">임시 게스트 해제</button>`:`<button type="button" class="btn sm" data-act="nm-reg" data-n="${h(o.name)}">게스트로 등록</button><button type="button" class="btn sm" data-act="nm-merge" data-n="${h(o.name)}">다른 이름과 합치기</button><button type="button" class="btn sm ghost" data-act="nm-one" data-n="${h(o.name)}">임시 게스트로 표시</button>`}</div>`}</div>`;
  return `<details class="due-yr unreg" id="unreg"${lsGet('sbpb-unreg-open',false)?' open':''}><summary><h3>미등록 이름 <span class="num muted" style="font-size:14px">${pend.length}</span></h3><span class="led-tg"><span class="tg-o">펼치기</span><span class="tg-c">접기</span> <i>▾</i></span></summary>
    <p class="small muted" style="margin:0 0 8px">회원 · 게스트 목록에 없는 이름 · 게스트로 등록 / 같은 사람이면 합치기 / 정규 게스트가 아니면 임시 게스트로 표시</p>
    ${pend.length?`<div class="unreg-list">${pend.map(o=>row(o,false)).join('')}</div>`:'<p class="small muted">검수할 이름 없음</p>'}
    ${one.length?`<details class="oneoff" id="oneoff"${lsGet('sbpb-oneoff-open',false)?' open':''}><summary>임시 게스트 ${one.length} <span class="led-tg"><span class="tg-o">펼치기</span><span class="tg-c">접기</span> <i>▾</i></span></summary><div class="unreg-list">${one.map(o=>row(o,true)).join('')}</div></details>`:''}
    ${MG.length?`<details class="oneoff" id="merged"${lsGet('sbpb-merged-open',false)?' open':''}><summary>합친 이름 ${MG.length} <span class="led-tg"><span class="tg-o">펼치기</span><span class="tg-c">접기</span> <i>▾</i></span></summary><div class="unreg-list">${MG.map(L=>`<div class="ur"><div class="ur-h"><b>${h(L.from)} + ${h(L.with||L.toName)}</b><span>${fmtD(new Date(L.at||0).toISOString().slice(0,10))}</span></div><div class="ur-d">본명 ${h(L.toName)} · 대진 기록 ${Object.values(L.slots||{}).filter(x=>x.length).length}회 합침</div>${RO?'':`<div class="ur-acts"><button type="button" class="btn sm ghost" data-act="mg-undo" data-id="${h(L.id)}">되돌리기</button></div>`}</div>`).join('')}</div></details>`:''}</details>`}
/* 이름 바꾸기 · 합치기: 모든 대진 기록에서 from 키를 to 키로 · 바뀐 자리(라운드.m.경기.편.순번 / 라운드.r.순번)를 돌려줌 → 되돌리기에 사용 */
async function rekeyBrackets(fromKey,toKey,pl){const slots={};for(const b of S.brackets){if(!b.players||!b.players[fromKey])continue;const players={...b.players};delete players[fromKey];if(!players[toKey])players[toKey]=pl;
  const pos=[];const sw=(k,p)=>k===fromKey?(pos.push(p),toKey):k;
  const rounds=b.rounds.map((R,ri)=>({...R,matches:R.matches.map((m,mi)=>m&&{...m,a:m.a.map((k,j)=>sw(k,`${ri}.m.${mi}.a.${j}`)),b:m.b.map((k,j)=>sw(k,`${ri}.m.${mi}.b.${j}`))}),rest:R.rest.map((k,j)=>sw(k,`${ri}.r.${j}`))}));
  slots[b.id]=pos;const {id,...rest}=b;try{await put('brackets',b.id,{...rest,players,rounds})}catch(e){}}return slots}
async function renameInBrackets(key,name){for(const b of S.brackets){const p=b.players&&b.players[key];if(!p||p.name===name)continue;const {id,...rest}=b;try{await put('brackets',b.id,{...rest,players:{...b.players,[key]:{...p,name}}})}catch(e){}}}
const nickList=s=>String(s||'').split(/\s*,\s*/).filter(Boolean);
/* from(미등록)을 key로 합침 · rename이면 게스트 이름을 from으로 바꾸고 기존 이름은 닉네임으로 */
async function doMerge(from,key,to,rename){const fk='n:'+from;const fromPl=nmPlayer(from)||{name:from,gender:'',level:3,guest:true,unreg:true};
  const m=S.members.find(x=>x.id===key),g=S.guests.find(x=>x.id===key);const fin=rename?from:to;
  const ds=[...new Set(S.brackets.filter(b=>b.players&&(b.players[key]||b.players[fk])&&b.cfg).map(b=>b.cfg.date))].sort();
  let pl;if(key.startsWith('n:'))pl=nmPlayer(to)||{name:to,gender:fromPl.gender||'',level:3,guest:true,unreg:true};else{const p=m||g;pl={name:fin,gender:p.gender,level:Number(p.level)||3,guest:!m}}
  const slots=await rekeyBrackets(fk,key,pl);
  let gb=null;if(g){gb={name:g.name,nick:g.nick||'',visits:g.visits||0,lastDate:g.lastDate||''};const add=rename?g.name:from;const nk=nickList(g.nick).filter(x=>x!==fin);if(add!==fin&&!nk.includes(add))nk.push(add);
    const {id,...rest}=g;try{await put('guests',id,{...rest,name:fin,nick:nk.join(', '),visits:Math.max(g.visits||0,ds.length),lastDate:[g.lastDate||'',ds[ds.length-1]||''].sort().pop()})}catch(e){}
    if(rename)await renameInBrackets(key,fin)}
  const lid=uid();for(const M of mergeLogs().filter(x=>x.toKey===fk)){const {id,...rest}=M;try{await put('names',id,{...rest,toKey:key,toName:fin,repointedBy:lid})}catch(e){}}
  const prev=mergeLogs().filter(x=>x.toKey===key&&x.base).pop();const base=prev?prev.base:gb&&{visits:gb.visits,lastDate:gb.lastDate};
  try{await put('names',lid,{type:'merge',from,with:to,toKey:key,toName:fin,at:Date.now(),slots,fromPl,guest:gb,base:base||null,renamed:!!rename})}catch(e){}
  const mk=nameMark(from);if(mk){try{await del('names',mk.id)}catch(e){}}return fin}
ACT['mg-undo']=async t=>{const L=mergeLogs().find(x=>x.id===t.dataset.id);if(!L)return;
  const ch=await choiceDialog({title:`${L.from} + ${L.with||L.toName} 되돌리기`,msg:'합치기 전 상태로 복원',choices:[{key:'go',label:'되돌리기',sub:`${L.from} 기록을 다시 미등록 이름으로 분리${L.guest?` · ${L.guest.name} 게스트 정보(이름 · 닉네임 · 방문 횟수) 복원`:''}`,cls:'pri'}]});if(ch!=='go')return;
  const fk='n:'+L.from,key=L.toKey;
  const gone=new Set();
  for(const [bid,pos] of Object.entries(L.slots||{})){const b=S.brackets.find(x=>x.id===bid);if(!b||!pos.length)continue;const rounds=JSON.parse(JSON.stringify(b.rounds));let n=0;
    pos.forEach(p=>{const q=p.split('.');const Rd=rounds[+q[0]];if(!Rd)return;if(q[1]==='r'){if(Rd.rest[+q[2]]===key){Rd.rest[+q[2]]=fk;n++}}else{const mm=Rd.matches[+q[2]];const side=mm&&mm[q[3]];if(side&&side[+q[4]]===key){side[+q[4]]=fk;n++}}});
    if(!n)continue;const players={...b.players,[fk]:L.fromPl||{name:L.from,gender:'',level:3,guest:true,unreg:true}};
    if(!rounds.some(Rd=>Rd.rest.includes(key)||Rd.matches.some(mm=>mm&&(mm.a.includes(key)||mm.b.includes(key))))){delete players[key];gone.add(bid)}
    const {id,...rest}=b;try{await put('brackets',bid,{...rest,players,rounds})}catch(e){}}
  const g=S.guests.find(x=>x.id===key);
  /* 게스트 정보는 이 합치기로 바뀐 부분만 되돌림 (다른 합치기 결과는 유지) */
  if(g){const {id,...rest}=g;let name=g.name,nk=nickList(g.nick).filter(x=>x!==L.from);
    if(L.renamed&&L.guest&&g.name===L.from){name=L.guest.name;nk=nk.filter(x=>x!==name)}
    const ds=[...new Set(S.brackets.filter(b=>!gone.has(b.id)&&b.players&&b.players[key]&&b.cfg).map(b=>b.cfg.date))].sort();const g0=L.base||L.guest||{};
    try{await put('guests',id,{...rest,name,nick:nk.join(', '),visits:Math.max(g0.visits||0,ds.length),lastDate:[g0.lastDate||'',ds[ds.length-1]||''].sort().pop()})}catch(e){}
    if(name!==g.name)await renameInBrackets(key,name)}
  for(const M of mergeLogs().filter(x=>x.repointedBy===L.id)){const {id,...rest}=M;try{await put('names',id,{...rest,toKey:fk,toName:L.from,repointedBy:''})}catch(e){}}
  try{await del('names',L.id)}catch(e){}toast(`${L.from} 합치기 되돌림 · 미등록 이름으로 복원`);render()};
const nmPlayer=n=>{for(const b of S.brackets){const p=b.players&&b.players['n:'+n];if(p)return p}return null};
ACT['nm-one']=async t=>{const n=t.dataset.n;const o=unregList().find(x=>x.name===n);const mk=nameMark(n);try{await put('names',mk?mk.id:uid(),{name:n,status:'oneoff',n:o?o.dates.length:1,at:Date.now()})}catch(e){return}toast(`${n} 임시 게스트로 표시`);render()};
ACT['nm-undo']=async t=>{const mk=nameMark(t.dataset.n);if(mk){try{await del('names',mk.id)}catch(e){return}}toast('임시 게스트 해제 · 미등록 이름으로 이동');render()};
ACT['nm-reg']=t=>{const n=t.dataset.n;const p=nmPlayer(n)||{};const o=unregList().find(x=>x.name===n);
  const fromNk=mergeLogs().filter(x=>x.toKey==='n:'+n).map(x=>x.from);
  openModal('게스트로 등록',guestForm({name:n,gender:p.gender||'M',nick:fromNk.join(', ')},'members')+`<p class="small muted" style="margin:0">지난 대진 기록 ${o?o.dates.length:0}회가 이 게스트로 연결됨</p>`,async fd=>{const id=uid();
    const dates=o?o.dates:[];await put('guests',id,{...guestFromFd(fd),createdAt:Date.now(),visits:dates.length,lastDate:dates[dates.length-1]||''});
    const g={name:fd.name.trim(),gender:fd.gender,level:fd.level===''?3:Number(fd.level),guest:true};await rekeyBrackets('n:'+n,id,g);
    for(const M of mergeLogs().filter(x=>x.toKey==='n:'+n)){const {id:mid,...rest}=M;try{await put('names',mid,{...rest,toKey:id,toName:g.name})}catch(e){}}
    const mk=nameMark(n);if(mk){try{await del('names',mk.id)}catch(e){}}toast(`${g.name} 게스트 등록 · 대진 기록 ${dates.length}회 연결`);render()})};
ACT['nm-merge']=t=>{const n=t.dataset.n;/* 합칠 대상: 게스트(가나다) → 미등록 이름(가나다). 회원은 합칠 일이 없어 제외 */
  const people=byName(S.guests.map(g=>({key:g.id,name:g.name,sub:'게스트'+(g.nick?` · ${g.nick}`:''),gender:g.gender,level:g.level,guest:true})).concat(S.members.filter(m=>ST(m)==='게스트'&&!S.guests.some(g=>g.name===m.name)).map(m=>({key:m.id,name:m.name,sub:'게스트',gender:m.gender,level:m.level,guest:false}))))
    .concat(byName(unregList().filter(o=>o.name!==n).map(o=>({key:'n:'+o.name,name:o.name,sub:'미등록',unreg:true}))));
  const ov=document.createElement('div');ov.className='me-ov';ov.id='cfxpick';
  ov.innerHTML=`<div class="me-box cfx-box" role="dialog" aria-modal="true" aria-label="합칠 이름 선택"><div class="me-bar"><span></span><b>${h(n)} → 합칠 이름</b><button type="button" class="btn ghost" data-act="cfx-close">닫기</button></div>
    <div class="cfx-new"><input class="in" id="nm-q" placeholder="이름 검색"></div><div class="cfx-list" id="nm-list">${people.map(p=>`<button type="button" data-act="nm-merge-to" data-from="${h(n)}" data-key="${h(p.key)}" data-name="${h(p.name)}"><b>${h(p.name)}</b> <span class="muted small">${h(p.sub)}</span></button>`).join('')}</div></div>`;
  document.body.appendChild(ov);const q=ov.querySelector('#nm-q');q.addEventListener('input',()=>{const v=q.value.trim();ov.querySelectorAll('#nm-list button').forEach(b=>b.hidden=!!v&&!b.dataset.name.includes(v))})};
ACT['nm-merge-to']=t=>{const from=t.dataset.from,key=t.dataset.key,to=t.dataset.name;const tg=S.guests.some(x=>x.id===key),un=key.startsWith('n:');
  const choices=tg||un?[{key:'keep',label:`${to}을(를) 본명으로`,sub:tg?`${from}은(는) ${to}의 닉네임으로 저장`:`${from} 기록을 ${to}(으)로 합침 · 게스트 등록 때 ${from}은(는) 닉네임으로`,cls:'pri'},
      {key:'swap',label:`${from}을(를) 본명으로`,sub:tg?`게스트 이름을 ${from}(으)로 변경 · ${to}은(는) 닉네임으로 이동`:`${to} 기록을 ${from}(으)로 합침 · 게스트 등록 때 ${to}은(는) 닉네임으로`}]
    :[{key:'keep',label:`${to}(으)로 합치기`,sub:`${from} 기록이 모두 ${to} 기록으로 바뀜`,cls:'pri'}];
  choiceDialog({title:`${from} + ${to}`,msg:`같은 사람의 이름을 하나로 합침${tg||un?' · 본명 선택':''} · 잘못 합치면 미등록 이름 › 합친 이름에서 되돌리기`,choices}).then(async ch=>{if(!ch)return;
    const o=$('#cfxpick');if(o)o.remove();
    const fin=un&&ch==='swap'?await doMerge(to,'n:'+from,from,false):await doMerge(from,key,to,ch==='swap');
    toast(`${from} + ${to} 합치기 완료 · 본명 ${fin}`);render()})};
document.addEventListener('toggle',e=>{if(e.target.id==='merged')lsSet('sbpb-merged-open',e.target.open)},true);
document.addEventListener('toggle',e=>{if(e.target.id==='oneoff')lsSet('sbpb-oneoff-open',e.target.open)},true);
document.addEventListener('toggle',e=>{if(e.target.id==='unreg')lsSet('sbpb-unreg-open',e.target.open)},true);
function viewDrawRO(){
  const list=S.brackets.slice().sort((a,b)=>(b.cfg?.date||'').localeCompare(a.cfg?.date||''));
  const latest=list.find(b=>b.status==='확정')||list[0];
  return `<div class="page-head"><div><h1>대진표</h1><p>공개된 대진표 조회 및 이미지 다운로드</p></div></div>
  <div class="draw"><div>${historyPanel(list)}</div><div style="min-width:0">${latest?`<div class="stage-bar"><div class="hint"><b>${fmtFull(latest.cfg.date)}</b> ${h(latest.status)}</div><button class="btn ball" data-act="bv-img" data-id="${latest.id}" data-inline="1">이미지 다운로드</button></div><div class="stage" id="stage">${posterHtml(normB(latest),false)}</div>`:'<div class="empty" style="padding:60px 16px"><b>공개된 대진표 없음</b>대진표 확정 및 공개본 갱신 후 표시</div>'}</div></div>
  <div class="draw-hist">${statsPanel()}</div>`;
}
let bvCtx=null;
/* 지난 대진을 원본은 그대로 두고 다음 정기모임 날짜의 새 초안으로 복사 */
ACT['br-copy']=t=>{const b=S.brackets.find(x=>x.id===t.dataset.id);if(!b)return;
  if(draft&&!draft.id&&!confirm('작성 중인 초안을 이 복사본으로 바꿉니다. 진행할까요?'))return;
  closeModal();const bc={...normB(b).cfg,date:nextRegNow(),title:REG.title,place:REG.place};const roster=new Set(rosterAll().map(p=>p.key));
  draft={id:null,cfg:bc,players:JSON.parse(JSON.stringify(b.players||{})),rounds:JSON.parse(JSON.stringify(b.rounds)).map(R=>{delete R.time;return R}),status:'초안',allowBlank:!!b.allowBlank};
  Object.assign(cfg,{title:bc.title,date:bc.date,place:bc.place,start:bc.start,end:bc.end||cfg.end,mins:bc.mins,courtList:JSON.parse(JSON.stringify(bc.courtList)),picked:Object.keys(b.players||{}).filter(k=>roster.has(k))});
  saveCfg();saveDraft();sel=null;if(route!=='draw')location.hash='#draw';render();window.scrollTo(0,0);toast(`${fmtD(b.cfg.date)} 대진을 ${fmtD(bc.date)} 새 초안으로 복사`)};
/* 테마에 맞춘 선택 창 (기기 기본 확인 창 대신): 선택한 key, 닫으면 null */
let dateAsk=false;
function choiceDialog({title,msg='',choices}){return new Promise(res=>{const ov=document.createElement('div');ov.className='me-ov ch-ov';ov.id='choice';
  ov.innerHTML=`<div class="ch-box" role="dialog" aria-modal="true" aria-label="${h(title)}"><div class="ch-h"><b>${h(title)}</b><button type="button" class="modal-x" data-ch="" aria-label="닫기">×</button></div>${msg?`<p class="ch-msg">${h(msg)}</p>`:''}<div class="ch-btns">${choices.map(c=>`<button type="button" class="btn ${c.cls||''}" data-ch="${h(c.key)}"><b>${h(c.label)}</b>${c.sub?`<span>${h(c.sub)}</span>`:''}</button>`).join('')}</div></div>`;
  const done=k=>{ov.remove();res(k||null)};ov.addEventListener('click',e=>{const b=e.target.closest('[data-ch]');if(b){e.stopPropagation();done(b.dataset.ch)}else if(e.target===ov)done(null)});
  document.body.appendChild(ov)})}
function openBracketView(id){
  const b=S.brackets.find(x=>x.id===id);if(!b)return;const d=normB(b);bvCtx=d;
  $('#modal-root').innerHTML=`<div class="ov" data-act="ov-close"><div class="modal wide" role="dialog" aria-modal="true" aria-label="대진표 보기"><div class="m-head"><h2>${fmtFull(b.cfg.date)} <span class="chip ${b.status==='확정'?'ball':''}">${h(b.status)}</span></h2><button type="button" class="modal-x" data-act="close-modal" aria-label="닫기">×</button></div><div class="stage" id="bv-stage">${posterHtml(d,false)}</div><div class="row" style="justify-content:flex-end;margin-top:12px">${mode!=='ro'?`<button class="btn danger" data-act="bv-del" data-id="${id}">삭제</button><button class="btn" data-act="br-copy" data-id="${id}">새 대진으로 복사</button><button class="btn" data-act="br-load" data-id="${id}">불러와서 수정</button>${b.cfg.eventId?`<button class="btn" data-act="bv-score" data-id="${id}">점수 입력</button>`:''}`:''}<button class="btn ball" data-act="bv-img" data-id="${id}">이미지 다운로드</button></div></div></div>`;
  lockPage();fitIn($('#bv-stage'));
}
ACT['bv-open']=t=>{closeDayPop();openBracketView(t.dataset.id)};
ACT['bv-del']=async t=>{if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='한 번 더 누르면 삭제';return}const id=t.dataset.id;closeModal();await del('brackets',id);if(draft&&draft.id===id){draft.id=null;saveDraft()}toast('대진표 삭제 완료');render()};
ACT['bv-img']=async t=>{const b=S.brackets.find(x=>x.id===t.dataset.id);if(!b)return;const inline=t.dataset.inline;const st=inline?$('#stage'):$('#bv-stage');const el=st&&st.querySelector('.poster');if(!el)return;await exportPoster(el,normB(b));fitIn(st)};
function viewDraw(){
  if(RO)return viewDrawRO();
  const all=rosterAll();
  const q=plq.trim();const match=p=>!q||p.name.includes(q)||(p.nick||'').includes(q);
  const picked=new Set(cfg.picked);
  const pc=all.filter(p=>picked.has(p.key));
  const pm=pc.filter(p=>p.gender==='M').length,pf=pc.length-pm,pg=pc.filter(p=>p.guest).length;
  const C=cfg.courtList.length,R=roundsOf(cfg),need=C*4;
  const row=p=>`<label><input type="checkbox" data-pick="${h(p.key)}"${picked.has(p.key)?' checked':''}><span class="grow">${h(p.name)}${p.nick?` <span class="muted small">(${h(nk(p.nick))})</span>`:''}${p.guest&&p.inviter?` <span class="muted small">· ${h(memberById(p.inviter)?.name||'')} 초대</span>`:''}</span><span class="g-${p.gender} small">${p.gender==='M'?'남':'여'}</span>${p.lvUnknown?stars(null):stars(p.level)}${p.guest?`<button type="button" class="btn ghost sm" data-act="guest-edit" data-id="${h(p.key)}" aria-label="게스트 수정">수정</button>`:''}</label>`;
  const mem=plf==='G'?[]:byName(all.filter(p=>!p.guest&&match(p))),gst=plf==='M'?[]:byName(all.filter(p=>p.guest&&match(p)));
  const plist=all.length?`<div class="plist" data-ks="plist">${mem.length?`<div class="grp">회원 ${mem.length}</div>${mem.map(row).join('')}`:''}${gst.length?`<div class="grp">게스트 ${gst.length}</div>${gst.map(row).join('')}`:''}</div>`:`<div class="empty" style="margin-top:8px">회원 등록 또는 게스트 추가 필요</div>`;
  let needBox;
  if(pc.length<need){const short=need-pc.length;needBox=`<div class="need warn"><b>${short}명 부족.</b> 코트 ${C}면 전체 사용 시 최소 ${need}명 필요. 현재 인원 기준 타임당 ${Math.floor(pc.length/4)}면 사용<div class="row" style="margin-top:6px"><button class="btn sm" data-act="guest-new">신규 게스트 추가</button></div>${recruitBox(short)}</div>`}
  else{const avg=(R*need/pc.length);needBox=`<div class="need">타임당 ${need}명 경기, ${pc.length-need}명 벤치 · 1인 평균 <b>${avg.toFixed(1)}경기</b> (${R}타임)${pf%2?'<br>여성 참석자 홀수로 타임별 남녀 수 조정에 따른 벤치 변동 가능':''}${pf<4&&pf>0?'<br>여성 4명 미만으로 여복 편성 불가':''}<div class="row" style="margin-top:6px"><button class="btn sm" data-act="guest-new">신규 게스트 추가</button></div>${pc.length-need>C*2?'':recruitBox(2)}</div>`}
  const courtOpts=S.courts.map(c=>`<option value="${h(c.name)}">`).join('');
  const saved=S.brackets.slice().sort((a,b)=>(b.cfg?.date||'').localeCompare(a.cfg?.date||''));
  const settings=`<section class="panel"><div class="panel-h"><h2>모임 설정</h2><div class="row"><button class="btn sm" data-act="reg-defaults" title="${REG.place} · 토 ${REG.gameStart}–${REG.end}">정기모임 기본값</button><button class="btn sm" data-act="ev-draw">행사 대진</button></div></div>${(()=>{const ev=cfg.eventId&&S.events.find(e=>e.id===cfg.eventId);return ev?`<div class="evdraw-bar"><span><b>행사 대진</b> · ${h(ev.title)}${(ev.teams||[]).length>=2?` · 팀전(${ev.teams.map(t=>h(t.name)).join(' vs ')})`:''}</span><button class="btn sm ghost" data-act="ev-draw-clear">해제</button></div>`:''})()}
    <div style="display:flex;flex-direction:column;gap:10px">
    <label class="f">제목<input class="in" id="c-title" data-cfg="title" value="${h(cfg.title)}"></label>
    <div class="grid2"><label class="f">날짜${calField(cfg.date,{id:'c-date',extra:'data-cfg="date"'})}</label><label class="f">장소<input class="in" id="c-place" data-cfg="place" list="courtlist" value="${h(cfg.place)}"></label></div>
    <div class="grid3"><label class="f">첫 게임${timeField(cfg.start,{id:'c-start',extra:'data-cfg="start"',title:'첫 게임 시각'})}</label><label class="f">게임(분)<input class="in" type="number" min="10" max="120" step="5" id="c-mins" data-cfg="mins" value="${h(cfg.mins)}"></label><label class="f">종료${timeField(cfg.end,{id:'c-end',extra:'data-cfg="end"',title:'종료 시각'})}</label></div>
    <div class="small muted" id="c-rinfo">${toMin(cfg.end)>toMin(cfg.start)?`총 ${R}타임 · 쉬는 시간 없음`:'종료 시각은 첫 게임 이후로 입력 필요'}</div>
    <div><div class="row" style="justify-content:space-between"><span class="small muted" style="font-weight:600">코트 ${C}면</span><div class="row"><button class="btn sm" data-act="court-n" data-v="-1" aria-label="코트 줄이기"${C<=1?' disabled':''}>−</button><button class="btn sm" data-act="court-n" data-v="1" aria-label="코트 늘리기"${C>=6?' disabled':''}>+</button></div></div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px">${cfg.courtList.map((c,i)=>`<div class="courtrow"><input class="in" id="cn-${i}" data-court="${i}" data-k="name" value="${h(c.name)}" aria-label="코트 ${i+1} 이름"><select class="in" id="cp-${i}" data-court="${i}" data-k="pref" aria-label="코트 ${i+1} 배정">${Object.entries(PREF).map(([k,v])=>`<option value="${k}"${c.pref===k?' selected':''}>${v}</option>`).join('')}</select></div>`).join('')}</div></div>
    <label class="f">편성 방식<select class="in" id="c-mode" data-cfg="mode">${Object.entries(MODES).map(([k,v])=>`<option value="${k}"${cfg.mode===k?' selected':''}>${v}</option>`).join('')}</select></label>
    </div><datalist id="courtlist">${courtOpts}</datalist></section>
    <section class="panel"><div class="panel-h"><h2>참석자 <span class="num muted">${pc.length}</span></h2><div class="row"><button class="btn sm" data-act="pick-all">회원 전체</button><button class="btn sm" data-act="pick-none">해제</button></div></div>
    <div class="small muted">남 ${pm} · 여 ${pf}${pg?` · 게스트 ${pg}`:''}</div>
    ${needBox}
    <div class="row" style="margin-top:10px;flex-wrap:nowrap"><input class="in" id="pl-q" placeholder="이름·닉네임 검색" value="${h(plq)}" data-plq="1" style="flex:1"><div class="seg">${[['','전체'],['M','회원'],['G',`게스트 ${all.filter(p=>p.guest).length}`]].map(([v,l])=>`<button class="${plf===v?'on':''}" data-act="pl-f" data-v="${v}">${l}</button>`).join('')}</div></div>
    ${plist}
    <button class="btn ball" style="width:100%;margin-top:14px;padding:10px" data-act="gen">${draft?'대진표 다시 생성':'대진표 생성'}</button>${cfg.eventId?'<button class="btn" style="width:100%;margin-top:8px;padding:10px" data-act="gen-blank">빈 대진표로 직접 입력</button>':''}
    </section>`;
  let selbar='';
  if(draft&&sel){const k=getSlot(sel.r,sel.slot);const inMatch=sel.slot[0]==='m';selbar=`<div class="selbar"><span><b>${h(dn(draft.players[k]?.name))}</b> 선택됨 (${sel.r+1}타임) · 같은 타임의 다른 이름 또는 빈자리 선택</span><span class="row" style="margin-left:auto"><button class="btn sm" data-act="sel-clear">${inMatch?'자리 비우기 (벤치로)':'이 타임에서 빼기'}</button><button class="btn sm danger" data-act="sel-out">모든 타임에서 빼기</button><button class="btn sm ghost" data-act="sel-cancel">취소</button></span></div>`}
  const stage=draft?`<div class="stage-bar"><div class="hint">이름 선택 시 변경·삭제 메뉴 표시 <button class="btn sm ghost" data-act="zoom-toggle">${posterZoom==='fit'?'크게 보기':'화면에 맞추기'}</button></div>
    ${(()=>{const ec=emptyCount();const lock=ec&&!draft.allowBlank;const tip=lock?` class="tipwrap" data-tip="대진표 입력 완료 필요 (빈자리 ${ec}곳)" tabindex="0"`:' class="tipwrap"';const dis=lock?' disabled':'';
      return `<div class="row"><button class="btn" data-act="br-save">${draft.id?'저장':'초안 저장'}</button>${draft.status==='확정'?'<button class="btn" data-act="br-unconfirm">확정 해제</button>':`<span${tip}><button class="btn pri" data-act="br-confirm"${dis}>확정</button></span>`}<span${tip}><button class="btn ball" data-act="br-img"${dis}>이미지 다운로드</button></span>${ec||draft.allowBlank?`<div class="emptywarn${draft.allowBlank?' ok':''}">${ec?`빈자리 ${ec}곳 · `:''}${draft.allowBlank?'공란 허용: 빈자리는 – 로 두고 확정·다운로드 가능 (현장에서 채움)':'모두 채워야 확정·다운로드 가능'}<label class="check blank-tg"><input type="checkbox" data-blank="1"${draft.allowBlank?' checked':''}> 공란 허용</label></div>`:''}</div>`})()}</div>
    ${selbar}<div class="stage" id="stage">${posterHtml()}</div>`:
    `<div class="empty" style="padding:60px 16px"><b>참석자 목록에서 인원 선택 후 '대진표 생성' 버튼으로 생성</b>기존 카톡 공지와 같은 형식(타임 · 코트 1–3 · 벤치)으로 생성</div>`;
  return `<div class="page-head"><div><h1>대진표</h1><p>매주 토요일 정기모임 대진 자동 생성, 수정 후 이미지 다운로드 및 카톡방 공지</p></div></div>
  ${logicHtml()}
  <div class="draw"><div>${settings}</div><div style="min-width:0">${stage}</div></div>
  <div class="draw-hist">${historyPanel(saved)}${statsPanel()}</div>`;
}
document.addEventListener('input',e=>{
  const t=e.target;
  /* 저장된 대진을 불러온 상태에서 날짜 변경: 새 대진으로 복사할지 원본 날짜를 고칠지 선택 */
  if(t.dataset.cfg==='date'&&draft&&draft.id&&t.value&&t.value!==draft.cfg.date&&S.brackets.some(b=>b.id===draft.id)){
    const v=t.value,old=draft.cfg.date;t.value=old;if(dateAsk)return;dateAsk=true;
    choiceDialog({title:`날짜를 ${fmtD(v)}로 변경`,msg:`${fmtD(old)} 대진 기록을 어떻게 할지 선택`,choices:[
      {key:'new',label:'새 대진으로 복사',sub:`${fmtD(old)} 기록은 그대로, ${fmtD(v)} 새 초안`,cls:'pri'},
      {key:'move',label:'원본 날짜 수정',sub:`${fmtD(old)} 기록을 ${fmtD(v)}로 옮김`,cls:''}]}).then(ch=>{dateAsk=false;
      if(ch){if(ch==='new'){draft.id=null;draft.status='초안'}cfg.date=v;draft.cfg.date=v;saveCfg();saveDraft();toast(ch==='new'?`${fmtD(old)} 기록 유지 · ${fmtD(v)} 새 초안`:`${fmtD(old)} 기록 날짜 ${fmtD(v)}로 변경 · 저장 필요`)}
      render()});
    return}
  if(t.dataset.cfg){let v=t.value;if(t.dataset.cfg==='mins')v=Number(v)||0;cfg[t.dataset.cfg]=v;saveCfg();
    if(['start','end','mins'].includes(t.dataset.cfg)){const ri=$('#c-rinfo');if(ri)ri.textContent=toMin(cfg.end)>toMin(cfg.start)?`총 ${roundsOf(cfg)}타임 · 쉬는 시간 없음`:'종료 시각은 첫 게임 이후로 입력 필요'}
    if(draft&&['title','date','place'].includes(t.dataset.cfg)){draft.cfg[t.dataset.cfg]=v;saveDraft();const st=$('#stage');if(st){st.innerHTML=posterHtml();fitPoster()}}}
  if(t.dataset.court!==undefined&&t.dataset.k==='name'){cfg.courtList[+t.dataset.court].name=t.value;saveCfg();if(draft&&draft.cfg.courtList&&draft.cfg.courtList[+t.dataset.court]){draft.cfg.courtList[+t.dataset.court].name=t.value;saveDraft();const st=$('#stage');if(st)st.innerHTML=posterHtml()}}
  if(t.dataset.plq){plq=t.value;render()}
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.pick!==undefined){const k=t.dataset.pick;cfg.picked=t.checked?[...new Set([...cfg.picked,k])]:cfg.picked.filter(x=>x!==k);saveCfg();render()}
  if(t.dataset.court!==undefined&&t.dataset.k==='pref'){cfg.courtList[+t.dataset.court].pref=t.value;saveCfg();render()}
  if(t.dataset.cfg==='mode'||t.dataset.cfg==='start'||t.dataset.cfg==='end'||t.dataset.cfg==='mins')render();
});
ACT['court-n']=t=>{const v=+t.dataset.v;if(v>0&&cfg.courtList.length<6)cfg.courtList.push({name:`코트 ${cfg.courtList.length+1}`,pref:''});if(v<0&&cfg.courtList.length>1)cfg.courtList.pop();saveCfg();render()};
ACT['reg-defaults']=()=>{delete cfg.eventId;Object.assign(cfg,{title:REG.title,place:REG.place,start:REG.gameStart,end:REG.end,mins:30,courtList:defCourts(),date:cfg.date&&diffDays(cfg.date)>=0&&parseYmd(cfg.date).getDay()===REG.weekday&&cfg.date>=nextRegNow()?cfg.date:nextRegNow()});saveCfg();render()};
ACT['reg-draw']=t=>{closeDayPop();Object.assign(cfg,{title:REG.title,place:REG.place,start:REG.gameStart,end:REG.end,date:t.dataset.d});saveCfg();location.hash='#draw'};
ACT['pick-all']=()=>{cfg.picked=[...new Set([...cfg.picked,...activeMembers().map(m=>m.id)])];saveCfg();render()};
ACT['pick-none']=()=>{cfg.picked=[];saveCfg();render()};
function recruitText(n){const d=parseYmd(cfg.date);return `[SBPB 게스트 모집]\n${d?`${d.getMonth()+1}/${d.getDate()}(${WD[d.getDay()]})`:''} ${REG.start}~${REG.end} ${cfg.place||REG.place}\n게스트 ${n}명 모집합니다! 🎾\n복식 게임 위주로 진행합니다. 참여 희망 시 댓글 부탁드립니다.`}
function recruitBox(n){return `<details class="recruit" id="recruit"${lsGet('sbpb-recruit-open',false)?' open':''}><summary><span>게스트 모집 문구 미리보기</span><span class="led-tg"><span class="tg-o">펼치기</span><span class="tg-c">접기</span> <i>▾</i></span></summary><pre class="rtext">${h(recruitText(n))}</pre><button class="btn sm" data-act="recruit-copy" data-n="${n}">문구 복사</button></details>`}
document.addEventListener('click',e=>{const d=e.target.closest&&e.target.closest('details');if(d&&!d.open&&!e.target.closest('summary')){e.preventDefault();d.open=true}});
document.addEventListener('toggle',e=>{if(e.target.id==='recruit')lsSet('sbpb-recruit-open',e.target.open)},true);
ACT['recruit-copy']=async t=>{
  const n=+t.dataset.n||1;const txt=recruitText(n);
  try{await navigator.clipboard.writeText(txt);toast('모집 문구 복사 완료')}catch(e){openModal('모집 공지 문구',`<textarea class="in" rows="6" readonly>${h(txt)}</textarea><p class="small muted" style="margin:0">문구 칸을 길게 눌러 복사</p>`,async()=>{})}
};
/* ---- guests ---- */
const nk=s=>{s=String(s||'');return [...s].length>5?[...s].slice(0,5).join('')+'…':s};
// 회원·게스트 표 공통 열 폭 (닉네임·배지가 길어져도 열이 밀리지 않음)
/* 회원 표: 거주 · 직장은 남는 폭을 나눠 쓰고 메모는 좁게 */
const MEM_COLS='<colgroup><col style="width:52px"><col style="width:130px"><col style="width:104px"><col style="width:104px"><col style="width:150px"><col><col><col style="width:136px"><col style="width:120px"><col style="width:180px"></colgroup>';
const PEOPLE_COLS='<colgroup><col style="width:52px"><col style="width:150px"><col style="width:112px"><col style="width:110px"><col style="width:150px"><col style="width:110px"><col style="width:140px"><col style="width:132px"><col></colgroup>';
function guestSection(){
  const q=(mf.q||'').trim();
  const list=S.guests.filter(g=>!q||(g.name||'').includes(q)||(g.nick||'').includes(q)||(g.memo||'').includes(q)).sort((x,y)=>(y.lastDate||'').localeCompare(x.lastDate||'')||(x.name||'').localeCompare(y.name||''));
  const lv=g=>g.level===null||g.level===undefined||g.level===''?stars(null):stars(g.level);
  const invName=g=>g.inviter?h(memberById(g.inviter)?.name||''):'';const exM=g=>g.memberId?'<span class="chip">전 회원</span>':'';
  const inv=g=>[exM(g),invName(g)?invName(g)+' 초대':''].filter(Boolean).join(' ');
  const visit=g=>g.visits?`${g.visits}회 · ${fmtD(g.lastDate)}`:'방문 기록 없음';
  return `<div class="sec-h"><div><h2>게스트 <span class="num muted" style="font-size:15px">${S.guests.length}</span></h2><p class="small muted" style="margin:2px 0 0">게스트 오픈톡방 우선 공지 대상. 대진표 참석자 목록에서 바로 선택 가능</p></div><button class="btn pri" data-act="guest-new" data-ctx="members">게스트 추가</button></div>
  ${S.guests.length?`<div class="tbl-wrap"><table class="tbl mt">${PEOPLE_COLS}<thead><tr><th style="cursor:default">No.</th><th style="cursor:default">이름</th><th style="cursor:default">성별</th><th style="cursor:default">레벨</th><th style="cursor:default">구력</th><th style="cursor:default">초대 회원</th><th style="cursor:default">방문</th><th style="cursor:default">연락 경로</th><th style="cursor:default">메모</th></tr></thead><tbody>
  ${list.map((g,i)=>`<tr data-act="guest-edit" data-id="${g.id}" style="cursor:pointer"><td class="num muted">${i+1}</td><td title="${h(g.name)}${g.nick?` (${h(g.nick)})`:""}"><b>${h(g.name)}</b>${g.nick?` <span class="muted small">(${h(nk(g.nick))})</span>`:''}</td><td class="g-${g.gender}">${g.gender==='M'?'남':'여'}</td><td>${lv(g)}</td><td>${h(g.career||'')}</td><td>${inv(g)}</td><td class="small">${visit(g)}</td><td class="muted">${h(g.contact||'')}</td><td class="muted small" style="max-width:220px;overflow:hidden;text-overflow:ellipsis">${h(g.memo||'')}</td></tr>`).join('')}
  ${!list.length?'<tr><td colspan="9" class="muted" style="text-align:center;padding:20px">조건에 맞는 게스트 없음</td></tr>':''}</tbody></table></div>
  <div class="mcards">${list.map((g,i)=>`<div class="mcard" data-act="guest-edit" data-id="${g.id}"><div class="top1"><div><span class="num muted small" style="margin-right:6px">${i+1}</span><b>${h(g.name)}</b>${g.nick?` <span class="muted small">(${h(nk(g.nick))})</span>`:''} <span class="g-${g.gender} small">${g.gender==='M'?'남':'여'}</span></div>${lv(g)}</div><div class="meta">${g.career?`<span>구력 ${h(g.career)}</span>`:''}${g.memberId?`<span>${exM(g)}</span>`:''}${g.inviter?`<span>${invName(g)} 초대</span>`:''}<span>${visit(g)}</span>${g.contact?`<span>${h(g.contact)}</span>`:''}</div></div>`).join('')||'<div class="empty">조건에 맞는 게스트 없음</div>'}</div>`
  :`<div class="empty"><b>등록된 게스트 없음</b>기존 방문 게스트를 미리 등록하면 대진표 참석자 목록에서 바로 선택 가능</div>`}`;
}
function guestForm(g={},ctx=''){
  return `<div class="grid2"><label class="f">이름<input class="in" name="name" required value="${h(g.name)}"></label>
  <label class="f">닉네임 (선택)<input class="in" name="nick" value="${h(g.nick)}" placeholder="오픈톡방 닉네임"></label></div>
  <div class="grid2"><label class="f">성별<select class="in" name="gender"><option value="M"${g.gender==='M'?' selected':''}>남</option><option value="F"${g.gender==='F'?' selected':''}>여</option></select></label>
  <div class="f">실력 레벨${levelSelect('level',g.id?(g.level??''):'',true)}</div></div>
  <div class="grid2">
<label class="f">초대한 회원<select class="in" name="inviter"><option value="">선택 안 함</option>${activeMembers().map(m=>`<option value="${m.id}"${g.inviter===m.id?' selected':''}>${h(m.name)}</option>`).join('')}</select></label></div>
  <div class="grid2"><label class="f">구력 (선택)<input class="in" name="career" value="${h(g.career)}" placeholder="예: 2년"></label><label class="f">연락 경로 (선택)<input class="in" name="contact" value="${h(g.contact)}" placeholder="예: 오픈채팅, 지인"></label></div>
  <label class="f">메모<textarea class="in" name="memo" placeholder="정회원 가입 의사, 특이사항 등">${h(g.memo)}</textarea></label>
  ${ctx==='members'?'':`<label class="check"><input type="checkbox" name="attend"${g.id?'':' checked'}> 이번 대진표 참석자에 포함</label>`}
  ${g.id?`<div class="convbox"><div><b>정회원 등록</b><span>${g.memberId&&memberById(g.memberId)?'전 회원 기록 복원 후 올해 등록 추가':'회원 명단으로 이동, 올해 등록으로 기록'}</span></div><button type="button" class="btn pri" data-act="g-to-member" data-id="${g.id}">정회원 등록</button></div>${g.memberId?`<div class="convbox"><div><b>전 회원 기록 초기화</b><span>'전 회원' 표시와 예전 회원 기록(등록 연도 등) 삭제. 처음부터 게스트였던 것으로 처리</span></div><button type="button" class="btn danger" data-act="g-clear-member" data-id="${g.id}">초기화</button></div>`:''}`:''}`;
}
const guestFromFd=(fd,old={})=>({...old,name:fd.name.trim(),nick:(fd.nick||'').trim(),gender:fd.gender,level:fd.level===''?null:Number(fd.level),inviter:fd.inviter,career:fd.career.trim(),contact:fd.contact.trim(),memo:fd.memo.trim()});
ACT['guest-new']=t=>{const fill=t.dataset.fill&&pickCtx?{...pickCtx}:null;openModal('게스트 등록',guestForm({},t.dataset.ctx||''),async fd=>{const id=uid();await put('guests',id,{...guestFromFd(fd),createdAt:Date.now(),visits:0});if(fd.attend&&!cfg.picked.includes(id)){cfg.picked.push(id);saveCfg()}
  if(fill&&draft){pickCtx=fill;setTimeout(()=>{if(S.guests.find(g=>g.id===id)||!db)placeInto(id);else{const iv=setInterval(()=>{if(S.guests.find(g=>g.id===id)){clearInterval(iv);pickCtx=fill;placeInto(id)}},200);setTimeout(()=>clearInterval(iv),5000)}},0)}
  render()})};
ACT['guest-edit']=(t,e)=>{e.preventDefault();const g=S.guests.find(x=>x.id===t.dataset.id);if(!g)return;openModal(`게스트 ${g.name}`,guestForm(g,route==='members'?'members':'')+`${g.visits?`<p class="small muted" style="margin:0">방문 ${g.visits}회 · 최근 ${fmtFull(g.lastDate)}</p>`:''}`,async fd=>{await put('guests',g.id,guestFromFd(fd,g));if(fd.attend&&!cfg.picked.includes(g.id)){cfg.picked.push(g.id);saveCfg()}},`<button type="button" class="btn danger" data-act="guest-del" data-id="${g.id}">삭제</button>`)};
ACT['guest-del']=t=>{if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='한 번 더 누르면 삭제';return}const id=t.dataset.id;cfg.picked=cfg.picked.filter(x=>x!==id);saveCfg();del('guests',id);closeModal()};
/* ---- save / confirm / export ---- */
ACT['gen']=()=>{if(draft&&draft.status==='확정'&&!ACT._genOk){ACT._genOk=1;toast('확정된 대진표. 한 번 더 누르면 새 초안 생성');setTimeout(()=>ACT._genOk=0,3000);return}ACT._genOk=0;generate()};
async function saveBracket(){const id=draft.id||uid();draft.id=id;saveDraft();const old=S.brackets.find(x=>x.id===id)||{};await put('brackets',id,{...old,cfg:draft.cfg,players:draft.players,rounds:draft.rounds,status:draft.status,allowBlank:!!draft.allowBlank,createdBy:old.createdBy||myId||null});}
ACT['br-save']=async()=>{try{await saveBracket();toast('대진표 저장 완료');render()}catch(e){}};
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.blank&&draft){draft.allowBlank=e.target.checked;saveDraft();render()}});
ACT['br-confirm']=async()=>{
  if(emptyCount()&&!draft.allowBlank){toast('대진표 입력 완료 필요');return}
  draft.status='확정';sel=null;
  try{await saveBracket();
    for(const k of Object.keys(draft.players)){const g=S.guests.find(x=>x.id===k);if(g&&g.lastDate!==draft.cfg.date)await put('guests',g.id,{...g,lastDate:draft.cfg.date,visits:(g.visits||0)+1})}
    toast('확정 완료. 이미지 다운로드 후 카톡방 공지')}catch(e){}
  render()};
ACT['br-unconfirm']=async()=>{draft.status='초안';try{await saveBracket()}catch(e){}render()};
ACT['br-load']=t=>{const b=S.brackets.find(x=>x.id===t.dataset.id);if(!b)return;closeModal();if(route!=='draw')location.hash='#draw';const bc={...b.cfg};if(!bc.courtList){const n=Math.max(...b.rounds.map(R=>R.matches.length));bc.courtList=Array.from({length:n},(_,i)=>({name:`코트 ${i+1}`,pref:''}))}
  draft={id:b.id,cfg:bc,players:b.players,rounds:JSON.parse(JSON.stringify(b.rounds)),status:b.status,allowBlank:!!b.allowBlank};
  Object.assign(cfg,{title:bc.title,date:bc.date,place:bc.place,start:bc.start,end:bc.end||cfg.end,mins:bc.mins,courtList:JSON.parse(JSON.stringify(bc.courtList))});saveCfg();saveDraft();sel=null;render();window.scrollTo(0,0)};
async function exportPoster(el,d){
  if(typeof html2canvas!=='function'){toast('이미지 도구 불러오기 실패. 새로고침 후 재시도 필요');return}
  resetScale(el);el.classList.add('exporting');
  try{await document.fonts.ready}catch(e){}
  let canvas;try{canvas=await html2canvas(el,{scale:2,backgroundColor:'#FBFBF9',useCORS:true})}catch(e){el.classList.remove('exporting');toast('이미지 생성 실패. 재시도 필요');return}
  el.classList.remove('exporting');
  const dt=parseYmd(d.cfg.date);const fname=`SBPB_대진표_${dt?`${dt.getMonth()+1}월${dt.getDate()}일`:''}.png`;
  canvas.toBlob(async blob=>{
    if(dl){try{await dl.save({filename:fname,data:blob});toast('이미지 저장 완료');return}catch(e){if(e&&e.code==='declined')return}}
    const url=URL.createObjectURL(blob);
    openModal('대진표 이미지',`<p class="small muted" style="margin:0">이미지를 길게 누르거나 우클릭하여 저장</p><img class="imgprev" src="${url}" alt="대진표 이미지">`,async()=>{});
  },'image/png');
}
ACT['br-img']=async()=>{
  if(!$('#poster'))return;
  if(emptyCount()&&!draft.allowBlank){toast('대진표 입력 완료 필요');return}
  sel=null;$('#stage').innerHTML=posterHtml();await exportPoster($('#poster'),draft);fitPoster();
};

/* =========================================================
   EVENTS
   ========================================================= */
let memoOpen=lsGet('sbpb-memo-open',false);
document.addEventListener('toggle',e=>{if(e.target.id==='memo-fold'){memoOpen=e.target.open;lsSet('sbpb-memo-open',memoOpen);const s=e.target.querySelector('summary .muted');if(s)s.textContent=memoOpen?'접기':'펼치기'}},true);
function setMemoOpen(v){memoOpen=v;lsSet('sbpb-memo-open',v);const d=$('#memo-fold');if(d)d.open=v;const hd=$('#evdetail .evhead');if(hd){hd.setAttribute('aria-expanded',String(v));hd.title=v?'메모 접기':'메모 펼치기'}}
ACT['memo-toggle']=(t,e)=>{if(e&&e.target.closest('a,button,input,textarea,select'))return;setMemoOpen(!memoOpen)};
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('evhead')){e.preventDefault();setMemoOpen(!memoOpen)}});
let noteView=lsGet('sbpb-note-view','sticky');
ACT['note-more']=t=>{t.classList.toggle('open')};
ACT['note-view']=t=>{noteView=t.dataset.v;lsSet('sbpb-note-view',noteView);render()};
let evSel=null,evFilter='all',evPastMore=false,noteColor='yellow';
function evForm(ev={}){
  return `<label class="f">행사명<input class="in" name="title" required value="${h(ev.title)}" placeholder="예: 2026 송년 내부대회"></label>
  <div class="grid2"><label class="f">종류<select class="in" name="type">${EV_TYPES.map(t=>`<option${ev.type===t?' selected':''}>${t}</option>`).join('')}</select></label>
  <label class="f">진행 상태<select class="in" name="status">${EV_STATUS.map(t=>`<option${ev.status===t?' selected':''}>${t}</option>`).join('')}</select></label></div>
  <div class="grid2"><label class="f">시작일${calField(ev.date,{name:'date',required:true})}</label><label class="f">종료일 (MT 등)${calField(ev.endDate,{name:'endDate'})}</label></div>
  <div class="grid2"><label class="f">장소<input class="in" name="place" value="${h(ev.place)}"></label><label class="f">담당 운영진<input class="in" name="owner" list="staffs" value="${h(ev.owner)}"><datalist id="staffs">${S.members.filter(m=>isStaff(m)).map(m=>`<option value="${h(m.name)}">`).join('')}</datalist></label></div>
  <div class="grid2" id="gen-fields"${ev.type==='개인대회'?' hidden':''}><label class="f">예산 (원)<input class="in" type="number" name="budget" value="${h(ev.budget)}"></label><label class="f">예상 인원<input class="in" type="number" name="headcount" value="${h(ev.headcount)}"></label></div>
  <div class="f" id="conf-fields" data-px="cfx"${ev.type==='개인대회'?' hidden':''}><span>확정 인원 <b class="num" id="cf-n" style="color:var(--court)">${(ev.confirmed||[]).length+(ev.confirmedExtra||[]).length}명</b> <span style="font-weight:500">(참석 확정된 멤버 선택 · + 로 게스트 추가)</span></span><input type="hidden" name="cfx" value="${h(JSON.stringify(ev.confirmedExtra||[]))}"><div class="cbchips cf-chips">${(()=>{const cf=ev.confirmed||[];const list=byName(activeMembers());cf.forEach(id=>{if(!list.some(m=>m.id===id)){const m=memberById(id);if(m)list.push(m)}});return list.map(m=>`<label><input type="checkbox" name="cf_${m.id}"${cf.includes(m.id)?' checked':''}>${h(m.name)}</label>`).join('')})()}${(ev.confirmedExtra||[]).map(cfxChip).join('')}<button type="button" class="cf-add" data-act="cf-add" aria-label="게스트 추가">+</button></div></div>
  <fieldset class="fs" id="tour-fields"${ev.type==='개인대회'?'':' hidden'}><legend>개인 대회 출전 정보</legend>
    <div class="grid2"><label class="f">부문<input class="in" name="division" list="divs" value="${h(ev.division)}" placeholder="예: 신인부, 개나리부"></label>
    <label class="f">종목<select class="in" name="category">${(()=>{const cats=['남자복식','여자복식','혼합복식','남자단식','여자단식','단체전','기타'];if(ev.category&&!cats.includes(ev.category))cats.push(ev.category);return cats.map(c=>`<option${ev.category===c?' selected':''}>${c}</option>`).join('')})()}</select></label></div>
    <div class="grid2"><label class="f">주최<input class="in" name="host" list="hosts" value="${h(ev.host)}" placeholder="예: KATO, 구 협회장배"></label>
    <label class="f">참가 조건<input class="in" name="cond" value="${h(ev.cond)}" placeholder="예: 구력 3년 미만, 비입상자"></label></div>
    <div class="f" style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--muted);font-weight:600">출전 멤버<div class="cbchips">${byName(activeMembers()).map(m=>`<label><input type="checkbox" name="ent_${m.id}" data-ent="${m.id}"${(ev.entrants||[]).includes(m.id)?' checked':''}>${h(m.name)}</label>`).join('')||'<span class="small muted">회원 등록 필요</span>'}</div></div>
    <div class="f" data-px="partners"><span>외부 파트너 (선택 · 멤버가 아닌 파트너)</span><input type="hidden" name="partners" value="${h(JSON.stringify(ptList(ev)))}"><div class="cbchips px-chips">${ptList(ev).map(cfxChip).join('')}<button type="button" class="cf-add px-add" data-act="cf-add" data-title="외부 파트너 추가">+ 게스트 추가</button></div></div>
    <div class="grid2"><label class="f">결과<select class="in" name="result">${RESULTS.map(r=>`<option${(ev.result||'대기')===r?' selected':''}>${r}</option>`).join('')}</select></label>
    <label class="f">결과 메모<input class="in" name="resultNote" value="${h(ev.resultNote)}" placeholder="예: 결승 6:4 승, 본선 2승 1패"></label></div>
    <div class="f" style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--muted);font-weight:600">응원 간 멤버 <span style="font-weight:500">(출전 멤버 제외)</span><div class="cbchips">${byName(activeMembers()).map(m=>{const ent=(ev.entrants||[]).includes(m.id);return `<label${ent?' class="off"':''}><input type="checkbox" name="ch_${m.id}" data-ch="${m.id}"${!ent&&(ev.cheer||[]).includes(m.id)?' checked':''}${ent?' disabled':''}>${h(m.name)}</label>`}).join('')}</div></div>
  </fieldset>
  <label class="f">개요 · 메모<textarea class="in" name="desc" placeholder="상대 클럽, 진행 방식, 회비, 대회 요강 링크 등">${h(ev.desc)}</textarea></label>
  <datalist id="divs">${['신인부','오픈부','개나리부','국화부','베테랑부','챌린저부','지역부','혼합복식부'].map(x=>`<option value="${x}">`).join('')}</datalist>
  <datalist id="hosts">${['KATO','KATA','KTA','구 테니스협회','시 테니스협회','동호회 주최'].map(x=>`<option value="${x}">`).join('')}</datalist>`;
}
const byName=list=>list.slice().sort((x,y)=>(x.name||'').localeCompare(y.name||'','ko'));
document.addEventListener('change',e=>{const id=e.target.dataset&&e.target.dataset.ent;if(!id)return;const ch=document.querySelector(`#mform input[data-ch="${id}"]`);if(!ch)return;ch.disabled=e.target.checked;if(e.target.checked)ch.checked=false;ch.closest('label').classList.toggle('off',e.target.checked)});
const RESULTS=['대기','우승','준우승','3위','4강','8강','16강','32강','본선 진출','예선','기권'];
const resultCls=r=>r==='우승'?'win':['준우승','3위','4강'].includes(r)?'podium':'';
document.addEventListener('change',e=>{if(e.target.name==='type'&&e.target.closest('#mform')){const t=e.target.value==='개인대회';const f=$('#tour-fields');if(f)f.hidden=!t;const g=$('#gen-fields');if(g)g.hidden=t;const cf=$('#conf-fields');if(cf)cf.hidden=t}});
/* confirmed attendees beyond members: registered guests ("g:<id>") or a typed name ("n:<name>") */
const cfxName=x=>x.startsWith('g:')?((S.guests.find(g=>g.id===x.slice(2))||{}).name||'(삭제된 게스트)'):x.slice(2);
const cfxChip=x=>`<span class="cfx" data-x="${h(x)}">${h(cfxName(x))}<i>게스트</i><button type="button" data-act="cf-x-del" aria-label="빼기">×</button></span>`;
function cfCount(){const n=$('#cf-n');if(n)n.textContent=(document.querySelectorAll('#conf-fields input[type=checkbox]:checked').length+document.querySelectorAll('#conf-fields .cfx').length)+'명'}
function pxSync(f){if(!f)return;f.querySelector(`[name=${f.dataset.px}]`).value=JSON.stringify([...f.querySelectorAll('.cfx')].map(e=>e.dataset.x));if(f.id==='conf-fields')cfCount()}
function pxAdd(f,x){if(!f||[...f.querySelectorAll('.cfx')].some(e=>e.dataset.x===x))return;f.querySelector('.cf-add').insertAdjacentHTML('beforebegin',cfxChip(x));pxSync(f)}
/* external partners in a tournament: registered guests or a new name */
/* 출전자 한 줄: 멤버 + 외부 파트너(게스트 표시) */
const entLine=e=>(e.entrants||[]).map(nameOf).map(h).concat(ptNames(e).map(n=>`${h(n)}<i class="gmark">G</i>`)).join(', ');
const ptList=e=>e.partners||(e.partner?['n:'+e.partner]:[]);
const ptNames=e=>ptList(e).map(cfxName);
ACT['cf-x-del']=t=>{const f=t.closest('[data-px]');t.closest('.cfx').remove();pxSync(f)};
ACT['cf-add']=t=>{const f=t.closest('[data-px]');const have=new Set([...f.querySelectorAll('.cfx')].map(e=>e.dataset.x));const title=t.dataset.title||'확정 인원 추가';
  const gl=byName(S.guests.filter(g=>!have.has('g:'+g.id)));
  const ov=document.createElement('div');ov.className='me-ov';ov.id='cfxpick';ov._f=f;
  ov.innerHTML=`<div class="me-box cfx-box" role="dialog" aria-modal="true" aria-label="${h(title)}"><div class="me-bar"><span></span><b>${h(title)}</b><button type="button" class="btn ghost" data-act="cfx-close">닫기</button></div>
    <div class="cfx-new"><input class="in" id="cfx-name" placeholder="게스트 이름 직접 입력" enterkeyhint="done"><button type="button" class="btn pri" data-act="cfx-name-add">추가</button></div>
    <div class="cfx-sec">등록된 게스트 ${gl.length}</div><div class="cfx-list">${gl.length?gl.map(g=>`<button type="button" data-act="cfx-g" data-id="${g.id}"><b>${h(g.name)}</b>${g.nick?` <span class="muted small">(${h(nk(g.nick))})</span>`:''} <span class="g-${g.gender} small">${g.gender==='M'?'남':'여'}</span>${g.inviter?` <span class="muted small">· ${h(memberById(g.inviter)?.name||'')} 초대</span>`:''}</button>`).join(''):'<p class="muted small" style="padding:12px 16px;margin:0">추가할 게스트 없음</p>'}</div></div>`;
  document.body.appendChild(ov)};
ACT['cfx-close']=()=>{const o=$('#cfxpick');if(o)o.remove()};
ACT['cfx-g']=t=>{const o=$('#cfxpick');pxAdd(o&&o._f,'g:'+t.dataset.id);t.remove();toast('추가 완료')};
ACT['cfx-name-add']=()=>{const o=$('#cfxpick');const i=$('#cfx-name');const v=(i.value||'').trim();if(!v){i.focus();return}pxAdd(o&&o._f,'n:'+v);i.value='';toast(`${v} 추가 완료`)};
document.addEventListener('keydown',e=>{if(e.target.id==='cfx-name'&&e.key==='Enter'){e.preventDefault();ACT['cfx-name-add']()}});
document.addEventListener('change',e=>{if(e.target.name&&e.target.name.startsWith('cf_'))cfCount()});
const evFromFd=(fd,old={})=>{
  const o={...old,title:fd.title.trim(),type:fd.type,status:fd.status,date:fd.date,endDate:fd.endDate&&fd.endDate>=fd.date?fd.endDate:'',place:fd.place.trim(),owner:fd.owner.trim(),headcount:fd.headcount,budget:fd.budget,desc:fd.desc.trim()};
  if(fd.type!=='개인대회'){try{o.confirmedExtra=JSON.parse(fd.cfx||'[]')}catch(e){o.confirmedExtra=[]}}
  if(fd.type!=='개인대회')o.confirmed=Object.keys(fd).filter(k=>k.startsWith('cf_')&&fd[k]===true).map(k=>k.slice(3));
  if(fd.type==='개인대회'){const ids=pre=>Object.keys(fd).filter(k=>k.startsWith(pre)&&fd[k]===true).map(k=>k.slice(pre.length));
    Object.assign(o,{division:fd.division.trim(),category:fd.category,host:fd.host.trim(),cond:fd.cond.trim(),entrants:ids('ent_'),partners:(()=>{try{return JSON.parse(fd.partners||'[]')}catch(e){return []}})(),partner:'',result:fd.result,resultNote:fd.resultNote.trim(),cheer:ids('ch_').filter(x=>!ids('ent_').includes(x))})}
  return o};
ACT['ev-new']=t=>{const stay=!!t.dataset.stay;closeDayPop();openModal(t.dataset.type==='개인대회'?'대회 출전 기록':'행사 추가',evForm({date:t.dataset.d||'',status:t.dataset.type==='개인대회'?'확정':'기획중',type:t.dataset.type||''}),async fd=>{const id=uid();await put('events',id,{...evFromFd(fd),createdAt:Date.now()});evSel=id;if(stay){toast('일정 추가 완료');reopenPop()}else if(route!=='events')location.hash='#events'})};
ACT['ev-edit']=()=>{const ev=S.events.find(e=>e.id===evSel);if(!ev)return;openModal('행사 수정',evForm(ev),fd=>put('events',ev.id,evFromFd(fd,ev)),`<button type="button" class="btn danger" data-act="ev-del">삭제</button>`)};
ACT['ev-del']=async t=>{if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='메모 포함 삭제. 한 번 더 누르면 삭제';return}const id=evSel;closeModal();for(const n of S.notes.filter(n=>n.eventId===id))await del('notes',n.id);await del('events',id);evSel=null};
ACT['ev-open']=t=>{closeDayPop();if(route==='events'&&evSel===t.dataset.id&&!t.closest('#daypop')){setMemoOpen(!memoOpen);return}evSel=t.dataset.id;if(route!=='events')location.hash='#events';else{render();if(window.innerWidth<=1000){const d=$('#evdetail');d&&d.scrollIntoView({behavior:'smooth',block:'start'})}}};
ACT['cheer']=async t=>{const ev=S.events.find(e=>e.id===evSel);if(!ev)return;const id=t.dataset.id;const c=new Set(ev.cheer||[]);c.has(id)?c.delete(id):c.add(id);try{await put('events',ev.id,{...ev,cheer:[...c]})}catch(e){}};
const nameOf=id=>memberById(id)?.name||'(삭제된 회원)';
ACT['ev-filter']=t=>{evFilter=t.dataset.v;evPastMore=false;render()};
ACT['ev-past-more']=()=>{evPastMore=true;render()};
ACT['ev-past-less']=()=>{evPastMore=false;render();const b=$('.ev-more');b&&b.scrollIntoView({block:'center'})};
ACT['note-color']=t=>{noteColor=t.dataset.c;document.querySelectorAll('.sw').forEach(s=>s.setAttribute('aria-pressed',s.dataset.c===noteColor))};
ACT['note-add']=async()=>{const ta=$('#note-text');const txt=ta.value.trim();if(!txt){ta.focus();return}const id=uid();try{await put('notes',id,{eventId:evSel,text:txt,color:noteColor,authorId:myId||null,createdAt:Date.now(),rot:(Math.random()*3-1.5).toFixed(1)});ta.value='';lsSet('sbpb-notedraft','')}catch(e){}};
ACT['note-del']=t=>{if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='삭제?';setTimeout(()=>{t.dataset.confirm='';t.textContent='×'},2500);return}del('notes',t.dataset.id)};
ACT['note-edit']=t=>{const n=S.notes.find(x=>x.id===t.dataset.id);if(!n)return;openModal('메모 수정',`<label class="f">내용<textarea class="in" name="text" rows="6">${h(n.text)}</textarea></label><label class="f">분류<select class="in" name="color">${Object.entries(NOTE_KIND).map(([c,k])=>`<option value="${c}"${n.color===c?' selected':''}>${k}</option>`).join('')}</select></label>`,fd=>put('notes',n.id,{...n,text:fd.text.trim(),color:fd.color}))};

/* ---------- 행사 대진 (MT · 내부대회): 팀전 · 점수 · 시상 ---------- */
const TEAM_C=['#2F6FBF','#D9480F','#2F9E44','#7048E8'];const TEAM_CN=['파랑','주황','초록','보라'];
const tcol=(ev,i)=>{const t=ev&&ev.teams&&ev.teams[i];return t&&t.color!=null&&TEAM_C[t.color]?TEAM_C[t.color]:TEAM_C[i%4]};
const evOfB=b=>b&&b.cfg&&b.cfg.eventId?S.events.find(e=>e.id===b.cfg.eventId):null;
/* 선수 key → 팀 번호 (행사에 등록된 팀 기준) */
function teamMap(ev){const m={};((ev&&ev.teams)||[]).forEach((t,i)=>(t.members||[]).forEach(k=>m[k]=i));return m}
/* 팀전 집계: 경기 승수 → 동점이면 득실(게임 차) */
function teamTally(ev){const T=(ev&&ev.teams)||[];if(T.length<2)return null;const tm=teamMap(ev);const r=T.map((t,i)=>({i,name:t.name,w:0,l:0,gf:0,ga:0}));let played=0;
  S.brackets.filter(b=>b.cfg&&b.cfg.eventId===ev.id).forEach(b=>(b.rounds||[]).forEach(R=>(R.matches||[]).forEach(m=>{if(!m||!m.sc||m.sc[0]===''||m.sc[1]===''||m.sc[0]==null||m.sc[1]==null)return;
    const ta=tm[(m.a||[]).find(Boolean)],tb=tm[(m.b||[]).find(Boolean)];if(ta==null||tb==null||ta===tb)return;const x=+m.sc[0],y=+m.sc[1];played++;
    r[ta].gf+=x;r[ta].ga+=y;r[tb].gf+=y;r[tb].ga+=x;if(x>y){r[ta].w++;r[tb].l++}else if(y>x){r[tb].w++;r[ta].l++}})));
  const rank=r.slice().sort((p,q)=>q.w-p.w||(q.gf-q.ga)-(p.gf-p.ga));return {rows:r,rank,played}}
const tdot=(ev,k)=>{if(!ev||!k)return '';const i=teamMap(ev)[k];return i==null?'':`<i class="tdot" style="background:${tcol(ev,i)}" title="${h(ev.teams[i].name)}"></i>`};
function evGames(ev){if(ev.type==='개인대회')return '';const bs=S.brackets.filter(b=>b.cfg&&b.cfg.eventId===ev.id).sort((x,y)=>(x.cfg.start||'').localeCompare(y.cfg.start||''));
  const T=ev.teams||[];const tl=teamTally(ev);const aw=ev.awards||[];
  const teamsHtml=T.length?`<div class="eg-teams">${T.map((t,i)=>`<div class="eg-team"><b><i class="tdot" style="background:${tcol(ev,i)}"></i>${h(t.name)}</b><span class="small muted">${h((t.members||[]).map(k=>keyName(k)).join(', '))}</span></div>`).join('')}</div>`:'<p class="small muted" style="margin:0">팀 없음 · 팀전이면 팀 설정</p>';
  const res=tl&&tl.played?`<div class="eg-res">${tl.rank.map((x,j)=>`<span class="eg-sc${j===0&&(tl.rank[0].w!==tl.rank[1].w||(tl.rank[0].gf-tl.rank[0].ga)!==(tl.rank[1].gf-tl.rank[1].ga))?' win':''}"><i class="tdot" style="background:${tcol(ev,x.i)}"></i>${h(x.name)} <b class="num">${x.w}승</b> <span class="muted small">${x.l}패 · 득실 ${x.gf-x.ga>0?'+':''}${x.gf-x.ga}</span></span>`).join('')}<span class="small muted">점수 입력 ${tl.played}경기</span></div>`:'';
  return `<div class="evgames"><div class="eg-h"><h3>행사 대진 · 결과</h3>${RO?'':`<div class="row"><button class="btn sm" data-act="eg-award">시상 추가</button></div>`}</div>
    ${evSetupHtml(ev)}${ev.tourney||!T.length?'':teamsHtml}${res}${tourHtml(ev)}
    ${bs.length?`<div class="list">${bs.map(b=>`<div class="li click" data-act="bv-open" data-id="${b.id}"><div class="grow"><div class="ttl">${h(b.cfg.title||ev.title)}</div><div class="sub">${h(b.cfg.start||'')}${b.rounds?` · ${b.rounds.length}타임`:''} · ${(b.cfg.courtList||[]).map(c=>h(c.name)).join(' · ')}</div></div><span class="chip">대진 보기</span></div>`).join('')}</div>`:ev.tourney?'':'<p class="small muted" style="margin:8px 0 0">등록된 행사 대진 없음</p>'}
    ${aw.length?`<div class="eg-aw"><h4 class="st-h">시상</h4>${aw.map((x,i)=>`<div class="eg-awr"><b>${h(x.t)}</b><span>${h(x.w)}</span>${RO?'':`<button class="x" data-act="eg-award-del" data-i="${i}" aria-label="시상 삭제">×</button>`}</div>`).join('')}</div>`:''}</div>`}
ACT['eg-award']=()=>{const ev=S.events.find(e=>e.id===evSel);if(!ev)return;
  openModal('시상 추가',`<label class="f">상 이름<input class="in" name="t" required placeholder="예: 우승 팀 · MVP · 발리 대전 우승"></label><label class="f">수상자<input class="in" name="w" required placeholder="예: 사방 · 홍길동"></label>`,async fd=>{if(!fd.t.trim()||!fd.w.trim())return;const {id,...rest}=ev;await put('events',ev.id,{...rest,awards:(ev.awards||[]).concat({t:fd.t.trim(),w:fd.w.trim()})});toast('시상 기록 추가');render()})};
ACT['eg-award-del']=async t=>{const ev=S.events.find(e=>e.id===evSel);if(!ev)return;const aw=(ev.awards||[]).slice();aw.splice(+t.dataset.i,1);const {id,...rest}=ev;await put('events',ev.id,{...rest,awards:aw});render()};
ACT['eg-teams']=(_t,_e,n)=>{const ev=S.events.find(e=>e.id===evSel);if(!ev)return;const T=(ev.teams&&ev.teams.length?ev.teams:Array.from({length:Math.max(2,+n||2)},(_,i)=>({name:`팀 ${i+1}`,members:[]})));const tm=teamMap({teams:T});
  const ppl=byName(S.members.filter(isCur).map(m=>({key:m.id,name:m.name}))).concat(byName(S.guests.map(g=>({key:g.id,name:g.name,g:true}))).filter(p=>tm[p.key]!=null));
  openModal('팀 설정',`<div class="grid2">${T.map((t,i)=>`<div class="f"><label class="f" style="margin:0">팀 ${i+1} 이름<input class="in" name="tn${i}" value="${h(t.name)}"></label><label class="f" style="margin:6px 0 0">색<select class="in" name="tc${i}">${TEAM_C.map((c,ci)=>`<option value="${ci}"${(t.color!=null?t.color:i)===ci?' selected':''}>${TEAM_CN[ci]}</option>`).join('')}</select></label></div>`).join('')}</div>
    <p class="small muted" style="margin:4px 0 8px">사람마다 팀 선택 · 다시 누르면 해제</p><div class="eg-pick">${ppl.map(p=>`<div class="eg-prow"><span>${h(p.name)}${p.g?' <span class="gmark">G</span>':''}</span><span class="seg">${T.map((t,i)=>`<button type="button" data-act="eg-tpick" data-k="${h(p.key)}" data-i="${i}" class="${tm[p.key]===i?'on':''}">${i+1}</button>`).join('')}</span><input type="hidden" name="tk_${h(p.key)}" value="${tm[p.key]==null?'':tm[p.key]}"></div>`).join('')}</div>`,
    async fd=>{const teams=T.map((t,i)=>({name:(fd['tn'+i]||'').trim()||`팀 ${i+1}`,color:Number(fd['tc'+i]??i),members:[]}));Object.keys(fd).filter(k=>k.startsWith('tk_')&&fd[k]!=='').forEach(k=>teams[+fd[k]].members.push(k.slice(3)));
      const {id,...rest}=ev;await put('events',ev.id,{...rest,teams});toast('팀 저장');render()})};
ACT['eg-tpick']=t=>{const row=t.closest('.eg-prow');const inp=row.querySelector('input');const on=t.classList.contains('on');row.querySelectorAll('button').forEach(b=>b.classList.remove('on'));if(on)inp.value='';else{t.classList.add('on');inp.value=t.dataset.i}};
/* 점수 입력: 대진 보기 창에서 경기마다 게임 점수 */
ACT['bv-score']=t=>{const b=S.brackets.find(x=>x.id===t.dataset.id);if(!b)return;const ev=evOfB(b);const courts=b.cfg.courtList||[];const nm=k=>k?keyName(k,b):'–';
  openModal('점수 입력',`<p class="small muted" style="margin:0 0 8px">게임 점수 입력 · 비워 두면 미입력${ev&&ev.teams?' · 팀 승패와 득실 자동 계산':''}</p><div class="sc-list">${b.rounds.map((R,ri)=>R.matches.map((m,ci)=>m?`<div class="sc-row"><span class="sc-t">${ri+1}타임 · ${h((courts[ci]||{}).name||'코트 '+(ci+1))}</span><span class="sc-p">${tdot(ev,m.a.find(Boolean))}${h(m.a.map(nm).join(' · '))}</span><input class="in num" name="s_${ri}_${ci}_0" inputmode="numeric" value="${m.sc?h(m.sc[0]??''):''}" aria-label="점수"><span class="muted">:</span><input class="in num" name="s_${ri}_${ci}_1" inputmode="numeric" value="${m.sc?h(m.sc[1]??''):''}" aria-label="점수"><span class="sc-p">${tdot(ev,m.b.find(Boolean))}${h(m.b.map(nm).join(' · '))}</span></div>`:'').join('')).join('')}</div>`,
    async fd=>{const rounds=b.rounds.map((R,ri)=>({...R,matches:R.matches.map((m,ci)=>{if(!m)return m;const x=(fd[`s_${ri}_${ci}_0`]||'').trim(),y=(fd[`s_${ri}_${ci}_1`]||'').trim();const o={...m};if(x===''&&y==='')delete o.sc;else o.sc=[x===''?'':+x,y===''?'':+y];return o})}));
      const {id,...rest}=b;await put('brackets',b.id,{...rest,rounds});toast('점수 저장');setTimeout(()=>openBracketView(b.id),50)})};
/* 행사 대진 파일 가져오기: 시간표와 팀 · 대진 */
function eventBracketImport(j){const ev=S.events.find(e=>e.date===j.date&&(!j.eventTitle||e.title.includes(j.eventTitle)))||S.events.find(e=>e.date===j.date);
  if(!ev){toast(`${j.date} 행사를 찾지 못함 · 이벤트에 먼저 등록 필요`);return}
  const ix=nameIndex();const unknown=new Set();const kof=n=>{if(!n)return null;const p=ix[n];if(p)return p.key;unknown.add(n);return 'n:'+n};
  const players={};const reg=n=>{const k=kof(n);if(!k)return null;if(!players[k]){const p=ix[n];players[k]=p?{name:p.name,gender:p.gender,level:p.level,guest:p.guest}:{name:n,gender:'',level:3,guest:true,unreg:true}}return k};
  const rounds=j.rounds.map(R=>({matches:R.matches.map(m=>{const o={a:m.a.map(reg),b:m.b.map(reg)};if(m.t)o.t=m.t;return o}),rest:(R.rest||[]).map(reg).filter(Boolean),...(R.time?{time:R.time}:{})}));
  const teams=(j.teams||[]).map((t,i)=>({name:t.name,color:t.color!=null?t.color:i,members:t.members.map(kof).filter(Boolean)}));
  const body=`<div class="mi-list"><div><b>${h(ev.title)}</b> ${fmtD(ev.date)}</div><div>${h(j.courts.join(' · '))} · ${h(j.start)} 시작 · ${rounds.length}타임 · ${Object.keys(players).length}명</div>${teams.length?`<div>팀: ${teams.map(t=>h(t.name)+' '+t.members.length+'명').join(' · ')}</div>`:''}</div>${unknown.size?`<p class="small" style="margin:8px 0 0">회원 · 게스트 목록에 없는 이름: ${[...unknown].map(h).join(', ')}</p>`:''}`;
  openModal('행사 대진 가져오기',body,async()=>{const bid='ev-'+ev.id+'-'+(j.key||'main');
    await put('brackets',bid,{cfg:{title:j.title||ev.title,date:ev.date,place:ev.place||'',start:j.start,end:j.end||'',mins:j.mins||30,courtList:j.courts.map(n=>({name:n,pref:''})),eventId:ev.id},players,rounds,status:'확정',createdBy:myId||null});
    if(teams.length){const {id,...rest}=ev;await put('events',ev.id,{...rest,teams})}toast('행사 대진 등록');evSel=ev.id;render()})}

/* ---------- 행사 대진 형식: 옵션 조합 (참가 단위 · 진행 방식 · 팀전 · 조) + 수정 가능한 프리셋 ----------
   ev.tourney = {title,fmt:{unit,prog,groups,adv},groups:[{name,teams:[{p:[keys],rank}]}],teams:[...](조 없는 토너먼트),lg:[{g,a,b,sc,w}](리그 경기 · 배열 순서 = 진행 순서),ko:[{stage,a,b,sc,w}]}
   ko의 a/b: 'A1'(A조 1위) · 'T3'(3번 팀) · 'W0'(0번 경기 승자) */
const UNIT_L={rot:'개인 로테이션',pair:'고정 페어',single:'단식'};
const PROG_L={time:'타임표',league:'리그',ko:'토너먼트','league-ko':'리그 → 토너먼트'};
const PRESET_DEF=[{id:'p-reg',name:'정기모임',unit:'rot',prog:'time',teams:0,groups:0,adv:2,order:1},{id:'p-team',name:'팀전 (MT)',unit:'rot',prog:'time',teams:2,groups:0,adv:2,order:2},
  {id:'p-lgko',name:'혼복 대전 (리그 → 토너먼트)',unit:'pair',prog:'league-ko',teams:0,groups:2,adv:2,order:3},{id:'p-single',name:'단식 토너먼트',unit:'single',prog:'ko',teams:0,groups:0,adv:2,order:4}];
function presets(){const over={};(S.presets||[]).forEach(p=>over[p.id]=p);const out=PRESET_DEF.map(p=>over[p.id]?{...p,...over[p.id]}:p);(S.presets||[]).forEach(p=>{if(!PRESET_DEF.some(d=>d.id===p.id))out.push(p)});
  return out.filter(p=>!p.deleted).sort((x,y)=>(x.order||99)-(y.order||99)||x.name.localeCompare(y.name,'ko'))}
const fmtLine=p=>`${UNIT_L[p.unit]} · ${PROG_L[p.prog]}${p.teams>=2?` · ${p.teams}팀 팀전`:''}${p.prog!=='time'&&p.prog!=='ko'&&p.groups?` · ${p.groups}개 조`:''}${p.prog==='league-ko'?` · 조별 ${p.adv}팀 진출`:''}`;
const optSelects=(p,pre='')=>`<div class="grid2"><label class="f">참가 단위<select class="in" name="${pre}unit">${Object.entries(UNIT_L).map(([v,l])=>`<option value="${v}"${p.unit===v?' selected':''}>${l}</option>`).join('')}</select></label>
  <label class="f">진행 방식<select class="in" name="${pre}prog">${Object.entries(PROG_L).map(([v,l])=>`<option value="${v}"${p.prog===v?' selected':''}>${l}</option>`).join('')}</select></label>
  <label class="f">팀전<select class="in" name="${pre}teams">${[0,2,3,4].map(n=>`<option value="${n}"${(+p.teams||0)===n?' selected':''}>${n?n+'팀':'없음'}</option>`).join('')}</select></label>
  <label class="f">조 (리그)<select class="in" name="${pre}groups">${[[0,'없음 · 단일 리그'],[2,'2개 조'],[3,'3개 조'],[4,'4개 조']].map(([n,l])=>`<option value="${n}"${(+p.groups||0)===n?' selected':''}>${l}</option>`).join('')}</select></label>
  <label class="f">조별 본선 진출<select class="in" name="${pre}adv">${[1,2].map(n=>`<option value="${n}"${(+p.adv||2)===n?' selected':''}>${n}팀</option>`).join('')}</select></label></div>`;
const optFrom=(fd,pre='')=>({unit:fd[pre+'unit'],prog:fd[pre+'prog'],teams:+fd[pre+'teams']||0,groups:+fd[pre+'groups']||0,adv:+fd[pre+'adv']||2});

/* 대진표 › 행사 대진: 행사 + 형식(프리셋 또는 직접 조합) */
ACT['ev-draw']=()=>{const evs=S.events.filter(e=>e.type!=='개인대회'&&e.date).sort((x,y)=>Math.abs(diffDays(x.date))-Math.abs(diffDays(y.date))).slice(0,30);
  if(!evs.length){toast('이벤트에 행사를 먼저 등록');return}const PS=presets();const p0=PS[0];
  openModal('행사 대진',`<label class="f">행사<select class="in" name="ev">${evs.map(e=>`<option value="${e.id}"${e.id===cfg.eventId?' selected':''}>${h(fmtD(e.date))} · ${h(e.title)}</option>`).join('')}</select></label>
    <div class="f"><div class="eg-h"><span>형식 (프리셋)</span><button type="button" class="btn sm ghost" data-act="ps-manage">프리셋 관리</button></div><div class="ev-fmt">${PS.map((p,i)=>`<label class="check"><input type="radio" name="preset" value="${p.id}"${i===0?' checked':''}> <span><b>${h(p.name)}</b> <span class="small muted">${h(fmtLine(p))}</span></span></label>`).join('')}</div></div>
    <details class="ps-opt"><summary class="small">옵션 직접 조정</summary>${optSelects(p0,'o_')}</details>`,
    fd=>{const ev=S.events.find(e=>e.id===fd.ev);if(!ev)return;const o=optFrom(fd,'o_');
      if(o.prog==='time'){Object.assign(cfg,{eventId:ev.id,title:ev.title,date:ev.date,place:ev.place||cfg.place});const tm=(ev.teams||[]).flatMap(t=>t.members||[]);const roster=new Set(rosterAll().map(p=>p.key));
        const want=tm.length?tm:(ev.confirmed||[]);if(want.length)cfg.picked=want.filter(k=>roster.has(k));saveCfg();toast(`${ev.title} 행사 대진으로 설정`);render();
        if(o.teams>=2&&(ev.teams||[]).length<2){evSel=ev.id;setTimeout(()=>ACT['eg-teams'](null,null,o.teams),80)}return}
      if(o.unit==='rot'){toast('리그 · 토너먼트는 고정 페어 또는 단식으로');return}
      setTimeout(()=>trBuild(ev,o),60)})};
document.addEventListener('change',e=>{if(e.target.name!=='preset'||!e.target.closest('#mform'))return;const p=presets().find(x=>x.id===e.target.value);if(!p)return;
  const f=e.target.closest('#mform');['unit','prog','teams','groups','adv'].forEach(k=>{const s=f.querySelector(`[name=o_${k}]`);if(s)s.value=String(p[k]??(k==='adv'?2:0))})});
ACT['ev-draw-clear']=()=>{delete cfg.eventId;saveCfg();render()};
/* 프리셋 관리: 이름 · 옵션 수정, 추가, 삭제 */
ACT['ps-manage']=()=>{const PS=presets();
  openModal('프리셋 관리',`<div class="ps-list">${PS.map(p=>`<div class="ps-row"><div><b>${h(p.name)}</b><div class="small muted">${h(fmtLine(p))}</div></div><div class="row"><button type="button" class="btn sm" data-act="ps-edit" data-id="${p.id}">수정</button><button type="button" class="btn sm ghost" data-act="ps-del" data-id="${p.id}">삭제</button></div></div>`).join('')}</div>
    <button type="button" class="btn" data-act="ps-edit" data-id="" style="margin-top:12px">프리셋 추가</button>`,()=>{})};
ACT['ps-edit']=t=>{const p=presets().find(x=>x.id===t.dataset.id)||{name:'',unit:'pair',prog:'ko',teams:0,groups:0,adv:2};
  openModal(t.dataset.id?'프리셋 수정':'프리셋 추가',`<label class="f">이름<input class="in" name="name" required value="${h(p.name)}" placeholder="예: 송년 단식 토너먼트"></label>${optSelects(p)}`,
    async fd=>{if(!fd.name.trim())return;const id=t.dataset.id||'p-'+uid();await put('presets',id,{...(S.presets||[]).find(x=>x.id===id),name:fd.name.trim(),...optFrom(fd),order:p.order||50,deleted:false});toast('프리셋 저장');setTimeout(()=>ACT['ps-manage'](),60)})};
ACT['ps-del']=async t=>{const id=t.dataset.id;const p=presets().find(x=>x.id===id);if(!p)return;const ch=await choiceDialog({title:`${p.name} 삭제`,msg:'이 프리셋을 목록에서 삭제',choices:[{key:'go',label:'삭제',sub:'이미 만든 행사 대진에는 영향 없음',cls:'danger'}]});if(ch!=='go')return;
  if(PRESET_DEF.some(d=>d.id===id))await put('presets',id,{...p,deleted:true});else await del('presets',id);toast('프리셋 삭제');ACT['ps-manage']()};

/* 참가 팀 입력 → 형식대로 조 · 리그 경기 · 본선 생성 */
const KO_STAGE=n=>n===2?'결승':n===4?'4강':n+'강';
function rrPairs(n){const out=[];const ids=[...Array(n).keys()];if(n%2)ids.push(-1);const m=ids.length;for(let r=0;r<m-1;r++){for(let i=0;i<m/2;i++){const x=ids[i],y=ids[m-1-i];if(x>=0&&y>=0)out.push([x,y])}ids.splice(1,0,ids.pop())}return out}
function koFromRefs(refs){const ko=[];let n=refs.length;let cur=refs;while(cur.length>1){const nx=[];for(let i=0;i<cur.length;i+=2){if(cur[i+1]==null){nx.push(cur[i]);continue}ko.push({stage:KO_STAGE(n),a:cur[i],b:cur[i+1],w:null});nx.push('W'+(ko.length-1))}cur=nx;n/=2}return ko}
function seedRefs(list){let P=2;while(P<list.length)P*=2;let so=[0,1];while(so.length<P){const L=so.length*2;so=so.flatMap(s=>[s,L-1-s])}
  const ko=[];const refs=[];for(let i=0;i<P;i+=2){const x=list[so[i]],y=list[so[i+1]];if(x&&y){ko.push({stage:KO_STAGE(P),a:x,b:y,w:null});refs.push('W'+(ko.length-1))}else refs.push(x||y)}
  let n=P/2,cur=refs;while(cur.length>1){const nx=[];for(let i=0;i<cur.length;i+=2){ko.push({stage:KO_STAGE(n),a:cur[i],b:cur[i+1],w:null});nx.push('W'+(ko.length-1))}cur=nx;n/=2}return ko}
function trBuild(ev,o){const T=ev.tourney;o=o||(T&&T.fmt)||{unit:'pair',prog:'ko',groups:0,adv:2};const lines=T?(T.groups&&T.groups.length?T.groups.flatMap(g=>g.teams):T.teams||[]).map(t=>t.p.map(k=>keyName(k)).join('/')).join('\n'):'';
  const single=o.unit==='single';
  openModal('행사 대진 만들기',`<p class="small muted" style="margin:0 0 8px">${h(ev.title)} · ${h(fmtD(ev.date))} · ${h(UNIT_L[o.unit])} · ${h(PROG_L[o.prog])}</p><label class="f">이름<input class="in" name="title" value="${h(T?T.title:'')}" placeholder="예: 혼복 대전 · 단식 토너먼트"></label>
    <label class="f">참가 ${single?'선수 (한 줄에 한 명)':'페어 (한 줄에 한 팀 · "이름/이름")'}<textarea class="in" name="teams" rows="8" placeholder="${single?'강경원&#10;김신정':'강경원/김신정&#10;서윤식/문민영'}">${h(lines)}</textarea></label>
    ${o.prog!=='ko'?`<div class="grid2"><label class="f">조<select class="in" name="groups">${[[0,'없음 · 단일 리그'],[2,'2개 조'],[3,'3개 조'],[4,'4개 조']].map(([n,l])=>`<option value="${n}"${(+o.groups||0)===n?' selected':''}>${l}</option>`).join('')}</select></label>${o.prog==='league-ko'?`<label class="f">조별 본선 진출<select class="in" name="adv">${[1,2].map(n=>`<option value="${n}"${(+o.adv||2)===n?' selected':''}>${n}팀</option>`).join('')}</select></label>`:''}</div>
    <label class="f">조 배정<select class="in" name="mix"><option value="order">입력 순서대로</option><option value="rand">무작위</option></select></label>`:''}
    ${T?'<p class="small" style="margin:8px 0 0">저장하면 기존 기록(순위 · 승자 · 점수)을 새로 만든 것으로 바꿈</p>':''}`,
    async fd=>{const ix=nameIndex();const kof=n=>{n=n.trim();const p=ix[n];return p?p.key:'n:'+n};
      let teams=fd.teams.split('\n').map(s=>s.trim()).filter(Boolean).map(s=>({p:(single?[s]:s.split(/\s*[\/&,]\s*/)).filter(Boolean).map(kof),rank:null}));
      if(teams.length<2){toast('참가 2팀 이상 입력');return}
      const tr=trMake(teams,o,{title:fd.title.trim(),groups:fd.groups,adv:fd.adv,mix:fd.mix});
      const {id,...rest}=ev;await put('events',ev.id,{...rest,tourney:tr});evSel=ev.id;toast('행사 대진 만듦 · 이벤트에서 결과 기록');location.hash='#events';render()})}
/* 참가 팀 목록 → 형식대로 조 · 리그 경기 · 본선 */
function trMake(teams,o,x={}){
  const fmt={...o,groups:+(x.groups??o.groups??0),adv:+(x.adv||o.adv||2)};let tr={title:(x.title||'').trim()||PROG_L[o.prog],fmt,groups:[],teams:[],lg:[],ko:[]};
      if(o.prog==='ko'){tr.teams=teams;tr.ko=seedRefs(teams.map((_,i)=>'T'+i))}
      else{if(x.mix==='rand')teams=shuffle(teams);const G=Math.max(1,fmt.groups);const L='ABCD';tr.groups=Array.from({length:G},(_,i)=>({name:G>1?L[i]+'조':'리그',teams:[]}));teams.forEach((t,i)=>tr.groups[i%G].teams.push(t));
        /* 리그 경기: 조마다 풀리그, 조를 번갈아 가며 진행 순서 배치 (현장에서 끌어다 놓아 변경) */
        const per=tr.groups.map((g,gi)=>rrPairs(g.teams.length).map(([a,b])=>({g:gi,a,b,w:null})));const mx=Math.max(...per.map(x=>x.length));for(let i=0;i<mx;i++)per.forEach(x=>{if(x[i])tr.lg.push(x[i])});
        if(o.prog==='league-ko'){const adv=fmt.adv;let refs;
          if(G===1)refs=Array.from({length:Math.min(4,teams.length)},(_,i)=>'A'+(i+1));
          else if(G===2)refs=adv===2?['A1','B2','B1','A2']:['A1','B1'];
          else if(G===4)refs=adv===2?['A1','B2','C1','D2','B1','A2','D1','C2']:['A1','B1','C1','D1'];
          else refs=adv===2?['A1','B2','C1','A2','B1','C2']:['A1','B1','C1'];
          tr.ko=G===1?seedRefs(refs):(refs.length%2===0&&(refs.length&(refs.length-1))===0?koFromRefs(refs):seedRefs(refs))}}
  return tr}
ACT['tr-build']=()=>{const ev=S.events.find(e=>e.id===evSel);if(ev)trBuild(ev)};

/* 순위: 리그 결과(승수 → 득실)가 있으면 자동, 없으면 직접 입력한 순위 */
function grpStand(tr,gi){const g=tr.groups[gi];const st=g.teams.map((t,ti)=>({ti,t,w:0,l:0,gf:0,ga:0,pl:0}));let any=false;
  (tr.lg||[]).forEach(m=>{if(m.g!==gi||!m.w)return;any=true;const A=st[m.a],B=st[m.b];if(!A||!B)return;A.pl++;B.pl++;const sc=m.sc&&m.sc[0]!==''&&m.sc[1]!==''&&m.sc[0]!=null?m.sc:null;
    if(sc){A.gf+=+sc[0];A.ga+=+sc[1];B.gf+=+sc[1];B.ga+=+sc[0]}if(m.w==='a'){A.w++;B.l++}else{B.w++;A.l++}});
  const out=any?st.slice().sort((x,y)=>y.w-x.w||(y.gf-y.ga)-(x.gf-x.ga)||(x.t.rank||9)-(y.t.rank||9)):st.slice().sort((x,y)=>(x.t.rank||9)-(y.t.rank||9));
  out.forEach((x,i)=>x.rank=any||x.t.rank?i+1:null);return {rows:out,auto:any}}
function trTeam(tr,ref){if(!ref)return null;if(ref[0]==='T')return (tr.teams||[])[+ref.slice(1)]||null;if(ref[0]==='W'){const m=tr.ko[+ref.slice(1)];return m&&m.w?trTeam(tr,m.w==='a'?m.a:m.b):null}
  const gi=(tr.groups||[]).findIndex(x=>x.name[0]===ref[0]||(ref[0]==='A'&&x.name==='리그'));if(gi<0)return null;const r=grpStand(tr,gi).rows.find(x=>x.rank===+ref.slice(1));return r?r.t:null}
const trName=t=>t?t.p.map(k=>keyName(k)).join(' / '):'미정';
const hasSc=m=>m.sc&&m.sc[0]!==''&&m.sc[1]!==''&&m.sc[0]!=null&&m.sc[1]!=null;
function tourHtml(ev){const tr=ev.tourney;if(!tr)return '';tr.groups=tr.groups||[];tr.lg=tr.lg||[];tr.ko=tr.ko||[];
  const fin=tr.ko[tr.ko.length-1];let champ=fin&&fin.w?trTeam(tr,fin.w==='a'?fin.a:fin.b):null;
  if(!tr.ko.length&&tr.groups.length===1&&tr.lg.length&&tr.lg.every(m=>m.w))champ=grpStand(tr,0).rows[0].t;
  const side=(m,i,s,act)=>{const t=act==='tr-win'?trTeam(tr,m[s]):tr.groups[m.g].teams[m[s]];const won=m.w===s;return `<button type="button" class="tr-side${won?' w':''}${m.w&&!won?' l':''}" ${RO||!t?'disabled':''} data-act="${act}" data-i="${i}" data-s="${s}"><span>${h(trName(t))}</span>${hasSc(m)?`<b class="num">${m.sc[s==='a'?0:1]}</b>`:''}</button>`};
  const cols=[];tr.ko.forEach((m,i)=>{let c=cols.find(x=>x.st===m.stage);if(!c){c={st:m.stage,ms:[]};cols.push(c)}c.ms.push([m,i])});
  const ko=tr.ko.length?`<h4 class="tr-sec">본선</h4><div class="tr-tree">${cols.map((c,ci)=>`<div class="tr-col${ci<cols.length-1?' to':''}"><span class="tr-st">${h(c.st)}</span><div class="tr-cm">${c.ms.map(([m,i])=>`<div class="tr-m">${/^[A-D]\d/.test(m.a)?`<span class="tr-seed muted">${m.a} vs ${m.b}</span>`:''}${side(m,i,'a','tr-win')}${side(m,i,'b','tr-win')}</div>`).join('')}</div></div>`).join('')}<div class="tr-col win"><span class="tr-st">우승</span><div class="tr-cm"><div class="tr-m"><div class="tr-side${champ?' w':''}" style="cursor:default">${champ?h(trName(champ)):'<span class="muted">미정</span>'}</div></div></div></div></div>`:'';
  const multi=tr.groups.length>1;
  const stand=tr.groups.length?`<div class="tr-groups">${tr.groups.map((g,gi)=>{const s=grpStand(tr,gi);return `<div class="tr-g"><b>${h(g.name)}${s.auto?' <span class="small muted" style="font-weight:500">결과로 자동 계산</span>':''}</b>${s.rows.map(x=>`<div class="tr-gt${x.rank&&tr.ko.length&&x.rank<=(tr.fmt&&tr.fmt.adv||2)?' adv':''}"><span class="num">${x.rank?x.rank+'위':'–'}</span><span>${h(trName(x.t))}</span>${s.auto?`<span class="num small">${x.w}승 ${x.l}패${x.gf||x.ga?` · ${x.gf-x.ga>0?'+':''}${x.gf-x.ga}`:''}</span>`:''}</div>`).join('')}</div>`}).join('')}</div>`:'';
  const lg=tr.lg.length?`<div class="lg-list" data-lg="1">${tr.lg.map((m,i)=>`<div class="lg-row" data-i="${i}">${RO?'':'<span class="lg-grip" aria-label="순서 바꾸기" title="끌어서 순서 바꾸기">⋮⋮</span>'}<span class="lg-n num">${i+1}</span>${multi?`<span class="lg-g">${h(tr.groups[m.g].name)}</span>`:''}<div class="lg-ms">${side(m,i,'a','lg-win')}${side(m,i,'b','lg-win')}</div></div>`).join('')}</div>`:'';
  return `<div class="tr"><div class="eg-h"><h4 class="st-h" style="margin:0">${h(tr.title||'토너먼트')}</h4>${RO?'':'<div class="row"><button class="btn sm" data-act="tr-build">다시 만들기</button><button class="btn sm" data-act="tr-score">점수 입력</button></div>'}</div>
    ${tr.fmt?`<p class="small muted" style="margin:0">${h(UNIT_L[tr.fmt.unit]||'')} · ${h(PROG_L[tr.fmt.prog]||'')}</p>`:''}
    ${champ?`<div class="tr-champ">우승 <b>${h(trName(champ))}</b></div>`:''}${ko}
    ${tr.groups.length?`<div class="eg-h"><h4 class="tr-sec">${tr.ko.length?'조별 예선':'리그'}</h4>${RO||tr.lg.length?'':'<button class="btn sm" data-act="tr-rank">조 순위 입력</button>'}</div>${stand}`:''}
    ${lg?`<h4 class="tr-sec">리그 경기 <span class="small muted" style="font-weight:500">${RO?'':'⋮⋮을 끌어 순서 변경 · '}</span></h4>${lg}`:''}
    ${RO?'':'<p class="small muted" style="margin:0">이긴 팀을 누르면 기록 · 다시 누르면 해제 · 점수는 "점수 입력"에서 (기억나지 않으면 승자만 기록)</p>'}</div>`}
const saveTr=async(ev,tr)=>{const {id,...rest}=ev;await put('events',ev.id,{...rest,tourney:tr});render()};
ACT['tr-win']=async t=>{const ev=S.events.find(e=>e.id===evSel);if(!ev||!ev.tourney)return;const tr=JSON.parse(JSON.stringify(ev.tourney));const m=tr.ko[+t.dataset.i];m.w=m.w===t.dataset.s?null:t.dataset.s;
  tr.ko.forEach((x,j)=>{if(j>+t.dataset.i&&(x.a==='W'+t.dataset.i||x.b==='W'+t.dataset.i))x.w=null});await saveTr(ev,tr)};
ACT['lg-win']=async t=>{const ev=S.events.find(e=>e.id===evSel);if(!ev||!ev.tourney)return;const tr=JSON.parse(JSON.stringify(ev.tourney));const m=tr.lg[+t.dataset.i];m.w=m.w===t.dataset.s?null:t.dataset.s;await saveTr(ev,tr)};
ACT['tr-score']=()=>{const ev=S.events.find(e=>e.id===evSel);if(!ev||!ev.tourney)return;const tr=ev.tourney;const lgN=t=>trName(t);
  const row=(key,label,A,B,m)=>`<div class="sc-row"><span class="sc-t">${h(label)}</span><span class="sc-p">${h(A)}</span><input class="in num" name="${key}_0" inputmode="numeric" value="${m.sc?h(m.sc[0]??''):''}" aria-label="점수"><span class="muted">:</span><input class="in num" name="${key}_1" inputmode="numeric" value="${m.sc?h(m.sc[1]??''):''}" aria-label="점수"><span class="sc-p">${h(B)}</span></div>`;
  openModal('점수 입력',`<div class="sc-list">${(tr.lg||[]).map((m,i)=>row('l'+i,`리그 ${i+1}${tr.groups.length>1?' · '+tr.groups[m.g].name:''}`,lgN(tr.groups[m.g].teams[m.a]),lgN(tr.groups[m.g].teams[m.b]),m)).join('')}${tr.ko.map((m,i)=>row('k'+i,m.stage,trName(trTeam(tr,m.a)),trName(trTeam(tr,m.b)),m)).join('')}</div><p class="small muted" style="margin:8px 0 0">점수를 넣으면 높은 쪽이 승자로 기록 · 비워 두면 기존 승자 유지</p>`,
    async fd=>{const t2=JSON.parse(JSON.stringify(tr));const ap=(m,k)=>{const x=(fd[k+'_0']||'').trim(),y=(fd[k+'_1']||'').trim();if(x===''&&y===''){delete m.sc;return}m.sc=[x===''?'':+x,y===''?'':+y];if(x!==''&&y!==''&&+x!==+y)m.w=+x>+y?'a':'b'};
      (t2.lg||[]).forEach((m,i)=>ap(m,'l'+i));t2.ko.forEach((m,i)=>ap(m,'k'+i));await saveTr(ev,t2);toast('점수 저장')})};
ACT['tr-rank']=()=>{const ev=S.events.find(e=>e.id===evSel);if(!ev||!ev.tourney)return;const tr=ev.tourney;
  openModal('조 순위',tr.groups.map((g,gi)=>`<div class="f"><b>${h(g.name)}</b>${g.teams.map((t,ti)=>`<label class="eg-prow"><span>${h(trName(t))}</span><select class="in" name="r_${gi}_${ti}" style="width:96px"><option value="">–</option>${g.teams.map((_,r)=>`<option value="${r+1}"${t.rank===r+1?' selected':''}>${r+1}위</option>`).join('')}</select></label>`).join('')}</div>`).join(''),
    async fd=>{const t2=JSON.parse(JSON.stringify(tr));t2.groups.forEach((g,gi)=>g.teams.forEach((t,ti)=>{const v=fd[`r_${gi}_${ti}`];t.rank=v?+v:null}));await saveTr(ev,t2);toast('조 순위 저장')})};
/* 리그 경기 순서: ⋮⋮ 손잡이를 끌어 놓기 (휴대폰 터치 포함) */
document.addEventListener('pointerdown',e=>{const gp=e.target.closest('.lg-grip');if(!gp||RO)return;e.preventDefault();const row=gp.closest('.lg-row'),list=row.parentElement;const ph=row.getBoundingClientRect();row.classList.add('drag');
  try{gp.setPointerCapture(e.pointerId)}catch(_){}
  const move=ev=>{const y=ev.clientY;const rows=[...list.querySelectorAll('.lg-row:not(.drag)')];let before=null;for(const r of rows){const b=r.getBoundingClientRect();if(y<b.top+b.height/2){before=r;break}}if(before!==row.nextSibling)list.insertBefore(row,before)};
  const up=async()=>{gp.removeEventListener('pointermove',move);gp.removeEventListener('pointerup',up);gp.removeEventListener('pointercancel',up);row.classList.remove('drag');
    const order=[...list.querySelectorAll('.lg-row')].map(r=>+r.dataset.i);if(order.every((v,i)=>v===i))return;const ev=S.events.find(x=>x.id===evSel);if(!ev||!ev.tourney)return;
    const tr=JSON.parse(JSON.stringify(ev.tourney));tr.lg=order.map(i=>tr.lg[i]);await saveTr(ev,tr);toast('경기 순서 변경')};
  gp.addEventListener('pointermove',move);gp.addEventListener('pointerup',up);gp.addEventListener('pointercancel',up)});
function tourneyImport(j){const ev=S.events.find(e=>j.eventTitle&&e.title.includes(j.eventTitle)&&(!j.date||e.date===j.date))||(j.date&&S.events.find(e=>e.date===j.date));
  if(!ev){toast(`"${j.eventTitle||j.date}" 행사를 찾지 못함 · 이벤트에 먼저 등록 필요`);return}
  const ix=nameIndex();const unknown=new Set();const kof=n=>{const p=ix[n];if(p)return p.key;unknown.add(n);return 'n:'+n};
  const tr={title:j.title||'토너먼트',groups:j.groups.map(g=>({name:g.name,teams:g.teams.map(t=>({p:t.p.map(kof),rank:t.rank||null}))})),ko:(j.ko||[{stage:'4강',a:'A1',b:'B2'},{stage:'4강',a:'B1',b:'A2'},{stage:'결승',a:'W0',b:'W1'}]).map(m=>({...m,w:m.w||null}))};
  openModal('토너먼트 가져오기',`<div class="mi-list"><div><b>${h(ev.title)}</b> ${fmtD(ev.date)} · ${h(tr.title)}</div>${tr.groups.map(g=>`<div>${h(g.name)}: ${g.teams.map(t=>h(t.p.map(k=>keyName(k)).join('/'))).join(', ')}</div>`).join('')}</div>${unknown.size?`<p class="small" style="margin:8px 0 0">회원 · 게스트 목록에 없는 이름: ${[...unknown].map(h).join(', ')}</p>`:''}`,
    async()=>{const {id,...rest}=ev;const aw=(ev.awards||[]).slice();(j.awards||[]).forEach(x=>{if(!aw.some(y=>y.t===x.t&&y.w===x.w))aw.push({t:x.t,w:x.w})});await put('events',ev.id,{...rest,tourney:tr,awards:aw});evSel=ev.id;toast('토너먼트 등록');render()})}

/* ---------- 이벤트 › 행사 대진 준비: 형식 선택 → 팀 · 페어 설정 → 대진 만들기 ---------- */
/* 참가자: 확정 인원(회원) + 확정 게스트 · 직접 입력 이름 */
/* 페어 목록: Firestore는 배열 안의 배열을 저장 못 하므로 [{p:[a,b]}] 형태로 저장 (예전 [[a,b]]도 읽음) */
const evPairs=ev=>(ev.pairs||[]).map(x=>Array.isArray(x)?x:(x&&x.p)||[]).filter(p=>p.length);
function evPeople(ev){const out=(ev.confirmed||[]).slice();(ev.confirmedExtra||[]).forEach(x=>out.push(x.startsWith('g:')?x.slice(2):x));return [...new Set(out)]}
const pGender=k=>{const m=S.members.find(x=>x.id===k)||S.guests.find(x=>x.id===k);return m?m.gender:''};
ACT['ev-fmt']=()=>{const ev=S.events.find(e=>e.id===evSel);if(!ev)return;const PS=presets();const cur=ev.fmt||PS[0];
  openModal('대회 형식',`<div class="ev-fmt">${PS.map(p=>`<label class="check"><input type="radio" name="preset" value="${p.id}"${(ev.fmt&&ev.fmt.preset===p.id)||(!ev.fmt&&p===PS[0])?' checked':''}> <span><b>${h(p.name)}</b> <span class="small muted">${h(fmtLine(p))}</span></span></label>`).join('')}</div>
    <details class="ps-opt"${ev.fmt&&!ev.fmt.preset?' open':''}><summary class="small">옵션 직접 조정</summary>${optSelects(cur,'o_')}</details><div class="row" style="margin-top:8px"><button type="button" class="btn sm ghost" data-act="ps-manage">프리셋 관리</button></div>`,
    async fd=>{const o=optFrom(fd,'o_');const p=PS.find(x=>x.id===fd.preset);const same=p&&['unit','prog','teams','groups','adv'].every(k=>String(p[k]??(k==='adv'?2:0))===String(o[k]));
      const nf={...o,preset:same?p.id:'',name:same?p.name:'직접 조합'};const tf=ev.tourney&&ev.tourney.fmt;
      const changed=ev.tourney&&(!tf||['unit','prog','groups','adv'].some(k=>String(tf[k]??'')!==String(nf[k]??''))||nf.prog==='time');
      const {id,...rest}=ev;await put('events',ev.id,{...rest,fmt:nf});toast('대회 형식 저장');render();
      if(changed)setTimeout(async()=>{const ch=await choiceDialog({title:'대진도 새 형식으로',msg:`형식이 바뀌어 지금 대진(${ev.tourney.title||''})과 맞지 않음`,choices:[{key:'manual',label:'새 형식으로 직접 입력',sub:'기존 대진의 순위 · 승자 · 점수는 지워짐',cls:'pri'},{key:'go',label:'새 형식으로 자동 생성',sub:'기존 대진의 순위 · 승자 · 점수는 지워짐'},{key:'keep',label:'기존 대진 유지',sub:'형식만 저장'}]});
        const ev2=S.events.find(e=>e.id===ev.id)||{...ev,fmt:nf};if(ch==='go')await evRemake(ev2,true);else if(ch==='manual'){if(nf.prog==='time'){await evRemake(ev2,true);return}trManual(ev2)}},80)})};
/* 형식대로 대진 다시 만들기: 참가자가 모자라면 기존 대진만 지우고 안내 */
async function evRemake(ev,fromFmt){const o=ev.fmt;const {id,...rest}=ev;
  if(o.prog==='time'){await put('events',ev.id,{...rest,tourney:null});toast('타임표 형식 · "대진 만들기"로 대진표 화면에서 생성');render();return}
  const teams=o.unit==='single'?evPeople(ev).map(k=>({p:[k],rank:null})):o.unit==='pair'?evPairs(ev).map(p=>({p:p.slice(),rank:null})):[];
  if(teams.length<2){await put('events',ev.id,{...rest,tourney:null});toast(o.unit==='pair'?'페어 설정 후 "대진 만들기"':o.unit==='single'?'확정 인원 체크 후 "대진 만들기"':'리그 · 토너먼트는 고정 페어 또는 단식');render();return}
  const tr=trMake(teams,o,{title:o.name&&o.name!=='직접 조합'?o.name.replace(/\s*\(.*\)$/,''):PROG_L[o.prog],groups:o.groups,adv:o.adv,mix:'rand'});
  await put('events',ev.id,{...rest,tourney:tr});toast(fromFmt?'새 형식으로 대진 다시 만듦':'대진 만듦');render()}
/* 페어 설정: 확정 인원 버튼을 페어 칸(2칸씩)에 끌어다 놓기 · 누르고 칸 누르기로도 가능 · 무작위(남녀 혼합) */
let PE=null;
function peHtml(){const chip=(k,sel)=>`<button type="button" class="pe-chip g-${pGender(k)||'x'}${PE.sel===k?' on':''}" data-pk="${h(k)}">${h(keyName(k))}</button>`;
  return `<div class="pe-pool" data-pe-pool="1">${PE.pool.length?PE.pool.map(k=>chip(k)).join(''):'<span class="small muted">모든 인원 배치 완료</span>'}</div>
  <div class="pe-slots">${PE.slots.map((s,i)=>`<div class="pe-pair"><span class="pe-n num">${i+1}</span>${[0,1].map(j=>`<div class="pe-cell${s[j]?'':' empty'}" data-pe-cell="${i}_${j}">${s[j]?chip(s[j]):'<span class="muted small">비어 있음</span>'}</div>`).join('')}</div>`).join('')}</div>`}
function peDraw(){const el=$('#pe');if(el)el.innerHTML=peHtml();const c=$('#pe-count');if(c)c.textContent=`${PE.slots.filter(s=>s[0]&&s[1]).length}/${PE.slots.length}팀 완성`}
function peTake(k){PE.pool=PE.pool.filter(x=>x!==k);PE.slots.forEach(s=>{for(let j=0;j<2;j++)if(s[j]===k)s[j]=null})}
function peWhere(k){for(let i=0;i<PE.slots.length;i++)for(let j=0;j<2;j++)if(PE.slots[i][j]===k)return [i,j];return null}
function peDrop(k,target){if(!k)return;if(target==='pool'){peTake(k);PE.pool.push(k);PE.pool=byName(PE.pool.map(x=>({key:x,name:keyName(x)}))).map(x=>x.key)}
  else{const [i,j]=target.split('_').map(Number);const from=peWhere(k);const prev=PE.slots[i][j];if(prev===k)return;peTake(k);
    if(prev){if(from)PE.slots[from[0]][from[1]]=prev;else{PE.slots[i][j]=null;PE.pool.push(prev)}}PE.slots[i][j]=k}
  PE.sel=null;peDraw()}
ACT['ev-pairs']=()=>{const ev=S.events.find(e=>e.id===evSel);if(!ev)return;const ppl=byName(evPeople(ev).map(k=>({key:k,name:keyName(k)}))).map(x=>x.key);
  if(ppl.length<2){toast('행사 확정 인원 먼저 체크 (수정 › 확정 인원)');return}
  const N=Math.ceil(ppl.length/2);const slots=Array.from({length:N},()=>[null,null]);const used=new Set();
  evPairs(ev).slice(0,N).forEach((p,i)=>p.forEach((k,j)=>{if(ppl.includes(k)&&j<2){slots[i][j]=k;used.add(k)}}));
  PE={pool:ppl.filter(k=>!used.has(k)),slots,sel:null};
  openModal('페어 설정',`<div class="pe-top"><span class="small muted">확정 인원 ${ppl.length}명 · <b id="pe-count"></b></span><div class="row"><button type="button" class="btn sm" data-act="ev-pairs-rand">무작위 (남녀 혼합)</button><button type="button" class="btn sm ghost" data-act="ev-pairs-clear">모두 비우기</button></div></div>
    <p class="small muted" style="margin:0 0 8px">이름을 페어 칸으로 끌어다 놓기 · 빈 칸을 누르면 목록에서 선택 · 칸의 이름을 누르면 빼기</p><div id="pe">${peHtml()}</div>`,
    async()=>{const bad=PE.slots.filter(s=>(s[0]?1:0)+(s[1]?1:0)===1);if(bad.length){toast('한 명만 들어간 페어가 있음');throw new Error('keep')}
      const pairs=PE.slots.filter(s=>s[0]&&s[1]).map(s=>({p:[s[0],s[1]]}));const {id,...rest}=ev;await put('events',ev.id,{...rest,pairs});toast(`페어 ${pairs.length}팀 저장`);render()});
  peDraw()};
ACT['ev-pairs-rand']=()=>{const all=PE.pool.concat(PE.slots.flat().filter(Boolean));const M=shuffle(all.filter(k=>pGender(k)==='M')),F=shuffle(all.filter(k=>pGender(k)==='F')),O=all.filter(k=>pGender(k)!=='M'&&pGender(k)!=='F');
  const order=[];while(M.length&&F.length)order.push(M.pop(),F.pop());order.push(...shuffle(M.concat(F,O)));PE.slots=PE.slots.map(()=>[null,null]);PE.pool=[];
  order.forEach((k,i)=>{const s=PE.slots[Math.floor(i/2)];if(s)s[i%2]=k;else PE.pool.push(k)});PE.sel=null;peDraw()};
ACT['ev-pairs-clear']=()=>{PE.pool=byName(PE.pool.concat(PE.slots.flat().filter(Boolean)).map(k=>({key:k,name:keyName(k)}))).map(x=>x.key);PE.slots=PE.slots.map(()=>[null,null]);PE.sel=null;peDraw()};
/* 끌어다 놓기 (터치 · 마우스) + 누르기 선택 */
document.addEventListener('pointerdown',e=>{const c=e.target.closest('.pe-chip');if(!c||!PE||!$('#pe'))return;e.preventDefault();const k=c.dataset.pk;const x0=e.clientX,y0=e.clientY;let ghost=null;
  const target=ev=>{if(ghost)ghost.style.display='none';const el=document.elementFromPoint(ev.clientX,ev.clientY);if(ghost)ghost.style.display='';const cell=el&&el.closest('[data-pe-cell]');if(cell)return cell.dataset.peCell;if(el&&el.closest('[data-pe-pool]'))return 'pool';return null};
  const move=ev=>{if(!ghost&&Math.hypot(ev.clientX-x0,ev.clientY-y0)<6)return;if(!ghost){ghost=c.cloneNode(true);ghost.classList.add('pe-ghost');document.body.appendChild(ghost);c.classList.add('dragging')}
    ghost.style.left=ev.clientX+'px';ghost.style.top=ev.clientY+'px';document.querySelectorAll('.pe-cell.over').forEach(x=>x.classList.remove('over'));const t=target(ev);if(t&&t!=='pool'){const cell=document.querySelector(`[data-pe-cell="${t}"]`);if(cell)cell.classList.add('over')}};
  const up=ev=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);
    if(ghost){const t=target(ev);ghost.remove();c.classList.remove('dragging');if(t)peDrop(k,t);else peDraw();return}
    PE.tapAt=Date.now();const loc=peWhere(k);if(PE.sel&&PE.sel!==k&&loc){peDrop(PE.sel,loc.join('_'));return}if(loc&&!PE.sel){peDrop(k,'pool');return}PE.sel=PE.sel===k?null:k;peDraw()};
  document.addEventListener('pointermove',move);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up)});
document.addEventListener('click',e=>{if(!PE||!$('#pe'))return;if(PE.tapAt&&Date.now()-PE.tapAt<500&&!e.target.closest('[data-pe-pick]'))return;const dd=e.target.closest('[data-pe-pick]');if(dd){const c=dd.closest('.pe-dd');peDrop(dd.dataset.pePick,c.dataset.cell);return}
  const old=$('.pe-dd');if(old&&!e.target.closest('.pe-dd'))old.remove();if(e.target.closest('.pe-chip'))return;const cell=e.target.closest('[data-pe-cell]');
  if(PE.sel){if(cell){peDrop(PE.sel,cell.dataset.peCell);return}if(e.target.closest('[data-pe-pool]'))peDrop(PE.sel,'pool');return}
  /* 빈 칸 누르기: 아직 배치 안 된 인원 목록에서 선택 */
  if(cell&&cell.classList.contains('empty')){if(!PE.pool.length){toast('남은 인원 없음');return}const box=document.createElement('div');box.className='pe-dd';box.dataset.cell=cell.dataset.peCell;
    box.innerHTML=PE.pool.map(k=>`<button type="button" data-pe-pick="${h(k)}"><i class="pe-g g-${pGender(k)||'x'}"></i>${h(keyName(k))}</button>`).join('');cell.appendChild(box)}});
/* 대진 만들기: 타임표는 대진표 화면으로, 리그 · 토너먼트는 이 행사에 바로 생성 */
ACT['ev-make']=async()=>{const ev=S.events.find(e=>e.id===evSel);if(!ev)return;const o=ev.fmt;if(!o){ACT['ev-fmt']();return}
  if(o.prog==='time'){Object.assign(cfg,{eventId:ev.id,title:ev.title,date:ev.date,place:ev.place||cfg.place});const roster=new Set(rosterAll().map(p=>p.key));const tm=(ev.teams||[]).flatMap(t=>t.members||[]);
    const want=tm.length?tm:evPeople(ev);if(want.length)cfg.picked=want.filter(k=>roster.has(k));saveCfg();location.hash='#draw';toast('대진표 화면에서 생성 · 저장하면 이 행사에 연결');return}
  const ch=await choiceDialog({title:ev.tourney?'대진 다시 만들기':'대진 만들기',msg:ev.tourney?'저장하면 기존 순위 · 승자 · 점수 기록은 지워짐':`${o.unit==='single'?'확정 인원':'등록한 페어'} 기준`,choices:[{key:'manual',label:'직접 입력',sub:o.prog==='ko'?'1라운드 대진 칸에 페어 · 선수 놓기':'조 칸에 페어 · 선수 놓기 (리그 경기는 자동 구성)',cls:'pri'},{key:'auto',label:'자동 생성',sub:'무작위 조 편성 · 시드 배치'}]});
  if(ch==='manual')trManual(ev);else if(ch==='auto')await evRemake(ev,false)};
/* ---------- 행사 대진 직접 입력: 등록한 페어 · 선수를 조 칸 또는 1라운드 대진 칸에 놓기 ----------
   SE={items:[{p:[keys]}],pool:[idx],boxes:[{label,cap,slots:[idx|null]}],sel,mode:'group'|'ko'} */
let SE=null;
const seLabel=i=>trName(SE.items[i]);
function seHtml(){const chip=i=>`<button type="button" class="pe-chip se-chip${SE.sel===i?' on':''}" data-si="${i}">${h(seLabel(i))}</button>`;
  return `<div class="pe-pool" data-se-pool="1">${SE.pool.length?SE.pool.map(chip).join(''):'<span class="small muted">모두 배치 완료</span>'}</div>
  <div class="se-boxes${SE.mode==='ko'?' ko':''}">${SE.boxes.map((b,bi)=>`<div class="se-box"><b class="se-l">${h(b.label)}</b>${b.slots.map((s,j)=>`${SE.mode==='ko'&&j===1?'<span class="se-vs">vs</span>':''}<div class="pe-cell${s==null?' empty':''}" data-se-cell="${bi}_${j}">${s!=null?chip(s):`<span class="muted small">${SE.mode==='ko'?'비어 있음 (부전승)':'비어 있음'}</span>`}</div>`).join('')}</div>`).join('')}</div>`}
function seDraw(){const el=$('#se');if(el)el.innerHTML=seHtml()}
function seWhere(i){for(let b=0;b<SE.boxes.length;b++){const j=SE.boxes[b].slots.indexOf(i);if(j>=0)return [b,j]}return null}
function seDrop(i,t){if(i==null)return;const from=seWhere(i);if(t==='pool'){if(from)SE.boxes[from[0]].slots[from[1]]=null;if(!SE.pool.includes(i))SE.pool.push(i);SE.pool.sort((x,y)=>x-y)}
  else{const [b,j]=t.split('_').map(Number);const prev=SE.boxes[b].slots[j];if(prev===i)return;SE.pool=SE.pool.filter(x=>x!==i);if(from)SE.boxes[from[0]].slots[from[1]]=null;
    if(prev!=null){if(from)SE.boxes[from[0]].slots[from[1]]=prev;else SE.pool.push(prev)}SE.boxes[b].slots[j]=i}SE.sel=null;seDraw()}
function trManual(ev){const o=ev.fmt;const items=o.unit==='single'?evPeople(ev).map(k=>({p:[k]})):evPairs(ev).map(p=>({p:p.slice()}));
  if(items.length<2){toast(o.unit==='pair'?'페어 설정 먼저 (2팀 이상)':'확정 인원 2명 이상 필요');return}
  const n=items.length;let boxes,mode;
  if(o.prog==='ko'){mode='ko';let P=2;while(P<n)P*=2;boxes=Array.from({length:P/2},(_,i)=>({label:`${KO_STAGE(P)} ${i+1}경기`,cap:2,slots:[null,null]}))}
  else{mode='group';const G=Math.max(1,+o.groups||0);const cap=Math.ceil(n/G);boxes=Array.from({length:G},(_,i)=>({label:G>1?'ABCD'[i]+'조':'리그',cap,slots:Array(cap).fill(null)}))}
  SE={items,pool:items.map((_,i)=>i),boxes,sel:null,mode};
  openModal('대진 직접 입력',`<p class="small muted" style="margin:0 0 8px">${h(o.name||'')} · ${mode==='ko'?'1라운드 대진 칸에':'조 칸에'} 끌어다 놓기 · 빈 칸을 누르면 목록에서 선택 · 칸의 이름을 누르면 빼기${mode==='group'?' · 리그 경기는 조 안에서 모두 한 번씩 자동 구성':''}</p><div id="se">${seHtml()}</div>`,
    async()=>{if(SE.pool.length){toast(`배치 안 된 ${SE.pool.length}팀 있음`);throw new Error('keep')}
      const title=o.name&&o.name!=='직접 조합'?o.name.replace(/\s*\(.*\)$/,''):PROG_L[o.prog];let tr;
      if(mode==='ko'){const teams=[];const refs=[];const ko=[];SE.boxes.forEach(b=>{const [x,y]=b.slots;const rx=x!=null?(teams.push({p:SE.items[x].p,rank:null}),'T'+(teams.length-1)):null,ry=y!=null?(teams.push({p:SE.items[y].p,rank:null}),'T'+(teams.length-1)):null;
          if(rx&&ry){ko.push({stage:SE.boxes[0].label.split(' ')[0],a:rx,b:ry,w:null});refs.push('W'+(ko.length-1))}else refs.push(rx||ry)});
        let cur=refs,nn=refs.length;while(cur.length>1){const nx=[];for(let i=0;i<cur.length;i+=2){const A=cur[i],B=cur[i+1];if(A&&B){ko.push({stage:KO_STAGE(nn),a:A,b:B,w:null});nx.push('W'+(ko.length-1))}else nx.push(A||B||null)}cur=nx;nn/=2}
        tr={title,fmt:{...o},groups:[],teams,lg:[],ko}}
      else{const groups=SE.boxes.map(b=>({name:b.label,teams:b.slots.filter(s=>s!=null).map(s=>({p:SE.items[s].p,rank:null}))}));
        tr=trMake([],o,{title});tr.groups=groups;tr.lg=[];const per=groups.map((g,gi)=>rrPairs(g.teams.length).map(([a,b])=>({g:gi,a,b,w:null})));const mx=Math.max(0,...per.map(x=>x.length));for(let i=0;i<mx;i++)per.forEach(x=>{if(x[i])tr.lg.push(x[i])});
        if(o.prog!=='league-ko')tr.ko=[];else if(!tr.ko.length){const G=groups.length,adv=+o.adv||2;const refs=G===1?Array.from({length:Math.min(4,groups[0].teams.length)},(_,i)=>'A'+(i+1)):G===2?(adv===2?['A1','B2','B1','A2']:['A1','B1']):G===4?(adv===2?['A1','B2','C1','D2','B1','A2','D1','C2']:['A1','B1','C1','D1']):(adv===2?['A1','B2','C1','A2','B1','C2']:['A1','B1','C1']);tr.ko=seedRefs(refs)}}
      const {id,...rest}=ev;await put('events',ev.id,{...rest,tourney:tr});toast('대진 저장');render()});SE.sel=null};
document.addEventListener('pointerdown',e=>{const c=e.target.closest('.se-chip');if(!c||!SE||!$('#se'))return;e.preventDefault();const i=+c.dataset.si;const x0=e.clientX,y0=e.clientY;let ghost=null;
  const target=ev=>{if(ghost)ghost.style.display='none';const el=document.elementFromPoint(ev.clientX,ev.clientY);if(ghost)ghost.style.display='';const cell=el&&el.closest('[data-se-cell]');if(cell)return cell.dataset.seCell;if(el&&el.closest('[data-se-pool]'))return 'pool';return null};
  const move=ev=>{if(!ghost&&Math.hypot(ev.clientX-x0,ev.clientY-y0)<6)return;if(!ghost){ghost=c.cloneNode(true);ghost.classList.add('pe-ghost');document.body.appendChild(ghost);c.classList.add('dragging')}
    ghost.style.left=ev.clientX+'px';ghost.style.top=ev.clientY+'px';document.querySelectorAll('.pe-cell.over').forEach(x=>x.classList.remove('over'));const t=target(ev);if(t&&t!=='pool'){const cell=document.querySelector(`[data-se-cell="${t}"]`);if(cell)cell.classList.add('over')}};
  const up=ev=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);
    if(ghost){const t=target(ev);ghost.remove();c.classList.remove('dragging');if(t)seDrop(i,t);else seDraw();return}
    SE.tapAt=Date.now();const loc=seWhere(i);if(SE.sel!=null&&SE.sel!==i&&loc){seDrop(SE.sel,loc.join('_'));return}if(loc&&SE.sel==null){seDrop(i,'pool');return}SE.sel=SE.sel===i?null:i;seDraw()};
  document.addEventListener('pointermove',move);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up)});
document.addEventListener('click',e=>{if(!SE||!$('#se'))return;if(SE.tapAt&&Date.now()-SE.tapAt<500&&!e.target.closest('[data-se-pick]'))return;const dd=e.target.closest('[data-se-pick]');if(dd){seDrop(+dd.dataset.sePick,dd.closest('.pe-dd').dataset.cell);return}
  const old=$('#se .pe-dd');if(old&&!e.target.closest('.pe-dd'))old.remove();if(e.target.closest('.se-chip'))return;const cell=e.target.closest('[data-se-cell]');
  if(SE.sel!=null){if(cell){seDrop(SE.sel,cell.dataset.seCell);return}if(e.target.closest('[data-se-pool]'))seDrop(SE.sel,'pool');return}
  if(cell&&cell.classList.contains('empty')){if(!SE.pool.length){toast('남은 팀 없음');return}const box=document.createElement('div');box.className='pe-dd';box.dataset.cell=cell.dataset.seCell;
    box.innerHTML=SE.pool.map(i=>`<button type="button" data-se-pick="${i}">${h(seLabel(i))}</button>`).join('');cell.appendChild(box)}});
/* 타임표 행사: 빈 대진표로 시작해 칸마다 직접 넣기 */
ACT['gen-blank']=()=>{const pool=rosterAll().filter(p=>cfg.picked.includes(p.key));if(!pool.length){toast('참석자 먼저 선택');return}
  const P={};pool.forEach(p=>P[p.key]={name:p.name,gender:p.gender,level:p.level,guest:p.guest});const courts=cfg.courtList,R=roundsOf(cfg);
  const rounds=Array.from({length:R},()=>({matches:courts.map(()=>({a:[null,null],b:[null,null]})),rest:[]}));const {picked:_p,...cfgRest}=cfg;
  draft={id:draft&&draft.status!=='확정'?draft.id:null,cfg:JSON.parse(JSON.stringify(cfgRest)),players:P,rounds,status:'초안',allowBlank:true};sel=null;saveDraft();render();toast('빈 대진표 · 빈자리를 눌러 사람 넣기')};
function evSetupHtml(ev){const o=ev.fmt;const ppl=evPeople(ev);const need=o?(o.teams>=2?'teams':o.unit==='pair'?'pairs':o.unit==='single'?'single':'rot'):null;
  const st=need==='teams'?`팀 ${(ev.teams||[]).length}개`:need==='pairs'?`페어 ${evPairs(ev).length}팀`:`참가 ${ppl.length}명`;
  return `<div class="ev-setup"><div><b>대회 형식</b> <span>${o?h(o.name||'')+' · '+h(fmtLine(o)):'<span class="muted">미정</span>'}</span></div>${o?`<div class="small muted">${st}${need==='pairs'&&evPairs(ev).length?` · ${h(evPairs(ev).map(p=>p.map(k=>keyName(k)).join('/')).join(', '))}`:''}</div>`:''}
    ${RO?'':`<div class="row"><button class="btn sm" data-act="ev-fmt">${o?'형식 변경':'형식 선택'}</button>${need==='teams'||(ev.teams||[]).length?'<button class="btn sm" data-act="eg-teams">팀 설정</button>':''}${need==='pairs'?'<button class="btn sm" data-act="ev-pairs">페어 설정</button>':''}${o?`<button class="btn sm pri" data-act="ev-make">대진 만들기</button>`:''}</div>`}</div>`}
function viewEvents(){
  const sorted=S.events.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  // 예정: 가까운 날짜부터 · 지난 이벤트: 최근 것부터
  const base=EV_TYPES.includes(evFilter)?sorted.filter(e=>e.type===evFilter):sorted;
  const isUp=e=>e.date&&diffDays(e.endDate||e.date)>=0;
  const up=base.filter(isUp),past=base.filter(e=>!isUp(e)).reverse();
  const PAST_N=3;const showUp=evFilter!=='past',showPast=evFilter!=='upcoming',secs=showUp&&showPast;
  const pastShown=secs&&!evPastMore?past.slice(0,PAST_N):past;
  const list=(showUp?up:[]).concat(showPast?pastShown:[]);
  if(!evSel||!S.events.find(e=>e.id===evSel))evSel=(list[0]||sorted[0]||{}).id||null;
  const ev=S.events.find(e=>e.id===evSel);
  const filters=[['all','전체'],['upcoming','예정'],['past','지난 이벤트']];
  const left=`<section class="panel evlist"><div class="row" style="margin-bottom:10px">${filters.map(([v,l])=>`<button class="btn sm ${evFilter===v?'pri':'ghost'}" data-act="ev-filter" data-v="${v}">${l}</button>`).join('')}</div>
   <div class="list">${(()=>{const row=e=>{const d=parseYmd(e.date);const nc=S.notes.filter(n=>n.eventId===e.id).length;return `<div class="li click t-${h(e.type)}${e.id===evSel?' on':''}" data-act="ev-open" data-id="${e.id}">${dateBox(e.date)}<div class="grow"><div class="ttl">${h(e.title)}</div><div class="sub"><span class="chip ttag">${e.type==='개인대회'?'개인 대회':h(e.type)}</span> ${e.type==='개인대회'?`${entLine(e)}${e.result&&e.result!=='대기'?` · <b>${h(e.result)}</b>`:''}`:h(e.status||'')}${nc?` · 메모 ${nc}`:''}</div></div>${e.date&&diffDays(e.date)>=0?`<span class="dday small">${ddayLabel(e.date)}</span>`:''}</div>`};const sec=(l,n)=>`<div class="ev-sec">${l} <span class="num">${n}</span></div>`;
     let o='';if(showUp){if(secs)o+=sec('예정',up.length);o+=up.map(row).join('')||(secs?'<div class="muted small ev-none">예정된 행사 없음</div>':'')}
     if(showPast){if(secs)o+=sec('지난 이벤트',past.length);o+=pastShown.map(row).join('');if(secs&&past.length>PAST_N)o+=evPastMore?`<button class="btn sm ghost ev-more" data-act="ev-past-less">지난 이벤트 접기</button>`:`<button class="btn sm ghost ev-more" data-act="ev-past-more">지난 이벤트 ${past.length-PAST_N}건 더 보기</button>`;if(secs&&!past.length)o+='<div class="muted small ev-none">지난 행사 없음</div>'}
     return o||'<div class="muted small" style="padding:8px">해당 행사 없음</div>'})()}</div></section>`;
  let right;
  if(!ev)right=`<div class="empty" style="padding:60px 16px"><b>등록된 행사 없음</b>행사별 회의 내용과 할 일을 스티커 메모로 기록 가능<div class="row"><button class="btn pri" data-act="ev-new">행사 추가</button></div></div>`;
  else{
    const notes=S.notes.filter(n=>n.eventId===ev.id).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
    const draftTxt=lsGet('sbpb-notedraft','');
    const isT=ev.type==='개인대회';const ch=(ev.cheer||[]);
    const tour=isT?`<div class="tour"><div><div class="l">출전</div><div class="v">${h((ev.entrants||[]).map(nameOf).join(', ')||'미입력')}${ptNames(ev).length?` <span class="muted">+ ${h(ptNames(ev).join(', '))}</span>`:''}</div></div><div><div class="l">부문 · 종목</div><div class="v">${h(ev.division||'–')} · ${h(ev.category||'–')}</div></div>${ev.host?`<div><div class="l">주최</div><div class="v">${h(ev.host)}</div></div>`:''}${ev.cond?`<div><div class="l">참가 조건</div><div class="v">${h(ev.cond)}</div></div>`:''}<div><div class="l">결과</div><div class="v"><span class="result ${resultCls(ev.result)}">${h(ev.result||'대기')}</span>${ev.resultNote?` <span class="small muted">${h(ev.resultNote)}</span>`:''}</div></div></div>
      ${(()=>{const past=ev.date&&diffDays(ev.endDate||ev.date)<0;  // finished: show only who went; edit via 수정
        return `<div class="cheer"><h3>응원단 <span class="cnt">${ch.length}</span><span class="small muted" style="font-weight:500">${ch.length?`${h(ch.map(nameOf).join(', '))} 님 응원 참석`:past?'응원 간 멤버 없음 · 수정에서 추가 가능':'응원 간 멤버 선택하여 체크'}</span></h3>
      ${past?(ch.length?`<div class="toggle done">${byName(ch.map(id=>({id,name:nameOf(id)}))).map(m=>`<span class="ch-on">${h(m.name)}</span>`).join('')}</div>`:''):`<div class="toggle">${byName(activeMembers().filter(m=>!(ev.entrants||[]).includes(m.id))).map(m=>`<button data-act="cheer" data-id="${m.id}" aria-pressed="${ch.includes(m.id)}">${h(m.name)}</button>`).join('')}</div>`}</div>`})()}`:'';
    right=`<section class="panel t-${h(ev.type)}" id="evdetail"><div class="evhead" data-act="memo-toggle" role="button" tabindex="0" aria-expanded="${memoOpen}" title="${memoOpen?'메모 접기':'메모 펼치기'}"><div><span class="chip ttag">${isT?'개인 대회':h(ev.type)}</span> <span class="chip">${h(ev.status)}</span><h2 style="margin-top:6px">${h(ev.title)}</h2>
      ${ev.status==='취소'&&ev.cancelReason?`<div class="small" style="margin-top:6px;color:var(--muted)">취소 사유: <b>${h(ev.cancelReason)}</b>${ev.cancelNote?' · '+h(ev.cancelNote):''}</div>`:''}<div class="meta-row"><span>${fmtFull(ev.date)}${ev.endDate?' – '+fmtFull(ev.endDate):''}</span>${ev.place?`<span>장소 ${h(ev.place)}</span>`:''}${ev.owner?`<span>담당 ${h(ev.owner)}</span>`:''}${ev.headcount?`<span>${h(ev.headcount)}명 예상</span>`:''}${(ev.confirmed||[]).length+(ev.confirmedExtra||[]).length?`<span>${(ev.confirmed||[]).length+(ev.confirmedExtra||[]).length}명 확정</span>`:''}${ev.budget?`<span>예산 ${Number(ev.budget).toLocaleString()}원</span>`:''}${(()=>{const s=ledSum(ev.id);return s.es.length?`<span><a href="#money" data-act="led-go" data-id="${ev.id}">정산 지출 ${won(s.out)}${s.inc?' · 수입 '+won(s.inc):''}</a></span>`:''})()}</div>${(ev.confirmed||[]).length+(ev.confirmedExtra||[]).length&&ev.type!=='개인대회'?`<div class="conf-line"><b>확정</b>${byName((ev.confirmed||[]).map(id=>({id,name:nameOf(id)}))).map(m=>`<span>${h(m.name)}</span>`).join('')}${(ev.confirmedExtra||[]).map(x=>`<span class="ex">${h(cfxName(x))}<i>G</i></span>`).join('')}</div>`:''}</div>
      <div class="row">${ev.date&&diffDays(ev.date)>=0?`<span class="dday" style="font-size:26px;color:var(--tc)">${ddayLabel(ev.date)}</span>`:''}<button class="btn" data-act="ev-edit">수정</button></div></div>
      ${tour}${evGames(ev)}<details class="memo-fold" id="memo-fold"${memoOpen?' open':''}><summary><span>메모 <b class="num">${notes.length}</b>${ev.desc?' · 개요':''}</span><span class="small muted">${memoOpen?'접기':'펼치기'}</span></summary>
      ${ev.desc?`<p style="white-space:pre-wrap;margin:12px 0 14px">${h(ev.desc)}</p>`:'<div style="height:12px"></div>'}
      <div class="composer"><textarea class="in" id="note-text" placeholder="회의 내용, 할 일, 아이디어 메모" data-notedraft="1">${h(draftTxt)}</textarea>
        <div style="display:flex;flex-direction:column;gap:8px"><div class="swatches">${Object.entries(NOTE_KIND).map(([c,k])=>`<button class="sw nc-${c}" data-act="note-color" data-c="${c}" aria-pressed="${noteColor===c}" title="${k}" aria-label="${k}"></button>`).join('')}</div><button class="btn pri" data-act="note-add">메모 붙이기</button></div></div>
      <div class="row" style="justify-content:space-between;margin-top:12px"><div class="legend" style="margin:0">${Object.entries(NOTE_KIND).map(([c,k])=>`<span><i class="dot nc-${c}" style="background:var(--nc)"></i>${k}</span>`).join('')}</div><div class="seg">${[['sticky','스티커'],['list','목록']].map(([v,l])=>`<button class="${noteView===v?'on':''}" data-act="note-view" data-v="${v}">${l}</button>`).join('')}</div></div>
      ${notes.length&&noteView==='list'?`<div class="nlist">${notes.map(n=>`<div class="nl nc-${h(n.color||'yellow')}"><div class="nl-top"><span class="nl-kind">${NOTE_KIND[n.color]||'메모'}</span><span class="nl-meta">${names[n.authorId]?h(names[n.authorId])+' · ':''}${n.createdAt?new Date(n.createdAt).toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'}):''}</span><span class="nl-acts"><button class="x" data-act="note-edit" data-id="${n.id}">수정</button><button class="x" data-act="note-del" data-id="${n.id}" aria-label="메모 삭제">×</button></span></div><div class="nl-text clamp" data-act="note-more" title="눌러서 전체 보기">${h(n.text)}</div></div>`).join('')}</div>`:notes.length?`<div class="board">${notes.map(n=>`<article class="note nc-${h(n.color||'yellow')}" style="--rot:${Number(n.rot)||0}deg"><div class="kind">${NOTE_KIND[n.color]||'메모'}</div><div class="nt clamp" data-act="note-more" title="눌러서 전체 보기">${h(n.text)}</div><div class="nf"><span>${names[n.authorId]?h(names[n.authorId])+' · ':''}${n.createdAt?new Date(n.createdAt).toLocaleDateString('ko-KR',{month:'numeric',day:'numeric'}):''}</span><span><button class="x" data-act="note-edit" data-id="${n.id}" aria-label="메모 수정">수정</button><button class="x" data-act="note-del" data-id="${n.id}" aria-label="메모 삭제">×</button></span></div></article>`).join('')}</div>`:'<p class="muted small" style="margin-top:14px">메모 없음. 첫 회의 내용 기록 가능</p>'}
      </details>
    </section>`;
  }
  return `<div class="page-head"><div><h1>이벤트</h1><p>내부대회 · 교류전 · MT 일정과 기획 메모, 멤버 개인 대회 출전 기록</p></div><div class="row"><button class="btn pri" data-act="ev-new">행사 추가</button></div></div><div class="evwrap">${left}<div style="min-width:0">${right}</div></div>`;
}
document.addEventListener('input',e=>{if(e.target.dataset.notedraft)lsSet('sbpb-notedraft',e.target.value)});

/* =========================================================
   COURTS
   ========================================================= */
function ruleFields(prefix,r={}){
  return `<div class="grid3"><label class="f">방식<select class="in" name="${prefix}type"><option value="monthly"${r.type!=='weekly'&&r.type!=='manual'?' selected':''}>매월 특정일</option><option value="weekly"${r.type==='weekly'?' selected':''}>매주 특정 요일</option><option value="rolling"${r.type==='rolling'?' selected':''}>이용일 N일 전</option><option value="manual"${r.type==='manual'?' selected':''}>날짜 직접</option></select></label>
  <label class="f rv-text"${r.type==='manual'?' hidden':''}>일 / 요일<input class="in" name="${prefix}val" value="${h(r.type==='weekly'?WD[r.weekday||0]:r.type==='manual'?'':r.type==='rolling'?(r.days||''):String(r.day||'').replace(/\bL\b/,'말일'))}" placeholder="10,25 · 말일 · 30 · 월"></label>
  <div class="f rv-date"${r.type==='manual'?'':' hidden'}>날짜${calField(r.type==='manual'?r.date:'',{name:prefix+'date'})}</div>
  <label class="f">시각${timeField(r.time||'10:00',{name:prefix+'time',title:'오픈 시각'})}</label></div>`;
}
function ruleFrom(fd,p){const type=fd[p+'type'],v=(fd[p+'val']||'').trim(),time=fd[p+'time']||'00:00';
  if(type==='weekly'){const i=WD.indexOf(v.replace('요일',''));return {type,weekday:i<0?1:i,time}}
  if(type==='manual'){const d=fd[p+'date']||v;return {type,date:/^\d{4}-\d{2}-\d{2}$/.test(d)?d:'',time}}
  if(type==='rolling'){const n=parseInt(v);return {type,days:n>0?n:30,time:fd[p+'time']||''}}
  if(!v)return {};/* 일 입력 없으면 오픈 규칙 없음 */
  const parts=v.split(/[,·\s]+/).filter(Boolean);const ds=parts.filter(x=>!/말/.test(x)).map(n=>parseInt(n)).filter(n=>n>=1&&n<=31);const last=parts.some(x=>/말/.test(x));
  const list=[...new Set(ds)].sort((a,b)=>a-b).map(String);if(last)list.push('L');return {type:'monthly',day:(list.length?list:['1']).join(','),time}}
function courtForm(c={}){
  return `<div class="grid2"><label class="f">코트 이름<input class="in" name="name" required value="${h(c.name)}" placeholder="예: OO공원 테니스장"></label><label class="f">위치 (구·시)<input class="in" name="district" list="areas-c" value="${h(c.district)}" placeholder="예: 송파구"></label></div>
  <label class="f">주소 (선택 시 네이버 지도 연결)<input class="in" name="address" value="${h(c.address)}" placeholder="예: 서울 광진구 천호대로 731"></label>
  <label class="f">네이버 지도 링크 (선택 · 비우면 주소로 검색)<input class="in" type="url" name="map" value="${h(c.map)}" placeholder="https://naver.me/..."></label>
  <div class="grid2"><label class="f">면 수<span class="sfx"><input class="in" inputmode="numeric" data-selall="1" name="courts" value="${h(courtsN(c.courts)||'')}" placeholder="4"><i>면</i></span></label>
  <div class="f"><span>요금</span><div class="feerow"><span class="sfx"><input class="in" inputmode="numeric" data-comma="1" name="feeN" value="${c.feeN?Number(c.feeN).toLocaleString('ko-KR'):''}" placeholder="5,000"><i>원</i></span>${optSel('feeUnit',c.feeUnit||'1시간',['1시간','2시간'],'1시간',{label:v=>v+'당',none:false})}</div>${c.fee&&!c.feeN?`<span class="small muted" style="font-weight:500">기존 입력: ${h(c.fee)}</span>`:''}</div></div>
  <div class="f"><span>바닥 (중복 선택 가능)</span><div class="iopick">${(()=>{const cur=surfList(c.surface);return [...new Set([...SURFACES,...cur])].map(s=>`<label><input type="checkbox" name="surf_${h(s)}"${cur.includes(s)?' checked':''}><span>${h(s)}</span></label>`).join('')})()}</div></div>
  <div class="f"><span>실내 · 실외 (중복 선택 가능)</span><div class="iopick"><label><input type="checkbox" name="indoor"${c.indoor?' checked':''}><span>실내</span></label><label><input type="checkbox" name="outdoor"${c.outdoor?' checked':''}><span>실외</span></label></div></div>
  <div class="grid2"><label class="f">구분<select class="in" name="kind">${KINDS.map(([k,l])=>`<option value="${k}"${kindOf(c)===k?' selected':''}>${l}</option>`).join('')}</select></label>
  <label class="f">예약 링크<input class="in" type="url" name="url" value="${h(c.url)}" placeholder="https://..."></label></div>
  <label class="check"><input type="checkbox" name="smash"${isSmash(c)?' checked':''}> 스매시 앱으로 예약 (목록 맨 아래에 표시)</label>
  <div><div class="small muted" style="font-weight:600;margin-bottom:4px">일반 예약 오픈</div>${ruleFields('g_',c.genRule)}</div>
  <label class="check"><input type="checkbox" name="resident"${c.resident?' checked':''}> 관내 주민 우선 예약 있음</label>
  <div><div class="small muted" style="font-weight:600;margin-bottom:4px">주민 우선 예약 오픈 (해당 시)</div>${ruleFields('r_',c.resRule)}</div>
  <div class="grid2"><label class="f">우선 대상 지역<input class="in" name="area" list="areas-c" value="${h(c.area)}" placeholder="비우면 위치와 같음"></label><label class="check" style="align-self:end;padding-bottom:8px"><input type="checkbox" name="workers"${c.workers?' checked':''}> 관내 직장인도 포함</label></div>
  <div class="f">예약 대상 기간 / 메모${bigMemo('memo',c.memo,'예: 다음 달 이용분 오픈, 1인 월 2회 제한, 추첨제','코트 메모')}</div>
  <datalist id="areas-c">${SEOUL.concat(NEAR).map(a=>`<option value="${a}">`).join('')}</datalist>`;
}
const courtFromFd=(fd,old={})=>({...old,name:fd.name.trim(),district:fd.district.trim(),address:(fd.address||'').trim(),map:(fd.map||'').trim(),courts:courtsN(fd.courts)?courtsN(fd.courts)+'면':'',surface:Object.keys(fd).filter(k=>k.startsWith('surf_')&&fd[k]===true).map(k=>k.slice(5)).join('·'),indoor:!!fd.indoor,outdoor:!!fd.outdoor,feeN:numOf(fd.feeN)||0,feeUnit:fd.feeUnit||'1시간',fee:numOf(fd.feeN)?'':(old.fee||''),url:fd.url.trim(),platform:old.platform||'etc',kind:fd.kind||'public',smash:!!fd.smash,genRule:ruleFrom(fd,'g_'),resident:!!fd.resident,resRule:ruleFrom(fd,'r_'),area:fd.area.trim(),workers:!!fd.workers,memo:(numOf(fd.feeN)&&old.fee&&!fd.memo.includes(old.fee)?['요금 상세: '+old.fee,fd.memo.trim()].filter(Boolean).join('\n'):fd.memo.trim())});
ACT['c-new']=()=>openModal('코트 추가',courtForm(),fd=>put('courts',uid(),{...courtFromFd(fd),createdAt:Date.now()}));
ACT['c-edit']=t=>{const c=S.courts.find(x=>x.id===t.dataset.id);if(!c)return;openModal('코트 수정',courtForm(c),fd=>put('courts',c.id,courtFromFd(fd,c)),`<button type="button" class="btn danger" data-act="c-del" data-id="${c.id}">삭제</button>`)};
ACT['c-del']=t=>{if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='한 번 더 누르면 삭제';return}del('courts',t.dataset.id);closeModal()};
// 예약처: 카드에 예약 링크가 없을 때 연결할 기본 사이트 (예전 데이터 호환)
const PLATFORMS=[
  {k:'seoul',url:'https://yeyak.seoul.go.kr/web/search/selectPageListDetailSearchImg.do?code=T100&dCode=T108'},
  {k:'olympic',url:'https://www.ksponco.or.kr/online/tennis/index.do'},
  {k:'naver',url:'https://booking.naver.com'},
  {k:'smash',url:''},
  {k:'etc',url:''}];
const KINDS=[['public','공공 코트'],['private','사설 코트']];
const courtsN=v=>{const m=String(v||'').match(/\d+/);return m?+m[0]:0};
const feeText=c=>c.feeN?`${c.feeUnit||'1시간'}당 ${Number(c.feeN).toLocaleString('ko-KR')}원`:(c.fee||'');
const SURFACES=['하드','클레이','인조잔디'];
const surfList=s=>String(s||'').split(/\s*[·,\/]\s*/).map(x=>x.trim()).filter(Boolean);
const isSmash=c=>c.smash!==undefined?!!c.smash:(c.platform==='smash'&&!c.url&&!/엠무브|mmove/i.test(c.name||''));
const kindOf=c=>c.kind||(c.platform==='smash'||c.platform==='naver'?'private':'public');
const platOf=c=>PLATFORMS.find(p=>p.k===c.platform)||PLATFORMS[PLATFORMS.length-1];
const mapUrl=q=>'https://map.naver.com/p/search/'+encodeURIComponent(q);
const addrLink=(addr,name,map)=>`<a class="addr" href="${h(map||mapUrl(addr||name||''))}" target="_blank" rel="noopener">${addr?h(addr):'지도에서 위치 보기'} <span aria-hidden="true">↗</span></a>`;
const MMOVE='https://mmove.co.kr/bbs/page.php?hid=m02_01';
const courtUrl=c=>c.url||(/엠무브|mmove/i.test(c.name||'')?MMOVE:platOf(c).url);
let courtArea='';
function viewCourts(){
  const ops=openings(45);
  const areas=[...new Set(S.courts.map(c=>c.district).filter(Boolean))].sort();
  const list=S.courts.filter(c=>!courtArea||c.district===courtArea).map(c=>({c,n:[c.resident?nextOpen(c.resRule):null,nextOpen(c.genRule)].filter(Boolean).sort((a,b)=>a-b)[0]})).sort((a,b)=>{const k=o=>o.n?+o.n:(o.c.genRule&&o.c.genRule.type==='rolling'?9e15:Infinity);return (isSmash(a.c)-isSmash(b.c))||k(a)-k(b)||(a.c.name||'').localeCompare(b.c.name||'','ko')});
  const tl=ops.length?`<div class="timeline">${ops.slice(0,12).map(o=>`<div class="tl ${o.kind}"><div class="dday">${ddayLabel(ymd(o.date))}</div><div style="font-weight:600">${h(o.court.name)}</div><div class="small muted">${o.date.getMonth()+1}/${o.date.getDate()} (${WD[o.date.getDay()]}) ${pad(o.date.getHours())}:${pad(o.date.getMinutes())}</div><div style="margin-top:4px">${o.kind==='res'?`<span class="chip warn">주민 우선 · ${priorityMembers(o.court).length}명 가능</span>`:'<span class="chip court">일반 오픈</span>'}</div></div>`).join('')}</div>`:'';
  const card=({c})=>{
    const g=nextOpen(c.genRule),r=c.resident?nextOpen(c.resRule):null;
    const pm=priorityMembers(c);
    const fd=d=>`${d.getMonth()+1}.${d.getDate()} (${WD[d.getDay()]})`;
    const ob=(l,d,rule)=>{const rc=l.startsWith('주민')?' res':'';if(rule&&rule.type==='rolling'){const n=Number(rule.days||0);const [hh,mi]=(rule.time||'00:00').split(':').map(Number);const now=new Date();const opened=now.getHours()*60+now.getMinutes()>=hh*60+mi;
        const upto=today0();upto.setDate(upto.getDate()+n-(opened?0:1));const nx=today0();nx.setDate(nx.getDate()+(opened?1:0));const nxUse=new Date(nx);nxUse.setDate(nxUse.getDate()+n);
        return `<div class="open-box roll${rc}"><div class="l">${l}</div><div class="big">이용일 <b>${n}일 전</b>${rule.time?` <b>${h(rule.time)}</b>`:''}</div><div class="d">지금 <b>${fd(upto)}</b> 이용분까지 예약 가능</div><div class="d">다음 오픈 ${opened?'내일':'오늘'} ${h(rule.time||'')} → ${fd(nxUse)} 이용분</div></div>`}
      if(!d)return `<div class="open-box${rc}"><div class="l">${l}</div><div class="big">미정</div><div class="d">${h(ruleText(rule))}</div></div>`;
      const dd=diffDays(ymd(d));return `<div class="open-box${rc}"><div class="l">${l}</div><div class="big"><span class="dday">${ddayLabel(ymd(d))}</span><b>${fd(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}</b></div><div class="d">${h(ruleText(rule))}</div></div>`};
    return `<article class="ccard"><div class="hd"><div><h3>${h(c.name)}</h3><div class="cbadges">${c.district?`<span class="cb cb-area">${h(c.district)}</span>`:''}${surfList(c.surface).map(s=>`<span class="cb ${({'인조잔디':'cb-grass','하드':'cb-hard','클레이':'cb-clay'})[s]||'cb-etc'}">${h(s)}</span>`).join('')}${c.indoor?'<span class="cb cb-io">실내</span>':''}${c.outdoor?'<span class="cb cb-io">실외</span>':''}${c.courts?`<span class="cb-n">${h(c.courts)}</span>`:''}${isSmash(c)?'<span class="cb cb-etc">스매시 앱 예약</span>':''}</div>${addrLink(c.address,c.name,c.map)}</div><div class="row">${c.resident?'<span class="chip warn">주민 우선</span>':''}<button class="btn sm ghost" data-act="c-edit" data-id="${c.id}">수정</button></div></div>
    ${c.genRule&&c.genRule.type?`<div class="opens">${c.resident?ob('주민 우선 오픈',r,c.resRule):''}${ob('일반 오픈',g,c.genRule)}</div>`:''}
    <dl class="kv"><dt>요금</dt><dd>${feeText(c)?h(feeText(c)):'-'}</dd>${c.memo?`<dt>메모</dt><dd style="white-space:pre-wrap">${h(c.memo)}</dd>`:''}</dl>
    ${c.resident?`<div class="prio"><div class="l">우선 예약 가능 회원 · ${h(c.area||c.district)}${c.workers?' 거주·직장':' 거주'} 기준 ${pm.length}명</div><div class="chips">${pm.length?pm.map(({m,why})=>`<span class="chip ${why==='거주'?'court':''}">${h(m.name)}${why==='직장'?' (직장)':''}</span>`).join(''):'<span class="small muted">해당 지역 회원 없음</span>'}</div></div>`:''}
    ${courtUrl(c)?`<a class="btn pri" href="${h(courtUrl(c))}" target="_blank" rel="noopener" style="text-align:center;text-decoration:none">예약 페이지 열기 ↗</a>`:''}
    </article>`};
  const cards=KINDS.map(([k,l])=>{const items=list.filter(({c})=>kindOf(c)===k);return items.length?`<section class="plat"><div class="plat-h"><h3>${l} <span class="num muted" style="font-size:13px">${items.length}</span></h3></div><div class="cards">${items.map(card).join('')}</div></section>`:''}).join('');
  // area coverage: which districts have members
  const memAreas={};activeMembers().forEach(m=>{if(m.district)memAreas[m.district]=(memAreas[m.district]||0)+1});
  return `<div class="page-head"><div><h1>코트</h1><p>정기대관 코트 사용 현황 및 추가 코트 예약 관리</p></div></div>
  ${rentalSection()}
  <div class="sec-h" id="extra"><div><h2>추가 코트 예약</h2><p class="small muted" style="margin:2px 0 0">예약처별 오픈 규칙·요금·예약 링크</p></div><div class="row"><button class="btn pri" data-act="c-new">코트 추가</button></div></div>
  ${S.courts.length?`<section class="panel"><div class="panel-h"><h2>45일 내 예약 오픈</h2><span class="small muted">주민 우선 오픈은 주황색</span></div>${tl||'<div class="muted small">45일 내 오픈 예정 코트 없음</div>'}</section>
  <div class="toolbar" style="margin-top:16px"><select class="in" id="c-area" data-carea="1"><option value="">지역 전체</option>${areas.map(a=>`<option${courtArea===a?' selected':''}>${h(a)}</option>`).join('')}</select><span class="small muted">회원 거주지: ${Object.entries(memAreas).sort((a,b)=>b[1]-a[1]).map(([a,n])=>`${h(areaLabel(a))} ${n}`).join(' · ')||'미입력'}</span></div>
  ${cards}`:
  `<div class="empty" style="padding:50px 16px"><b>등록된 추가 코트 없음</b>예약 링크·오픈일·주민 우선 여부 입력 시 다음 오픈일까지 남은 기간과 우선 예약 가능 회원 표시<div class="row"><button class="btn pri" data-act="c-new">코트 추가</button></div></div>`}`;
}
document.addEventListener('change',e=>{if(e.target.dataset.carea){courtArea=e.target.value;render()}});

/* ---------- regular rental court (정기대관) ---------- */
let rentMonth=null,rentYear=null,archFilter='';
function rentalInfo(){return S.rentals.find(r=>r.id==='main')||{name:REG.place+' 테니스장',courts:3,fee:'',from:'',to:'',contact:'',memo:''}}
function satsIn(y,m){const out=[];const d=new Date(y,m,1);while(d.getMonth()===m){if(d.getDay()===REG.weekday)out.push(ymd(d));d.setDate(d.getDate()+1)}return out}
function satState(ds){const rs=regStat(ds);if(rs)return rs.status==='취소'?{k:'cx',l:rs.reason,rs}:{k:'del',l:'미진행',rs};const r=rentalInfo();if((r.from&&ds<r.from)||(r.to&&ds>r.to))return {k:'out',l:'계약 외'};return diffDays(ds)<0?{k:'used',l:'사용'}:{k:'plan',l:'예정'}}
// 청구 기준: 사용·우천·클럽 사정 취소·미진행은 청구, 코트 측 취소는 대체일 사용 시만 청구 (미사용 시 비용 없음)
function billOf(ds){const s=satState(ds);if(s.k==='out')return 'none';if(s.k==='plan')return 'pending';if(s.k==='cx'&&isCourtCx(s.rs)){const m=mkState(s.rs);return m==='사용'?'charge':m==='미사용'?'deduct':'pending'}return 'charge'}
function won(n){return (Number(n)||0).toLocaleString('ko-KR')+'원'}
function rentalSection(){
  const r=rentalInfo();const t=today0();
  if(!rentMonth)rentMonth=`${t.getFullYear()}-${pad(t.getMonth()+1)}`;if(!rentYear)rentYear=t.getFullYear();
  const [y,m]=rentMonth.split('-').map(Number);const sats=satsIn(y,m-1);const fee=Number(r.fee)||0;
  const mc={used:0,cx:0,del:0,plan:0,out:0,charge:0,pending:0};sats.forEach(ds=>{mc[satState(ds).k]++;const b=billOf(ds);if(b==='charge'||b==='pending')mc[b]++});
  const monthRows=sats.map(ds=>{const s=satState(ds);const br=S.brackets.find(b=>b.cfg&&b.cfg.date===ds&&b.status==='확정');
    return `<tr class="${s.k==='cx'||s.k==='del'?'dim':''}"><td class="num">${fmtD(ds)}</td><td><span class="st st-${s.k}">${h(s.l)}</span></td><td class="muted small">${s.rs?h(s.rs.note||''):''}${mkInfo(s.rs)}${br?`<button class="btn sm ghost" data-act="bv-open" data-id="${br.id}">대진표</button>`:''}</td><td style="text-align:right">${RO||s.k==='out'?'':s.rs?`${isCourtCx(s.rs)?`<button class="btn sm" data-act="reg-makeup" data-d="${ds}">대체일</button>`:''}<button class="btn sm ghost" data-act="reg-restore" data-d="${ds}">복구</button>`:`<button class="btn sm ghost" data-act="reg-cancel" data-d="${ds}">취소</button>`}</td></tr>`}).join('');
  // yearly summary
  const months=Array.from({length:12},(_,i)=>{const ss=satsIn(rentYear,i);const o={used:0,cx:0,del:0,plan:0,out:0,reasons:{},charge:0,deduct:0,pending:0};ss.forEach(ds=>{const s=satState(ds);o[s.k]++;const b=billOf(ds);if(b!=='none')o[b]++;if(s.k==='cx')o.reasons[s.l]=(o.reasons[s.l]||0)+1});return o});
  const tot=months.reduce((a,o)=>{['used','cx','del','plan'].forEach(k=>a[k]+=o[k]);Object.entries(o.reasons).forEach(([k,v])=>a.reasons[k]=(a.reasons[k]||0)+v);return a},{used:0,cx:0,del:0,plan:0,reasons:{}});
  const maxCx=Math.max(1,...months.map(o=>o.cx));
  const yearRows=months.map((o,i)=>`<tr><td>${i+1}월</td><td class="num">${o.used}</td>${CANCEL_REASONS.map(k=>`<td class="num${o.reasons[k]?'':' muted'}">${o.reasons[k]||'–'}</td>`).join('')}<td class="num${o.del?'':' muted'}">${o.del||'–'}</td><td class="num">${fee?won(o.charge*fee):'–'}</td><td><div class="cxbar"><i style="width:${o.cx/maxCx*100}%"></i></div></td></tr>`).join('');
  // archive
  const arch=S.regstat.slice().filter(x=>!archFilter||x.reason===archFilter||(archFilter==='미진행'&&x.status==='삭제')).sort((a,b)=>b.id.localeCompare(a.id));
  const reasonsUsed=[...new Set(S.regstat.map(x=>x.status==='삭제'?'미진행':x.reason))];
  return `<section class="panel rent">
    <div class="sec-h" style="margin-top:0"><div><h2>정기대관 코트 관리</h2><p class="small muted" style="margin:2px 0 0">${h(r.name)} · 매주 토 ${REG.start}–${REG.end} · ${h(r.courts||3)}면${fee?` · 회당 ${won(fee)}`:''}${r.from||r.to?` · 계약 ${r.from?fmtD(r.from):''}~${r.to?fmtD(r.to):''}`:''}</p>${addrLink(r.address,r.name,r.map)}</div>${RO?'':'<button class="btn" data-act="rent-edit">대관 정보 수정</button>'}</div>
    ${r.memo||r.contact?`<p class="small muted" style="margin:0 0 12px;white-space:pre-wrap">${h([r.contact&&('담당·연락처: '+r.contact),r.memo].filter(Boolean).join('\n'))}</p>`:''}
    <div class="rent-grid">
      <div class="rent-box"><div class="panel-h" style="margin-bottom:8px"><h3>${y}년 ${m}월 사용 현황</h3><div class="row"><button class="btn sm" data-act="rent-m" data-v="-1" aria-label="이전 달">‹</button><button class="btn sm" data-act="rent-m" data-v="0">이번 달</button><button class="btn sm" data-act="rent-m" data-v="1" aria-label="다음 달">›</button></div></div>
        <div class="rent-kpi"><div><b class="num">${mc.used}</b><span>사용</span></div><div><b class="num">${mc.cx}</b><span>취소</span></div><div><b class="num">${mc.del}</b><span>미진행</span></div><div><b class="num">${mc.plan}</b><span>예정</span></div><div><b class="num">${fee?won(mc.charge*fee):'–'}</b><span>청구 금액</span></div></div>
        <div class="tbl-wrap"><table class="tbl rtbl"><tbody>${monthRows}</tbody></table></div></div>
      <div class="rent-box"><div class="panel-h" style="margin-bottom:8px"><h3>${rentYear}년 연간 현황</h3><div class="row"><button class="btn sm" data-act="rent-y" data-v="-1" aria-label="이전 해">‹</button><button class="btn sm" data-act="rent-y" data-v="1" aria-label="다음 해">›</button></div></div>
        <div class="chips" style="margin-bottom:8px"><span class="chip">사용 <b class="num">${tot.used}</b></span>${CANCEL_REASONS.map(k=>`<span class="chip${tot.reasons[k]?' cxchip':''}">${k} <b class="num">${tot.reasons[k]||0}</b></span>`).join('')}<span class="chip">미진행 <b class="num">${tot.del}</b></span>${fee?`<span class="chip court">청구 금액 <b class="num">${won(months.reduce((s,o)=>s+o.charge,0)*fee)}</b></span>`:''}</div>
        <div class="tbl-wrap"><table class="tbl ytbl"><thead><tr><th>월</th><th>사용</th>${CANCEL_REASONS.map(k=>`<th>${k.replace(' 취소','')}</th>`).join('')}<th>미진행</th><th>금액</th><th>취소</th></tr></thead><tbody>${yearRows}</tbody></table></div></div>
    </div>
    <p class="small muted" style="margin:12px 0 0">분기별 대관료 정산은 <a href="#money">정산 탭</a>에서 확인</p>
    <div class="rent-box" style="margin-top:14px"><div class="panel-h" style="margin-bottom:8px"><h3>취소 기록 아카이브 <span class="muted small">${S.regstat.length}건</span></h3><div class="row"><button class="btn sm ${archFilter?'ghost':'pri'}" data-act="arch-f" data-v="">전체</button>${reasonsUsed.map(k=>`<button class="btn sm ${archFilter===k?'pri':'ghost'}" data-act="arch-f" data-v="${h(k)}">${h(k)}</button>`).join('')}</div></div>
      ${arch.length?`<div class="list arch">${arch.map(x=>`<div class="li"><span class="st st-${x.status==='삭제'?'del':'cx'}">${h(x.status==='삭제'?'미진행':x.reason)}</span><div class="grow"><div class="ttl">${fmtFull(x.id)}</div><div class="sub">${h(x.note||'메모 없음')} · 기록 ${x.createdAt?new Date(x.createdAt).toLocaleDateString('ko-KR'):''}</div>${mkInfo(x)}</div>${RO?'':`${isCourtCx(x)?`<button class="btn sm" data-act="reg-makeup" data-d="${x.id}">대체일</button>`:''}<button class="btn sm ghost" data-act="reg-restore" data-d="${x.id}">복구</button>`}</div>`).join('')}</div>`:'<div class="muted small">취소 기록 없음. 대시보드 캘린더 또는 월별 사용 현황 표에서 취소 처리 시 기록</div>'}
    </div>
  </section>`;
}
ACT['rent-m']=t=>{const v=+t.dataset.v;const tt=today0();if(!v){rentMonth=`${tt.getFullYear()}-${pad(tt.getMonth()+1)}`}else{const [y,m]=rentMonth.split('-').map(Number);const d=new Date(y,m-1+v,1);rentMonth=`${d.getFullYear()}-${pad(d.getMonth()+1)}`}render()};
ACT['rent-y']=t=>{rentYear+=+t.dataset.v;render()};
ACT['arch-f']=t=>{archFilter=t.dataset.v;render()};
ACT['rent-edit']=()=>{const r=rentalInfo();openModal('정기대관 정보',`<label class="f">코트 이름<input class="in" name="name" required value="${h(r.name)}"></label>
  <label class="f">주소 (선택 시 네이버 지도 연결)<input class="in" name="address" value="${h(r.address)}" placeholder="예: 서울 동대문구 서울시립대로 163"></label>
  <div class="grid2"><label class="f">사용 면 수<input class="in" type="number" min="1" name="courts" value="${h(r.courts||3)}"></label><label class="f">회당 대관료 (원)<input class="in" inputmode="numeric" data-comma="1" name="fee" value="${r.fee?h(Number(r.fee).toLocaleString('ko-KR')):''}" placeholder="예: 60,000"></label></div>
  <div class="grid2"><label class="f">계약 시작일${calField(r.from,{name:'from'})}</label><label class="f">계약 종료일${calField(r.to,{name:'to'})}</label></div>
  <label class="f">담당자·연락처<input class="in" name="contact" value="${h(r.contact)}" placeholder="예: 체육시설 관리팀 02-000-0000"></label>
  <label class="f">정산·운영 메모<textarea class="in" name="memo" placeholder="예: 우천 취소분 익월 이월, 코트 측 취소 시 환불">${h(r.memo)}</textarea></label>`,fd=>put('rentals','main',{...rentalInfo(),name:fd.name.trim(),address:(fd.address||'').trim(),courts:Number(fd.courts)||3,fee:numOf(fd.fee),from:fd.from,to:fd.to,contact:fd.contact.trim(),memo:fd.memo.trim()}))};

/* =========================================================
   MONEY (정산): 월 회비 · 행사 정산 · 정기대관 분기 정산
   ========================================================= */
let MONEY_AFTER=null;
let monY=new Date().getFullYear(),monM=new Date().getMonth()+1,ledFocus=null;
let ledOpen=(()=>{const v=lsGet('sbpb-led-open',null);return Array.isArray(v)?new Set(v):null})();
function ledRow(x){
  if(RO)return `<tr class="${x.kind==='in'?'inc':''}"><td>${h(x.item||'')}</td><td class="num">${won(x.amount)}</td><td>${x.kind==='in'?'수입':'지출'}</td><td>${h(x.cat||'')}</td><td>${h(x.payer||'')}</td><td>${fmtD(x.date)}</td><td>${h(x.memo||'')}</td><td></td></tr>`;
  const f=(k,extra='')=>`id="lf-${x.id}-${k}" data-led="${k}" data-id="${x.id}" ${extra}`;
  return `<tr class="${x.kind==='in'?'inc':''}"><td><input class="cell" ${f('item','placeholder="항목" aria-label="항목"')} value="${h(x.item||'')}"></td>
    <td><input class="cell num" inputmode="numeric" ${f('amount','placeholder="0" aria-label="금액"')} value="${x.amount?Number(x.amount).toLocaleString('ko-KR'):''}"></td>
    <td><select class="cell" ${f('kind')} aria-label="구분"><option value="out"${x.kind!=='in'?' selected':''}>지출</option><option value="in"${x.kind==='in'?' selected':''}>수입</option></select></td>
    <td><button type="button" class="cell cpick" ${f('cat')} data-act="cp-open" data-k="cat" aria-haspopup="listbox" aria-label="분류">${x.cat?h(x.cat):'<span class="ph">분류</span>'}<i aria-hidden="true">▾</i></button></td>
    <td><button type="button" class="cell cpick" ${f('payer')} data-act="cp-open" data-k="payer" aria-haspopup="listbox" aria-label="결제·담당">${x.payer?h(x.payer):'<span class="ph">결제·담당</span>'}<i aria-hidden="true">▾</i></button></td>
    <td>${calField(x.date,{extra:f('date'),cell:true,required:true})}</td>
    <td><input class="cell" ${f('memo','placeholder="메모" aria-label="메모"')} value="${h(x.memo||'')}"></td>
    <td>${x.draft?'':`<button type="button" class="cell-x" data-act="led-del" data-id="${x.id}" aria-label="행 삭제">×</button>`}</td></tr>`;
}
const duesCfg=()=>({fee:10000,start:'2026-01',...(S.dues.find(d=>d.id==='cfg')||{})});
const dueOf=(mid,y,mo)=>((S.dues.find(d=>d.id===`${y}-${mid}`)||{}).m||{})[mo];
function dueState(m,y,mo){const c=duesCfg();if(`${y}-${pad(mo)}`<(c.start||''))return 'na';return dueOf(m.id,y,mo)||'none'}
function duesPeople(Y){const ids=new Set(S.dues.filter(d=>Number(d.year)===Y).map(d=>d.memberId));const now=new Date().getFullYear();
  return S.members.filter(m=>!m.sample&&((isCur(m)&&(yearsOf(m).includes(Y)||Y===now))||ids.has(m.id))).sort((x,y)=>(x.name||'').localeCompare(y.name||'','ko'))}
// 모임 통장: 이월 잔액 + 회비(납부 체크 자동) + 정산 기록(행사·일반) 수입 − 지출
const bankCfg=Y=>S.dues.find(d=>d.id==='bank-'+Y)||{};
function duesIncome(Y){const fee=Number(duesCfg().fee)||0;const by=Array(12).fill(0);S.dues.filter(d=>Number(d.year)===Y&&d.memberId).forEach(d=>Object.entries(d.m||{}).forEach(([mo,v])=>{if(v==='paid'&&+mo>=1&&+mo<=12)by[+mo-1]+=fee}));return by}
function bankYear(Y){const du=duesIncome(Y);const mi=du.slice(),mo=Array(12).fill(0);const inc={},out={};const dT=du.reduce((x,y)=>x+y,0);if(dT)inc['회비']=dT;
  S.ledger.filter(x=>(x.date||'').startsWith(String(Y))).forEach(x=>{const m=+(x.date||'').slice(5,7)-1;const v=Number(x.amount)||0;if(!v)return;const k=x.cat||(x.kind==='in'?'기타 수입':'기타');
    if(x.kind==='in'){inc[k]=(inc[k]||0)+v;if(m>=0)mi[m]+=v}else{out[k]=(out[k]||0)+v;if(m>=0)mo[m]+=v}});
  const sum=o=>Object.values(o).reduce((x,y)=>x+y,0);return {inc,out,I:sum(inc),O:sum(out),mi,mo}}
function opening(Y,d=0){const c=bankCfg(Y);if(c.opening!==undefined&&c.opening!==null&&c.opening!=='')return Number(c.opening)||0;if(Y<=CLUB_Y||d>8)return 0;const p=bankYear(Y-1);return opening(Y-1,d+1)+p.I-p.O}
const LED_OUT=['코트 대여','식비','음료·간식','공·용품','상품·시상','교통','숙박','기타'];
const LED_IN=['참가비','회비 지원','후원','기타 수입'];
function ledSum(evId){const es=S.ledger.filter(x=>(x.eventId||'')===(evId||''));const inc=es.filter(x=>x.kind==='in').reduce((s,x)=>s+(Number(x.amount)||0),0);const out=es.filter(x=>x.kind!=='in').reduce((s,x)=>s+(Number(x.amount)||0),0);return {es,inc,out}}
function billYear(y){return Array.from({length:12},(_,i)=>{const o={charge:0,deduct:0,pending:0};satsIn(y,i).forEach(ds=>{const b=billOf(ds);if(b!=='none')o[b]++});return o})}

function bankHtml(Y){
  const B=bankYear(Y),op=opening(Y),cfg=bankCfg(Y),bal=op+B.I-B.O;const manual=cfg.opening!==undefined&&cfg.opening!==null&&cfg.opening!=='';
  const tot=B.I+B.O;const ip=tot?Math.round(B.I/tot*100):0;
  const brk=(o,T,cls)=>{const es=Object.entries(o).sort((x,y)=>y[1]-x[1]);const mx=Math.max(1,...es.map(e=>e[1]));return es.length?es.map(([k,v])=>`<div class="bk-row"><span class="bk-k">${h(k)}</span><div class="tr"><div class="fl ${cls}" style="width:${v/mx*100}%"></div></div><span class="num">${won(v)}</span><span class="num muted bk-p">${T?Math.round(v/T*100):0}%</span></div>`).join(''):'<div class="muted small">기록 없음</div>'};
  const now=new Date();const lastM=Y===now.getFullYear()?now.getMonth()+1:Y<now.getFullYear()?12:0;let run=op;
  const firstM=B.mi.concat().map((v,i)=>v||B.mo[i]).findIndex(Boolean);const mrows=firstM<0?'':Array.from({length:lastM},(_,i)=>{run+=B.mi[i]-B.mo[i];if(i<firstM)return '';return `<tr><td>${i+1}월</td><td class="num inc">${B.mi[i]?'+'+won(B.mi[i]):'–'}</td><td class="num out">${B.mo[i]?'-'+won(B.mo[i]):'–'}</td><td class="num${run<0?' neg':''}">${won(run)}</td></tr>`}).join('');
  const act=cfg.actual!==undefined&&cfg.actual!==null&&cfg.actual!=='';const diff=act?Number(cfg.actual)-bal:0;
  return `<section class="panel"><div class="panel-h"><div><h2>모임 통장</h2><div class="small muted">${Y}년 수입·지출 전체 흐름 · 회비는 납부 체크 기준 자동 집계 · 그 외 수입·지출은 행사 정산(행사 외 일반 포함) 기록 기준</div></div>${RO?'':'<button class="btn sm" data-act="bank-cfg">잔액 설정</button>'}</div>
    <div class="led-kpi bank-kpi"><div><span>${Y-1}년 이월 잔액${manual?'':' · 자동'}</span><b class="num">${won(op)}</b></div><div><span>${Y}년 수입</span><b class="num inc">+${won(B.I)}</b></div><div><span>${Y}년 지출</span><b class="num out">-${won(B.O)}</b></div><div class="bal"><span>현재 잔액 (장부 기준)</span><b class="num${bal<0?' neg':''}">${won(bal)}</b></div></div>
    ${act?`<div class="need${Math.abs(diff)>0?' warn':''}" style="margin-top:10px">통장 실잔액 <b>${won(cfg.actual)}</b>${cfg.actualAt?` (${fmtD(cfg.actualAt)} 확인)`:''} · 장부와 차이 <b>${diff===0?'없음':(diff>0?'+':'')+won(diff)}</b>${diff?' · 누락된 수입·지출 기록 확인 필요':''}</div>`:''}
    <div class="bk-ratio"><div class="bk-bar" role="img" aria-label="수입 ${ip}%, 지출 ${100-ip}%">${tot?`<i class="inc" style="width:${ip}%"></i><i class="out" style="width:${100-ip}%"></i>`:''}</div><div class="small muted">${tot?`수입 ${ip}% · 지출 ${100-ip}% · 수입 대비 지출 ${B.I?Math.round(B.O/B.I*100):0}%`:'기록된 수입·지출 없음'}</div></div>
    <div class="bk-grid2"><div><h3 class="bk-h">수입 구성 <span class="num muted">${won(B.I)}</span></h3>${brk(B.inc,B.I,'inc')}</div><div><h3 class="bk-h">지출 구성 <span class="num muted">${won(B.O)}</span></h3>${brk(B.out,B.O,'out')}</div></div>
    ${lastM?`<h3 class="bk-h" style="margin-top:16px">월별 흐름</h3><div class="xwrap"><table class="tbl ytbl bk-tbl"><thead><tr><th>월</th><th>수입</th><th>지출</th><th>월말 잔액</th></tr></thead><tbody><tr class="muted"><td>이월</td><td></td><td></td><td class="num">${won(op)}</td></tr>${mrows}</tbody></table></div>`:''}
    <p class="small muted" style="margin:10px 0 0;line-height:1.6">공 구입 등 행사와 무관한 지출은 행사 정산의 '행사 외 일반'에 기록 · 정기대관료는 정기대관 코트 정산의 분기별 '납부 기록'으로 반영 · ${Y+1}년 이월 잔액은 ${Y}년 말 잔액으로 자동 계산</p></section>`;
}
ACT['bank-cfg']=()=>{const Y=monY;const c=bankCfg(Y);const auto=(()=>{if(Y<=CLUB_Y)return 0;const p=bankYear(Y-1);return opening(Y-1)+p.I-p.O})();const fm=v=>v===undefined||v===null||v===''?'':Number(v).toLocaleString('ko-KR');
  openModal(`${Y}년 모임 통장 설정`,`<label class="f">${Y-1}년 이월 잔액 (원)<input class="in" inputmode="numeric" data-comma="1" name="opening" value="${fm(c.opening)}" placeholder="${Y<=CLUB_Y?'예: 500,000':'비우면 자동 '+auto.toLocaleString('ko-KR')}"></label>
  <p class="small muted" style="margin:0">${Y<=CLUB_Y?'모임 통장 시작 잔액 입력':'비워 두면 '+(Y-1)+'년 장부 잔액으로 자동 이월'}</p>
  <div class="grid2"><label class="f">통장 실잔액 (선택)<input class="in" inputmode="numeric" data-comma="1" name="actual" value="${fm(c.actual)}" placeholder="은행 앱 잔액"></label><label class="f">확인 날짜${calField(c.actualAt||ymd(today0()),{name:'actualAt'})}</label></div>
  <p class="small muted" style="margin:0">실잔액 입력 시 장부 잔액과 차이 표시. 차이가 있으면 누락된 기록 확인</p>`,
  fd=>put('dues','bank-'+Y,{opening:String(fd.opening||'').trim()===''?null:numOf(fd.opening),actual:String(fd.actual||'').trim()===''?null:numOf(fd.actual),actualAt:fd.actualAt||''}))};
ACT['rent-pay']=async t=>{const Y=+t.dataset.y,q=+t.dataset.q,amt=+t.dataset.amt;if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent=`${won(amt)} 지출 기록`;t.classList.add('pri');return}
  try{await put('ledger',uid(),{eventId:'',kind:'out',cat:'코트 대여',item:`${Y}년 ${q}분기 정기대관료`,amount:amt,payer:'회비 통장',memo:'',date:ymd(today0()),rentQ:`${Y}-${q}`,createdAt:Date.now()});toast(`${q}분기 대관료 지출 기록 완료`)}catch(e){}};
/* ---------- 정산 › 공 재고: 구매(몇 구짜리 몇 통) · 사용(몇 통 개봉, 쓴 공은 연습구로) · 연습구 조정 ----------
   balls 문서: {date,kind:'buy'|'use'|'prac',per(구),cans(통),price,toPrac,n(연습구 증감),note} */
const BALL_PER=[2,3,4];
function ballStock(){const st={};BALL_PER.forEach(p=>st[p]=0);let prac=0;
  (S.balls||[]).forEach(b=>{const per=+b.per||0,c=+b.cans||0;if(b.kind==='buy')st[per]=(st[per]||0)+c;else if(b.kind==='use'){st[per]=(st[per]||0)-c;if(b.toPrac)prac+=c*per}else if(b.kind==='prac')prac+=+b.n||0});
  return {st,prac}}
function ballsHtml(Y){const {st,prac}=ballStock();const rows=(S.balls||[]).slice().sort((x,y)=>(y.date||'').localeCompare(x.date||'')||(y.at||0)-(x.at||0));
  const yb=rows.filter(b=>b.kind==='buy'&&(b.date||'').startsWith(Y+''));const yu=rows.filter(b=>b.kind==='use'&&(b.date||'').startsWith(Y+''));
  const pers=BALL_PER.filter(p=>st[p]);const totalBalls=BALL_PER.reduce((s,p)=>s+st[p]*p,0);
  const line=b=>b.kind==='buy'?`<b>구매</b> ${b.per}구 ${b.cans}통${b.price?` · ${won(b.price)}`:''}`:b.kind==='use'?`<b>사용</b> ${b.per}구 ${b.cans}통 개봉${b.toPrac?` · 연습구 +${b.cans*b.per}`:''}`:`<b>연습구</b> ${(+b.n>0?'+':'')+b.n}개`;
  const PER_N=5;const shown=ballMore?rows:rows.slice(0,PER_N);
  return `<section class="panel balls"><div class="panel-h"><h2>공 재고</h2>${RO?'':`<div class="row"><button class="btn sm" data-act="ball-add" data-k="buy">구매</button><button class="btn sm" data-act="ball-add" data-k="use">사용</button><button class="btn sm" data-act="ball-add" data-k="prac">연습구 조정</button></div>`}</div>
    <div class="ball-sum"><div class="bs"><span class="l">새 공</span><b class="num">${pers.length?pers.map(p=>`${p}구 ${st[p]}통`).join(' · '):'0통'}</b><span class="small muted">총 ${totalBalls}구</span></div>
      <div class="bs"><span class="l">연습구</span><b class="num">${prac}개</b></div>
      <div class="bs"><span class="l">${Y}년</span><b class="num">구매 ${yb.reduce((s,b)=>s+(+b.cans||0),0)}통 · 사용 ${yu.reduce((s,b)=>s+(+b.cans||0),0)}통</b><span class="small muted">구매 금액 ${won(yb.reduce((s,b)=>s+(+b.price||0),0))}</span></div></div>
    ${BALL_PER.some(p=>st[p]<0)?'<p class="small" style="margin:8px 0 0;color:var(--warn)">재고가 음수인 종류가 있음 · 구매 기록 확인 필요</p>':''}
    <div class="list ball-list">${shown.length?shown.map(b=>`<div class="li${RO?'':' click'}" ${RO?'':`data-act="ball-edit" data-id="${b.id}"`}><span class="ball-dot bd-${b.kind}"></span><div class="grow"><div class="ttl">${line(b)}</div><div class="sub">${fmtD(b.date)}${b.note?' · '+h(b.note):''}</div></div></div>`).join(''):'<div class="muted small" style="padding:8px 0">기록 없음 · 구매부터 기록</div>'}</div>
    ${rows.length>PER_N?`<button class="btn sm ghost ev-more" data-act="ball-more">${ballMore?'접기':`기록 ${rows.length-PER_N}건 더 보기`}</button>`:''}</section>`}
let ballMore=false;ACT['ball-more']=()=>{ballMore=!ballMore;render()};
function ballForm(k,b={}){const per=`<label class="f">종류<select class="in" name="per">${BALL_PER.map(p=>`<option value="${p}"${(+b.per||3)===p?' selected':''}>${p}구짜리 (1통 ${p}개)</option>`).join('')}</select></label>`;
  const date=`<label class="f">날짜${calField(b.date||ymd(today0()),{name:'date',required:true})}</label>`;const note=`<label class="f">메모 (선택)<input class="in" name="note" value="${h(b.note||'')}" placeholder="${k==='buy'?'예: 던롭 포트 · 온라인 구매':k==='use'?'예: 정기모임 · MT':'예: 낡은 공 버림 · 기증'}"></label>`;
  if(k==='buy')return `<div class="grid2">${date}${per}</div><div class="grid2"><label class="f">수량 (통)<input class="in" name="cans" inputmode="numeric" data-selall="1" value="${h(b.cans||'')}" required></label><label class="f">금액 (원 · 선택)<input class="in" name="price" inputmode="numeric" data-comma="1" data-selall="1" value="${b.price?Number(b.price).toLocaleString('ko-KR'):''}"></label></div>${note}`;
  if(k==='use')return `<div class="grid2">${date}${per}</div><label class="f">개봉 수량 (통)<input class="in" name="cans" inputmode="numeric" data-selall="1" value="${h(b.cans||'')}" required></label><label class="check"><input type="checkbox" name="toPrac"${b.toPrac!==false?' checked':''}> 쓴 공은 연습구로 (통 × 구 수만큼 연습구 추가)</label>${note}`;
  return `${date}<div class="grid2"><label class="f">변경<select class="in" name="sign"><option value="-"${+b.n<0||b.n==null?' selected':''}>빼기 (버림 · 분실)</option><option value="+"${+b.n>0?' selected':''}>더하기 (기증 · 발견)</option></select></label><label class="f">개수<input class="in" name="n" inputmode="numeric" data-selall="1" value="${b.n?Math.abs(b.n):''}" required></label></div>${note}`}
const ballFromFd=(k,fd)=>{const o={kind:k,date:fd.date,note:(fd.note||'').trim()};if(k==='prac'){o.n=(fd.sign==='+'?1:-1)*numOf(fd.n)}else{o.per=+fd.per;o.cans=numOf(fd.cans);if(k==='buy')o.price=numOf(fd.price);else o.toPrac=!!fd.toPrac}return o};
const BALL_T={buy:'공 구매',use:'공 사용',prac:'연습구 조정'};
ACT['ball-add']=t=>{const k=t.dataset.k;openModal(BALL_T[k],ballForm(k),async fd=>{const o=ballFromFd(k,fd);if(k!=='prac'&&!o.cans){toast('수량 입력 필요');throw new Error('keep')}if(k==='prac'&&!o.n){toast('개수 입력 필요');throw new Error('keep')}
  await put('balls',uid(),{...o,at:Date.now()});toast(`${BALL_T[k]} 기록`);render()})};
ACT['ball-edit']=t=>{const b=(S.balls||[]).find(x=>x.id===t.dataset.id);if(!b)return;
  openModal(BALL_T[b.kind]+' 수정',ballForm(b.kind,b),async fd=>{const {id,...rest}=b;await put('balls',b.id,{...rest,...ballFromFd(b.kind,fd)});toast('수정 완료');render()},`<button type="button" class="btn danger" data-act="ball-del" data-id="${b.id}">삭제</button>`)};
ACT['ball-del']=async t=>{if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='한 번 더 누르면 삭제';return}await del('balls',t.dataset.id);closeModal();toast('기록 삭제');render()};
function viewMoney(){
  const Y=monY,M=monM;const cfg=duesCfg();const fee=Number(cfg.fee)||0;const ppl=duesPeople(Y);
  // ----- dues: month -----
  const cnt={paid:0,none:0,free:0,na:0};ppl.forEach(m=>cnt[dueState(m,Y,M)]++);
  const segBtns=(m,s)=>RO?`<span class="due-st ${s}">${s==='paid'?'납부':s==='free'?'면제':'미납'}</span>`:`<div class="seg due-seg">${[['paid','납부'],['none','미납']].concat(s==='free'?[['free','면제']]:[]).map(([v,l])=>`<button class="${s===v?'on '+v:''}" data-act="due-set" data-id="${m.id}" data-y="${Y}" data-m="${M}" data-v="${v==='none'?'':v}" aria-pressed="${s===v}">${l}</button>`).join('')}</div>`;
  const rows=ppl.map(m=>{const s=dueState(m,Y,M);return `<div class="due-row${isCur(m)?'':' dim'}"><div class="grow"><b>${h(m.name)}</b>${ST(m)!=='활동'?' '+stChip(m):''}</div>${s==='na'?'<span class="muted small">회비 시작 전</span>':segBtns(m,s)}</div>`}).join('')||'<div class="muted small" style="padding:12px 0">대상 회원 없음</div>';
  // ----- dues: year grid -----
  let yTot=0;
  const yRows=ppl.map(m=>{let n=0;const cells=Array.from({length:12},(_,i)=>{const v=dueState(m,Y,i+1);if(v==='paid')n++;return `<td class="dc ${v}${i+1===M?' cur':''}" data-act="mon-m" data-v="${i+1}" title="${i+1}월">${v==='paid'?'●':v==='free'?'면':v==='na'?'':'○'}</td>`}).join('');yTot+=n;
    return `<tr class="${isCur(m)?'':'dim'}"><th>${h(m.name)}</th>${cells}<td class="num">${n}</td><td class="num">${fee?won(n*fee):'–'}</td></tr>`}).join('');
  const colSum=Array.from({length:12},(_,i)=>ppl.filter(m=>dueState(m,Y,i+1)==='paid').length);
  const dues=`<section class="panel"><div class="panel-h"><div><h2>월 회비</h2><div class="small muted">월 ${won(fee)} · ${cfg.start?cfg.start.replace('-','년 ')+'월부터':''} · ${Y}년 누적 ${won(yTot*fee)}</div></div>${RO?'':'<button class="btn sm" data-act="due-cfg">회비 설정</button>'}</div>
    <div class="due-top"><div class="row"><button class="btn sm" data-act="mon-step" data-v="-1" aria-label="이전 달">‹</button><b class="due-mon">${Y}년 ${M}월</b><button class="btn sm" data-act="mon-step" data-v="1" aria-label="다음 달">›</button></div>
      <div class="chips"><span class="chip ok">납부 ${cnt.paid}</span><span class="chip warn">미납 ${cnt.none}</span>${cnt.free?`<span class="chip">면제 ${cnt.free}</span>`:''}<span class="chip court">${M}월 걷은 금액 ${won(cnt.paid*fee)}</span></div></div>
    <div class="due-list">${rows}</div>
    ${cnt.none&&!RO?`<details class="recruit" id="due-pv"${lsGet('sbpb-due-pv',false)?' open':''}><summary><span>미납 안내 문구 미리보기</span><span class="led-tg"><span class="tg-o">펼치기</span><span class="tg-c">접기</span> <i>▾</i></span></summary><pre class="rtext">${h(dueText())}</pre><button class="btn sm" data-act="due-copy">문구 복사</button></details>`:''}
    <details class="due-yr" id="due-yr"${lsGet('sbpb-due-yr',false)?' open':''}><summary><h3>${Y}년 납부 현황</h3><span class="led-tg"><span class="tg-o">펼치기</span><span class="tg-c">접기</span> <i>▾</i></span></summary>
    <div class="small muted" style="margin:0 0 8px">● 납부 · ○ 미납 · 면 면제 · 월 선택 시 해당 월 납부 체크로 이동</div>
    <div class="xwrap"><table class="dtbl"><thead><tr><th>이름</th>${Array.from({length:12},(_,i)=>`<td class="${i+1===M?'cur':''}">${i+1}</td>`).join('')}<td>횟수</td><td>금액</td></tr></thead><tbody>${yRows}</tbody>
    <tfoot><tr><th>합계</th>${colSum.map((n,i)=>`<td class="num${i+1===M?' cur':''}">${n||''}</td>`).join('')}<td class="num">${yTot}</td><td class="num">${fee?won(yTot*fee):'–'}</td></tr></tfoot></table></div></details></section>`;
  // ----- event ledger (accordion + editable sheet) -----
  const evs=S.events.filter(e=>(e.date||'').startsWith(String(Y))&&(e.type!=='개인대회'||ledSum(e.id).es.length)).sort((x,y)=>(y.date||'').localeCompare(x.date||''));
  if(ledOpen===null&&S.ledger.length){const f=evs.find(e=>ledSum(e.id).es.length);if(f)ledOpen=new Set([f.id])}
  const acc=(id,title,sub)=>{const s=ledSum(id);const open=!!ledOpen&&ledOpen.has(id);const ev=id?S.events.find(e=>e.id===id):null;const head=Number(ev&&ev.headcount)||0;
    const rows=(s.es.length?s.es.slice().sort((x,y)=>(x.createdAt||0)-(y.createdAt||0)):RO?[]:[{id:'new:'+(id||'gen'),draft:true,eventId:id,kind:'out',date:ev&&ev.date?ev.date:ymd(today0())}]).map(ledRow).join('');
    const byCat={};s.es.filter(x=>x.kind!=='in').forEach(x=>{const k=x.cat||'기타';byCat[k]=(byCat[k]||0)+(Number(x.amount)||0)});
    const body=open?`<div class="led-body"><div class="xwrap" data-ks="led-${id||'gen'}"><table class="lsheet"><thead><tr><th style="min-width:170px">항목</th><th style="width:112px">금액</th><th style="width:76px">구분</th><th style="width:110px">분류</th><th style="width:120px">결제·담당</th><th style="width:150px">날짜</th><th style="min-width:130px">메모</th><th style="width:40px"></th></tr></thead>
      <tbody>${rows||`<tr><td colspan="8" class="muted small" style="padding:12px;text-align:center">${RO?'기록 없음':'+ 행 추가 버튼으로 항목 입력'}</td></tr>`}</tbody>
      <tfoot><tr><td>잔액 (수입 − 지출)</td><td class="num${s.inc-s.out<0?' neg':''}">${won(s.inc-s.out)}</td><td colspan="6">수입 ${won(s.inc)} · 지출 ${won(s.out)}${head&&s.out?` · 1인당 ${won(Math.round(s.out/head))}`:''}${ev&&ev.budget?` · 예산 대비 ${Math.round(s.out/ev.budget*100)}%`:''}</td></tr></tfoot></table></div>
      ${RO?'':`<button class="btn led-add" data-act="led-row" data-id="${id}">+ 행 추가</button>`}
      ${Object.keys(byCat).length>1?`<div class="small muted" style="margin-top:8px">분류별 지출 · ${Object.entries(byCat).sort((x,y)=>y[1]-x[1]).map(([k,v])=>`${h(k)} ${won(v)}`).join(' · ')}</div>`:''}</div>`:'';
    return `<div class="led-acc${open?' open':''}"><div class="led-hd" data-act="led-tog" data-id="${id}" role="button" tabindex="0" aria-expanded="${open}"><div class="grow"><div class="ttl">${h(title)}</div><div class="sub">${sub}</div></div><div class="led-mini">${s.es.length?`<span class="num">-${won(s.out)}</span>${s.inc?`<span class="num inc">+${won(s.inc)}</span>`:''}`:'<span class="muted small">기록 없음</span>'}</div><span class="led-tg">${open?'접기':'펼치기'}<i aria-hidden="true">▾</i></span></div>${body}</div>`};
  const ledger=`<section class="panel" style="margin-top:16px"><div class="panel-h"><div><h2>행사 정산</h2><div class="small muted">행사 선택 시 펼쳐짐 · 칸에 바로 입력하면 자동 저장 · '+ 행 추가'로 줄 추가 · 표는 옆으로 밀어서 확인</div></div></div>
    <div class="led-accs">${evs.map(e=>acc(e.id,e.title,`${fmtD(e.date)} · ${h(e.type)}`)).join('')}${acc('','행사 외 일반','공·용품 구입 등 행사와 무관한 지출·수입')}</div>
    <datalist id="led-cats">${LED_OUT.concat(LED_IN).map(v=>`<option value="${v}">`).join('')}</datalist><datalist id="led-payers">${S.members.filter(m=>isStaff(m)&&isCur(m)).map(m=>`<option value="${h(m.name)}">`).join('')}<option value="총무 카드"><option value="회비 통장"></datalist></section>`;
  // ----- regular court quarterly -----
  const r=rentalInfo();const rfee=Number(r.fee)||0;const by=billYear(Y);
  const quarter=`<section class="panel" style="margin-top:16px"><div class="panel-h"><div><h2>정기대관 코트 정산</h2><div class="small muted">${h(r.name)} · 분기별 청구${rfee?` · 회당 ${won(rfee)}`:' · 회당 대관료는 코트 탭 대관 정보에서 입력'}</div></div><a href="#courts">코트 탭</a></div>
    <div class="xwrap"><table class="tbl ytbl"><thead><tr><th>분기</th><th>청구 회차</th><th>차감 (대체일 미사용)</th><th>대기 (예정·대체일 미정)</th><th>청구 금액</th><th>예상 금액</th><th>납부</th></tr></thead><tbody>${[0,1,2,3].map(q=>{const ms=by.slice(q*3,q*3+3);const t=k=>ms.reduce((n,o)=>n+o[k],0);return `<tr><td>${q+1}분기 <span class="muted small">${q*3+1}–${q*3+3}월</span></td><td class="num">${t('charge')}</td><td class="num${t('deduct')?'':' muted'}">${t('deduct')||'–'}</td><td class="num${t('pending')?'':' muted'}">${t('pending')||'–'}</td><td class="num">${rfee?won(t('charge')*rfee):'–'}</td><td class="num muted">${rfee?won((t('charge')+t('pending'))*rfee):'–'}</td><td>${(()=>{const pd=S.ledger.find(x=>x.rentQ===`${Y}-${q+1}`);if(pd)return `<span class="chip ok">납부 ${won(pd.amount)}</span>`;const amt=t('charge')*rfee;return RO||!amt?'<span class="muted small">–</span>':`<button class="btn sm" data-act="rent-pay" data-y="${Y}" data-q="${q+1}" data-amt="${amt}">납부 기록</button>`})()}</td></tr>`}).join('')}</tbody></table></div>
    <p class="small muted" style="margin:8px 0 0;line-height:1.6">청구: 사용 · 우천 취소 · 클럽 사정 취소(행사 대체·기타) · 미진행 · 코트 측 취소 후 대체일 사용. 차감: 코트 측 취소 후 대체일 미사용(비용 없음). 대기: 예정 회차 및 대체일 미정·예정 회차</p></section>`;
  return `<div class="page-head"><div><h1>정산</h1><p>월 회비 납부 · 행사 비용 · 정기대관 분기 정산 · 공 재고</p></div><div class="row"><button class="btn sm" data-act="mon-y" data-v="-1" aria-label="이전 해">‹</button><b class="num" style="font-size:16px">${Y}년</b><button class="btn sm" data-act="mon-y" data-v="1" aria-label="다음 해">›</button></div></div>
  ${bankHtml(Y)}${dues}${ledger}${quarter}${ballsHtml(Y)}`;
}
ACT['mon-y']=t=>{monY+=+t.dataset.v;render()};
ACT['mon-m']=t=>{monM=+t.dataset.v;render();const l=$('.due-top');l&&l.scrollIntoView({behavior:'smooth',block:'start'})};
ACT['mon-step']=t=>{let m=monM+(+t.dataset.v);if(m<1){m=12;monY--}if(m>12){m=1;monY++}monM=m;render()};
ACT['due-set']=async t=>{const {id,y,m,v}=t.dataset;const did=`${y}-${id}`;const cur=S.dues.find(d=>d.id===did);const mm={...((cur&&cur.m)||{})};if(v)mm[m]=v;else delete mm[m];
  t.closest('.seg').querySelectorAll('button').forEach(b=>{const on=b===t;b.className=on?'on '+(b.dataset.v||'none'):'';b.setAttribute('aria-pressed',String(on))});
  try{await put('dues',did,{year:+y,memberId:id,m:mm})}catch(e){render()}};
ACT['due-cfg']=()=>{const c=duesCfg();openModal('회비 설정',`<div class="grid2"><label class="f">월 회비 (원)<input class="in" inputmode="numeric" data-comma="1" name="fee" value="${h(Number(c.fee||0).toLocaleString('ko-KR'))}" required></label><label class="f">회비 시작 월${wheelField(c.start,'start','ym','회비 시작 월')}</label></div><p class="small muted" style="margin:0">시작 월 이전은 납부 대상에서 제외</p>`,fd=>put('dues','cfg',{fee:numOf(fd.fee),start:fd.start||''}))};
function dueText(){const Y=monY,M=monM;const fee=Number(duesCfg().fee)||0;const un=duesPeople(Y).filter(m=>isCur(m)&&dueState(m,Y,M)==='none');
  return `[SBPB ${M}월 회비 안내]\n${M}월 회비 ${won(fee)} 미납 확인 부탁드립니다 🙏\n${un.map(m=>m.name).join(', ')}`}
document.addEventListener('toggle',e=>{if(e.target.id==='due-pv')lsSet('sbpb-due-pv',e.target.open);if(e.target.id==='due-yr')lsSet('sbpb-due-yr',e.target.open)},true);
ACT['due-copy']=async()=>{const txt=dueText();
  try{await navigator.clipboard.writeText(txt);toast('미납 안내 문구 복사 완료')}catch(e){openModal('미납 안내 문구',`<textarea class="in" rows="5" readonly>${h(txt)}</textarea><p class="small muted" style="margin:0">문구 칸을 길게 눌러 복사</p>`,async()=>{})}};
// ledger entries
function ledForm(x={}){
  const evs=S.events.filter(e=>e.date).sort((p,q)=>(q.date||'').localeCompare(p.date||'')).slice(0,60);
  return `<div class="f">구분<div class="cbchips">${[['out','지출'],['in','수입']].map(([v,l])=>`<label><input type="radio" name="kind" value="${v}"${(x.kind||'out')===v?' checked':''}>${l}</label>`).join('')}</div></div>
  <div class="grid2"><label class="f">행사<select class="in" name="eventId"><option value="">행사 외 일반</option>${evs.map(e=>`<option value="${e.id}"${(x.eventId||'')===e.id?' selected':''}>${h(fmtD(e.date)+' '+e.title)}</option>`).join('')}</select></label>
  <label class="f">날짜<input class="in" type="date" name="date" required value="${h(x.date||'')}"></label></div>
  <div class="grid2"><label class="f">분류<input class="in" name="cat" list="led-cats" value="${h(x.cat||'')}" placeholder="예: 식비, 코트 대여"></label>
  <label class="f">금액 (원)<input class="in" type="number" inputmode="numeric" min="0" step="1" name="amount" required value="${h(x.amount??'')}"></label></div>
  <label class="f">내용<input class="in" name="item" value="${h(x.item||'')}" placeholder="예: 뒤풀이 식사, 공 2박스"></label>
  <label class="f">결제·담당 (선택)<input class="in" name="payer" list="led-payers" value="${h(x.payer||'')}" placeholder="예: 총무 카드, 홍길동 선결제"></label>
  <label class="f">메모 (선택)<input class="in" name="memo" value="${h(x.memo||'')}" placeholder="영수증, 환급 여부 등"></label>
  <datalist id="led-cats">${LED_OUT.concat(LED_IN).map(v=>`<option value="${v}">`).join('')}</datalist><datalist id="led-payers">${S.members.filter(m=>isStaff(m)&&isCur(m)).map(m=>`<option value="${h(m.name)}">`).join('')}<option value="총무 카드"><option value="회비 통장"></datalist>`;
}
const ledFromFd=(fd,old={})=>({...old,kind:fd.kind==='in'?'in':'out',eventId:fd.eventId||'',date:fd.date,cat:(fd.cat||'').trim()||(fd.kind==='in'?'기타 수입':'기타'),item:(fd.item||'').trim(),amount:Math.max(0,Math.round(Number(fd.amount)||0)),payer:(fd.payer||'').trim(),memo:(fd.memo||'').trim()});
ACT['led-go']=t=>{const id=t.dataset.id;if(ledOpen===null)ledOpen=new Set();ledOpen.add(id);lsSet('sbpb-led-open',[...ledOpen]);const e=S.events.find(x=>x.id===id);if(e&&e.date)monY=+e.date.slice(0,4)};
ACT['led-tog']=t=>{const id=t.dataset.id;if(ledOpen===null)ledOpen=new Set();ledOpen.has(id)?ledOpen.delete(id):ledOpen.add(id);lsSet('sbpb-led-open',[...ledOpen]);render()};
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('led-hd')){e.preventDefault();e.target.click()}});
ACT['led-row']=async t=>{const ev=t.dataset.id||'';const e=ev?S.events.find(x=>x.id===ev):null;const id=uid();ledFocus=id;
  try{await put('ledger',id,{eventId:ev,kind:'out',date:e&&e.date?e.date:ymd(today0()),cat:'',item:'',amount:0,payer:'',memo:'',createdAt:Date.now()})}catch(err){ledFocus=null}};
document.addEventListener('change',async e=>{const t=e.target;if(!t.dataset||!t.dataset.led)return;
  await new Promise(r=>setTimeout(r,0)); // let focus move to the next cell first so a re-render keeps it
  const k=t.dataset.led;let v=t.value;
  if(String(t.dataset.id).startsWith('new:')){const ae=document.activeElement;const nk=ae&&ae.dataset&&ae.dataset.id===t.dataset.id?ae.dataset.led:null;
    if(k==='amount')v=numOf(v);else if(k==='kind')v=v==='in'?'in':'out';else v=String(v).trim();if(!v&&k!=='kind'&&k!=='date'&&!ledDraft[t.dataset.id])return;
    await ledCreate(t.dataset.id,{[k]:v},nk,nk&&ae.value!==undefined&&ae.tagName!=='BUTTON'?ae.value:null);return}
  if(k==='amount')v=numOf(v);else if(k==='kind')v=v==='in'?'in':'out';else v=String(v).trim();
  const x=S.ledger.find(y=>y.id===t.dataset.id);if(x&&String(x[k]??'')===String(v)){if(k==='amount')t.value=v?v.toLocaleString('ko-KR'):'';return}
  await setLed(t.dataset.id,k,v)});
document.addEventListener('focusin',e=>{const t=e.target;if(t.dataset&&t.dataset.led==='amount'&&t.value)t.value=t.value.replace(/[^\d]/g,'')});
document.addEventListener('focusout',e=>{const t=e.target;if(t.dataset&&t.dataset.led==='amount'&&t.value){const n=parseInt(t.value.replace(/[^\d]/g,''),10);if(n)t.value=n.toLocaleString('ko-KR')}});
MONEY_AFTER=()=>{if(ledFocus){const isNew=typeof ledFocus==='string';const fo=isNew?{id:ledFocus,k:'item'}:ledFocus;const el=document.getElementById(`lf-${fo.id}-${fo.k||'item'}`);if(el){ledFocus=null;if(fo.val!=null)el.value=fo.val;el.focus();if(isNew)el.scrollIntoView({block:'center',behavior:'smooth'})}}};
// draft row ("new:<event>") → real entry
// a draft row turns into one real entry; later edits that still reach the draft (fast typing, removed inputs) go to that entry
const ledDraft={},ledPending={};
async function ledCreate(draftId,fields,nextK,nextVal){
  if(ledDraft[draftId]){const id=ledDraft[draftId];for(const [k,v] of Object.entries(fields))await setLed(id,k,v);return id}
  const evKey=draftId.slice(4);const ev=evKey==='gen'?'':evKey;const e=ev?S.events.find(x=>x.id===ev):null;const id=uid();ledDraft[draftId]=id;
  ledFocus=nextK?{id,k:nextK,val:nextVal}:null;
  const doc={eventId:ev,kind:'out',date:e&&e.date?e.date:ymd(today0()),cat:'',item:'',amount:0,payer:'',memo:'',createdAt:Date.now(),...fields};ledPending[id]=doc;
  try{await put('ledger',id,doc)}catch(err){ledFocus=null;delete ledDraft[draftId]}return id}
async function setLed(id,k,v){if(String(id).startsWith('new:'))return ledCreate(id,{[k]:v});const x=S.ledger.find(y=>y.id===id)||(ledPending[id]&&{id,...ledPending[id]});if(!x||String(x[k]??'')===String(v))return;if(ledPending[id])ledPending[id]={...ledPending[id],[k]:v};try{await put('ledger',id,{...x,[k]:v})}catch(err){}}
// in-place picker (분류 · 결제·담당): opens right under the cell
function closeCellPop(){const p=$('#cellpop');if(p)p.remove()}
ACT['cp-open']=t=>{const was=$('#cellpop');if(was&&was.dataset.for===t.id){closeCellPop();return}closeCellPop();
  const id=t.dataset.id,k=t.dataset.k;const x=S.ledger.find(y=>y.id===id)||{kind:'out'};const cur=(x[k]||'');
  const used=[...new Set(S.ledger.map(y=>y[k]).filter(Boolean))];
  const base=k==='cat'?(x.kind==='in'?LED_IN:LED_OUT):S.members.filter(m=>isStaff(m)&&isCur(m)).map(m=>m.name).concat(['총무 카드','회비 통장','개인 선결제']);
  const opts=[...new Set(base.concat(used.filter(v=>k!=='cat'||!(x.kind==='in'?LED_OUT:LED_IN).includes(v))))];
  const p=document.createElement('div');p.id='cellpop';p.className='cellpop';p.dataset.for=t.id;p.setAttribute('role','listbox');
  p.innerHTML=`${opts.map(o=>`<button type="button" role="option" data-act="cp-pick" data-v="${h(o)}" aria-selected="${o===cur}">${h(o)}</button>`).join('')}<div class="cp-in"><input id="cp-txt" placeholder="직접 입력" value="${opts.includes(cur)?'':h(cur)}" autocomplete="off"><button type="button" class="btn sm pri" data-act="cp-pick" data-custom="1">확인</button></div>${cur?'<button type="button" class="cp-clear" data-act="cp-pick" data-v="">비우기</button>':''}`;
  p._ctx={id,k};document.body.appendChild(p);
  placeCellPop();t.setAttribute('aria-expanded','true')};
function placeCellPop(){const p=$('#cellpop');if(!p)return;const t=document.getElementById(p.dataset.for);if(!t){closeCellPop();return}
  p.style.maxHeight='none';const want=Math.min(p.scrollHeight,320);const below=makeRoom(t,Math.min(want,POP_MIN));const r=t.getBoundingClientRect();
  const w=Math.max(r.width,190);const left=Math.max(8,Math.min(r.left,innerWidth-w-8));
  p.style.width=w+'px';p.style.left=left+'px';p.style.maxHeight=Math.max(120,Math.min(320,below))+'px';p.style.top=(r.bottom+4)+'px'}
ACT['cp-pick']=t=>{const p=$('#cellpop');if(!p)return;const {id,k}=p._ctx;let v=t.dataset.custom?($('#cp-txt').value||'').trim():t.dataset.v;closeCellPop();setLed(id,k,v)};
document.addEventListener('keydown',e=>{if(e.target.id==='cp-txt'&&e.key==='Enter'){e.preventDefault();const b=$('#cellpop [data-custom]');b&&b.click()}if(e.key==='Escape')closeCellPop()});
document.addEventListener('click',e=>{if($('#cellpop')&&!e.target.closest('#cellpop')&&!e.target.closest('[data-act="cp-open"]'))closeCellPop()},true);
window.addEventListener('scroll',e=>{const p=$('#cellpop');if(!p||(e.target&&e.target.nodeType===1&&p.contains(e.target)))return;placeCellPop()},true);
window.addEventListener('resize',placeCellPop);if(window.visualViewport)visualViewport.addEventListener('resize',placeCellPop);
window.addEventListener('hashchange',closeCellPop);
ACT['led-del']=t=>{if(!t.dataset.confirm){t.dataset.confirm='1';t.textContent='삭제?';t.classList.add('on');setTimeout(()=>{if(document.body.contains(t)){delete t.dataset.confirm;t.textContent='×';t.classList.remove('on')}},3000);return}del('ledger',t.dataset.id)};
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('led-it')){e.preventDefault();e.target.click()}});

/* ---------- boot ---------- */
function viewSettings(){
  return `<div class="page-head"><div><h1>설정</h1><p>앱 정보 · 업데이트 기록 · 데이터 관리</p></div></div>
  <div class="set-grid">
  <section class="panel"><div class="panel-h"><h2>앱 정보</h2></div>
    <div class="set-row"><span>현재 버전</span><b>${h(APP_V())}</b></div>
    <div class="set-row"><span>마지막 업데이트</span><b>${NEWS.length?fmtFull(NEWS[0].date):'-'}</b></div>
    ${mode==='db'?`<div class="set-acts"><button class="btn" data-act="backup-open">데이터 백업</button>${art?`<button class="btn" data-act="pub-open">공개본 갱신${pendingCount()?` (${pendingCount()})`:''}</button>`:''}${WEB?`<button class="btn ghost" data-act="web-logout">로그아웃</button>`:''}</div>`:''}
    ${WEB&&mode==='ro'?`<div class="set-acts"><button class="btn" data-act="web-login">운영진 로그인</button></div>`:''}
  </section>
  <section class="panel"><div class="panel-h"><h2>업데이트 기록</h2><span class="small muted">버전별 · 최신 순 · 같은 날 배포는 한 버전</span></div><div id="verwrap">${verBox()}</div></section>
  </div>`}
const VIEWS={home:viewHome,members:viewMembers,draw:viewDraw,events:viewEvents,courts:viewCourts,money:viewMoney,settings:viewSettings};
const AFTER={};
let posterZoom='fit';
function fitPoster(){fitIn($('#stage'))}
function resetScale(p){p.style.zoom='';p.style.transform='';p.style.marginRight='';p.style.marginBottom=''}
function fitIn(st){const p=st&&st.querySelector('.poster');if(!p)return;resetScale(p);if(posterZoom!=='fit')return;const avail=st.clientWidth-parseFloat(getComputedStyle(st).paddingLeft)*2;const w=p.offsetWidth,hh=p.offsetHeight;const sc=Math.min(1,avail/w);if(sc<1){p.style.transformOrigin='0 0';p.style.transform=`scale(${sc})`;p.style.marginRight=`${-(w*(1-sc))}px`;p.style.marginBottom=`${-(hh*(1-sc))}px`}}
AFTER.draw=fitPoster;
AFTER.money=()=>MONEY_AFTER&&MONEY_AFTER();
/* ---------- content zoom: pinch scales the page body only, header stays fixed ---------- */
let cz=(()=>{const v=Number(lsGet('sbpb-zoom',1));return v>=0.8&&v<=1.8?v:1})();
const clampZ=v=>Math.round(Math.min(1.8,Math.max(0.8,v))*100)/100;
function applyZoom(v,show){cz=clampZ(v);const m=$('#view');if(m)m.style.zoom=cz===1?'':String(cz);lsSet('sbpb-zoom',cz);if(show)zoomPill();clearTimeout(applyZoom.t);applyZoom.t=setTimeout(()=>{if(route==='draw')fitPoster()},120)}
function zoomPill(){let p=$('#zoompill');if(!p){p=document.createElement('div');p.id='zoompill';p.className='zoompill';document.body.appendChild(p)}
  p.innerHTML=`<span class="num">${Math.round(cz*100)}%</span>${cz!==1?'<button data-act="zoom-reset">원래대로</button>':''}`;p.classList.add('on');clearTimeout(zoomPill.t);zoomPill.t=setTimeout(()=>p.classList.remove('on'),1800)}
ACT['zoom-reset']=()=>applyZoom(1,true);
(function(){let d0=0,z0=1,raf=0,pend=null;
  const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
  const inMain=e=>!!(e.target&&e.target.closest&&e.target.closest('#view'))&&!$('#modal-root').innerHTML&&!$('#wheel')&&!$('#dp-back');
  document.addEventListener('touchstart',e=>{if(e.touches.length===2&&inMain(e)){d0=dist(e.touches);z0=cz}},{passive:true});
  document.addEventListener('touchmove',e=>{if(e.touches.length===2&&d0){e.preventDefault();pend=z0*dist(e.touches)/d0;if(!raf)raf=requestAnimationFrame(()=>{raf=0;if(pend!=null)applyZoom(pend,true)})}},{passive:false});
  document.addEventListener('touchend',e=>{if(e.touches.length<2)d0=0},{passive:true});
  // iOS Safari: block the native page zoom gesture so only the body scales
  ['gesturestart','gesturechange'].forEach(t=>document.addEventListener(t,e=>{if(inMain(e)||e.target===document||e.target===document.body)e.preventDefault()},{passive:false}));
  // desktop trackpad pinch (ctrl+wheel) behaves the same way
  document.addEventListener('wheel',e=>{if(e.ctrlKey&&inMain(e)){e.preventDefault();applyZoom(cz*(1-e.deltaY*0.01),true)}},{passive:false});
})();
let rzT;window.addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{if(route==='draw')fitPoster()},150)});
ACT['zoom-toggle']=()=>{posterZoom=posterZoom==='fit'?'full':'fit';render()};
/* ---------- data backup ---------- */
ACT['backup-open']=()=>{
  const n=COLS.reduce((s,c)=>s+S[c].length,0);
  $('#modal-root').innerHTML=`<div class="ov" data-act="ov-close"><div class="modal" role="dialog" aria-modal="true" aria-label="데이터 백업"><div class="m-head"><h2>데이터 백업</h2><button type="button" class="modal-x" data-act="close-modal" aria-label="닫기">×</button></div>
  <p class="small muted" style="margin:0 0 14px;line-height:1.6">현재 저장된 전체 데이터 ${n}건 다운로드. 엑셀은 회원·게스트·행사·메모·정기모임 기록·대진표·코트를 시트별로 정리, 전체 데이터(.json)는 복원·이전용 원본</p>
  <div class="bk-grid"><button class="bk" data-act="bk-xlsx"><b>엑셀 (.xlsx)</b><span>명단 확인·인쇄·공유용</span></button><button class="bk" data-act="bk-json"><b>전체 데이터 (.json)</b><span>복원·웹앱 이전용 원본</span></button></div>
  ${WEB?`<button class="bk" data-act="data-import" style="margin-top:10px;width:100%;box-sizing:border-box"><b>데이터 가져오기 (.json)</b><span>백업 파일 또는 이전 운영실에서 받은 전체 데이터 복원</span></button>`:''}
  <p class="small muted" style="margin:12px 0 0">정기적인 백업 권장 (예: 월 1회)</p></div></div>`;
  lockPage();
};
const stamp=()=>{const d=new Date();return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`};
async function saveFile(name,data){
  if(!dl){toast('이 화면에서는 파일 다운로드 불가');return false}
  try{await dl.save({filename:name,data});toast('백업 파일 저장 완료');return true}catch(e){if(e&&e.code==='declined')return false;toast('파일 저장 실패. 잠시 후 재시도 필요');return false}
}
ACT['bk-json']=async()=>{const data={};COLS.forEach(c=>data[c]=S[c]);const blob=new Blob([JSON.stringify({app:'SBPB 운영실',version:1,exportedAt:new Date().toISOString(),data},null,1)],{type:'application/json'});if(await saveFile(`SBPB_백업_${stamp()}.json`,blob))closeModal()};
function loadXLSX(){return new Promise((res,rej)=>{if(window.XLSX)return res(window.XLSX);const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=()=>res(window.XLSX);s.onerror=rej;document.head.appendChild(s)})}
ACT['bk-xlsx']=async t=>{
  t.disabled=true;let X;try{X=await loadXLSX()}catch(e){t.disabled=false;toast('엑셀 도구 불러오기 실패. 전체 데이터(.json) 백업 권장');return}
  const mn=id=>memberById(id)?.name||'';const yn=v=>v?'O':'';
  const sheets={
    '회원':S.members.slice().sort((x,y)=>(x.name||'').localeCompare(y.name||'')).map((m,i)=>({'No.':i+1,'이름':m.name,'성별':m.gender==='M'?'남':'여','생년월일':m.birth||'','나이':m.birth?ageOf(m.birth):'','레벨':m.level??'','테니스 시작':m.since||'','구력':career(m.since),'전화번호':fmtPhone(m.phone),'거주지':areaLabel(m.district),'직장':areaLabel(m.work),'상태':ST_LABEL[ST(m)]||ST(m),'등록 연도':yearsOf(m).join(', '),'운영진':yn(isStaff(m)),'직책':staffRole(m),'운영진 임기':Object.keys(staffMap(m)).sort().map(y=>`${y}${staffMap(m)[y]?' '+staffMap(m)[y]:''}`).join(', '),'가입일':m.joined||'','메모':m.memo||''})),
    '게스트':S.guests.map((g,i)=>({'No.':i+1,'이름':g.name,'닉네임':g.nick||'','성별':g.gender==='M'?'남':'여','레벨':g.level??'모름','초대 회원':mn(g.inviter),'방문 횟수':g.visits||0,'최근 방문':g.lastDate||'','구력':g.career||'','연락 경로':g.contact||'','메모':g.memo||''})),
    '행사':S.events.slice().sort((x,y)=>(x.date||'').localeCompare(y.date||'')).map(e=>({'날짜':e.date||'','종료일':e.endDate||'','종류':e.type,'제목':e.title,'상태':e.status||'','장소':e.place||'','담당':e.owner||'','예상 인원':e.headcount||'','확정 인원':(e.confirmed||[]).map(nameOf).concat((e.confirmedExtra||[]).map(cfxName)).join(', '),'예산':e.budget||'','취소 사유':e.cancelReason||'','취소 메모':e.cancelNote||'','출전':(e.entrants||[]).map(mn).join(', '),'외부 파트너':ptNames(e).join(', '),'부문':e.division||'','종목':e.category||'','결과':e.result||'','응원':(e.cheer||[]).map(mn).join(', '),'개요':e.desc||''})),
    '메모':S.notes.slice().sort((x,y)=>(x.createdAt||0)-(y.createdAt||0)).map(n=>({'행사':S.events.find(e=>e.id===n.eventId)?.title||'(삭제된 행사)','분류':NOTE_KIND[n.color]||'메모','내용':n.text,'작성일':n.createdAt?new Date(n.createdAt).toLocaleDateString('ko-KR'):''})),
    '정기모임 기록':S.regstat.slice().sort((x,y)=>x.id.localeCompare(y.id)).map(r=>({'날짜':r.id,'상태':r.status==='삭제'?'미진행':'취소','사유':r.reason||'','메모':r.note||'','대체일':isCourtCx(r)?(r.mkDate||'미정'):'','대체 시간':isCourtCx(r)&&r.mkDate?`${r.mkStart||REG.start}–${r.mkEnd||REG.end}`:'','대체일 상태':isCourtCx(r)?mkState(r):''})),
    '대진표':S.brackets.slice().sort((x,y)=>(x.cfg?.date||'').localeCompare(y.cfg?.date||'')).map(b=>({'날짜':b.cfg?.date||'','제목':b.cfg?.title||'','상태':b.status,'참석 인원':Object.keys(b.players||{}).length,'타임 수':(b.rounds||[]).length,'참석자':Object.values(b.players||{}).map(p=>dn(p.name)+(p.guest?'(G)':'')).join(', ')})),
    '회비':S.dues.filter(d=>d.id!=='cfg'&&d.memberId).sort((x,y)=>(x.year-y.year)||(memberById(x.memberId)?.name||'').localeCompare(memberById(y.memberId)?.name||'')).map(d=>{const o={'연도':d.year,'이름':memberById(d.memberId)?.name||'(삭제된 회원)'};for(let i=1;i<=12;i++){const v=(d.m||{})[i];o[i+'월']=v==='paid'?'O':v==='free'?'면제':''}o['납부 횟수']=Object.values(d.m||{}).filter(v=>v==='paid').length;return o}),
    '행사 정산':S.ledger.slice().sort((x,y)=>(x.date||'').localeCompare(y.date||'')).map(x=>({'날짜':x.date||'','행사':x.eventId?(S.events.find(e=>e.id===x.eventId)?.title||'(삭제된 행사)'):'행사 외 일반','구분':x.kind==='in'?'수입':'지출','분류':x.cat||'','내용':x.item||'','금액':Number(x.amount)||0,'결제·담당':x.payer||'','메모':x.memo||''})),
    '코트':S.courts.map(c=>({'이름':c.name,'지역':c.district||'','주소':c.address||'','예약 링크':c.url||'','일반 오픈':ruleText(c.genRule),'주민 우선':yn(c.resident),'주민 오픈':c.resident?ruleText(c.resRule):'','요금':feeText(c),'메모':c.memo||''})),
  };
  const r=rentalInfo();if(S.rentals.length)sheets['정기대관']=[{'코트':r.name,'주소':r.address||'','면 수':r.courts,'회당 대관료':r.fee,'계약 시작':r.from||'','계약 종료':r.to||'','담당·연락처':r.contact||'','메모':r.memo||''}];
  const wb=X.utils.book_new();
  Object.entries(sheets).forEach(([name,rows])=>{const ws=X.utils.json_to_sheet(rows.length?rows:[{'':'데이터 없음'}]);if(rows.length){ws['!cols']=Object.keys(rows[0]).map(k=>({wch:Math.min(40,Math.max(6,k.length*2,...rows.map(r=>String(r[k]??'').length+2)))}))}X.utils.book_append_sheet(wb,ws,name)});
  const buf=X.write(wb,{type:'array',bookType:'xlsx'});t.disabled=false;
  if(await saveFile(`SBPB_백업_${stamp()}.xlsx`,new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})))closeModal();
};


/* ---------- web app: operator login, operator accounts, data import ---------- */
ACT['web-login']=()=>{if(WEB)window.SBPB_WEB.login().catch(e=>toast('로그인 실패. 잠시 후 재시도 필요'))};
ACT['web-logout']=async()=>{if(!WEB)return;await window.SBPB_WEB.logout();location.reload()};
ACT['admin-open']=async()=>{if(!WEB)return;let list=[];try{list=await window.SBPB_WEB.getAdmins()}catch(e){}const me=window.SBPB_WEB.user();
  openModal('운영진 계정',`<p class="small muted" style="margin:0;line-height:1.6">구글 로그인 시 수정 권한을 받는 이메일 목록. 한 줄에 하나씩 입력. 대표 계정(${h(window.SBPB_WEB.SUPER)})은 항상 포함</p>
  <label class="f">운영진 이메일<textarea class="in" name="emails" rows="7" placeholder="name@gmail.com">${h(list.join('\n'))}</textarea></label>
  <p class="small muted" style="margin:0">현재 로그인: ${h(me&&me.email||'')}</p>`,
  async fd=>{const em=[...new Set(String(fd.emails||'').split(/[\s,;]+/).map(s=>s.trim().toLowerCase()).filter(s=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)))];await window.SBPB_WEB.saveAdmins(em);toast(`운영진 ${em.length}명 저장 완료`)},
  `<button type="button" class="btn ghost" data-act="web-logout">로그아웃</button>`)};
/* 지난 대진표 기록 가져오기: 이름으로 회원·게스트를 찾아 연결, 못 찾은 이름은 이름 그대로 보관(미등록) */
const ARCH_GUESS={'남복':'M','여복':'F','남단':'M','여단':'F'};
function nameIndex(){const ix={};S.members.forEach(m=>{if(m.name&&!ix[m.name])ix[m.name]={key:m.id,name:m.name,gender:m.gender,level:Number(m.level)||3,guest:false}});
  S.guests.forEach(g=>{const p={key:g.id,name:g.name,gender:g.gender,level:Number(g.level)||3,guest:true};[g.name,...String(g.nick||'').split(/\s*,\s*/)].forEach(n=>{if(n&&!ix[n])ix[n]=p})});return ix}
async function archiveImport(list,people={}){const ix=nameIndex();const plan=[],skipRain=[],skipHas=[];
  for(const e of list){const ds=e.date;const rs=regStat(ds);
    if(rs&&rs.status==='취소'&&/우천/.test(rs.reason||'')){skipRain.push(ds);continue}
    if(S.brackets.some(b=>b.cfg&&b.cfg.date===ds&&!b.archive)){skipHas.push(ds);continue}
    plan.push(e)}
  if(!plan.length){alert(`가져올 대진 없음${skipRain.length?`\n우천 취소일 제외: ${skipRain.join(', ')}`:''}${skipHas.length?`\n이미 대진표 있음: ${skipHas.join(', ')}`:''}`);return}
  if(!confirm(`지난 대진표 ${plan.length}건을 기록으로 가져옵니다.${skipRain.length?`\n우천 취소일 제외: ${skipRain.join(', ')}`:''}${skipHas.length?`\n이미 대진표가 있어 제외: ${skipHas.join(', ')}`:''}\n진행할까요?`))return;
  let done=0;const unknown=new Set();
  for(const e of plan){const players={};
    const key=(n,t)=>{if(!n)return null;const p=ix[n];if(p){players[p.key]={name:p.name,gender:p.gender,level:p.level,guest:p.guest};return p.key}
      const k='n:'+n;unknown.add(n);if(!players[k])players[k]={name:n,gender:people[n]||'',level:3,guest:true,unreg:true};if(!players[k].gender&&ARCH_GUESS[t])players[k].gender=ARCH_GUESS[t];return k};
    const rounds=e.rounds.map(R=>({matches:R.matches.map(m=>{const all=[...m.a,...m.b].every(x=>!x);const o={a:m.a.map(n=>key(n,m.t)),b:m.b.map(n=>key(n,m.t))};if(!all&&m.t)o.t=m.t;return o}),rest:R.rest.map(n=>key(n)),...(R.time?{time:R.time}:{})}));
    const first=(e.rounds[0]||{}).time;const start=first?first.split('–')[0].padStart(5,'0'):'09:30';
    try{await put('brackets','arch-'+e.date,{cfg:{title:'SBPB 정기모임',date:e.date,place:REG.place,start,end:'12:00',mins:30,courtList:[1,2,3].map(i=>({name:`코트 ${i}`,pref:''}))},players,rounds,status:'확정',archive:true,allowBlank:!!e.blank,createdBy:myId||null});done++}catch(err){}}
  alert(`대진 기록 가져오기 완료 ${done}건${skipRain.length?`\n우천 취소일 제외: ${skipRain.join(', ')}`:''}${skipHas.length?`\n이미 대진표가 있어 제외: ${skipHas.join(', ')}`:''}${unknown.size?`\n\n회원·게스트 목록에 없는 이름 ${unknown.size}명 (대진표 › 대진 히스토리 › 미등록 이름에서 확인)`:''}`);render()}
/* 회원 정보(생년월일 · 거주지) 파일: 이름으로 찾아 빈 칸은 채우고, 이미 다른 값이 있으면 목록으로 보여주고 고른 것만 변경 */
/* 대진표가 없는 정기모임: 출석 투표 기록으로 출석만 저장 (attend 컬렉션, 문서 id = 날짜) */
function attendImport(days){const ix=nameIndex();const plan=[],skipB=[],skipCx=[],unknown=new Set();
  days.forEach(d=>{const rs=regStat(d.date);if(rs&&(rs.status==='취소'||rs.status==='삭제')){skipCx.push(d.date);return}
    if(pastBrackets().some(b=>b.cfg.date===d.date)){skipB.push(d.date);return}
    const keys=[...new Set(d.names.map(n=>{const p=ix[n];if(!p)unknown.add(n);return p?p.key:'n:'+n}))];plan.push({date:d.date,keys,names:d.names})});
  const body=`${plan.length?`<div class="mi-list">${plan.map(p=>`<div><b>${fmtD(p.date)}</b> 출석 ${p.keys.length}명</div>`).join('')}</div>`:'<p class="small muted">저장할 날짜 없음</p>'}
    ${skipB.length?`<p class="small muted" style="margin:12px 0 0">대진 기록이 있어 제외(대진 기록 사용): ${skipB.map(fmtD).join(', ')}</p>`:''}
    ${skipCx.length?`<p class="small muted" style="margin:8px 0 0">취소된 날이라 제외: ${skipCx.map(fmtD).join(', ')}</p>`:''}
    ${unknown.size?`<p class="small" style="margin:8px 0 0">회원 · 게스트 목록에 없는 이름 (미등록으로 저장): ${[...unknown].map(h).join(', ')}</p>`:''}`;
  openModal('출석 기록 가져오기',body,async()=>{let n=0;for(const p of plan){try{await put('attend',p.date,{date:p.date,keys:p.keys,names:p.names,src:'vote',at:Date.now()});n++}catch(e){}}toast(`출석 기록 ${n}일 저장`);render()})}
function memberInfoImport(rows){const F={birth:'생년월일',district:'거주지'};const fmt=(k,v)=>k==='birth'?fmtBirth(v):areaLabel(v);
  const fill=[],diff=[],same=[],miss=[];
  rows.forEach(r=>{const m=S.members.find(x=>x.name===r.name);if(!m){miss.push(r.name);return}
    Object.keys(F).forEach(k=>{const v=String(r[k]||'').trim();if(!v)return;const cur=String(m[k]||'').trim();
      if(!cur)fill.push({m,k,v});else if(cur!==v)diff.push({m,k,v,cur});else same.push(1)})});
  const body=`${diff.length?`<h3 style="font-size:14px;margin:0 0 6px">앱 값과 다른 항목 ${diff.length}건</h3><p class="small muted" style="margin:0 0 8px">체크한 항목만 파일 값으로 변경 · 체크하지 않으면 앱 값 유지</p>
      <div class="mi-list">${diff.map((x,i)=>`<label class="check"><input type="checkbox" data-mi="${i}"> <span><b>${h(x.m.name)}</b> ${F[x.k]}: 앱 ${h(fmt(x.k,x.cur))} <span class="muted">→</span> 파일 ${h(fmt(x.k,x.v))}</span></label>`).join('')}</div>`:'<p class="small muted" style="margin:0">앱 값과 다른 항목 없음</p>'}
    ${miss.length?`<h3 style="font-size:14px;margin:16px 0 6px">회원 목록에 없는 이름 ${miss.length}명</h3><p class="small" style="margin:0">${miss.map(h).join(', ')}</p>`:''}
    <details class="mi-fill" style="margin-top:16px"><summary class="small"><b>빈 칸 입력 ${fill.length}건</b> <span class="muted">· 이미 같은 값 ${same.length}건 · 저장 시 입력</span></summary>${fill.length?`<div class="mi-list" style="margin-top:8px">${fill.map(x=>`<div><b>${h(x.m.name)}</b> ${F[x.k]} <span class="muted">→</span> ${h(fmt(x.k,x.v))}</div>`).join('')}</div>`:''}</details>`;
  openModal('회원 정보 가져오기',body,async()=>{const pick=[...document.querySelectorAll('#mform [data-mi]:checked')].map(e=>diff[+e.dataset.mi]);
    const by={};fill.concat(pick).forEach(x=>{(by[x.m.id]=by[x.m.id]||{m:x.m,ch:{}}).ch[x.k]=x.v});
    let n=0;for(const {m,ch} of Object.values(by)){const {id,...rest}=m;try{await put('members',id,{...rest,...ch});n++}catch(e){}}
    toast(`회원 ${n}명 정보 반영 · 입력 ${fill.length}건${pick.length?` · 변경 ${pick.length}건`:''}`);render()})}
ACT['data-import']=()=>{const inp=document.createElement('input');inp.type='file';inp.accept='application/json,.json';
  inp.onchange=async()=>{const f=inp.files&&inp.files[0];if(!f)return;let j;try{j=JSON.parse(await f.text())}catch(e){toast('JSON 파일 읽기 실패');return}
    if(j&&Array.isArray(j.archive)){closeModal();await archiveImport(j.archive,j.people||{});return}
    if(j&&j.kind==='memberinfo'&&Array.isArray(j.members)){closeModal();memberInfoImport(j.members);return}
    if(j&&j.kind==='attendance'&&Array.isArray(j.days)){closeModal();attendImport(j.days);return}
    if(j&&j.kind==='eventbracket'&&Array.isArray(j.rounds)){closeModal();eventBracketImport(j);return}
    if(j&&j.kind==='tourney'&&Array.isArray(j.groups)){closeModal();tourneyImport(j);return}
    const data=j&&j.data?j.data:j;const cols=COLS.filter(c=>Array.isArray(data[c]));const n=cols.reduce((s,c)=>s+data[c].length,0);
    if(!n){toast('가져올 데이터 없음');return}
    if(!confirm(`${n}건을 가져옵니다. 같은 항목은 파일 내용으로 덮어씀. 진행할까요?`))return;
    closeModal();let done=0;toast(`가져오는 중… 0/${n}`);
    for(const c of cols)for(const d of data[c]){if(!d||!d.id)continue;const {id,...rest}=d;try{await put(c,String(id),rest)}catch(e){}done++;if(done%20===0)toast(`가져오는 중… ${done}/${n}`)}
    if(art){toast(`가져오기 완료 ${done}건. 공개본 갱신 필요`);setTimeout(()=>ACT['pub-open'](),1200)}else toast(`가져오기 완료 ${done}건`)};
  inp.click()};

/* ---------- public snapshot: automatic refresh ----------
   Operators' changes reach signed-out visitors only through the encrypted snapshot.
   It is refreshed automatically when the operator leaves the app (tab hidden) or after
   3 idle minutes with unpublished changes, using the key derived at password entry. */
let autoPubBusy=false,lastAct=Date.now();
['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,()=>{lastAct=Date.now()},{passive:true,capture:true}));
async function autoPublish(why){
  if(mode!=='db'||!art||autoPubBusy||!PUB.snap||!pendingCount())return;
  if(loaded.size<COLS.length)return;
  const s=lsGet('sbpb-k',null);if(!s||s.salt!==PUB.snap.salt)return;
  autoPubBusy=true;
  try{const key=await importKey(s.k);const data={};COLS.forEach(c=>data[c]=S[c]);const enc=await encryptJSON(data,key);
    await savePub({v:1,pw:PW_HASH,snap:{salt:s.salt,iv:enc.iv,ct:enc.ct,at:Date.now()}})}
  catch(e){if(e&&(e.code==='not_writer'||e.code==='not_granted'))art=null}
  autoPubBusy=false;
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')autoPublish('hidden')});
setInterval(()=>{const busy=$('#modal-root').innerHTML||$('#wheel')||$('#daypop')||$('#slotmenu')||(document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName));if(!busy&&Date.now()-lastAct>180000)autoPublish('idle')},30000);

/* ---------- public snapshot: publish / password change ---------- */
ACT['pub-open']=()=>{
  if(mode!=='db')return;
  if(!art){toast('이 화면에서는 공개본 갱신 불가');return}
  const at=PUB.snap&&PUB.snap.at;
  openModal('보기 전용 공개본 갱신',`<p class="small" style="margin:0;line-height:1.65">운영진이 아닌 회원은 비밀번호 입력 후 <b>공개본</b> 열람. 공개본은 비밀번호로 암호화되어 페이지에 저장. 갱신 시 열려 있는 모든 화면이 새 버전으로 다시 열림</p>
  <div class="need">${at?`마지막 갱신 ${new Date(at).toLocaleString('ko-KR')} · 이후 변경 <b>${pendingCount()}건</b>`:'공개본 없음. 첫 갱신 이후 로그인 없이 열람 가능'}</div>
  <label class="f">현재 비밀번호<input class="in" type="password" name="cur" required autocomplete="current-password"></label>
  <label class="check"><input type="checkbox" name="chg" id="pw-chg"> 비밀번호 변경 (운영진 교체·인수인계 시)</label>
  <div id="pw-new" class="grid2" hidden><label class="f">새 비밀번호 (6자 이상)<input class="in" type="password" name="np1" autocomplete="new-password"></label><label class="f">새 비밀번호 확인<input class="in" type="password" name="np2" autocomplete="new-password"></label></div>`,doPublish);
  const b=$('#mform button[type=submit]');if(b)b.textContent='공개본 갱신';
};
document.addEventListener('change',e=>{if(e.target.id==='pw-chg'){const n=$('#pw-new');if(n)n.hidden=!e.target.checked}});
async function doPublish(fd){
  if(sha256(fd.cur)!==PW_HASH){toast('현재 비밀번호 불일치');throw 0}
  let pw=fd.cur,hash=PW_HASH,salt=PUB.snap&&PUB.snap.salt;
  if(fd.chg){if(!fd.np1||fd.np1.length<6){toast('새 비밀번호는 6자 이상 필요');throw 0}if(fd.np1!==fd.np2){toast('새 비밀번호 불일치');throw 0}pw=fd.np1;hash=sha256(pw);salt=null}
  if(!salt)salt=u8b64(crypto.getRandomValues(new Uint8Array(16)));
  const b=$('#mform button[type=submit]');if(b){b.disabled=true;b.textContent='암호화 중…'}
  const key=await deriveKey(pw,salt);
  const data={};COLS.forEach(c=>data[c]=S[c]);
  const enc=await encryptJSON(data,key);
  const pub={v:1,pw:hash,snap:{salt,iv:enc.iv,ct:enc.ct,at:Date.now()}};
  lsSet('sbpb-k',{salt,k:await exportKey(key)});touchAuth();
  try{await savePub(pub);toast(WEB?'공개본 갱신 완료':'공개본 갱신 완료. 새 버전으로 다시 열림');if(WEB&&fd.chg)setTimeout(()=>location.reload(),900)}
  catch(e){if(b){b.disabled=false;b.textContent='공개본 갱신'}const c=e&&e.code;toast(c==='not_writer'||c==='not_granted'||c==='not_declared'?'공개본 갱신은 편집 권한(Editor) 보유 운영진만 가능':c==='conflict'?'다른 운영진이 먼저 갱신. 새 버전으로 다시 열림':c==='too_large'?'데이터 용량 초과로 갱신 실패':'공개본 갱신 실패. 잠시 후 재시도 필요');throw e}
}

/* ---------- password gate ---------- */
function sha256(str){
  const K=[];for(let n=2;K.length<64;n++){let pr=true;for(let d=2;d*d<=n;d++)if(n%d===0){pr=false;break}if(pr)K.push((Math.cbrt(n)%1)*4294967296|0)}
  const by=new TextEncoder().encode(str),l=by.length,buf=new Uint8Array(((l+9+63)>>6)<<6);buf.set(by);buf[l]=0x80;
  const dv=new DataView(buf.buffer);dv.setUint32(buf.length-4,(l*8)>>>0);dv.setUint32(buf.length-8,Math.floor(l*8/4294967296));
  let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];const W=new Uint32Array(64);const rr=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let i=0;i<buf.length;i+=64){
    for(let t=0;t<16;t++)W[t]=dv.getUint32(i+t*4);
    for(let t=16;t<64;t++){const s0=rr(W[t-15],7)^rr(W[t-15],18)^(W[t-15]>>>3),s1=rr(W[t-2],17)^rr(W[t-2],19)^(W[t-2]>>>10);W[t]=(W[t-16]+s0+W[t-7]+s1)|0}
    let [a,b,c,d,e,f,g,k]=H;
    for(let t=0;t<64;t++){const t1=(k+(rr(e,6)^rr(e,11)^rr(e,25))+((e&f)^(~e&g))+K[t]+W[t])|0,t2=((rr(a,2)^rr(a,13)^rr(a,22))+((a&b)^(a&c)^(b&c)))|0;k=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0}
    H=H.map((v,j)=>(v+[a,b,c,d,e,f,g,k][j])|0);
  }
  return H.map(v=>(v>>>0).toString(16).padStart(8,'0')).join('');
}
const PW_HASH=PUB.pw||'dd22dd5735108da693b2670257ccbdeda6686e87923a7d18bcf452b95a91d71c';
const IDLE_MS=2*60*60*1000;
let memSeen=0,started=false,lastTouch=0;
function lastSeen(){try{const v=localStorage.getItem('sbpb-auth-seen');return v?Number(v):memSeen}catch(e){return memSeen}}
function touchAuth(){const n=Date.now();memSeen=n;lastTouch=n;try{localStorage.setItem('sbpb-auth-seen',String(n))}catch(e){}}
const authed=()=>{if(WEB)return true;const t=lastSeen();return t>0&&Date.now()-t<IDLE_MS};
function lock(msg){memSeen=0;snapKey=null;try{localStorage.removeItem('sbpb-auth-seen');localStorage.removeItem('sbpb-k')}catch(e){}$('#gate-err').textContent=msg||'';document.body.classList.add('locked');closeModal();$('#gate').hidden=false;$('#gate-pw').value='';setTimeout(()=>$('#gate-pw').focus(),50)}
function unlock(){touchAuth();document.body.classList.remove('locked');$('#gate').hidden=true;render();if(!started){started=true;boot()}else if(mode==='ro')enterRO()}
$('#gate-form').addEventListener('submit',async e=>{e.preventDefault();const v=$('#gate-pw').value;
  if(WEB){const sb=$('#gate-form button[type=submit]');sb.disabled=true;sb.textContent='확인 중…';const err=await window.SBPB_WEB.loginPw(v);sb.disabled=false;sb.textContent='입장하기';if(err){$('#gate-err').textContent=err;$('#gate-pw').select()}return}if(sha256(v)===PW_HASH){$('#gate-err').textContent='';
    if(PUB.snap){const sb=$('#gate-form button[type=submit]');sb.disabled=true;sb.textContent='여는 중…';try{snapKey=await deriveKey(v,PUB.snap.salt);lsSet('sbpb-k',{salt:PUB.snap.salt,k:await exportKey(snapKey)})}catch(err){}sb.disabled=false;sb.textContent='입장하기'}
    unlock()}else{$('#gate-err').textContent='비밀번호 불일치. 다시 입력 필요';$('#gate-pw').select()}});
$('#gate-eye').addEventListener('click',()=>{const i=$('#gate-pw');const show=i.type==='password';i.type=show?'text':'password';$('#gate-eye').textContent=show?'숨기기':'보기'});
['click','keydown','touchstart','scroll'].forEach(ev=>document.addEventListener(ev,()=>{if(document.body.classList.contains('locked'))return;if(Date.now()-lastTouch>60000){if(!authed()){lock();return}touchAuth()}},{passive:true,capture:true}));
setInterval(()=>{if(!document.body.classList.contains('locked')&&!authed())lock()},60000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&!document.body.classList.contains('locked')&&!authed())lock()});
/* web app: password gate → signs in to the shared operator account on Firebase (checked by the server) */
function showWebGate(msg){document.body.classList.add('locked');$('#gate').hidden=false;
  const p=$('#gate-form > p');if(p)p.textContent='하루 1회 비밀번호 재입력 필요';
  $('#gate-err').textContent=msg||'';$('#gate-pw').value='';setTimeout(()=>$('#gate-pw').focus(),50)}
// sign-in lasts for the day it was made: a new date asks for the password again
const loginDay=()=>{try{return localStorage.getItem('sbpb-login-day')||''}catch(e){return ''}};
async function webGate(){let st={u:null,ok:false};try{st=await Promise.race([window.SBPB_WEB.state(),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),9000))])}catch(e){showWebGate(e&&e.message==='timeout'?'로그인 확인 지연. 비밀번호 다시 입력 필요':'');return}
  if(st.ok&&loginDay()!==ymd(new Date())){try{await window.SBPB_WEB.logout()}catch(e){}showWebGate('하루 1회 비밀번호 재입력 필요');return}
  if(!st.ok){showWebGate(st.u?'이 계정은 운영진으로 등록되어 있지 않음':'');return}
  document.body.classList.remove('locked');$('#gate').hidden=true;render();if(!started){started=true;boot()}}
if(WEB){webGate();setInterval(()=>{if(!document.body.classList.contains('locked')&&loginDay()!==ymd(new Date()))window.SBPB_WEB.logout().then(()=>location.reload())},60000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&!document.body.classList.contains('locked')&&loginDay()!==ymd(new Date()))window.SBPB_WEB.logout().then(()=>location.reload())})}
else if(authed()&&(!PUB.snap||((lsGet('sbpb-k',null)||{}).salt===PUB.snap.salt)))unlock();else lock();
