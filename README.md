# iRM_ITRI
ITRI iRM with o-cloud GUI style project

# Mockup UE with RSRP values
## install flask and flask_cors

```python
from flask import Flask, jsonify
from flask_cors import CORS

import random
import threading
import time

app = Flask(__name__)
CORS(app)

# 初始化 RSRP 值
rsrp_value = -100

# 創建一個背景線程來模擬 RSRP 值的不斷更新
def update_rsrp():
    global rsrp_value
    while True:
        # 隨機變化 RSRP 值（在-120到-60之間浮動）
        rsrp_value = random.randint(-120, -60)
        time.sleep(1)  # 每秒更新一次

# 啟動背景線程
threading.Thread(target=update_rsrp, daemon=True).start()

# 提供一個查詢 RSRP 值的 API
@app.route('/rsrp', methods=['GET'])
def get_rsrp():
    return jsonify({'rsrp': rsrp_value})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

## Test
```bash
curl http://localhost:5000/rsrp
```

# Mockup proxy and no cors ue
## proxy
```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# 允许CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# 代理端点
@app.route('/rsrp', methods=['GET'])
def get_rsrp():
    # UE的RSRP服务器地址
    ue_rsrp_server_url = 'http://localhost:5500/rsrp'
    
    # 向UE的RSRP服务器发送请求
    try:
        response = requests.get(ue_rsrp_server_url)
        response.raise_for_status()  # 如果请求返回了一个错误状态码，这会抛出一个异常
        # 将RSRP服务器的响应返回给前端
        return jsonify(response.json()), 200
    except requests.RequestException as e:
        # 如果请求失败，返回错误信息
        return jsonify({'error': 'Failed to fetch RSRP data'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```
## server, no cros
```python
from flask import Flask, jsonify
# from flask_cors import CORS

import random
import threading
import time

app = Flask(__name__)
# CORS(app)

# 初始化 RSRP 值
rsrp_value = -100

# 創建一個背景線程來模擬 RSRP 值的不斷更新
def update_rsrp():
    global rsrp_value
    while True:
        # 隨機變化 RSRP 值（在-120到-60之間浮動）
        rsrp_value = random.randint(-120, -60)
        time.sleep(1)  # 每秒更新一次

# 啟動背景線程
threading.Thread(target=update_rsrp, daemon=True).start()

# 提供一個查詢 RSRP 值的 API
@app.route('/rsrp', methods=['GET'])
def get_rsrp():
    return jsonify({'rsrp': rsrp_value})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500)
```