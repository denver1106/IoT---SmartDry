# SmartDry Node-RED Source

Thu muc nay chua full source Node-RED cho 8 task nang cao cua 2 thanh vien.

## 1. Task mapping

| MSSV | Task | Node-RED flow |
|---|---:|---|
| 24127493 | 1 | Subscribe `smartdry/task1/light-led`, hien thi va log ket qua LDR -> LED |
| 24127192 | 2 | Subscribe `smartdry/sensor/rain`, hien thi web va tao alert khi co mua |
| 24127493 | 4 | Firebase adapter tao document cho Firestore |
| 24127493 | 5 | HTTP dashboard `/smartdry` va API `/smartdry/api/status` |
| 24127192 | 6 | Build FCM payload tu alert |
| 24127192 | 7 | Build email payload tu alert |
| 24127192 | 9 | Login API `/smartdry/api/login` va guard cho command motor |
| 24127493 | 12 | Subscribe heartbeat/WiFi status tu ESP32, log portal/WiFi state |

## 2. File quan trong

| File | Vai tro |
|---|---|
| `flows.json` | File import vao Node-RED |
| `generate_flows.js` | Generator sinh `flows.json` tu source function |
| `functions/*.js` | Code cho tung Function node, co comment ro rang |
| `functions/smartdry_dashboard_template.html` | Web dashboard chay tren Node-RED HTTP node |

## 3. Cai dat

```bash
cd nodered
npm install
npm run generate
npm run check
node-red
```

Trong Node-RED:

1. Menu -> Import.
2. Chon file `nodered/flows.json`.
3. Deploy.
4. Mo `http://localhost:1880/smartdry`.

MQTT broker mac dinh: `127.0.0.1:1883`. Neu broker chay tren may khac, sua config node `Local MQTT 1883`.

## 4. Cach test khong can ESP32

Tab `07 Simulators - Dev/Test` co cac inject node:

- `Sim environment`
- `Sim rain dry`
- `Sim rain wet alert`
- `Sim light -> LED`
- `Sim rack status`
- `Sim heartbeat`

Bam cac node nay de day payload mau vao MQTT, sau do xem dashboard `/smartdry`.

## 5. Firebase adapter

Flow `06 Firebase Adapter - Task 4/5` tao object:

```js
msg.firebase = {
  collection: 'sensor_logs',
  document: { ... },
  path: 'sensor_logs/{autoId}'
}
```

Mac dinh flow ghi vao local cache trong Node-RED context de dashboard chay duoc ngay. Khi co Firebase credential:

1. Cai `node-red-contrib-firestore`.
2. Thay node debug `Firestore document ready` bang Firestore ADD/SET node.
3. Dung `msg.firebase.collection` de chon collection.
4. Ghi `msg.firebase.document` vao Firestore.

Schema chi tiet nam trong `../FireBase/schema.md`.

## 6. Bao mat va canh bao

Demo login:

- username: `admin`
- password: `admin123`

Trong ban nop that, khong luu plain password trong Function node. Dung collection `accounts` voi `passwordHash`, xem `../FireBase/sample_data.json`.

FCM va email:

- `functions/build_fcm_payload.js` chuan bi payload va header FCM.
- `functions/build_email_payload.js` chuan bi `msg.to`, `msg.topic`, `msg.payload`.
- Khi co key that, thay debug bang HTTP Request node FCM va Email node.

