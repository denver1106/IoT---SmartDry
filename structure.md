# Structure - So do mach SmartDry dung ESP32

Tai lieu nay ve lai so do mach SmartDry theo hinh mau dung Arduino UNO, nhung thay bang ESP32 DevKit. Cac module duoc giu tuong tu hinh mau: cam bien mua, DHT11, nut nhan, thu hong ngoai, cam bien anh sang, LCD1602 I2C va mach dieu khien dong co.

Hinh so do mach da xuat: `docs/smartdry_esp32_wiring.png`.

## 1. Linh kien su dung

| # | Linh kien | Vai tro trong SmartDry |
|---:|---|---|
| 1 | ESP32 DevKit | Board dieu khien trung tam, thay Arduino UNO |
| 2 | Remote hong ngoai 20 phim | Dieu khien thu/keo/dung sao phoi bang remote |
| 3 | Module cam bien mua | Phat hien mua de gui web/FCM/email |
| 4 | Module DHT11 | Doc nhiet do va do am |
| 5 | Nut nhan 4 chan 12x12 | Dieu khien thu/keo/dung truc tiep tren mach |
| 6 | Module thu hong ngoai 1838T/MH-R38 | Nhan tin hieu remote hong ngoai |
| 7 | Module cam bien anh sang MS-CDS05 | Do muc sang de quyet dinh dieu kien phoi |
| 8 | Breadboard | Dau noi thu nghiem |
| 9 | Dong co 5V | Keo/thu sao phoi |
| 10 | Driver dong co L298N hoac ULN2003 | Khuyech dai dong cho dong co |
| 11 | LCD1602 + module I2C | Hien thi trang thai tai thiet bi |

## 2. Luu y truoc khi dau mach

- ESP32 dung muc logic 3.3V. Chan GPIO cua ESP32 khong chiu duoc tin hieu 5V.
- Neu module sensor co VCC 3.3V/5V, uu tien cap 3.3V de tin hieu OUT khong vuot qua 3.3V.
- LCD1602 I2C thuong cap 5V de sang ro, nhung module I2C co the keo SDA/SCL len 5V. An toan nhat la dung level shifter I2C 3.3V <-> 5V, hoac cap LCD I2C bang 3.3V neu man hinh van hien thi duoc.
- Dong co khong cap truc tiep tu ESP32. Dung nguon 5V rieng cho driver/motor, va noi GND nguon motor chung voi GND ESP32.
- Neu dong co la 28BYJ-48 5 day, nen dung driver ULN2003. L298N phu hop hon voi motor DC hoac stepper 4 day/bipolar. Khong cam truc tiep 28BYJ-48 5 day vao L298N neu chua biet cach chuyen day.

## 3. Bang quy doi Arduino UNO sang ESP32

| Chuc nang tren hinh mau | Arduino UNO | ESP32 de xuat | Ghi chu |
|---|---|---|---|
| IR receiver DATA | D2 | GPIO13 | Nhan tin hieu remote |
| Relay/motor command | D3 | GPIO18/GPIO19/GPIO23 | ESP32 dung nhieu chan de dieu khien driver motor |
| DHT11 DATA | D8 hoac D7 | GPIO4 | Khop code SmartDry hien tai |
| Nut nhan 1 | D10 | GPIO25 | Dung `INPUT_PULLUP` |
| Nut nhan 2 | D11 | GPIO27 | Dung `INPUT_PULLUP` |
| Rain sensor AO | A0 | GPIO34 | GPIO34 chi doc input/analog |
| Light sensor AO | A1 | GPIO35 | GPIO35 chi doc input/analog |
| LCD I2C SDA | A4 | GPIO21 | SDA mac dinh cua ESP32 |
| LCD I2C SCL | A5 | GPIO22 | SCL mac dinh cua ESP32 |
| 5V | 5V | VIN/5V hoac nguon ngoai | Khong dua 5V vao GPIO |
| GND | GND | GND | Tat ca module phai chung GND |

## 4. Pin mapping de xuat cho SmartDry

