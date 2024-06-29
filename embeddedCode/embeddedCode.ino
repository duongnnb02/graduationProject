#define Relay1 25
#define Relay2 21

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <PZEM004Tv30.h>
#include <SoftwareSerial.h>

// Kết nối Wifi
const char *ssid = "Tenda_208638";
const char *password = "tumotdenchin";

// Thông tin MQTTBroker
const char *mqtt_broker = "broker.emqx.io";
const int mqtt_port = 1883;

// Biến đếm thời gian 3 phút
unsigned long previousMillis = 0;
const long interval = 10800000;

// Biến đếm thời gian 1 tiếng
unsigned long lastResetMillis = 0;
const long resetInterval = 2629746000;

// Biến tháng
int month = 1;

WiFiClient espClient;
PubSubClient client(espClient);
SoftwareSerial mySim(33, 32);
DynamicJsonDocument doc1(1024);
DynamicJsonDocument doc2(1024);
DynamicJsonDocument doc(1024);
DynamicJsonDocument docMonth(1024);

// PZEM của Dương
PZEM004Tv30 pzem1(&Serial1, 27, 26);
// PZEM của Thu
PZEM004Tv30 pzem2(&Serial2, 19, 18);

void setup() {
  // Cài serial baud
  Serial.begin(115200);

  // Khởi tạo module sim
  mySim.begin(115200);

  // Cài chân Relay
  pinMode(Relay1, OUTPUT);
  pinMode(Relay2, OUTPUT);
  digitalWrite(Relay1, HIGH);
  digitalWrite(Relay2, HIGH);

  // Kết nối WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the Wi-Fi network");

  // Kết nối tới MQTTBroker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the public MQTT broker \n", client_id.c_str());
    if (client.connect(client_id.c_str())) {
      Serial.println("MQTT broker connected");
    } else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  client.subscribe("Lightbulb");
  client.subscribe("Dryer");
}

void callback(char *topic, byte *payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  String msg;
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    msg += (char)payload[i];
  }
  Serial.println();
  if (String(topic) == "Lightbulb") {
    if (msg == "bat") {
      digitalWrite(Relay1, HIGH);
      Serial.println("Machine 1: on!");
    } else if (msg == "tat") {
      digitalWrite(Relay1, LOW);
      Serial.println("Machine 1: off!");
    }
  }

  if (String(topic) == "Dryer") {
    if (msg == "bat") {
      digitalWrite(Relay2, HIGH);
      Serial.println("Machine 2: on!");
    } else if (msg == "tat") {
      digitalWrite(Relay2, LOW);
      Serial.println("Machine 2: off!");
    }
  }
}

void sendWarning(String text) {
  mySim.println("AT");
  delay(200);
  mySim.println("AT+CMFG=1");
  delay(200);
  mySim.println("AT+CMGS=\"+84942363104\"");
  delay(200);
  mySim.print(text);  //text content
  delay(200);
  mySim.write(26);
  delay(200);
}
void loop() {
  client.loop();

  // Lấy dữ liệu PZEM1
  float pzemW1 = pzem1.energy();
  float pzemP1 = pzem1.power();
  Serial.println(pzemP1);
  if (pzemP1 > 500) {
    digitalWrite(Relay1, LOW);
    sendWarning("Warning: Lightbulb is operating beyond its capacity!");
  }

  // Lấy dữ liệu PZEM2
  float pzemW2 = pzem2.energy();
  float pzemP2 = pzem2.power();
  Serial.println(pzemP2);
  if (pzemP2 > 500) {
    digitalWrite(Relay2, LOW);
    sendWarning("Warning: Dryer is operating beyond its capacity!");
  }

  //Đóng gói dữ liệu
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    doc["energy1"] = pzemW1;
    doc["energy2"] = pzemW2;
    char mqtt_message[128];
    serializeJson(doc, mqtt_message);
    client.publish("Energy", mqtt_message, true);
    previousMillis = currentMillis;
  }

  if (currentMillis - lastResetMillis >= resetInterval) {
    docMonth["energyMonth1"] = pzemW1;
    docMonth["energyMonth2"] = pzemW2;
    docMonth["month"] = month;
    docMonth["year"] = 2023;
    char mqtt_message[128];
    serializeJson(docMonth, mqtt_message);
    client.publish("monthlyenergy", mqtt_message, true);
    pzem1.resetEnergy();
    pzem2.resetEnergy();
    month++;
    if (month == 13) month = 1;
    lastResetMillis = currentMillis;
  }
}