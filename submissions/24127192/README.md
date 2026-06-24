# README - 24127192

## Vai tro trong SmartDry

24127192 phu trach luong Input -> Web va cac chuc nang canh bao/bao mat:

- Can ban 1: DHT22 -> ESP32 -> MQTT -> Node-RED -> Dashboard.
- Task 2: Rain sensor -> ESP32 -> MQTT -> Node-RED dashboard.
- Task 6: Thong bao nhanh ve dien thoai bang FCM.
- Task 7: Gui email canh bao bang Gmail SMTP, khong dung cung dich vu voi FCM.
- Task 9: Dang nhap/bao mat dashboard, tai khoan luu trong Firestore.

## Luong can giai thich khi van dap

```text
DHT22/Rain sensor
  -> ESP32 doc gia tri
  -> tao JSON co deviceId, timestamp
  -> publish MQTT
  -> Node-RED subscribe va parse JSON
  -> dashboard hien thi
  -> Firestore/FCM/email/login xu ly phan nang cao
```

## Thu tu thuc hien

### Buoc 1 - Nam topic va schema

Doc:

- `../../docs/mqtt_topics.md`
- `../../esp32/config.h`
- `../../esp32/smartdry_esp32.ino`

Can nam cac topic:

- `smartdry/sensor/environment`
- `smartdry/sensor/rain`
- `smartdry/alerts`

### Buoc 2 - Can ban 1: DHT22 -> Web

File chinh:

- `../../esp32/smartdry_esp32.ino`
- `esp32/task2_rain_to_web.ino` de tham khao cach viet ham doc input.

Viec can lam:

1. Kiem tra `DHT_TYPE` trong `config.h` la `DHT22` hay `DHT11`.
2. Kiem tra day DATA vao GPIO4.
3. Trong Serial Monitor, xac nhan khong co log `Loi doc DHT`.
4. Trong Node-RED, xem topic `smartdry/sensor/environment`.
5. Them gauge/text dashboard neu flow import chua co node UI thuc te.

### Buoc 3 - Task 2: Rain sensor -> Web

File chinh:

- `../../esp32/smartdry_esp32.ino`, ham `readRainSensorTask2()`.
- `esp32/task2_rain_to_web.ino`, skeleton rieng.
- `nodered/task2_rain_router.js`, function Node-RED mau.

Viec can lam:

1. Dau rain sensor AO vao GPIO34.
2. Hieu chuan `RAIN_WET_THRESHOLD` trong `config.h`.
3. Publish payload co `raw`, `rainPercent`, `isRaining`.
4. Trong Node-RED, route `isRaining = true` sang alert link.
5. Dashboard phai hien thi duoc trang thai mua/khong mua.

### Buoc 4 - Task 6: FCM

File chinh:

- `nodered/task6_push_notification.js`
- `../../web/fcm_receiver.html`
- `../../web/firebase-messaging-sw.js`

Viec can lam:

1. Tao Firebase Web App.
2. Dien `firebaseConfig` va `vapidKey` vao file web.
3. Chay trang web bang localhost/HTTPS.
4. Copy registration token neu Node-RED FCM node can token.
5. Khi rain alert den, node FCM gui title/body ro rang.

### Buoc 5 - Task 7: Email

File chinh:

- `nodered/task7_email_alert.js`

Viec can lam:

1. Tao Gmail App Password.
2. Cau hinh node email trong Node-RED.
3. Payload email can co nguoi nhan, subject va body.
4. Test canh bao mua va xac nhan email den inbox/spam.

### Buoc 6 - Task 9: Login/security

File chinh:

- `nodered/task9_auth_guard.js`
- `../../FireBase/sample_data.json`

Viec can lam:

1. Tao collection `accounts`.
2. Khong luu password plain text. Dung password hash.
3. Login thanh cong moi cho hien/cho dieu khien dashboard.
4. Login that bai phai co thong bao va khong publish lenh motor.

## Checklist hoan thanh

- [ ] Giai thich duoc DHT22 va rain sensor khac nhau, khong vi pham quy dinh thiet bi doi mot.
- [ ] DHT22 co du lieu tren Node-RED.
- [ ] Rain sensor co du lieu tren Node-RED va tao alert khi co mua.
- [ ] FCM gui duoc thong bao nhanh.
- [ ] Email gui duoc bang Gmail SMTP.
- [ ] Login doc tai khoan tu Firestore va chan nguoi chua dang nhap.
- [ ] Comment trong code noi ro ham lam gi va vi sao can co.