| Module | Chan module | Noi voi ESP32/nguon | Ghi chu |
|---|---|---|---|
| Cam bien mua | VCC | 3V3 | Uu tien 3.3V de OUT an toan |
| Cam bien mua | GND | GND | Mass chung |
| Cam bien mua | AO | GPIO34 | Doc muc mua analog |
| Cam bien mua | DO | Khong bat buoc, co the noi GPIO16 | Chi dung neu muon doc digital |
| DHT11 | VCC | 3V3 | Module DHT11 3 chan |
| DHT11 | DATA/OUT | GPIO4 | Can ban 1 |
| DHT11 | GND | GND | Mass chung |
| Nut nhan Thu sao | 1 chan | GPIO25 | Cau hinh `INPUT_PULLUP` |
| Nut nhan Thu sao | chan doi dien | GND | Nhan nut -> GPIO25 = LOW |
| Nut nhan Keo/Dung | 1 chan | GPIO27 | Cau hinh `INPUT_PULLUP` |
| Nut nhan Keo/Dung | chan doi dien | GND | Nhan nut -> GPIO27 = LOW |
| Thu hong ngoai 1838T | VCC | 3V3 | Neu module yeu cau 5V, can dam bao DATA khong len 5V |
| Thu hong ngoai 1838T | GND | GND | Mass chung |
| Thu hong ngoai 1838T | DATA/S | GPIO13 | Nhan remote |
| Cam bien anh sang MS-CDS05 | VCC | 3V3 | Uu tien 3.3V |
| Cam bien anh sang MS-CDS05 | GND | GND | Mass chung |
| Cam bien anh sang MS-CDS05 | AO | GPIO35 | Doc muc sang analog |
| Cam bien anh sang MS-CDS05 | DO | Khong bat buoc, co the noi GPIO17 | Neu muon doc nguong digital |
| LCD1602 I2C | GND | GND | Mass chung |
| LCD1602 I2C | VCC | 5V hoac 3V3 | 5V sang ro hon, 3V3 an toan hon cho I2C |
| LCD1602 I2C | SDA | GPIO21 | Nen dung level shifter neu LCD cap 5V |
| LCD1602 I2C | SCL | GPIO22 | Nen dung level shifter neu LCD cap 5V |
| Nut reset WiFi | 1 chan | GPIO14 | Nhan giu 3 giay de xoa WiFi |
| Nut reset WiFi | chan doi dien | GND | Cau hinh `INPUT_PULLUP` |

## 5. So do tong the

```text
                              +----------------------+
                              |      ESP32 DevKit    |
                              |                      |
 Cam bien mua AO ------------>| GPIO34          3V3 |----> VCC sensor 3.3V
 Cam bien anh sang AO -------->| GPIO35          GND |----> GND chung
 DHT11 DATA ------------------>| GPIO4               |
 IR receiver DATA ------------>| GPIO13              |
 Nut reset WiFi -------------->| GPIO14              |
 Nut Thu sao ----------------->| GPIO25              |
 Nut Keo/Dung ---------------->| GPIO27              |
 LCD I2C SDA <---------------->| GPIO21              |
 LCD I2C SCL <---------------->| GPIO22              |
 Motor IN1/PHA1 <-------------| GPIO18              |
 Motor IN2/PHA2 <-------------| GPIO19              |
 Motor EN/PHA3 <--------------| GPIO23              |
 Motor PHA4 neu dung stepper <-| GPIO5               |
                              |                      |
                              +----------------------+

  Rail 3.3V tren breadboard: cap cho rain sensor, DHT11, IR receiver, light sensor.
  Rail 5V rieng: cap cho LCD neu can, driver motor va motor.
  Tat ca GND cua ESP32, sensor, LCD, driver motor va nguon ngoai noi chung.
```

## 6. Dau noi chi tiet tung module

### 6.1. Cam bien mua

```text
Rain sensor VCC  -> ESP32 3V3
Rain sensor GND  -> ESP32 GND
Rain sensor AO   -> ESP32 GPIO34
Rain sensor DO   -> de trong, hoac GPIO16 neu can doc digital
```

