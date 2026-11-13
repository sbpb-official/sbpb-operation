# SBPB 운영실

사방팔방(SBPB) 테니스 클럽 운영 웹앱. 회원·대진표·이벤트·코트·정산 관리.

- 주소: https://sbpb-official.github.io/sbpb-operation/
- 저장소: Firebase (Firestore + Google 로그인, 무료 Spark 요금제)
- 운영진: 구글 로그인 후 수정 (대표 계정 + 앱의 '운영진 계정'에 등록된 이메일)
- 일반 회원: 비밀번호로 공개본(암호화) 열람

## 구조
- `src/` 원본 소스 (`app.js`, `style.css`, `shell.html`, `head.html`, `web-shim.js`)
- `tools/build.py` 빌드: `python3 tools/build.py web` → `index.html`, `app.js` 생성
- `firestore.rules` Firestore 보안 규칙 (Firebase 콘솔 > Firestore > 규칙에 붙여넣기)

같은 `src/app.js`로 Claude 아티팩트 버전도 빌드 가능: `python3 tools/build.py artifact --pub <공개본.json> --out <파일.html>`
