# Plan - SmartDry

## 1. Dinh huong san pham

SmartDry la sao phoi thong minh dung ESP32 lam board trung tam. Thiet bi thu thap dieu kien phoi, phat hien mua, cho phep nguoi dung thu/keo sao phoi tu dashboard Node-RED, gui canh bao ve dien thoai/email va luu lich su hoat dong len cloud.

Trong demo do an, Node-RED dong vai tro:

- Backend: nhan/gui MQTT, xu ly du lieu, ghi doc Firestore, gui FCM/email.
- Frontend: dashboard dieu khien va hien thi du lieu.

Khong trien khai Task 10 vi yeu cau hien tai uu tien web Node-RED.

## 2. Mapping theo quy dinh do an

| Hang muc | Mo ta theo de | Cach SmartDry dap ung | Sinh vien |
|---|---|---|---|
| Can ban 1 | Input -> ESP -> MQTT -> Web backend -> Web frontend | DHT22 gui nhiet do/do am len Node-RED dashboard | 24127192 |
| Can ban 2 | Web frontend -> Web backend -> MQTT -> ESP -> Output | Node-RED gui lenh extend/retract/stop den motor sao phoi | 24127493 |
| Teamwork | Tat ca ma nguon tich hop chung project | ESP32, Node-RED, Firebase, web FCM dung chung topic/schema | Ca nhom |
| Task 1 | Them luong Input -> Output | LDR dieu khien LED trang thai anh sang ngay tren ESP32 | 24127493 |
| Task 2 | Them luong Input -> Web | Rain sensor gui trang thai mua len Node-RED dashboard | 24127192 |
| Task 4 | Luu du lieu cam bien/lich su len cloud | Firestore luu sensor_logs, rain_events, rack_events, alerts | 24127493 |
| Task 5 | Lay du lieu cloud ve va hien thi len web | Node-RED doc Firestore va ve gauge/chart/table | 24127493 |
| Task 6 | Thong bao nhanh ve dien thoai | Firebase Cloud Messaging khi mua/luc thu sao gap loi | 24127192 |
| Task 7 | Gui email khong dung cung dich vu thong bao nhanh | Gmail SMTP gui email canh bao rieng voi FCM | 24127192 |
| Task 9 | Bao mat he thong bang dang ky/dang nhap | Form login Node-RED, tai khoan luu Firestore accounts | 24127192 |
| Task 12 | San pham that co cau hinh WiFi | ESP32 tu tao AP + web server cau hinh WiFi, luu Preferences | 24127493 |

## 3. Phan cong chi tiet

### 24127192

Muc tieu: lam cac luong canh bao, bao mat va input -> web.

- Can ban 1: doc DHT22 va publish `smartdry/sensor/environment`.
- Task 2: doc rain sensor va publish `smartdry/sensor/rain`.
- Task 6: tao FCM payload va gui push notification.
- Task 7: tao email payload va gui qua Gmail SMTP.
- Task 9: tao login flow, hash password, doc tai khoan tu Firestore, chan dashboard neu chua login.

### 24127493

Muc tieu: lam dieu khien output, cloud va WiFi portal.

- Can ban 2: nhan lenh `smartdry/rack/control`, dieu khien motor thu/keo sao.
- Task 1: doc LDR va dieu khien LED trang thai bang local logic.
- Task 4: ghi log len Firestore theo thoi gian.
- Task 5: doc Firestore ve dashboard gauge/chart/table.
- Task 12: xay dung WiFi Config Portal tren ESP32 bang `WebServer.h` va `Preferences.h`.

## 4. Chuan thiet bi

De tranh trung lap thiet bi theo de, moi luong dung thiet bi rieng:

| Chuc nang | Linh kien | Loai |
|---|---|---|
| Can ban 1 | DHT22 | Input |
| Can ban 2 | L298N + DC motor/linear actuator | Output |
| Task 1 input | LDR/photoresistor | Input |
| Task 1 output | LED trang thai/LED strip 5V | Output |
| Task 2 | Rain sensor module | Input |
| Task 12 | Nut reset WiFi | Input phu tro |

Khuyen nghi co them 2 limit switch cho motor de tranh chay qua hanh trinh. Limit switch la thiet bi an toan phu tro, khong tinh la thiet bi chinh cua cac task.

## 5. Kien truc MQTT

| Topic | Huong | Payload chinh |
|---|---|---|
| `smartdry/sensor/environment` | ESP32 -> Node-RED | `temperature`, `humidity`, `heatIndex` |
| `smartdry/sensor/rain` | ESP32 -> Node-RED | `raw`, `rainPercent`, `isRaining` |
| `smartdry/rack/control` | Node-RED -> ESP32 | `action`: `extend`, `retract`, `stop` |
| `smartdry/rack/status` | ESP32 -> Node-RED | `state`, `target`, `motorRunning` |
| `smartdry/task1/light-led` | ESP32 -> Node-RED | `lightRaw`, `dark`, `ledOn` |
| `smartdry/system/heartbeat` | ESP32 -> Node-RED | `uptime`, `wifiRSSI`, `freeHeap` |
| `smartdry/alerts` | Node-RED internal/MQTT | `type`, `severity`, `message` |

## 6. Milestones

### Milestone 1 - Nen tang

- Tao Firebase project, Firestore database, service account.
- Cai Node-RED va cac package can thiet.
- Import `nodered/flows.json`.
- Nap sketch ESP32 va ket noi MQTT.

### Milestone 2 - Luong can ban

- 24127192 kiem tra DHT22 len dashboard.
- 24127493 kiem tra nut extend/retract/stop dieu khien motor.
- Ca nhom kiem tra topic MQTT khop schema.

### Milestone 3 - Task nang cao

- 24127192 them rain sensor, FCM, email, login.
- 24127493 them LDR -> LED, Firestore logging, chart/gauge, WiFi portal.

### Milestone 4 - Tich hop va van dap

- Test mat WiFi, mat MQTT, mua gia lap, lenh motor loi.
- Moi sinh vien ghi lai so do luong du lieu cua phan minh.
- Chuan bi demo voi san pham that: hop day gon, nut reset WiFi, day motor an toan.

## 7. Tieu chi hoan thanh

- Node-RED dashboard co login, hien thi environment/rain/rack status.
- Tu dashboard co the thu/keo/dung sao phoi.
- Khi rain sensor bao mua, dashboard cap nhat va FCM/email duoc gui.
- Firestore co log theo thoi gian, dashboard co chart/gauge lay tu cloud.
- Lan dau bat ESP32 chua co WiFi se phat AP `SmartDry_Setup` va cho cau hinh.
- Code moi ham co comment ngan gon: ham lam gi, vi sao can co, publish/subscribe topic nao.