Ghi chu:

- GPIO34 la chan input-only, dung rat tot cho analog sensor.
- Khi co nuoc, gia tri analog thuong thay doi manh. Can hieu chuan nguong trong code sau khi lap that.

### 6.2. DHT11

```text
DHT11 VCC  -> ESP32 3V3
DHT11 DATA -> ESP32 GPIO4
DHT11 GND  -> ESP32 GND
```

Ghi chu:

- Neu la DHT11 module 3 chan, thuong da co dien tro keo len.
- Neu la cam bien DHT11 roi 4 chan, them dien tro 10k tu DATA len VCC.

### 6.3. Hai nut nhan dieu khien truc tiep

```text
Nut Thu sao:
  Chan 1 -> ESP32 GPIO25
  Chan 2 -> GND

Nut Keo/Dung:
  Chan 1 -> ESP32 GPIO27
  Chan 2 -> GND
```

Ghi chu:

- Trong code cau hinh `pinMode(GPIO25, INPUT_PULLUP)` va `pinMode(GPIO27, INPUT_PULLUP)`.
- Khi khong nhan: GPIO doc HIGH.
- Khi nhan: GPIO bi keo xuong GND, doc LOW.
- Nut 4 chan co 2 cap chan noi san ben trong. Nen dung 2 chan nam cheo hoac 2 chan o hai ben khac nhau cua nut.

### 6.4. Module thu hong ngoai 1838T/MH-R38

```text
IR receiver GND  -> ESP32 GND
IR receiver VCC  -> ESP32 3V3
IR receiver DATA -> ESP32 GPIO13
```

Neu module co thu tu chan nhu hinh mau:

```text
Pin 1 -> GND
Pin 2 -> VCC
Pin 3 -> DATA
```

Ghi chu:

- Remote hong ngoai khong noi day vao ESP32; remote chi phat tin hieu den module receiver.
- Sau khi cai thu vien IRremoteESP8266 hoac IRremote, doc ma phim de gan lenh `extend`, `retract`, `stop`.

### 6.5. Module cam bien anh sang MS-CDS05

```text
Light sensor VCC -> ESP32 3V3
Light sensor GND -> ESP32 GND
Light sensor AO  -> ESP32 GPIO35
Light sensor DO  -> de trong, hoac ESP32 GPIO17 neu can doc digital
```

Ghi chu:

- AO cho gia tri analog min-max tuy theo anh sang.
- Bien tro tren module dung de chinh nguong DO, nhung SmartDry nen doc AO de hien thi muc sang tren web.

### 6.6. LCD1602 I2C

```text
LCD I2C GND -> ESP32 GND
LCD I2C VCC -> 5V hoac 3V3
LCD I2C SDA -> ESP32 GPIO21
LCD I2C SCL -> ESP32 GPIO22
```

Ghi chu:

- Neu LCD cap 5V, chan SDA/SCL cua backpack I2C co the bi keo len 5V. Nen dung level shifter I2C.
- Neu khong co level shifter, thu cap LCD bang 3.3V. Neu LCD qua mo, tang do tuong phan bang bien tro tren module I2C.
- Dia chi I2C thuong gap: `0x27` hoac `0x3F`.

## 7. Dau noi driver dong co

Co 2 cach dau tuy loai dong co nhom dang co.

### Cach A - Khuyen nghi neu dung 28BYJ-48 5V

28BYJ-48 5V thuong la stepper 5 day va di kem board ULN2003. Cach nay de dung va an toan hon L298N.

```text
ULN2003 VCC  -> Nguon 5V ngoai
ULN2003 GND  -> GND nguon ngoai va GND ESP32
ULN2003 IN1  -> ESP32 GPIO18
ULN2003 IN2  -> ESP32 GPIO19
ULN2003 IN3  -> ESP32 GPIO23
ULN2003 IN4  -> ESP32 GPIO5
28BYJ-48 jack 5 day -> cong motor tren ULN2003
```

Ghi chu:

