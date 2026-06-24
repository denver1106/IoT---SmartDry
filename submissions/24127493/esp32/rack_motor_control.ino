// ============================================
// rack_motor_control.ino - Skeleton cho 24127493
// Can ban 2: Web -> MQTT -> ESP32 -> Motor output.
//
// Luu y:
// - Motor can nguon rieng, khong lay dong truc tiep tu ESP32.
// - Limit switch va timeout la lop bao ve de motor khong chay qua hanh trinh.
// ============================================

void driveRackMotorSkeleton(const char* action) {
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

  ledcWrite(0, 190);
}

void updateRackMotorSafetySkeleton() {
  if (!motorRunning) return;

  bool retractedLimit = digitalRead(LIMIT_RETRACTED_PIN) == LOW;
  bool extendedLimit = digitalRead(LIMIT_EXTENDED_PIN) == LOW;

  if (rackTarget == "retract" && retractedLimit) {
    stopRackMotor("limit_retracted", "retracted");
  } else if (rackTarget == "extend" && extendedLimit) {
    stopRackMotor("limit_extended", "extended");
  } else if (millis() - motorStartedAt > MOTOR_MAX_RUN_MS) {
    stopRackMotor("timeout_safety");
  }
}
