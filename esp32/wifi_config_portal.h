// ============================================
// wifi_config_portal.h - WiFi Config Portal cho SmartDry
// Task 12 - 24127493
//
// Muc dich:
// - Khi thiet bi chua co WiFi hoac nhan giu nut reset, ESP32 tao AP SmartDry_Setup.
// - Nguoi dung vao 192.168.4.1 de chon WiFi va nhap MQTT broker.
// - SSID/password/broker duoc luu vao Preferences, khong hardcode trong sketch.
//
// Vi sao can file rieng?
// - Task 12 la phan doc lap va co the giai thich rieng khi van dap.
// - Sketch chinh gon hon, chi goi ensureWiFiConfigured().
// ============================================

#ifndef SMARTDRY_WIFI_CONFIG_PORTAL_H
#define SMARTDRY_WIFI_CONFIG_PORTAL_H

#include <ArduinoJson.h>
#include <Preferences.h>
#include <WebServer.h>
#include <WiFi.h>
#include "config.h"

WebServer smartDryConfigServer(80);
Preferences smartDryPrefs;

const char* SMARTDRY_AP_SSID = "SmartDry_Setup";
const char* SMARTDRY_AP_PASSWORD = "12345678";

// Trang HTML nho gon de cau hinh WiFi va MQTT broker.
// Luu trong PROGMEM de tiet kiem RAM cho ESP32.
const char SMARTDRY_PORTAL_HTML[] PROGMEM = R"rawliteral(
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SmartDry Setup</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background: #f4f7f8;
      color: #172126;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    main {
      width: 100%;
      max-width: 430px;
      background: #ffffff;
      border: 1px solid #d8e1e5;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 12px 30px rgba(15, 31, 36, 0.12);
    }
    h1 { font-size: 22px; margin: 0 0 8px; }
    p { margin: 0 0 18px; color: #60727b; line-height: 1.45; }
    label { display: block; margin: 14px 0 6px; font-weight: 700; }
    input, select, button {
      width: 100%;
      min-height: 44px;
      border-radius: 6px;
      border: 1px solid #bccbd1;
      padding: 10px 12px;
      font-size: 15px;
    }
    button {
      margin-top: 14px;
      border: 0;
      background: #0d6b6f;
      color: white;
      font-weight: 700;
      cursor: pointer;
    }
    button.secondary {
      background: #e9f0f2;
      color: #172126;
      border: 1px solid #c9d6db;
    }
    #status {
      margin-top: 14px;
      padding: 10px 12px;
      border-radius: 6px;
      display: none;
      line-height: 1.4;
    }
    #status.show { display: block; }
    #status.ok { background: #e8f6ee; color: #145c35; }
    #status.err { background: #fdecec; color: #8a1f1f; }
    #status.info { background: #eaf3ff; color: #164b7a; }
  </style>
</head>
<body>
  <main>
    <h1>SmartDry Setup</h1>
    <p>Chon WiFi nha ban va nhap dia chi MQTT broker cua may dang chay Node-RED.</p>
    <button class="secondary" type="button" onclick="scanWifi()">Quet WiFi</button>
    <form id="setupForm">
      <label for="ssid">WiFi SSID</label>
      <select id="ssid" name="ssid">
        <option value="">Nhan Quet WiFi de tim mang</option>
      </select>

      <label for="password">Mat khau WiFi</label>
      <input id="password" name="password" type="password" autocomplete="off">

      <label for="broker">MQTT broker IP</label>
      <input id="broker" name="broker" type="text" placeholder="192.168.1.100">

      <button type="submit">Luu va khoi dong lai</button>
    </form>
    <div id="status"></div>
  </main>
  <script>
    const statusBox = document.getElementById('status');
    const setStatus = (type, text) => {
      statusBox.className = 'show ' + type;
      statusBox.textContent = text;
    };

    async function scanWifi() {
      setStatus('info', 'Dang quet WiFi...');
      try {
        const response = await fetch('/scan');
        const networks = await response.json();
        const select = document.getElementById('ssid');
        select.innerHTML = '';
        if (!networks.length) {
          select.innerHTML = '<option value="">Khong tim thay WiFi</option>';
          setStatus('err', 'Khong tim thay mang WiFi nao.');
          return;
        }
        const first = document.createElement('option');
        first.value = '';
        first.textContent = '-- Chon WiFi --';
        select.appendChild(first);
        networks.forEach((network) => {
          const opt = document.createElement('option');
          opt.value = network.ssid;
          opt.textContent = `${network.ssid} (${network.rssi} dBm)`;
          select.appendChild(opt);
        });
        setStatus('ok', `Da tim thay ${networks.length} mang.`);
      } catch (err) {
        setStatus('err', 'Loi quet WiFi: ' + err.message);
      }
    }

    document.getElementById('setupForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = new URLSearchParams(new FormData(event.target));
      if (!form.get('ssid')) {
        setStatus('err', 'Vui long chon WiFi.');
        return;
      }
      if (!form.get('broker')) {
        form.set('broker', '192.168.1.100');
      }
      setStatus('info', 'Dang luu cau hinh...');
      try {
        const response = await fetch('/save', { method: 'POST', body: form });
        if (!response.ok) throw new Error(await response.text());
        setStatus('ok', 'Da luu. Thiet bi se khoi dong lai.');
      } catch (err) {
        setStatus('err', 'Loi luu cau hinh: ' + err.message);
      }
    });
  </script>