- Khong cap 5V motor tu chan 3V3 cua ESP32.
- Noi GND chung giua ESP32 va nguon 5V cua ULN2003.
- Neu quay nguoc chieu, doi thu tu IN1-IN4 trong code hoac doi thu tu day dieu khien.

### Cach B - Neu bat buoc dung L298N nhu hinh mau

Dung cho motor DC/linear actuator 2 day, hoac stepper 4 day/bipolar. Neu motor dang la 28BYJ-48 5 day, khong nen dung cach nay tru khi da chuyen motor sang dang 4 day.

#### B1. L298N voi motor DC/linear actuator 2 day

```text
L298N +12V/VMS -> Nguon motor 5V-12V tuy motor
L298N GND      -> GND nguon motor va GND ESP32
L298N 5V       -> De nguyen theo huong dan module, khong cap nguoc ve ESP32
L298N ENA      -> ESP32 GPIO23
L298N IN1      -> ESP32 GPIO18
L298N IN2      -> ESP32 GPIO19
L298N OUT1     -> Day motor 1
L298N OUT2     -> Day motor 2
```

Nguyen ly:

```text
IN1 HIGH, IN2 LOW  -> motor quay keo sao ra
IN1 LOW,  IN2 HIGH -> motor quay thu sao vao
IN1 LOW,  IN2 LOW  -> motor dung
ENA PWM            -> dieu chinh toc do
```

#### B2. L298N voi stepper 4 day/bipolar

```text
L298N VMS      -> Nguon motor
L298N GND      -> GND nguon motor va GND ESP32
L298N IN1      -> ESP32 GPIO18
L298N IN2      -> ESP32 GPIO19
L298N IN3      -> ESP32 GPIO23
L298N IN4      -> ESP32 GPIO5
L298N OUT1/OUT2 -> Cap cuon 1 cua stepper
L298N OUT3/OUT4 -> Cap cuon 2 cua stepper
```

Ghi chu:

- ENA va ENB co the cam jumper enable tren module, hoac dua ve 2 chan PWM neu muon dieu khien dong/toc do.
- 28BYJ-48 5 day khong phai stepper 4 day nguyen ban.

## 8. Nguon dien de xuat

```text
Nguon USB ESP32:
  USB 5V -> ESP32

Nguon 5V ngoai:
  +5V -> driver motor, motor, LCD neu can
  GND -> GND driver motor, GND LCD, GND ESP32

Nguon 3.3V tu ESP32:
  3V3 -> rain sensor, DHT11, IR receiver, light sensor
```

Khong noi:

- Khong noi 5V vao GPIO ESP32.
- Khong cap motor tu chan 3V3.
- Khong de GND cua nguon motor tach roi GND ESP32.

## 9. So do day theo mau mau sac goi y

| Mau day | Y nghia |
|---|---|
| Do | 5V hoac 3.3V tuy module, can ghi nhan ro tren breadboard |
| Den | GND |
| Vang | Signal cam bien analog/digital |
| Xanh la | SDA/I2C hoac signal dieu khien |
| Xanh duong | SCL/I2C hoac signal dieu khien |
| Cam | Motor control |

Nen tach 2 rail tren breadboard:

```text
Rail tren: 3.3V sensor + GND sensor
Rail duoi: 5V motor/LCD + GND chung
```

## 10. Checklist kiem tra truoc khi cap nguon

- [ ] Tat ca GND da noi chung.
- [ ] Sensor OUT khong vuot qua 3.3V truoc khi vao ESP32.
- [ ] LCD I2C neu cap 5V da co level shifter hoac da kiem tra SDA/SCL an toan.
- [ ] Driver motor dung nguon rieng, khong lay dong motor tu ESP32.
- [ ] Nut nhan noi ve GND va dung `INPUT_PULLUP`.
- [ ] Rain AO vao GPIO34, light AO vao GPIO35.
- [ ] SDA vao GPIO21, SCL vao GPIO22.
- [ ] Dong co quay thu/keo dung chieu; neu nguoc thi doi logic IN hoac doi day motor.
