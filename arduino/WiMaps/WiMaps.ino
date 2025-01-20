#include <WiFi.h>
#include <WiFiClient.h>
#include <WiFiServer.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> 

const char* ssid = "Sanjuna";  // Replace with your WiFi credentials
const char* password = "sanju038";
const char* serverAddress = "https://6101-103-247-50-129.ngrok-free.app/WiMaps/RouterInfoReceived";

void setup() {
    Serial.begin(115200);
    delay(1000);

    // Connect to Wi-Fi
    WiFi.begin(ssid, password);  // Replace with your WiFi credentials
  while (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    Serial.println("Connecting to WiFi...");
  }

    Serial.println("Connected to WiFi");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  
    sendScanResults();
}

void loop() {
    //sendScanResults();
    delay(50000);
}


void sendScanResults() {
  HTTPClient http;
    int networkCount = WiFi.scanNetworks();

  if (networkCount == 0) {
     Serial.println("No networks found.");
     return;
  }

   DynamicJsonDocument doc(1024 * 8); // Increased buffer for more network info
    JsonArray networks = doc.createNestedArray("networks");

    for (int i = 0; i < networkCount; ++i) {
        JsonObject network = networks.createNestedObject();
        network["ssid"] = WiFi.SSID(i);
        network["rssi"] = WiFi.RSSI(i);
       network["channel"] = WiFi.channel(i);
       network["bssid"] = WiFi.BSSIDstr(i);
     network["encryption"] = getEncryptionType(WiFi.encryptionType(i));
    }

    String jsonString;
    serializeJson(doc, jsonString);


  http.begin(serverAddress);
    http.addHeader("Content-Type", "application/json");

 int httpResponseCode = http.POST(jsonString);
    if (httpResponseCode > 0) {
         String response = http.getString();
        Serial.println("Response code: "+String(httpResponseCode));
       Serial.println("Response : "+response);

    } else {
         Serial.print("Error: "+ String(httpResponseCode) );
    }

   http.end();
}


String getEncryptionType(int encType) {
    switch (encType) {
        case WIFI_AUTH_OPEN:
            return "Open";
        case WIFI_AUTH_WEP:
            return "WEP";
        case WIFI_AUTH_WPA_PSK:
            return "WPA/PSK";
        case WIFI_AUTH_WPA2_PSK:
            return "WPA2/PSK";
         case WIFI_AUTH_WPA_WPA2_PSK:
          return "WPA/WPA2/PSK";
        case WIFI_AUTH_WPA2_ENTERPRISE:
            return "WPA2/Enterprise";
        case WIFI_AUTH_WPA3_PSK:
            return "WPA3/PSK";
        default:
            return "Unknown";
    }
}