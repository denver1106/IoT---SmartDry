# README - 24127493

## Vai tro trong SmartDry

24127493 phu trach dieu khien output, cloud va WiFi portal:

- Can ban 2: Node-RED dashboard -> MQTT -> ESP32 -> motor thu/keo sao.
- Task 1: LDR -> LED trang thai, luong Input -> Output truc tiep.
- Task 4: Luu du lieu cam bien/lich su hoat dong len Firestore theo thoi gian.
- Task 5: Lay du lieu cloud ve web va hien thi gauge/chart/table.
- Task 12: Tu xay dung WiFi Config Portal cho san pham that.

## Luong can giai thich khi van dap

```text
Dashboard Node-RED
  -> tao JSON command
  -> publish MQTT smartdry/rack/control
  -> ESP32 mqttCallback()
  -> driveRackMotor()
  -> L298N/motor thu hoac keo sao
  -> ESP32 publish smartdry/rack/status
  -> Node-RED luu Firestore va cap nhat dashboard
```

Task 1 rieng:

```text
LDR -> ESP32 analogRead -> so sanh nguong -> LED status
```

Task 12 rieng:

```text
Khong co WiFi hoac nhan reset -> ESP32 tao AP -> web portal -> Preferences -> reboot -> ket noi WiFi moi
```

## Thu tu thuc hien

### Buoc 1 - Can ban 2: Web -> Output

File chinh:

- `../../esp32/smartdry_esp32.ino`
- `esp32/rack_motor_control.ino`
- `../../nodered/flows.json`

Viec can lam:

1. Dau L298N/driver theo `../../docs/wiring_diagram.md`.
2. Kiem tra GPIO18, GPIO19, GPIO23 khop driver.
3. Test bang nut inject/dashboard `extend`, `retract`, `stop`.
4. Kiem tra limit switch GPIO32/GPIO33 co dung logic `INPUT_PULLUP`.
5. Khi motor chay qua `MOTOR_MAX_RUN_MS`, code phai tu dung de an toan.

### Buoc 2 - Task 1: Input -> Output

File chinh:

- `../../esp32/smartdry_esp32.ino`, ham `handleLightToLedTask1()`.
- `esp32/task1_light_to_led.ino`.

Viec can lam:

1. Lap cau chia ap LDR + dien tro 10k.
2. Hieu chuan `LDR_DARK_THRESHOLD`.
3. Khi troi toi, LED status bat; khi du sang, LED tat.
4. Publish status len MQTT chi de log/dashboard, khong phu thuoc web.

### Buoc 3 - Task 4: Cloud logging

File chinh:

- `nodered/task4_cloud_logger.js`
- `../../FireBase/sample_data.json`

Viec can lam:

1. Chuan hoa document truoc khi ghi Firestore.
2. Ghi theo thoi gian, co `serverTime`.
3. Tach collection: `sensor_logs`, `rack_events`, `alerts`.
4. Dam bao khong ghi du lieu qua nhieu lam spam Firestore.

### Buoc 4 - Task 5: Cloud -> Web

File chinh:

- `nodered/task5_cloud_dashboard.js`

Viec can lam:

1. Doc log moi nhat tu Firestore.
2. Tao dataset cho gauge/chart/table.
3. Dashboard co it nhat chart de dat muc cao cua Task 5.

### Buoc 5 - Task 12: WiFi Config Portal

File chinh:

- `../../esp32/wifi_config_portal.h`
- `esp32/task12_wifi_config_notes.h`

Viec can lam:

1. Khong hardcode SSID/password trong sketch.
2. Khi chua co WiFi, ESP32 phat AP `SmartDry_Setup`.
3. Web portal co route `/`, `/scan`, `/save`.
4. Luu SSID/password/broker bang `Preferences`.
5. Nhan giu reset WiFi 3 giay de xoa cau hinh.

## Checklist hoan thanh

- [ ] Motor co the extend/retract/stop tu Node-RED.
- [ ] Limit switch hoac timeout dung motor dung cach.
- [ ] LDR dieu khien LED truc tiep, khong phu thuoc cloud/web.
- [ ] Firestore co log theo thoi gian.
- [ ] Dashboard doc du lieu cloud ve va co chart/gauge.
- [ ] WiFi portal tu xay dung hoat dong tren dien thoai.
- [ ] Comment trong code noi ro ham lam gi va vi sao can co.

