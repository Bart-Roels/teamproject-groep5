//pinnen
const int ledaantal = 12;
int btn1Pin = 18;
float bat = 34;

//states
bool btn1State;
bool prevstate;

//merkers
bool a = false;
float o;
  
//library
#include "FastLED.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>

CRGB leds[ledaantal];

// Replace the next variables with your SSID/Password combination
const char* ssid = "Pole";
const char* password = "Pole8500";
//const char* ssid = "Howest-IoT";
//const char* password = "LZe5buMyZUcDpLY";
//const char* ssid = "Paaltjes";
//const char* password = "Paaltje8500";

// Add your MQTT Broker IP address, example:
//const char* mqtt_server = "192.168.1.144";
const char* mqtt_server = "192.168.220.1";
//const char* mqtt_server = "192.168.168.159";


WiFiClient espClient;
PubSubClient client(espClient);
//long lastMsg = 0;
char msg[50];
int value = 0;
const char* device_name = "ESP32(3)";  // <-- naam apparaat


void setup() {
  Serial.begin(115200);
  //  pinMode(led, OUTPUT);
  FastLED.addLeds<NEOPIXEL, 23>(leds, ledaantal);
  pinMode(btn1Pin, INPUT_PULLUP);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

//fastled

//0 = rood
//1 = geel
//2 = groen
//3= blauw
int black = CRGB::Black;
int yellow = CRGB::Yellow;
int blue = CRGB::Blue;
int red = CRGB::Red;
int green = CRGB::Green;

//colors
int kleuren[5] = { red, yellow, green, blue, black };

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    connectblink();
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;

  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }

  // Feel free to add more if statements to control more GPIOs with MQTT

  // If a message is received on the topic esp32/output, you check if the message is either "on" or "off".
  // Changes the output state according to the message
  if (String(topic) == "3") {
    //    Serial.print("Changing output to ");
    if (messageTemp == "on") {
      client.publish("3", "Message recieved at ESP32(3)");
      for (int i = 0; i < ledaantal; i++) {
        leds[i] = kleuren[3];
      }
      FastLED.show();
      delay(100);
      Serial.println("On");
    }
    if (messageTemp == "0") {
      client.publish("3", "Message recieved at ESP32(3)");
      for (int i = 0; i < ledaantal; i++) {
        leds[i] = kleuren[0];
      }
      FastLED.show();
      delay(100);
      Serial.println("0");
    }
    if (messageTemp == "1") {
      client.publish("3", "Message recieved at ESP32(3)");
      for (int i = 0; i < ledaantal; i++) {
        leds[i] = kleuren[1];
      }
      FastLED.show();
      delay(100);
      Serial.println("On");
    }
    if (messageTemp == "2") {
      client.publish("3", "Message recieved at ESP32(3)");
      for (int i = 0; i < ledaantal; i++) {
        leds[i] = kleuren[2];
      }
      FastLED.show();
      delay(100);
      Serial.println("On");
    }
    if (messageTemp == "3") {
      client.publish("3", "Message recieved at ESP32(3)");
      for (int i = 0; i < ledaantal; i++) {
        leds[i] = kleuren[3];
      }
      FastLED.show();
      delay(100);
      Serial.println("on");
    }
    if (messageTemp == "RGB") {
      // showke();
      client.publish("3", "Message recieved at ESP32(3)");
      a = true;
      // run();
    }
    if (messageTemp == "fade") {
      fadeAnimation(random(0, 255), random(0, 255), random(0, 255));  // Orange
      client.publish("3", "fade ended");
    }
    if (messageTemp == "bat3") {
      measure_bat();
    } else if (messageTemp == "off") {
      for (int i = 0; i < ledaantal; i++) {
        leds[i] = kleuren[4];
      }
      FastLED.show();
      delay(100);
      a = false;
      Serial.println("off");
    }
  }
}

