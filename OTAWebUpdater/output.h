#include <Arduino.h>

#define LPWM_REAR D1
#define RPWM_REAR D2
#define LPWM_FRONT D3
#define RPWM_FRONT D4

#define PWM_REAR D5
#define PWM_FRONT D6

void output_setup(void)
{
    pinMode(LPWM_FRONT, OUTPUT);
    pinMode(RPWM_FRONT, OUTPUT);
    pinMode(LPWM_REAR, OUTPUT);
    pinMode(RPWM_REAR, OUTPUT);
    pinMode(PWM_FRONT, OUTPUT);
    pinMode(PWM_REAR, OUTPUT);

    analogWrite(PWM_REAR, 200);
    analogWrite(PWM_FRONT, 200);
}

void output_loop(void) {
    // digitalWrite(LPWM_FRONT, LOW);
    // digitalWrite(RPWM_FRONT, HIGH);
    // digitalWrite(LPWM_REAR, LOW);
    // digitalWrite(RPWM_REAR, HIGH);
    // delay(1000);
    // digitalWrite(LPWM_FRONT, LOW);
    // digitalWrite(RPWM_FRONT, LOW);
    // digitalWrite(LPWM_REAR, LOW);
    // digitalWrite(RPWM_REAR, LOW);
    // delay(2000);
    // digitalWrite(LPWM_FRONT, HIGH);
    // digitalWrite(RPWM_FRONT, LOW);
    // digitalWrite(LPWM_REAR, HIGH);
    // digitalWrite(RPWM_REAR, LOW);
    // delay(2000);
}