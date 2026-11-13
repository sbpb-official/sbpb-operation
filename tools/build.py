"""Build SBPB 운영실 from src/.

  python3 tools/build.py web
      → index.html + app.js at the repository root (GitHub Pages, Firebase backend)
  python3 tools/build.py artifact --pub PUB.json --out OUT.html
      → single-file page for the Claude artifact (encrypted snapshot embedded)

Both targets run the same src/app.js. In the web build, src/web-shim.js connects
Firebase and exposes it to the app as window.claude / window.SBPB_WEB.
"""
import hashlib, json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
head = (SRC / 'head.html').read_text()
css = (SRC / 'style.css').read_text()
shell = (SRC / 'shell.html').read_text()
app = (SRC / 'app.js').read_text()

js = lambda s: json.dumps(s, ensure_ascii=False).replace('</', '<\\/')
assert app.count('"__HEAD__"') == 1 and app.count('"__SHELL__"') == 1
app = app.replace('"__HEAD__"', js(head)).replace('"__SHELL__"', js(shell))
assert '</script' not in app.lower(), 'literal </script inside app'


def artifact(pub_path, out_path):
    p = json.dumps(json.load(open(pub_path)), ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
    out = head + '<style id="css">\n' + css + '\n</style>\n<script type="application/json" id="sbpb-pub">' + p + '</script>\n<script id="app">\n' + app + '</script>\n'
    pathlib.Path(out_path).write_text(out)
    print('artifact', out_path, len(out))


def web():
    # base styles the artifact host normally provides (taken from the app's own page skeleton)
    skel = re.search(r"const SKEL='(.*?)';", app).group(1)
    base = re.search(r'<style>(.*?)</style>', skel).group(1)
    shim = (SRC / 'web-shim.js').read_text()
    (ROOT / 'app.js').write_text(app)
    ver = hashlib.sha1(app.encode()).hexdigest()[:10]
    shim = shim.replace('__APP_SRC__', f'app.js?v={ver}')
    page = f'''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#094027">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="SBPB 운영실">
<meta name="robots" content="noindex">
<link rel="manifest" href="manifest.json">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-192.png">
{head}<style>{base}</style>
<style id="css">
{css}
</style>
</head>
<body>
<div id="boot-msg" style="min-height:100vh;display:flex;align-items:center;justify-content:center;font:14px system-ui,sans-serif;color:#6E6A5E;background:#F9F4EB">불러오는 중…</div>
<script type="module">
{shim}
</script>
</body>
</html>
'''
    (ROOT / 'index.html').write_text(page)
    print('web index.html', len(page), 'app.js', len(app), 'v', ver)


if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else 'web'
    if target == 'web':
        web()
    elif target == 'artifact':
        a = sys.argv[2:]
        artifact(a[a.index('--pub') + 1], a[a.index('--out') + 1])
    else:
        sys.exit('target: web | artifact')
