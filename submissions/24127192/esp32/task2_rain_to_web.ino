// ============================================
// task2_rain_to_web.ino - Skeleton cho 24127192
// Task 2: Them luong Input -> Web bang rain sensor.
//
// Cach dung:
// - Logic nay da duoc tich hop trong ../../esp32/smartdry_esp32.ino.
// - File nay giu rieng de sinh vien doc/giai thich va co the copy khi tach module.
// ============================================

void readRainSensorTask2Skeleton() {
  // Vi sao dung millis:
  // Rain sensor chi can doc moi vai giay, neu dung delay() thi ESP32 se cham xu ly MQTT.
  if (millis() - lastRainRead < RAIN_READ_INTERVAL_MS) return;
  lastRainRead = millis();

  // GPIO34 la chan input-only, phu hop doc analog rain sensor.
  int raw = analogRead(RAIN_SENSOR_PIN);

  // Moi module co nguong khac nhau, can hieu chuan RAIN_WET_THRESHOLD bang thuc nghiem.
  bool isRaining = raw < RAIN_WET_THRESHOLD;
  int rainPercent = map(constrain(raw, 0, 4095), 4095, 0, 0, 100);

  StaticJsonDocument<192> doc;
  addBasePayload(doc);
  doc["raw"] = raw;
  doc["rainPercent"] = rainPercent;
  doc["isRaining"] = isRaining;
  doc["stateChanged"] = isRaining != lastRainState;

  publishJson(TOPIC_RAIN, doc);
  lastRainState = isRaining;
}

