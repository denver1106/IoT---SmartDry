# Huong dan cai dat SmartDry

## 1. Kien truc

```text
ESP32
  |-- DHT22, rain sensor, LDR, reset button
  |-- motor driver, LED status
  |
  +-- MQTT
        |
        v
Node-RED backend + dashboard
  |-- Firestore
  |-- FCM
  |-- Gmail SMTP
```

Node-RED vua la backend xu ly du lieu, vua la frontend dashboard. ESP32 chi can ket noi WiFi va MQTT.

## 2. Cai Node-RED

```bash
npm install -g --unsafe-perm node-red
node-red
```

Mo trinh duyet tai `http://localhost:1880`.

## 3. Cai package Node-RED

Vao menu Node-RED -> Manage palette -> Install, cai:

- `node-red-contrib-aedes`
- `node-red-contrib-firestore`
- `node-red-node-email`
- `node-red-contrib-fcm-v2`
- `@flowfuse/node-red-dashboard`

Sau khi cai xong, restart Node-RED.

## 4. Import flow

1. Trong Node-RED, vao menu -> Import.
2. Chon file `nodered/flows.json`.
3. Import to current flow hoac new flow.
4. Deploy.
5. Mo dashboard theo duong dan UI cua package dashboard dang dung.

## 5. Cau hinh Firestore

1. Tao Firebase project.
2. Bat Firestore Database.
3. Vao Project settings -> Service accounts -> Generate new private key.
4. Trong Node-RED, mo node Firestore config va dan noi dung service account key.
5. Kiem tra collection mau trong `FireBase/sample_data.json`.

## 6. Cau hinh FCM

1. Tao Web App trong Firebase.
2. Dan `firebaseConfig` vao `web/fcm_receiver.html` va `web/firebase-messaging-sw.js`.
3. Lay VAPID key va thay `YOUR_VAPID_KEY_HERE`.
4. Chay web bang localhost/HTTPS, khong mo truc tiep bang file path.
5. Cho phep notification tren trinh duyet.

## 7. Cau hinh email

1. Bat 2-Step Verification cho Gmail.
2. Tao App Password.
3. Trong node email cua Node-RED:
   - Server: `smtp.gmail.com`
   - Port: `465`
   - Secure: true
   - User: email gui
   - Password: App Password

## 8. Nap code ESP32

1. Mo Arduino IDE.
2. Cai board ESP32 va cac thu vien trong `requirements.md`.
3. Mo `esp32/smartdry_esp32.ino`.
4. Kiem tra `esp32/config.h`.
5. Upload code.

Lan dau chay, neu chua co WiFi, ESP32 phat mang `SmartDry_Setup`. Ket noi vao mang nay, mo `192.168.4.1`, chon WiFi nha va nhap IP MQTT broker.

## 9. Test nhanh

- Che rain sensor bang nuoc hoac cham dau do: dashboard phai bao `isRaining = true`.
- Che LDR bang tay: LED trang thai phai bat/tat theo nguong.
- Bam `Retract`: motor thu sao. Bam `Stop`: motor dung.
- Tat Node-RED hoac WiFi: ESP32 van chay local Task 1 va co heartbeat khi ket noi lai.

## 10. Loi thuong gap

| Loi | Nguyen nhan | Cach xu ly |
|---|---|---|
| ESP32 khong thay MQTT | Sai IP broker hoac khac mang WiFi | Cau hinh lai broker trong portal |
| DHT tra `NaN` | Dau sai day, doc qua nhanh, thieu thu vien | Kiem tra VCC/GND/DATA va thu vien |
| Motor khong quay | Nguon motor yeu, IN1/IN2 sai, EN chua bat | Kiem tra nguon rieng va pin mapping |
| FCM khong hien thong bao | Chua cap quyen notification, sai VAPID key | Chay localhost/HTTPS va cap quyen |
| Email bi tu choi | Dung mat khau Gmail chinh | Dung App Password |
| Portal WiFi khong hien | ESP32 da co WiFi cu | Nhan giu nut reset WiFi 3 giay |

