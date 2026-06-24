# TODO List - SmartDry

Day la cac viec thu cong can lam bang tai khoan/dung cu that cua nhom.

## 1. Firebase va Firestore

- [ ] Tao Firebase project, vi du `smartdry-iot`.
- [ ] Bat Firestore Database, chon location gan Viet Nam.
- [ ] Tao service account key va luu file an toan.
- [ ] Tao Web App trong Firebase de lay `firebaseConfig`.
- [ ] Bat Cloud Messaging va lay key can thiet cho FCM.
- [ ] Tao collection mau theo `FireBase/sample_data.json`.
- [ ] Tao account demo trong `accounts` voi password hash.

## 2. Gmail

- [ ] Bat 2-Step Verification cho Gmail gui canh bao.
- [ ] Tao App Password cho Mail.
- [ ] Cau hinh node email trong Node-RED bang App Password, khong dung mat khau Gmail chinh.

## 3. Node-RED

- [ ] Cai Node-RED va package trong `requirements.md`.
- [ ] Chay Node-RED tai `http://localhost:1880`.
- [ ] Import `nodered/flows.json`.
- [ ] Cau hinh MQTT broker, Firestore, FCM, email.
- [ ] Deploy va kiem tra cac node khong con canh bao thieu config.

## 4. ESP32

- [ ] Cai ESP32 board package trong Arduino IDE.
- [ ] Cai cac thu vien Arduino trong `requirements.md`.
- [ ] Mo `esp32/smartdry_esp32.ino`.
- [ ] Kiem tra pin mapping trong `esp32/config.h` co khop mach that.
- [ ] Upload sketch len ESP32.
- [ ] Lan dau chay, ket noi WiFi `SmartDry_Setup`, truy cap `192.168.4.1` va cau hinh WiFi/MQTT broker.

## 5. Lap phan cung

- [ ] Dau day theo `docs/wiring_diagram.md`.
- [ ] Kiem tra nguon motor tach rieng voi nguon ESP32 neu motor can dong lon.
- [ ] Kiem tra limit switch truoc khi cho motor chay that.
- [ ] Co dinh day va module gon gang de duoc xem la san pham that.

## 6. Test demo

- [ ] Dashboard hien thi nhiet do/do am.
- [ ] Rain sensor bao mua tren dashboard.
- [ ] Nut `Extend`, `Retract`, `Stop` dieu khien dung motor.
- [ ] LDR toi/sang lam LED trang thai doi dung.
- [ ] Firestore co log moi theo thoi gian.
- [ ] Chart/gauge lay du lieu tu Firestore hien thi duoc.
- [ ] FCM va email gui khi co canh bao.
- [ ] Login sai/duoc xu ly dung.
- [ ] Nhan giu nut reset WiFi, ESP32 xoa cau hinh va mo portal lai.

