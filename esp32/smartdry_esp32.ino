// ============================================
// smartdry_esp32.ino
// SmartDry - sao phoi thong minh
// ESP32 + MQTT + Node-RED + Firestore/FCM/Email qua backend
// ============================================
// Thu vien can cai:
// - PubSubClient
// - ArduinoJson v6
// - DHT sensor library
// - Adafruit Unified Sensor
// ============================================

#include <ArduinoJson.h>
#include <DHT.h>
#include <PubSubClient.h>
#include <WiFi.h>

#include "config.h"
#include "wifi_config_portal.h"

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
DHT dht(DHT_PIN, DHT_TYPE);

char mqttServer[48] = DEFAULT_MQTT_SERVER;

unsigned long lastEnvRead = 0;
unsigned long lastRainRead = 0;
unsigned long lastLightRead = 0;
unsigned long lastHeartbeat = 0;
unsigned long motorStartedAt = 0;
unsigned long resetButtonStartedAt = 0;

bool lastRainState = false;
bool lastDarkState = false;
bool motorRunning = false;
bool resetButtonActive = false;

String rackState = "stopped";
String rackTarget = "none";

// ============================================
// JSON helper
// Them cac truong chung de Node-RED de log va truy vet thiet bi.
// ============================================
template <size_t Capacity>
void addBasePayload(StaticJsonDocument<Capacity>& doc) {
  doc["deviceId"] = DEVICE_ID;
  doc["timestamp"] = millis();
}

void publishJson(const char* topic, JsonDocument& doc) {
  char buffer[512];
  size_t len = serializeJson(doc, buffer, sizeof(buffer));
  mqttClient.publish(topic, buffer, len);
  Serial.print("[MQTT] Publish ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(buffer);
}

// ============================================
// Can ban 1 - 24127192
// Doc DHT22 de tao luong Input -> Web.
// Vi sao can ham rieng: day la luong can ban cua 24127192, can giai thich duoc
// du lieu di tu cam bien, qua ESP32, MQTT, Node-RED backend, roi dashboard.
// ============================================
void readEnvironmentSensor() {
  if (millis() - lastEnvRead < ENV_READ_INTERVAL_MS) return;
  lastEnvRead = millis();

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("[DHT] Loi doc DHT22/DHT11.");
    return;
  }

  float heatIndex = dht.computeHeatIndex(temperature, humidity, false);

  StaticJsonDocument<192> doc;
  addBasePayload(doc);
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["heatIndex"] = heatIndex;
  publishJson(TOPIC_ENVIRONMENT, doc);
}

// ============================================
// Task 2 - 24127192
// Rain sensor -> Web.
// Ham nay doc analog rain sensor, chuyen thanh phan tram va publish len MQTT.
// Node-RED dung topic nay de hien thi canh bao mua tren dashboard.
// ============================================
void readRainSensorTask2() {
  if (millis() - lastRainRead < RAIN_READ_INTERVAL_MS) return;
  lastRainRead = millis();

  int raw = analogRead(RAIN_SENSOR_PIN);
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

// ============================================
// Task 1 - 24127493
// LDR -> LED status, luong Input -> Output truc tiep tren ESP32.
// Vi sao xu ly local: task 1 yeu cau input dieu khien output, khong phu thuoc web.
// MQTT publish chi de dashboard ghi nhan, khong phai dieu kien chinh cua task.
// ============================================
void handleLightToLedTask1() {
  if (millis() - lastLightRead < LIGHT_READ_INTERVAL_MS) return;
  lastLightRead = millis();

  int lightRaw = analogRead(LDR_PIN);
  bool dark = lightRaw > LDR_DARK_THRESHOLD;
  bool ledOn = dark;
  digitalWrite(STATUS_LED_PIN, ledOn ? HIGH : LOW);

  StaticJsonDocument<192> doc;
  addBasePayload(doc);
  doc["lightRaw"] = lightRaw;
  doc["dark"] = dark;
  doc["ledOn"] = ledOn;
  doc["stateChanged"] = dark != lastDarkState;
  publishJson(TOPIC_LIGHT_LED, doc);

  lastDarkState = dark;
}

// ============================================
// Can ban 2 - 24127493
// Dieu khien motor sao phoi tu Node-RED.
// action hop le: extend, retract, stop.
// ============================================
void stopRackMotor(const char* reason, const char* finalState = "stopped") {
  ledcWrite(0, 0);
  digitalWrite(MOTOR_IN1_PIN, LOW);
  digitalWrite(MOTOR_IN2_PIN, LOW);
  motorRunning = false;
  rackState = finalState;

  StaticJsonDocument<192> doc;
  addBasePayload(doc);
  doc["state"] = rackState;
  doc["target"] = rackTarget;
  doc["motorRunning"] = motorRunning;
  doc["reason"] = reason;
  publishJson(TOPIC_RACK_STATUS, doc);
}

void driveRackMotor(const char* action) {
  rackTarget = action;
  motorStartedAt = millis();
  motorRunning = true;

  if (strcmp(action, "extend") == 0) {
    digitalWrite(MOTOR_IN1_PIN, HIGH);
    digitalWrite(MOTOR_IN2_PIN, LOW);
    rackState = "extending";
  } else if (strcmp(action, "retract") == 0) {
    digitalWrite(MOTOR_IN1_PIN, LOW);
    digitalWrite(MOTOR_IN2_PIN, HIGH);
    rackState = "retracting";
  } else {
    stopRackMotor("manual_stop");
    return;
  }

  ledcWrite(0, 190); // PWM 0-255. Giam toc de demo an toan.

  StaticJsonDocument<192> doc;
  addBasePayload(doc);
  doc["state"] = rackState;
  doc["target"] = rackTarget;
  doc["motorRunning"] = motorRunning;
  doc["reason"] = "command";
  publishJson(TOPIC_RACK_STATUS, doc);
}

void updateRackMotorSafety() {
  if (!motorRunning) return;

  bool retractedLimit = digitalRead(LIMIT_RETRACTED_PIN) == LOW;
  bool extendedLimit = digitalRead(LIMIT_EXTENDED_PIN) == LOW;

  if (rackTarget == "retract" && retractedLimit) {
    stopRackMotor("limit_retracted", "retracted");
    return;
  }

  if (rackTarget == "extend" && extendedLimit) {
    stopRackMotor("limit_extended", "extended");
    return;
  }

  if (millis() - motorStartedAt > MOTOR_MAX_RUN_MS) {
    stopRackMotor("timeout_safety");
  }
}

// ============================================
// MQTT callback
// Xu ly lenh tu Node-RED. Tach rieng de 24127493 de giai thich luong Web -> Output.
// ============================================
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, message);
  if (error) {
    Serial.print("[MQTT] JSON loi: ");
    Serial.println(error.c_str());
    return;
  }

  if (strcmp(topic, TOPIC_RACK_CONTROL) == 0) {
    const char* action = doc["action"] | "stop";
    Serial.print("[Rack] Nhan lenh: ");
    Serial.println(action);

    if (strcmp(action, "extend") == 0 || strcmp(action, "retract") == 0) {
      driveRackMotor(action);
    } else {
      stopRackMotor("dashboard_stop");
    }
  }
}

