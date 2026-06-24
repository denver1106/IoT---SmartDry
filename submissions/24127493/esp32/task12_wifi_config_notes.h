// ============================================
// task12_wifi_config_notes.h - Ghi chu trien khai cho 24127493
// Task 12: Tu xay dung WiFi Config Portal.
//
// File chinh: ../../esp32/wifi_config_portal.h
// ============================================

// Cac ham can nam:
// - isSmartDryWiFiConfigured(): kiem tra da co SSID trong Preferences chua.
// - connectSavedSmartDryWiFi(): doc SSID/password tu Preferences va ket noi WiFi.
// - startSmartDryConfigPortal(): tao AP SmartDry_Setup va web server port 80.
// - handleSmartDryPortalScan(): scan WiFi va tra JSON ve browser.
// - handleSmartDryPortalSave(): luu SSID/password/MQTT broker va reboot.
// - clearSmartDryWiFiConfig(): xoa cau hinh khi nhan giu nut reset.

// Vi sao duoc 2 diem:
// - Khong dung WiFiManager.
// - Tu tao WebServer.h, route HTTP va Preferences.h.
// - Nguoi dung co the cau hinh WiFi khi moi mua thiet bi hoac doi mang.

