
import random
from paho.mqtt import client as mqtt_client

class Mqqt:
    def __init__(self, broker, port, username, password):
        self.broker = broker
        self.port = port
        self.username = username
        self.password = password


    # Properties
    # ********** property broker - (setter/getter) ***********
    @property
    def broker(self) -> type:
        """ The broker property. """
        return self.__broker
    
    @broker.setter
    def broker(self, value: type) -> None:
        self.__broker = value
    
    
    # ********** property port - (setter/getter) ***********
    @property
    def port(self) -> type:
        """ The port property. """
        return self.__port
    
    @port.setter
    def port(self, value: type) -> None:
        self.__port = value
    
    
    # ********** property topic - (setter/getter) ***********
    @property
    def topic(self) -> type:
        """ The topic property. """
        return self.__topic
    
    @topic.setter
    def topic(self, value: type) -> None:
        self.__topic = value
    
    # ********** property username - (setter/getter) ***********
    @property
    def username(self) -> type:
        """ The username property. """
        return self.__username
    
    @username.setter
    def username(self, value: type) -> None:
        self.__username = value
    
    # ********** property password - (setter/getter) ***********
    @property
    def password(self) -> type:
        """ The password property. """
        return self.__password
    
    @password.setter
    def password(self, value: type) -> None:
        self.__password = value

    # ********** property client_id - (enkel getter) ***********
    @property
    def client_id(self) -> type:
        """ The client_id property. """
        return f'python-mqtt-{random.randint(0, 100)}'
    
    
    # Methods
    def connect_mqtt(self):
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print("Connected to MQTT Broker!")
            else:
                print("Failed to connect, return code %d\n", rc)

        client = mqtt_client.Client(self.client_id)
        client.username_pw_set(self.username, self.password)
        client.on_connect = on_connect
        client.connect(self.broker, self.port)
        print("Connected to MQTT Broker!")
        return client

    
    # Method to publish a message
    def send(self, client, topic, msg):
        result = client.publish(topic, msg)
        # result: [0, 1]
        status = result[0]
        if status == 0:
            print(f"Send `{msg}` to topic `{topic}`")
        else:
            print(f"Failed to send message to topic {topic}")

    # Method to subscribe to a topic
    def subscribe(self, client, topic):
        recived_messages = []
        def on_message(client, userdata, msg):
            bericht = msg.payload.decode()
            recived_messages.append(bericht)

        client.subscribe(topic)
        client.on_message = on_message

        # Return message
        return recived_messages
        

        