</body>
</html>
)rawliteral";

bool isSmartDryWiFiConfigured() {
  smartDryPrefs.begin("smartdry-net", true);
  String ssid = smartDryPrefs.getString("ssid", "");
  smartDryPrefs.end();
  return ssid.length() > 0;
}

String getSavedMqttBroker() {
  smartDryPrefs.begin("smartdry-net", true);
  String broker = smartDryPrefs.getString("broker", DEFAULT_MQTT_SERVER);
  smartDryPrefs.end();
  return broker;
}

bool connectSavedSmartDryWiFi() {
  smartDryPrefs.begin("smartdry-net", true);
  String ssid = smartDryPrefs.getString("ssid", "");
  String password = smartDryPrefs.getString("password", "");
  smartDryPrefs.end();

  if (ssid.length() == 0) {
    Serial.println("[WiFi] Chua co SSID da luu.");
    return false;
  }

  Serial.print("[WiFi] Dang ket noi toi ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid.c_str(), password.c_str());

  unsigned long startedAt = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - startedAt > WIFI_CONNECT_TIMEOUT_MS) {
      Serial.println("[WiFi] Ket noi that bai do timeout.");
      WiFi.disconnect();
      return false;
    }
    delay(300);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("[WiFi] Da ket noi, IP: ");
  Serial.println(WiFi.localIP());
  return true;
}

void clearSmartDryWiFiConfig() {
  Serial.println("[WiFi] Xoa cau hinh WiFi/MQTT da luu.");
  smartDryPrefs.begin("smartdry-net", false);
  smartDryPrefs.clear();
  smartDryPrefs.end();
  delay(500);
  ESP.restart();
}

void handleSmartDryPortalRoot() {
  smartDryConfigServer.send(200, "text/html", SMARTDRY_PORTAL_HTML);
}

void handleSmartDryPortalScan() {
  int count = WiFi.scanNetworks();
  StaticJsonDocument<1024> doc;
  JsonArray networks = doc.to<JsonArray>();

  for (int i = 0; i < count; i++) {
    JsonObject item = networks.createNestedObject();
    item["ssid"] = WiFi.SSID(i);
    item["rssi"] = WiFi.RSSI(i);
    item["encrypted"] = WiFi.encryptionType(i) != WIFI_AUTH_OPEN;
  }

  String response;
  serializeJson(doc, response);
  WiFi.scanDelete();
  smartDryConfigServer.send(200, "application/json", response);
}

void handleSmartDryPortalSave() {
  String ssid = smartDryConfigServer.arg("ssid");
  String password = smartDryConfigServer.arg("password");
  String broker = smartDryConfigServer.arg("broker");

  if (ssid.length() == 0) {
    smartDryConfigServer.send(400, "text/plain", "SSID is required");
    return;
  }
  if (broker.length() == 0) {
    broker = DEFAULT_MQTT_SERVER;
  }

  smartDryPrefs.begin("smartdry-net", false);
  smartDryPrefs.putString("ssid", ssid);
  smartDryPrefs.putString("password", password);
  smartDryPrefs.putString("broker", broker);
  smartDryPrefs.end();

  Serial.println("[Portal] Da luu WiFi va MQTT broker.");
  smartDryConfigServer.send(200, "text/plain", "OK");
  delay(1200);
  ESP.restart();
}

void handleSmartDryPortalNotFound() {
  smartDryConfigServer.sendHeader("Location", "/", true);
  smartDryConfigServer.send(302, "text/plain", "");
}

void startSmartDryConfigPortal() {
  Serial.println("[Portal] Khoi dong SmartDry WiFi Config Portal.");
  WiFi.mode(WIFI_AP);
  WiFi.softAP(SMARTDRY_AP_SSID, SMARTDRY_AP_PASSWORD);

  Serial.print("[Portal] SSID: ");
  Serial.println(SMARTDRY_AP_SSID);
  Serial.print("[Portal] IP: ");
  Serial.println(WiFi.softAPIP());

  smartDryConfigServer.on("/", HTTP_GET, handleSmartDryPortalRoot);
  smartDryConfigServer.on("/scan", HTTP_GET, handleSmartDryPortalScan);
  smartDryConfigServer.on("/save", HTTP_POST, handleSmartDryPortalSave);
  smartDryConfigServer.onNotFound(handleSmartDryPortalNotFound);
  smartDryConfigServer.begin();

  while (true) {
    smartDryConfigServer.handleClient();
    delay(2);
  }
}

void ensureWiFiConfigured() {
  if (!isSmartDryWiFiConfigured()) {
    startSmartDryConfigPortal();
  }

  if (!connectSavedSmartDryWiFi()) {
    startSmartDryConfigPortal();
  }
}

#endif // SMARTDRY_WIFI_CONFIG_PORTAL_H

