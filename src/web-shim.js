// Firebase backend for the standalone web app.
// Exposes the same small interface the app uses inside the Claude artifact (window.claude.use(...)),
// plus window.SBPB_WEB for login, operator accounts and the encrypted public snapshot.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, collection, doc, setDoc, deleteDoc, getDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Firebase web config: public identifiers, safe to ship in the page (access is enforced by firestore.rules)
const firebaseConfig = {
  apiKey: 'AIzaSyAjinew5QBRwESUq9YpTJPPMYkT6dRuIWQ',
  authDomain: 'sbpb-95e00.firebaseapp.com',
  projectId: 'sbpb-95e00',
  storageBucket: 'sbpb-95e00.firebasestorage.app',
  messagingSenderId: '950304660445',
  appId: '1:950304660445:web:96bb61c81d64cffcec3434'
};
const SUPER = 'sbpb.official@gmail.com';   // club account: always an operator (must match firestore.rules)
const STAFF = 'staff@sbpb-official.github.io';
const MEMBER = 'member@sbpb-official.github.io';   // shared member login: read-only member view (must match firestore.rules)   // shared operator login: the site password is this account's password (must match firestore.rules)

const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
let fs;
// ignoreUndefinedProperties: an empty optional field must never make a save fail
try { fs = initializeFirestore(fbApp, { ignoreUndefinedProperties: true, localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }); }
catch (e) { fs = initializeFirestore(fbApp, { ignoreUndefinedProperties: true }); }

// member view: a second Firebase app keeps the member sign-in separate from the operator sign-in
const mApp = initializeApp(firebaseConfig, 'member');
const mAuth = getAuth(mApp);
const mFs = initializeFirestore(mApp, { ignoreUndefinedProperties: true });
const mReady = new Promise(res => { const un = onAuthStateChanged(mAuth, u => { un(); res(u); }); });
const authErr = e => {
  const c = e && e.code || '';
  if (c === 'auth/too-many-requests') return '시도 횟수 초과. 잠시 후 재시도 필요';
  if (c === 'auth/network-request-failed') return '인터넷 연결 확인 필요';
  if (c === 'auth/operation-not-allowed' || c === 'auth/configuration-not-found') return '로그인 설정 미완료. 관리자 확인 필요';
  if (c === 'auth/weak-password') return '비밀번호 6자 이상 필요';
  return '비밀번호 불일치. 다시 입력 필요';
};

getRedirectResult(auth).catch(() => {});
let currentUser = null;
const authReady = new Promise(res => { const un = onAuthStateChanged(auth, u => { currentUser = u; un(); res(u); }); });

const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const markLogin = () => { try { localStorage.setItem('sbpb-login-day', today()); } catch (e) {} };
const withTimeout = (p, ms, fallback) => Promise.race([p, new Promise(r => setTimeout(() => r(fallback), ms))]);

async function adminList() {
  const s = await getDoc(doc(fs, 'config', 'admins'));
  return s.exists() ? (s.data().emails || []) : [];
}
let adminP = null;
function adminState() {
  return adminP || (adminP = authReady.then(async u => {
    if (!u || !u.email) return { u, ok: false };
    const email = u.email.toLowerCase();
    let ok = email === SUPER || email === STAFF;
    if (!ok) { try { ok = (await adminList()).map(x => String(x).toLowerCase()).includes(email); } catch (e) { ok = false; } }
    if (ok) setDoc(doc(fs, 'profiles', u.uid), { name: u.displayName || email.split('@')[0], email, at: Date.now() }).catch(() => {});
    return { u, ok };
  }));
}

const dbCap = {
  collection: col => ({
    doc: id => ({
      set: body => setDoc(doc(fs, col, id), body),
      delete: () => deleteDoc(doc(fs, col, id))
    }),
    onSnapshot: (next, err) => onSnapshot(collection(fs, col), { includeMetadataChanges: true }, s => next({ docs: s.docs, metadata: s.metadata }), err)
  })
};

function saveFile({ filename, data }) {
  const url = URL.createObjectURL(data);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return Promise.resolve();
}

window.claude = {
  use: async cap => {
    const st = await adminState();
    if (cap === 'db') return st.ok ? dbCap : null;
    if (cap === 'user') return st.u ? {
      can: async () => st.ok,
      id: async () => st.u.uid,
      profiles: async ids => {
        const out = {};
        await Promise.all(ids.map(async id => { try { const s = await getDoc(doc(fs, 'profiles', id)); if (s.exists()) out[id] = { name: s.data().name }; } catch (e) {} }));
        return out;
      }
    } : null;
    if (cap === 'downloads') return { save: saveFile };
    if (cap === 'artifact') return null;   // web app: no public copy, operators only
    return null;
  }
};

