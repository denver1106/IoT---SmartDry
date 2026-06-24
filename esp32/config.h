// ============================================
// config.h - Cau hinh chung cho SmartDry
// Tap trung GPIO, nguong doc cam bien, MQTT topic va hang so thoi gian.
// Khi doi phan cung hoac topic, sua o file nay truoc de cac file con dong bo.
// ============================================

#ifndef SMARTDRY_CONFIG_H
#define SMARTDRY_CONFIG_H

// ============================================
// THONG TIN THIET BI
// ============================================
#define DEVICE_ID "smartdry-01"

// ============================================
// MQTT
// MQTT broker co the cau hinh qua WiFi portal, gia tri nay la fallback.
// ============================================
#define MQTT_PORT 1883
#define DEFAULT_MQTT_SERVER "192.168.1.100"

// ============================================
// GPIO - INPUT
// ============================================
#define DHT_PIN 4                 // Can ban 1 - 24127192: DHT22/DHT11 -> Web
#define RAIN_SENSOR_PIN 34        // Task 2 - 24127192: Rain sensor analog -> Web
#define LDR_PIN 35                // Task 1 - 24127493: LDR -> LED status
#define RESET_WIFI_BTN_PIN 14     // Task 12 - 24127493: nhan giu de reset WiFi
#define LIMIT_RETRACTED_PIN 32    // Bao ve motor khi sao da thu het
#define LIMIT_EXTENDED_PIN 33     // Bao ve motor khi sao da keo het

// ============================================
// GPIO - OUTPUT
// ============================================
#define STATUS_LED_PIN 26         // Task 1 output: LED bao dieu kien anh sang
#define MOTOR_IN1_PIN 18          // Can ban 2 output: chieu 1 motor
#define MOTOR_IN2_PIN 19          // Can ban 2 output: chieu 2 motor
#define MOTOR_EN_PIN 23           // PWM enable/speed cho L298N

// ============================================
// CAM BIEN VA NGUONG
// ============================================
#define DHT_TYPE DHT22            // Doi thanh DHT11 neu dung DHT11
#define RAIN_WET_THRESHOLD 2200   // Gia tri analog nho hon nguong -> co mua, can hieu chuan thuc te
#define LDR_DARK_THRESHOLD 2500   // Gia tri analog lon hon nguong -> toi, bat LED

// ============================================
// THOI GIAN
// ============================================
#define ENV_READ_INTERVAL_MS 10000
#define RAIN_READ_INTERVAL_MS 3000
#define LIGHT_READ_INTERVAL_MS 2000
#define HEARTBEAT_INTERVAL_MS 30000
#define WIFI_CONNECT_TIMEOUT_MS 15000
#define MOTOR_MAX_RUN_MS 20000    // Chan motor chay qua lau neu limit switch loi
#define RESET_WIFI_HOLD_MS 3000

// ============================================
// MQTT TOPICS
// ============================================
#define TOPIC_ENVIRONMENT "smartdry/sensor/environment"
#define TOPIC_RAIN "smartdry/sensor/rain"
#define TOPIC_RACK_CONTROL "smartdry/rack/control"
#define TOPIC_RACK_STATUS "smartdry/rack/status"
#define TOPIC_LIGHT_LED "smartdry/task1/light-led"
#define TOPIC_HEARTBEAT "smartdry/system/heartbeat"

#endif // SMARTDRY_CONFIG_H