void reconnect() {

  // Loop until we're reconnected
  while (!client.connected()) {
    mqqtconnecting();
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP32(3)")) {
      Serial.println("connected");
      // Subscribe
      client.subscribe("3");
      client.publish("3", "nr:3 online");
      for (int i = 0; i < ledaantal; i++) {
        leds[i] = kleuren[2];
      }
      FastLED.show();
      delay(500);

      for (int i = 0; i < ledaantal; i++) {
        leds[i] = kleuren[4];
      }
      FastLED.show();
      delay(3);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    setup_wifi();
  }
  if (!client.connected()) {
    reconnect();
  }
  if (client.connected()) {
    client.loop();
    btnpress();
    if (a == true) {
      rainbowCycle(1);
    }
  }
}


void btnpress() {
  btn1State = digitalRead(btn1Pin);
  if (btn1State != prevstate) {
    if (btn1State == 0) {
      Serial.println("Button is pressed");
      client.publish("button", "3");
      //        client.publish("ledstate" , "Is Off");
      delay(300);
    }
  }
  prevstate = btn1State;
}

void measure_bat() {
  float reading = analogRead(bat);
  float voltage = ((reading / 4095.0) * 3.3) * 2;
  float percentage = (4095 - voltage)/4095*(100);
  publishVoltage(percentage);
}

void connectblink() {
  for (int i = 0; i < ledaantal; i++) {
    leds[i] = kleuren[0];
  }
  FastLED.show();
  delay(100);
  delay(100);
  for (int i = 0; i < ledaantal; i++) {
    leds[i] = kleuren[4];
  }
  FastLED.show();
  delay(100);
}
void mqqtconnecting() {
  //  leds[0] = CRGB::Yellow; FastLED.show(); delay(300);
  for (int i = 0; i < ledaantal; i++) {
    leds[i] = kleuren[1];
  }
  FastLED.show();
  delay(100);
  delay(100);
  for (int i = 0; i < ledaantal; i++) {
    leds[i] = kleuren[4];
  }
  FastLED.show();
  delay(100);
  delay(100);
  for (int i = 0; i < ledaantal; i++) {
    leds[i] = kleuren[1];
  }
  FastLED.show();
  delay(100);
  delay(100);
  for (int i = 0; i < ledaantal; i++) {
    leds[i] = kleuren[4];
  }
  FastLED.show();
  delay(100);
  delay(100);
}

// fun stuff
void showke() {
  for (int j = 0; j < ledaantal; j++) {
    for (int i = 0; i < ledaantal; i++) {
      leds[i] = CHSV(i - (j * 120), 255, 255); /* The higher the value 4 the less fade there is and vice versa */
    }
    FastLED.show();
    delay(30); /* Change this to your hearts desire, the lower the value the faster your colors move (and vice versa) */
  }
}


void rainbowCycle(int tijd) {
  byte* c;
  uint16_t i, j;

  for (j = 0; j < 256; j++) {
    for (i = 0; i < ledaantal; i++) {
      c = Wheel(((i * 256 / ledaantal) + j) & 255);
      leds[ledaantal - 1 - i].setRGB(*c, *(c + 1), *(c + 2));
    }
    FastLED.show();
    delay(tijd);
  }
}
byte* Wheel(byte positie) {
  static byte c[3];

  if (positie < 85) {
    c[0] = positie * 3;
    c[1] = 255 - positie * 3;
    c[2] = 0;
  } else if (positie < 170) {
    positie -= 85;
    c[0] = 255 - positie * 3;
    c[1] = 0;
    c[2] = positie * 3;
  } else {
    positie -= 170;
    c[0] = 0;
    c[1] = positie * 3;
    c[2] = 255 - positie * 3;
  }
  return c;
}

void fadeAnimation(int red, int green, int blue) {
  float r, g, b;

  // FADE IN
  for (int i = 0; i <= 255; i++) {
    r = (i / 256.0) * red;
    g = (i / 256.0) * green;
    b = (i / 256.0) * blue;
    fill_solid(leds, ledaantal, CRGB(r, g, b));
    FastLED.show();
    delay(2);
  }

  // FADE OUT
  for (int i = 255; i >= 0; i--) {
    r = (i / 256.0) * red;
    g = (i / 256.0) * green;
    b = (i / 256.0) * blue;
    fill_solid(leds, ledaantal, CRGB(r, g, b));
    FastLED.show();
    delay(2);
  }
}
void publishVoltage(float voltage) {
  String message = String(voltage);
  client.publish("bat3", message.c_str());
  // Serial.println(message);
}
