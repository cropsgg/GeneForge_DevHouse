#include <WiFiS3.h>
#include <DHT.h>
#include <MQ135.h>

#define DHTPIN 4
#define MQ135PIN A0

const char* ssid = "Adarsh-college";
const char* password = "talu0192";

// OPTIONAL: Static IP (only if DHCP gives 0.0.0.0)
/*
IPAddress local_IP(192, 168, 1, 200);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
*/

DHT dht(DHTPIN, DHT11);
MQ135 mq135(MQ135PIN);
WiFiServer server(80);

void setup() {
  Serial.begin(9600);
  dht.begin();

  // OPTIONAL: set static IP
  // WiFi.config(local_IP, gateway, subnet);

  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    delay(2000);
    Serial.println("\n WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    server.begin();
  } else {
    Serial.println("\n Failed to connect to WiFi.");
  }
}

void loop() {
  WiFiClient client = server.available();

  if (client) {
    Serial.println(" Client connected.");
    String request = client.readStringUntil('\r');
    client.readStringUntil('\n');

    if (request.indexOf("GET /data") != -1) {
      float temp = dht.readTemperature();
      float hum = dht.readHumidity();
      float ppm = mq135.getPPM();

      client.println("HTTP/1.1 200 OK");
      client.println("Content-Type: application/json");
      client.println("Access-Control-Allow-Origin: *"); // 🛡️ Add CORS header here
      client.println("Connection: close");
      client.println();
      client.print("{\"temperature\":");
      client.print(temp);
      client.print(",\"humidity\":");
      client.print(hum);
      client.print(",\"aqi\":");
      client.print(ppm);
      client.println("}");
    } else {
      client.println("HTTP/1.1 404 Not Found");
      client.println("Content-Type: text/plain");
      client.println("Access-Control-Allow-Origin: *"); // 🛡️ Also add for error response
      client.println("Connection: close");
      client.println();
      client.println("Not Found");
    }

    client.stop();
    Serial.println(" Client disconnected.");
  }
}
