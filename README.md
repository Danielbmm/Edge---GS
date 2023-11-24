## Projeto
O Health Connect SUS é uma iniciativa dedicada a aprimorar a comunicação 
entre pacientes e a rede do Sistema Único de Saúde (SUS) por meio do 
desenvolvimento de um aplicativo inovador. O objetivo principal é melhorar a 
eficiência e qualidade dos serviços de saúde, integrando tecnologia para criar um 
ambiente centralizado. Este aplicativo visa conectar pacientes, médicos e Unidades 
Básicas de Saúde (UBS), simplificando a burocracia, aprimorando o acesso às 
informações de saúde e facilitando decisões médicas. Além disso, oferece 
funcionalidades como agendamento de consultas, acesso aos remédios disponíveis 
nas farmácias populares e acesso a históricos médicos, contribuindo para a 
organização do atendimento, redução do tempo de espera e a melhoria da 
experiência global dos usuários.

## Aplicação
então podemos perceber que  a aplicação iot no projeto não é presente, então foi desenvolvido um sistema para o controle de estoque de remédios nas farmácias.

Esse sistema irá resolver os problemas direcionados à verificação da disponibilidade de alguns remédios nas farmácias do SUS. Muitas vezes, ocorre de um paciente ir buscar um remédio e, ao chegar na farmácia, ele não está disponível. Se houvesse um sistema de verificação mais preciso, poderíamos evitar esse desgaste e perda de tempo.

Nosso sistema, além de garantir a existência ou não desse medicamento, confere se ele está armazenado na temperatura ideal, evitando assim perdas e mantendo as informações dos dados corretas e atualizadas.

## codigo do wokwi
//EXEMPLO COM A TAGO.IO
#include <WiFi.h>
#include <ArduinoJson.h>
#include <DHTesp.h>
#include <PubSubClient.h>

// Configurações de WiFi
const char *SSID = "Wokwi-GUEST";
const char *PASSWORD = "";  // Substitua pelo sua senha

// Configurações de MQTT
const char *BROKER_MQTT = "broker.hivemq.com";
const int BROKER_PORT = 1883;
const char *ID_MQTT = "DANI_mqtt";
const char *TOPIC_PUBLISH_STOCK = "FIAP/GS/STOCK";
const char *TOPIC_PUBLISH_HUMI = "FIAP/GS/HUMi";
const char *TOPIC_PUBLISH_TEMP = "FIAP/GS/TEMP";
const int trigPin = 5;
const int echoPin = 18;

// Configurações de Hardware
#define PIN_DHT 12
#define PIN_LED 15
#define TEMP_LED 21
#define GREEN_LED 2
#define PUBLISH_DELAY 2000
#define SOUND_SPEED 0.034
#define CM_TO_INCH 0.393701

// Variáveis globais
WiFiClient espClient;
PubSubClient MQTT(espClient);
DHTesp dht;
unsigned long publishUpdate = 0;
TempAndHumidity sensorValues;
const int TAMANHO = 200;
long duration;
float distanceCm;
float distanceInch;
String stock;

// Protótipos de funções
void updateSensorValues();
void initWiFi();
void initMQTT();
void reconnectMQTT();
void reconnectWiFi();
void checkWiFIAndMQTT();

void updateSensorValues() {
  sensorValues = dht.getTempAndHumidity();
}

void initWiFi() {
  Serial.print("Conectando com a rede: ");
  Serial.println(SSID);
  WiFi.begin(SSID, PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Conectado com sucesso: ");
  Serial.println(SSID);
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void initMQTT() {
  MQTT.setServer(BROKER_MQTT, BROKER_PORT);
}

void reconnectMQTT() {
  while (!MQTT.connected()) {
    Serial.print("Tentando conectar com o Broker MQTT: ");
    Serial.println(BROKER_MQTT);

    if (MQTT.connect(ID_MQTT)) {
      Serial.println("Conectado ao broker MQTT!");
      //entrar no mqtt
      
    } else {
      Serial.println("Falha na conexão com MQTT. Tentando novamente em 2 segundos.");
      delay(2000);
    }
  }
}

void checkWiFIAndMQTT() {
  if (WiFi.status() != WL_CONNECTED) reconnectWiFi();
  if (!MQTT.connected()) reconnectMQTT();
}

void reconnectWiFi(void)
{
  if (WiFi.status() == WL_CONNECTED)
    return;

  WiFi.begin(SSID, PASSWORD); // Conecta na rede WI-FI

  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Wifi conectado com sucesso");
  Serial.print(SSID);
  Serial.println("IP: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(115200);

  pinMode(PIN_LED, OUTPUT);
  digitalWrite(PIN_LED, LOW);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(TEMP_LED, OUTPUT);
  digitalWrite(TEMP_LED, LOW);
  dht.setup(PIN_DHT, DHTesp::DHT22);
  initWiFi();
  initMQTT();
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distanceCm = duration * SOUND_SPEED/2;


  if(distanceCm > 200){
    digitalWrite(PIN_LED, HIGH);
    digitalWrite(GREEN_LED, LOW);
    stock = "baixo";
  }
  else{
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(PIN_LED, LOW);
    stock = "alto";
  }
  
  if(sensorValues.temperature > 25 || sensorValues.temperature < 15){
    digitalWrite(TEMP_LED, HIGH);
  }
  else{
    digitalWrite(TEMP_LED, LOW);
  }

  checkWiFIAndMQTT();
  MQTT.loop();

  if ((millis() - publishUpdate) >= PUBLISH_DELAY) {
    publishUpdate = millis();
    updateSensorValues();

    if (!isnan(sensorValues.temperature) && !isnan(sensorValues.humidity)) {
      // Enviar umidade
      StaticJsonDocument<TAMANHO> doc_humidity;
      doc_humidity["humidity"] = sensorValues.humidity;

      char buffer_humidity[TAMANHO];
      serializeJson(doc_humidity, buffer_humidity);
      MQTT.publish(TOPIC_PUBLISH_HUMI, buffer_humidity);
      Serial.println(buffer_humidity);

      // Enviar temperatura
      StaticJsonDocument<TAMANHO> doc_temperature;
      doc_temperature["temperature"] = sensorValues.temperature;

      char buffer_temperature[TAMANHO];
      serializeJson(doc_temperature, buffer_temperature);
      MQTT.publish(TOPIC_PUBLISH_TEMP, buffer_temperature);
      Serial.println(buffer_temperature);

      StaticJsonDocument<TAMANHO> doc_stock;
      doc_stock["stock"] = stock;

      char buffer_stock[TAMANHO];
      serializeJson(doc_stock, buffer_stock);
      MQTT.publish(TOPIC_PUBLISH_STOCK, buffer_stock);
      Serial.println(buffer_stock);
    }
  }
}