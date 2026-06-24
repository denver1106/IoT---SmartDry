// ============================================
// task1_light_to_led.ino - Skeleton cho 24127493
// Task 1: Them luong Input -> Output.
//
// Input: LDR doc analog tren GPIO35.
// Output: LED status tren GPIO26.
// Vi sao dung luong local: de dung yeu cau Input -> Output, khong can web/cloud.
// ============================================

void handleLightToLedTask1Skeleton() {
  if (millis() - lastLightRead < LIGHT_READ_INTERVAL_MS) return;
  lastLightRead = millis();

  int lightRaw = analogRead(LDR_PIN);
  bool dark = lightRaw > LDR_DARK_THRESHOLD;

  digitalWrite(STATUS_LED_PIN, dark ? HIGH : LOW);

  StaticJsonDocument<192> doc;
  addBasePayload(doc);
  doc["lightRaw"] = lightRaw;
  doc["dark"] = dark;
  doc["ledOn"] = dark;

  // Publish de Node-RED co log minh chung, nhung task van dat bang dieu khien local.
  publishJson(TOPIC_LIGHT_LED, doc);
}

