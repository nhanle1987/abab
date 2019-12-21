#include <Arduino.h>

#include <WebSocketsServer.h>
#include "output.h"

#define WEBSOCKET_PORT 86

char strBuff[50];

WebSocketsServer webSocket = WebSocketsServer(WEBSOCKET_PORT, "");

int frontDirection = 1;
int frontStrength = 0;
int rearDirection = 1;
int rearStrength = 0;
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
        frontDirection = 1;
        frontStrength = 0;
        rearDirection = payload[0];
        rearStrength = payload[1];
        frontDirection = payload[2];
        frontStrength = payload[3];
        setRear(rearDirection, rearStrength);
        setFront(frontDirection, frontStrength);
        sprintf(strBuff, "%s %d [%d - %d]", payload, length, rearDirection, rearStrength);
        webSocket.sendTXT(num, strBuff);

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
