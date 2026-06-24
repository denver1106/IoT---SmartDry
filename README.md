# SmartDry - Sao phoi thong minh dung ESP32, MQTT va Node-RED

SmartDry la do an IoT mo phong san pham that: mot sao phoi co the theo doi dieu kien phoi, phat hien mua, dieu khien thu/keo sao qua web Node-RED, gui thong bao nhanh/email, luu lich su len cloud va cho phep cau hinh WiFi khi doi mang.

Du an nay duoc lap theo cau truc cua `Fingerprint-Authentication-System` cu:

- `esp32/`: ma Arduino cho ESP32, cam bien va thiet bi output.
- `nodered/`: flow Node-RED backend/dashboard de import.
- `FireBase/`: mau du lieu va rule Firestore.
- `web/`: trang web nhan Firebase Cloud Messaging.
- `docs/`: huong dan cai dat, dau day, MQTT topics.
- `submissions/`: thu muc rieng cho tung MSSV, gom README step-by-step va ma suon theo task.

## Muc tieu cham diem

Theo quy dinh do an cuoi ky, moi nhom can co 2 luong can ban va co the trien khai cac yeu cau nang cao. Phan SmartDry nay chia viec cho 2 sinh vien:

| MSSV | Luong can ban | Yeu cau nang cao |
|---|---|---|
| 24127192 | DHT22 -> ESP32 -> MQTT -> Node-RED backend -> Node-RED dashboard | Task 2, 6, 7, 9 |
| 24127493 | Node-RED dashboard -> Node-RED backend -> MQTT -> ESP32 -> motor thu/keo sao | Task 1, 4, 5, 12 |

Luu y quan trong: tong diem yeu cau nang cao trong de bi gioi han toi da 4 diem, nen cac task duoc trien khai nhu phan du phong va de hoan thien san pham. Khi van dap, tung sinh vien phai giai thich duoc luong du lieu va code cua phan minh phu trach.

## Luong du lieu chinh

```text
Luong can ban 1:
DHT22 -> ESP32 -> MQTT topic smartdry/sensor/environment
      -> Node-RED -> Dashboard gauge/text

Luong can ban 2:
Node-RED Dashboard button -> MQTT topic smartdry/rack/control
      -> ESP32 -> L298N/relay -> motor thu/keo sao phoi

Task 2:
Rain sensor -> ESP32 -> MQTT topic smartdry/sensor/rain
      -> Node-RED -> Dashboard canh bao mua

Task 1:
LDR -> ESP32 -> LED trang thai phoi

Task 4 va 5:
Node-RED -> Firestore sensor_logs/rack_events/rain_events
Firestore -> Node-RED Dashboard gauge/chart/table

Task 6 va 7:
Node-RED alert router -> FCM push notification va Gmail SMTP email

Task 9:
Node-RED login/auth guard -> Firestore accounts

Task 12:
ESP32 WiFi Config Portal -> Preferences/NVS -> ket noi WiFi moi
```

## Thiet bi de tranh trung lap theo quy dinh

| Hang muc | Input | Output | Ghi chu |
|---|---|---|---|
| Can ban 1 | DHT22 | Web Node-RED | Theo doi nhiet do/do am moi truong |
| Can ban 2 | Web Node-RED | Motor/linear actuator | Thu/keo sao phoi |
| Task 1 | LDR | LED trang thai | Luong input -> output rieng |
| Task 2 | Rain sensor | Web Node-RED | Luong input -> web rieng |
| Task 12 | Nut reset WiFi | Web portal tren ESP32 | Cau hinh WiFi cho san pham that |

## Chay nhanh

1. Doc `docs/README.md` de cai Node-RED, Firebase va Arduino IDE.
2. Import `nodered/flows.json` vao Node-RED.
3. Cau hinh MQTT broker, Firestore service account, Gmail App Password va FCM key.
4. Nap `esp32/smartdry_esp32.ino` len ESP32.
5. Neu ESP32 phat WiFi `SmartDry_Setup`, ket noi bang dien thoai va vao `192.168.4.1` de cau hinh WiFi.

## File nen doc truoc

- `plan.md`: ke hoach trien khai va mapping rubric.
- `requirements.md`: phan mem, dich vu, linh kien, thu vien can co.
- `TODO_list.md`: checklist thao tac thu cong.
- `submissions/24127192/README.md`: viec cua 24127192.
- `submissions/24127493/README.md`: viec cua 24127493.

