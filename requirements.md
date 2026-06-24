# Requirements - SmartDry

## 1. Phan mem

| Phan mem | Phien ban khuyen nghi | Muc dich |
|---|---:|---|
| Node.js | 18+ hoac 20 LTS | Chay Node-RED |
| npm | 9+ | Cai package Node-RED |
| Node-RED | 3+ | Backend va dashboard |
| Arduino IDE | 2+ | Nap code ESP32 |
| ESP32 board package | Moi nhat on dinh | Bien dich sketch ESP32 |
| Trinh duyet Chrome/Edge | Moi nhat | Dashboard va FCM web push |

## 2. Node-RED packages

Cai trong `~/.node-red` hoac qua Manage Palette:

```bash
npm install node-red-contrib-aedes
npm install node-red-contrib-firestore
npm install node-red-node-email
npm install node-red-contrib-fcm-v2
npm install @flowfuse/node-red-dashboard
```

Neu may chi dung dashboard cu, co the thay `@flowfuse/node-red-dashboard` bang `node-red-dashboard`, nhung can doi node UI tuong ung trong flow.

## 3. Arduino libraries

Cai qua Arduino Library Manager:

| Thu vien | Ly do |
|---|---|
| `PubSubClient` | MQTT client cho ESP32 |
| `ArduinoJson` v6 | Tao/parse payload JSON |
| `DHT sensor library` | Doc DHT22/DHT11 |
| `Adafruit Unified Sensor` | Phu thuoc cua DHT |

Thu vien san co trong ESP32 core:

- `WiFi.h`
- `WebServer.h`
- `Preferences.h`

## 4. Dich vu cloud

| Dich vu | Dung cho |
|---|---|
| Firebase Firestore | Luu sensor logs, rain events, rack events, accounts |
| Firebase Cloud Messaging | Task 6, thong bao nhanh ve dien thoai/trinh duyet |
| Gmail SMTP App Password | Task 7, gui email canh bao |

## 5. Linh kien phan cung

| Linh kien | So luong | Ghi chu |
|---|---:|---|
| ESP32 DevKit v1 | 1 | Board trung tam |
| DHT22 hoac DHT11 | 1 | Can ban 1: nhiet do/do am |
| Rain sensor module | 1 | Task 2: phat hien mua |
| LDR + dien tro 10k | 1 | Task 1 input |
| LED trang thai/LED strip 5V | 1 | Task 1 output |
| L298N hoac relay dao chieu | 1 | Dieu khien motor sao phoi |
| DC gear motor/linear actuator | 1 | Can ban 2 output |
| Limit switch | 2 | Khuyen nghi de bao ve hanh trinh motor |
| Nut nhan reset WiFi | 1 | Task 12 |
| Nguon 5V/2A | 1 | ESP32, LED, module phu |
| Nguon rieng cho motor | 1 | Theo dien ap motor, nen dung nguon rieng |
| Breadboard, day jumper, dien tro | 1 bo | Lap demo |

## 6. Tai khoan va thong tin can chuan bi

- Firebase project ID.
- File `serviceAccountKey.json` cho Node-RED Firestore.
- Firebase web config cho `web/fcm_receiver.html` va `web/firebase-messaging-sw.js`.
- FCM server key hoac cau hinh node FCM v2.
- Gmail App Password 16 ky tu.
- IP may tinh chay Node-RED/MQTT broker trong cung mang WiFi voi ESP32.

## 7. Quy tac code

- Khong hardcode WiFi SSID/password trong sketch.
- Tat ca MQTT topic khai bao tap trung trong `esp32/config.h`.
- Payload giua ESP32 va Node-RED dung JSON co `deviceId` va `timestamp`.
- Cac ham doc cam bien khong dung `delay()` dai; uu tien `millis()` de loop khong bi treo.
- Cac comment can noi ro ham lam gi va vi sao can co, khong ghi comment vo nghia.

