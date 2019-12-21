/*
  To upload through terminal you can use: curl -F "image=@firmware.bin" esp8266-webupdate.local/update
*/

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPUpdateServer.h>

#include "websocket-handle.h"
#include "output.h"

#ifndef STASSID
#define STASSID "HelloKitty"
#define STAPSK  "asdfghjkl"
#endif

const char* ssid = STASSID;
const char* password = STAPSK;

ESP8266WebServer httpServer(80);
ESP8266HTTPUpdateServer httpUpdater;

void setup(void) {

  Serial.begin(115200);
  Serial.println();
  Serial.println("Booting Sketch...");
  WiFi.mode(WIFI_AP_STA);
  WiFi.begin(ssid, password);

  while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
    Serial.println("WiFi failed, retrying.");
  }

  httpUpdater.setup(&httpServer);
  httpServer.begin();

  socket_setup();
  output_setup();
}

void loop(void) {
  httpServer.handleClient();
  socket_loop();
  output_loop();
}
