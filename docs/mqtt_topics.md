# MQTT Topics - SmartDry

## 1. Quy uoc payload

Tat ca payload la JSON.

Truong bat buoc:

```json
{
  "deviceId": "smartdry-01",
  "timestamp": 123456
}
```

`timestamp` tren ESP32 la `millis()`. Khi ghi Firestore, Node-RED nen them `serverTime` bang thoi gian cloud.

## 2. Topics

### `smartdry/sensor/environment`

ESP32 publish moi 10 giay.

```json
{
  "deviceId": "smartdry-01",
  "temperature": 30.5,
  "humidity": 68.2,
  "heatIndex": 34.1,
  "timestamp": 123456
}
```

### `smartdry/sensor/rain`

ESP32 publish khi den chu ky doc hoac khi trang thai mua thay doi.

```json
{
  "deviceId": "smartdry-01",
  "raw": 1340,
  "rainPercent": 72,
  "isRaining": true,
  "timestamp": 123456
}
```

### `smartdry/rack/control`

Node-RED publish khi nguoi dung bam nut.

```json
{
  "action": "retract",
  "source": "dashboard",
  "requestedBy": "admin",
  "timestamp": 123456
}
```

`action` hop le: `extend`, `retract`, `stop`.

### `smartdry/rack/status`

ESP32 publish khi trang thai motor thay doi.

```json
{
  "deviceId": "smartdry-01",
  "state": "retracted",
  "target": "retract",
  "motorRunning": false,
  "reason": "limit_retracted",
  "timestamp": 123456
}
```

### `smartdry/task1/light-led`

ESP32 publish sau khi xu ly LDR -> LED.

```json
{
  "deviceId": "smartdry-01",
  "lightRaw": 2800,
  "dark": true,
  "ledOn": true,
  "timestamp": 123456
}
```

### `smartdry/system/heartbeat`

ESP32 publish moi 30 giay.

```json
{
  "deviceId": "smartdry-01",
  "status": "online",
  "uptime": 120,
  "wifiRSSI": -55,
  "freeHeap": 185320,
  "timestamp": 123456
}
```

## 3. Firestore collections

| Collection | Du lieu |
|---|---|
| `sensor_logs` | Environment va rain theo thoi gian |
| `rain_events` | Cac lan chuyen trang thai mua/het mua |
| `rack_events` | Lenh va trang thai motor |
| `alerts` | Canh bao da gui FCM/email |
| `accounts` | Tai khoan dashboard |
| `devices` | Trang thai moi nhat cua ESP32 |

