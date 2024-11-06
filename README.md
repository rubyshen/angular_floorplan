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