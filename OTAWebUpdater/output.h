#include <Arduino.h>

#define LPWM_REAR D1
#define RPWM_REAR D2
#define LPWM_FRONT D3
#define RPWM_FRONT D4

#define PWM_REAR D7
#define PWM_FRONT D5

void output_setup(void)
{
    pinMode(LPWM_FRONT, OUTPUT);
    pinMode(RPWM_FRONT, OUTPUT);
    pinMode(LPWM_REAR, OUTPUT);
    pinMode(RPWM_REAR, OUTPUT);
    pinMode(PWM_FRONT, OUTPUT);
    pinMode(PWM_REAR, OUTPUT);

    analogWriteRange(50);
    analogWriteFreq(1000000UL);

    // analogWrite(PWM_REAR, 255);
    // analogWrite(PWM_FRONT, 255);
}

void setFront(int direction, int value)
{
    if (direction == 1)
    {
        digitalWrite(LPWM_FRONT, LOW);
        digitalWrite(RPWM_FRONT, HIGH);
    }
    else
    {
        digitalWrite(LPWM_FRONT, HIGH);
        digitalWrite(RPWM_FRONT, LOW);
    }
    analogWrite(PWM_FRONT, value);
}

void setRear(int direction, int value)
{
    if (direction == 1)
    {
        digitalWrite(LPWM_REAR, LOW);
        digitalWrite(RPWM_REAR, HIGH);
    }
    else
    {
        digitalWrite(LPWM_REAR, HIGH);
        digitalWrite(RPWM_REAR, LOW);
    }
    analogWrite(PWM_REAR, value);
}

void output_loop(void) {
}