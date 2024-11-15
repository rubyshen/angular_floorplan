# iRM_ITRI
ITRI iRM with o-cloud GUI style project

---
# npm
> --legacy-peer-deps


---
# Rsrp proxy, get QUB RIS info

## 最新版
``` no cache
from flask import Flask, jsonify
import requests

app = Flask(__name__)

# 允許 CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    
    # 添加 no-cache 头部，防止缓存
    response.headers.add('Cache-Control', 'no-cache')
    
    return response

@app.route('/rsrp', methods=['GET'])
def get_rsrp():
    ris_server_url = 'http://ris.m10.site/api/get_ris_info'
    
    try:
        # 設置請求的超時時間
        response = requests.get(ris_server_url, timeout=0.9)
        response.raise_for_status()  # 如果有錯誤狀態碼則拋出異常
        
        # 解析 JSON 響應
        data = response.json()
        received_power = data.get('received_power', {})
        
        # 構造響應結果
        result = {
            'min_value': received_power.get('min_value', None),
            'max_value': received_power.get('max_value', None),
            'unit': received_power.get('unit', None)
        }
        
        # 打印結果到控制台
        print("Received Power Data:", result)
        
        # 返回 JSON 給客戶端
        return jsonify(result), 200
    
    except requests.exceptions.Timeout:
        # 如果發生超時，返回 min_value 和 max_value 為 0 的 result 格式
        print("Request timed out. Returning default values.")
        result = {
            'min_value': 0,
            'max_value': 0,
            'unit': None
        }
        return jsonify(result), 200
    except requests.RequestException as e:
        # 其他請求錯誤，返回錯誤信息
        print("Error fetching received power data:", e)
        return jsonify({'error': 'Failed to fetch received power data'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

```

```
from flask import Flask, jsonify
import requests
app = Flask(__name__)

# 允許 CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/rsrp', methods=['GET'])
def get_rsrp():
    ris_server_url = 'http://ris.m10.site/api/get_ris_info'
    
    try:
        # 設置請求的超時時間
        response = requests.get(ris_server_url, timeout=0.9)
        response.raise_for_status()  # 如果有錯誤狀態碼則拋出異常
        
        # 解析 JSON 響應
        data = response.json()
        received_power = data.get('received_power', {})
        
        # 構造響應結果
        result = {
            'min_value': received_power.get('min_value', None),
            'max_value': received_power.get('max_value', None),
            'unit': received_power.get('unit', None)
        }
        
        # 打印結果到控制台
        print("Received Power Data:", result)
        
        # 返回 JSON 給客戶端
        return jsonify(result), 200
    
    except requests.exceptions.Timeout:
        # 如果發生超時，返回 min_value 和 max_value 為 0 的 result 格式
        print("Request timed out. Returning default values.")
        result = {
            'min_value': 0,
            'max_value': 0,
            'unit': None
        }
        return jsonify(result), 200
    except requests.RequestException as e:
        # 其他請求錯誤，返回錯誤信息
        print("Error fetching received power data:", e)
        return jsonify({'error': 'Failed to fetch received power data'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

```

```
from flask import Flask, jsonify
import requests

app = Flask(__name__)

# 允許 CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# 代理端點
@app.route('/rsrp', methods=['GET'])
def get_rsrp():
    # RIS 伺服器 URL
    ris_server_url = 'http://ris.m10.site/api/get_ris_info'
    
    try:
        # 向 RIS 伺服器發送請求
        response = requests.get(ris_server_url)
        response.raise_for_status()  # 如果有錯誤狀態碼則拋出異常
        
        # 解析 RIS 伺服器的 JSON 響應
        data = response.json()
        received_power = data.get('received_power', {})
        
        # 構造只包含所需欄位的響應
        result = {
            'min_value': received_power.get('min_value', None),
            'max_value': received_power.get('max_value', None),
            'unit': received_power.get('unit', None)
        }
        
        return jsonify(result), 200
    except requests.RequestException as e:
        # 如果請求失敗，返回錯誤信息
        return jsonify({'error': 'Failed to fetch received power data'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

```

---

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