const inApp = /KAKAOTALK|Instagram|FBAN|FBAV|NAVER|Line\//i.test(navigator.userAgent);
window.SBPB_WEB = {
  SUPER,
  user: () => currentUser,
  state: adminState,
  async login() {
    if (/KAKAOTALK/i.test(navigator.userAgent)) { location.href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(location.href); return; }
    if (inApp) { alert('앱 안의 브라우저에서는 구글 로그인이 막혀 있습니다. 메뉴에서 "다른 브라우저로 열기"(Safari·Chrome) 후 로그인해 주세요.'); return; }
    const provider = new GoogleAuthProvider(); provider.setCustomParameters({ prompt: 'select_account' });
    try { await signInWithPopup(auth, provider); markLogin(); location.reload(); }
    catch (e) {
      if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) return signInWithRedirect(auth, provider);
      if (e && (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request')) return;
      throw e;
    }
  },
  logout: () => signOut(auth),
  async loginPw(pw) {
    try { await signInWithEmailAndPassword(auth, STAFF, pw); markLogin(); location.reload(); return ''; }
    catch (e) {
      const c = e && e.code || '';
      if (c === 'auth/too-many-requests') return '시도 횟수 초과. 잠시 후 재시도 필요';
      if (c === 'auth/network-request-failed') return '인터넷 연결 확인 필요';
      if (c === 'auth/operation-not-allowed' || c === 'auth/configuration-not-found') return '로그인 설정 미완료. 관리자 확인 필요';
      return '비밀번호 불일치. 다시 입력 필요';
    }
  },
  member: {
    ready: () => mReady,
    user: () => mAuth.currentUser,
    async login(pw) { try { await signInWithEmailAndPassword(mAuth, MEMBER, pw); return ''; } catch (e) { return authErr(e); } },
    logout: () => signOut(mAuth),
    db: { collection: col => ({ onSnapshot: (next, err) => onSnapshot(collection(mFs, col), { includeMetadataChanges: true }, s => next({ docs: s.docs, metadata: s.metadata }), err) }) },
    roster: (next, err) => onSnapshot(doc(mFs, 'pub', 'roster'), s => next(s.exists() ? s.data() : null), err),
    // operators only: current member password is kept in an operator-only document
    async info() { const s = await getDoc(doc(fs, 'secure', 'member')); return s.exists() ? s.data() : null; },
    async setPassword(pw, oldPw) {
      try {
        const cur = await getDoc(doc(fs, 'secure', 'member'));
        const old = oldPw || (cur.exists() ? cur.data().pw : '');
        if (!old) {
          try { await createUserWithEmailAndPassword(mAuth, MEMBER, pw); }
          catch (e) { if (e && e.code === 'auth/email-already-in-use') return 'need-old'; throw e; }
        } else {
          await signInWithEmailAndPassword(mAuth, MEMBER, old);
          await updatePassword(mAuth.currentUser, pw);
        }
        await setDoc(doc(fs, 'secure', 'member'), { pw, at: Date.now() });
        return '';
      } catch (e) { return authErr(e); }
    }
  },
  saveRoster: data => setDoc(doc(fs, 'pub', 'roster'), data),
  getAdmins: adminList,
  saveAdmins: emails => setDoc(doc(fs, 'config', 'admins'), { emails, at: Date.now() }),
  savePub: pub => setDoc(doc(fs, 'public', 'snapshot'), pub)
};

// auto-update: the home-screen app can keep an old page alive; check for a newer build and reload when idle
const CUR_APP = '__APP_SRC__';
function busy() {
  const ae = document.activeElement;
  return !!((document.getElementById('modal-root') || {}).innerHTML || document.getElementById('wheel') || document.getElementById('daypop') || document.getElementById('cellpop') ||
    (ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName)));
}
let updating = false;
async function checkUpdate() {
  if (updating || document.visibilityState !== 'visible') return;
  try {
    const html = await (await fetch(location.pathname + '?check=' + Date.now(), { cache: 'no-store' })).text();
    const m = html.match(/app\.js\?v=([0-9a-f]+)/);
    if (!m || CUR_APP.endsWith(m[1])) return;
    updating = true;
    const go = () => location.replace(location.pathname + '?u=' + m[1] + location.hash);
    const wait = () => { if (!busy()) go(); else setTimeout(wait, 5000); };
    wait();
  } catch (e) {}
}
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkUpdate(); });
setInterval(checkUpdate, 120000);
setTimeout(checkUpdate, 15000);

// load the encrypted public snapshot, then start the app
(async () => {
  window.SBPB_PUB = {};   // operators read live data after Google sign-in; no public copy
  const m = document.getElementById('boot-msg'); if (m) m.remove();
  const sc = document.createElement('script'); sc.id = 'app'; sc.src = '__APP_SRC__';
  sc.onerror = () => { document.body.insertAdjacentHTML('afterbegin', '<p style="padding:24px;font:14px system-ui">앱을 불러오지 못했습니다. 새로고침해 주세요.</p>'); };
  document.body.appendChild(sc);
})();