void connectMQTT() {
  if (mqttClient.connected()) return;

  String clientId = String("SmartDry_") + String(random(0xffff), HEX);
  Serial.print("[MQTT] Ket noi broker ");
  Serial.print(mqttServer);
  Serial.print(":");
  Serial.println(MQTT_PORT);

  if (mqttClient.connect(clientId.c_str())) {
    Serial.println("[MQTT] Da ket noi.");
    mqttClient.subscribe(TOPIC_RACK_CONTROL);
    stopRackMotor("mqtt_connected");
  } else {
    Serial.print("[MQTT] Loi ket noi, state=");
    Serial.println(mqttClient.state());
  }
}

void publishHeartbeat() {
  if (millis() - lastHeartbeat < HEARTBEAT_INTERVAL_MS) return;
  lastHeartbeat = millis();

  StaticJsonDocument<224> doc;
  addBasePayload(doc);
  doc["status"] = "online";
  doc["uptime"] = millis() / 1000;
  doc["wifiRSSI"] = WiFi.RSSI();
  doc["freeHeap"] = ESP.getFreeHeap();
  doc["rackState"] = rackState;
  publishJson(TOPIC_HEARTBEAT, doc);
}

// ============================================
// Task 12 reset button - 24127493
// Nhan giu 3 giay de xoa WiFi, lan khoi dong sau se vao portal.
// ============================================
void checkResetWiFiButton() {
  bool pressed = digitalRead(RESET_WIFI_BTN_PIN) == LOW;

  if (pressed && !resetButtonActive) {
    resetButtonActive = true;
    resetButtonStartedAt = millis();
    Serial.println("[WiFi] Dang nhan nut reset.");
  }

  if (pressed && resetButtonActive && millis() - resetButtonStartedAt > RESET_WIFI_HOLD_MS) {
    clearSmartDryWiFiConfig();
  }

  if (!pressed) {
    resetButtonActive = false;
  }
}

void setupPins() {
  pinMode(DHT_PIN, INPUT);
  pinMode(RAIN_SENSOR_PIN, INPUT);
  pinMode(LDR_PIN, INPUT);
  pinMode(RESET_WIFI_BTN_PIN, INPUT_PULLUP);
  pinMode(LIMIT_RETRACTED_PIN, INPUT_PULLUP);
  pinMode(LIMIT_EXTENDED_PIN, INPUT_PULLUP);

  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(MOTOR_IN1_PIN, OUTPUT);
  pinMode(MOTOR_IN2_PIN, OUTPUT);
  pinMode(MOTOR_EN_PIN, OUTPUT);

  digitalWrite(STATUS_LED_PIN, LOW);
  digitalWrite(MOTOR_IN1_PIN, LOW);
  digitalWrite(MOTOR_IN2_PIN, LOW);

  // PWM channel 0, 5 kHz, 8-bit. Dung cho ENA cua L298N.
  ledcSetup(0, 5000, 8);
  ledcAttachPin(MOTOR_EN_PIN, 0);
  ledcWrite(0, 0);
}

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println();
  Serial.println("====================================");
  Serial.println(" SmartDry - ESP32 IoT Drying Rack");
  Serial.println(" Device: " DEVICE_ID);
  Serial.println("====================================");

  setupPins();
  dht.begin();

  if (digitalRead(RESET_WIFI_BTN_PIN) == LOW) {
    startSmartDryConfigPortal();
  }

  ensureWiFiConfigured();

  String broker = getSavedMqttBroker();
  broker.toCharArray(mqttServer, sizeof(mqttServer));
  mqttClient.setServer(mqttServer, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  mqttClient.setBufferSize(512);

  connectMQTT();
}

void loop() {
  checkResetWiFiButton();

  if (WiFi.status() != WL_CONNECTED) {
    connectSavedSmartDryWiFi();
  }

  if (!mqttClient.connected()) {
    connectMQTT();
  }
  mqttClient.loop();

  readEnvironmentSensor();     // Can ban 1 - 24127192
  readRainSensorTask2();       // Task 2 - 24127192
  handleLightToLedTask1();     // Task 1 - 24127493
  updateRackMotorSafety();     // Can ban 2 - 24127493
  publishHeartbeat();          // Chung
}
