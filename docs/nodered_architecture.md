# Node-RED Architecture - SmartDry

## 1. Tong quan flow

```text
ESP32 sensors
  -> MQTT topics
  -> Node-RED ingest/normalize
  -> Firebase adapter
  -> Web dashboard /smartdry

Web dashboard
  -> Auth guard
  -> Rack command builder
  -> MQTT smartdry/rack/control
  -> ESP32 motor output
```

## 2. MQTT topics

| Topic | Huong | Node-RED xu ly |
|---|---|---|
| `smartdry/sensor/environment` | ESP32 -> Node-RED | Normalize DHT data, cache, Firebase `sensor_logs` |
| `smartdry/sensor/rain` | ESP32 -> Node-RED | Task 2, hien thi web, tao alert khi mua |
| `smartdry/task1/light-led` | ESP32 -> Node-RED | Task 1 monitor, Firebase `device_events` |
| `smartdry/rack/status` | ESP32 -> Node-RED | Trang thai motor, Firebase `rack_events` |
| `smartdry/system/heartbeat` | ESP32 -> Node-RED | Task 12 monitor, Firebase `device_events` |
| `smartdry/rack/control` | Node-RED -> ESP32 | Lenh `extend`, `retract`, `stop` |

## 3. HTTP APIs

| API | Method | Muc dich |
|---|---|---|
| `/smartdry` | GET | Web dashboard Node-RED |
| `/smartdry/api/status` | GET | Lay latest state, chart data, recent logs |
| `/smartdry/api/login` | POST | Task 9 login |
| `/smartdry/api/rack` | POST | Dieu khien motor, can login truoc |

## 4. Luong 8 task

### Task 1 - 24127493

```text
LDR -> ESP32 -> LED
ESP32 -> MQTT smartdry/task1/light-led -> Node-RED -> device_events
```

Node-RED khong dieu khien LED o task nay. Node-RED chi hien thi/log de minh chung input -> output da chay tren ESP32.

### Task 2 - 24127192

```text
Rain sensor -> ESP32 -> MQTT smartdry/sensor/rain
  -> Normalize Rain
  -> Dashboard
  -> Alert router neu isRaining = true
```

### Task 4 - 24127493

Moi Function node normalize tao `msg.firestore`. Firebase adapter chuyen thanh `msg.firebase` va local cache.

### Task 5 - 24127493

Dashboard API `/smartdry/api/status` lay cache/Firestore data va tra ve:

- latest environment/rain/light/rack/wifi
- chart environment
- chart rain
- recent rack events, alerts, device events

### Task 6 - 24127192

Alert -> `Build FCM Payload` -> HTTP Request/FCM node.

### Task 7 - 24127192

Alert -> `Build Email Payload` -> Email node.

### Task 9 - 24127192

Login API luu `currentUser` vao flow context. Rack command API bi chan neu chua login.

### Task 12 - 24127493

ESP32 WiFi Config Portal gui heartbeat/status. Node-RED log vao `device_events`, dashboard hien RSSI/online/portal mode.

