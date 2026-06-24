# So do dau day SmartDry

## 1. Pin mapping

| # | Linh kien | Chan linh kien | Chan ESP32 | Ghi chu |
|---:|---|---|---|---|
| 1 | DHT22 | DATA | GPIO4 | Can ban 1 |
| 2 | DHT22 | VCC | 3V3 | Dung 3.3V |
| 3 | DHT22 | GND | GND | Mass chung |
| 4 | Rain sensor | AO | GPIO34 | Task 2, input-only |
| 5 | Rain sensor | VCC | 3V3 | Neu module yeu cau 5V, can kiem tra muc tin hieu AO |
| 6 | Rain sensor | GND | GND | Mass chung |
| 7 | LDR divider | OUT | GPIO35 | Task 1 input-only |
| 8 | LDR divider | VCC/GND | 3V3/GND | LDR + dien tro 10k tao cau chia ap |
| 9 | LED status | DIN/IN | GPIO26 | Task 1 output, co the qua transistor |
| 10 | Motor driver L298N | IN1 | GPIO18 | Dieu khien chieu motor |
| 11 | Motor driver L298N | IN2 | GPIO19 | Dieu khien chieu motor |
| 12 | Motor driver L298N | ENA | GPIO23 | PWM toc do motor |
| 13 | Motor driver | OUT1/OUT2 | Motor | Sao phoi thu/keo |
| 14 | Limit switch retracted | NO/COM | GPIO32/GND | Input pull-up |
| 15 | Limit switch extended | NO/COM | GPIO33/GND | Input pull-up |
| 16 | Nut reset WiFi | NO/COM | GPIO14/GND | Input pull-up, nhan giu 3 giay |

## 2. So do ASCII

```text
                         ESP32 DevKit
                   +----------------------+
      DHT22 DATA ->| GPIO4          3V3  |--> DHT22/Rain/LDR VCC
 Rain sensor AO -> | GPIO34         GND  |--> GND chung
      LDR OUT   -> | GPIO35              |
  Reset WiFi    -> | GPIO14              |
 Limit retract  -> | GPIO32              |
 Limit extend   -> | GPIO33              |
                   |                      |
 LED status IN <-  | GPIO26              |
 Motor IN1    <-   | GPIO18              |
 Motor IN2    <-   | GPIO19              |
 Motor ENA PWM <-  | GPIO23              |
                   +----------------------+

 Motor driver dung nguon rieng phu hop voi motor.
 Noi GND nguon motor voi GND ESP32 de tin hieu dieu khien co cung mass.
```

## 3. DHT22

```text
DHT22 VCC  -> ESP32 3V3
DHT22 DATA -> ESP32 GPIO4
DHT22 GND  -> ESP32 GND
```

Neu dung DHT22 rời 4 chan, them dien tro 10k giua DATA va VCC.

## 4. Rain sensor

```text
Rain AO  -> ESP32 GPIO34
Rain VCC -> ESP32 3V3
Rain GND -> ESP32 GND
```

GPIO34 chi doc analog/input, rat phu hop voi rain sensor. Can hieu chuan `RAIN_WET_THRESHOLD` trong `config.h` vi moi module co nguong khac nhau.

## 5. LDR + LED status

```text
3V3 --- LDR ---+--- 10k --- GND
               |
               +--- ESP32 GPIO35

ESP32 GPIO26 -> dien tro/transistor -> LED status -> GND/5V
```

Neu LED strip can dong lon, khong cap truc tiep tu GPIO. Dung transistor/MOSFET va nguon rieng.

## 6. Motor driver va limit switch

```text
ESP32 GPIO18 -> L298N IN1
ESP32 GPIO19 -> L298N IN2
ESP32 GPIO23 -> L298N ENA
L298N OUT1/OUT2 -> Motor
Nguon motor -> L298N Vmotor/GND
ESP32 GND -> L298N GND
```

Limit switch:

```text
GPIO32 ---- switch retracted ---- GND
GPIO33 ---- switch extended  ---- GND
```

Trong code dung `INPUT_PULLUP`: khi chua cham cong tac la HIGH, khi cham cong tac la LOW.

## 7. Luu y an toan

- Khong cap motor tu chan 5V cua ESP32 neu motor can dong lon.
- Luon noi GND chung giua ESP32 va driver.
- Test motor khong tai truoc, sau do moi lap vao sao phoi.
- De tranh hu hong, nen bat buoc lap limit switch hoac gioi han thoi gian chay motor.

