#include <Arduino.h>

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>

#include <WebSocketsServer.h>

#define WEBSOCKET_PORT 86

WebSocketsServer webSocket = WebSocketsServer(WEBSOCKET_PORT);

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length)
{
    switch (type)
    {
    case WStype_DISCONNECTED:
        break;
    case WStype_CONNECTED:
    {
        IPAddress ip = webSocket.remoteIP(num);
        // USE_SERIAL.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);

        // send message to client
        webSocket.sendTXT(num, "Hello Kitty!!!");
    }
    break;
    case WStype_TEXT:
        // webSocket.sendTXT(num, "message here");

        // webSocket.broadcastTXT("message here");
        break;
    case WStype_BIN:
    case WStype_ERROR:
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
        break;
    }
}

void socket_setup(void)
{
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
}

void socket_loop(void)
{
    webSocket.loop();
}
