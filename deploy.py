#!/usr/bin/env python3
"""Deploy tomperwear ke Vercel: upload per-file (/v2/files) lalu create deployment."""
import os, json, hashlib, urllib.request, urllib.error, time

ROOT = os.path.expanduser("~/workspace/tomperwear")
TOKEN = open('/home/hatch/.config/vercel/token').read().strip()
PRJ = 'prj_USmc8yFhQSnwCccHtQXs2C7e4h9M'

SKIP_DIRS = {'node_modules', '.git', 'build', '__pycache__'}
SKIP_FILES = {'.DS_Store', 'deploy.py', '.last-deploy.json'}

def api(method, path, data=None, headers=None):
    h = {'Authorization': f'Bearer {TOKEN}'}
    if headers:
        h.update(headers)
    if data is not None and 'Content-Type' not in h:
        h['Content-Type'] = 'application/json'
    req = urllib.request.Request(f'https://api.vercel.com{path}', data=data, headers=h, method=method)
    try:
        r = urllib.request.urlopen(req, timeout=120)
        return r.status, json.load(r) if 'json' in r.headers.get('Content-Type', '') else r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:800]

# 1. kumpulkan file
entries = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    # root/public = output build (jangan diupload); web/public & admin/public = source CRA (wajib ikut)
    skip = set(SKIP_DIRS)
    if os.path.abspath(dirpath) == os.path.abspath(ROOT):
        skip.add('public')
    dirnames[:] = [d for d in dirnames if d not in skip]
    for fn in filenames:
        if fn in SKIP_FILES or fn.endswith('.log'):
            continue
        fp = os.path.join(dirpath, fn)
        entries.append((os.path.relpath(fp, ROOT), fp))
print(f'{len(entries)} files')

# 2. upload tiap file -> sha
files = []
for i, (rel, fp) in enumerate(entries):
    with open(fp, 'rb') as f:
        data = f.read()
    digest = hashlib.sha1(data).hexdigest()
    st, resp = api('POST', '/v2/files', data=data, headers={
        'Content-Type': 'application/octet-stream', 'x-vercel-digest': digest})
    if st == 200:
        files.append({'file': rel, 'sha': digest})  # /v2/files balikin {} — sha = digest yg dikirim
    else:
        print(f'UPLOAD FAIL {rel}: {st} {resp}')
    if (i + 1) % 50 == 0:
        print(f'  {i+1}/{len(entries)} uploaded')
print(f'uploaded {len(files)}/{len(entries)}')

# 3. create deployment
body = json.dumps({
    'name': 'tomperwear',
    'project': PRJ,
    'target': 'production',
    'projectSettings': {'buildCommand': 'npm run build', 'outputDirectory': 'public'},
    'files': files,
}).encode()
st, resp = api('POST', '/v13/deployments', data=body)
print('deploy:', st, json.dumps(resp)[:400] if isinstance(resp, dict) else resp[:400])
if st == 200 and isinstance(resp, dict):
    json.dump({'id': resp.get('id'), 'url': resp.get('url')},
              open(os.path.join(ROOT, '.last-deploy.json'), 'w'))
