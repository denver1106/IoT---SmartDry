# Firebase Firestore Schema - SmartDry

Schema nay duoc thiet ke tu source Node-RED trong `nodered/functions`.

## 1. Collections

| Collection | Nguon Node-RED | Muc dich |
|---|---|---|
| `devices` | heartbeat/latest state | Trang thai moi nhat cua ESP32 |
| `sensor_logs` | environment/rain normalizer | Du lieu cam bien theo thoi gian |
| `rain_events` | rain alert/state changed | Lich su mua/het mua |
| `rack_events` | rack command/status | Lich su thu/keo/dung sao |
| `device_events` | light LED, WiFi portal | Su kien thiet bi khac |
| `commands` | rack command builder | Lenh nguoi dung gui tu web |
| `alerts` | rain/rack alert router | Canh bao FCM/email |
| `accounts` | login/security | Tai khoan dashboard |

## 2. Document shapes

### `sensor_logs/{autoId}`

```json
{
  "kind": "environment",
  "deviceId": "smartdry-01",
  "temperature": 30.5,
  "humidity": 67,
  "heatIndex": 34.2,
  "espTimestamp": 1000,
  "serverTime": "2026-06-27T12:00:00.000Z"
}
```

Rain log:

```json
{
  "kind": "rain",
  "deviceId": "smartdry-01",
  "raw": 1200,
  "rainPercent": 78,
  "isRaining": true,
  "stateChanged": true,
  "espTimestamp": 1000,
  "serverTime": "2026-06-27T12:00:00.000Z"
}
```

### `rain_events/{autoId}`

```json
{
  "kind": "rain",
  "deviceId": "smartdry-01",
  "raw": 1200,
  "rainPercent": 78,
  "isRaining": true,
  "stateChanged": true,
  "serverTime": "2026-06-27T12:00:00.000Z"
}
```

### `rack_events/{autoId}`

```json
{
  "kind": "rack_status",
  "deviceId": "smartdry-01",
  "state": "retracted",
  "target": "retract",
  "motorRunning": false,
  "reason": "limit_retracted",
  "serverTime": "2026-06-27T12:00:00.000Z"
}
```

### `commands/{autoId}`

```json
{
  "action": "retract",
  "source": "node-red-web",
  "requestedBy": "admin",
  "requestId": "rack-1780000000000",
  "serverTime": "2026-06-27T12:00:00.000Z"
}
```

### `alerts/{autoId}`

```json
{
  "type": "rain",
  "severity": "critical",
  "title": "SmartDry phat hien mua",
  "message": "Cam bien mua bao 78%. Nen thu sao phoi ngay.",
  "deviceId": "smartdry-01",
  "source": "rain_sensor",
  "sentFcm": true,
  "sentEmail": true,
  "serverTime": "2026-06-27T12:00:00.000Z"
}
```

### `device_events/{autoId}`

Task 1 LDR -> LED:

```json
{
  "kind": "light_led",
  "deviceId": "smartdry-01",
  "lightRaw": 2850,
  "dark": true,
  "ledOn": true,
  "stateChanged": true,
  "serverTime": "2026-06-27T12:00:00.000Z"
}
```

Task 12 WiFi monitor:

```json
{
  "kind": "wifi_status",
  "deviceId": "smartdry-01",
  "status": "online",
  "wifiRSSI": -52,
  "uptime": 120,
  "freeHeap": 160000,
  "portalMode": false,
  "ip": "192.168.1.50",
  "serverTime": "2026-06-27T12:00:00.000Z"
}
```

### `accounts/{username}`

```json
{
  "username": "admin",
  "displayName": "SmartDry Admin",
  "role": "admin",
  "passwordHash": "sha256:replace-with-real-hash",
  "active": true,
  "createdAt": "2026-06-27T12:00:00.000Z"
}
```

## 3. Index suggestions

- `sensor_logs`: `deviceId ASC`, `serverTime DESC`
- `rain_events`: `deviceId ASC`, `serverTime DESC`
- `rack_events`: `deviceId ASC`, `serverTime DESC`
- `alerts`: `severity ASC`, `serverTime DESC`

