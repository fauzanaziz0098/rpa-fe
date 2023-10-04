const mqtt = require("mqtt");

const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_URL, {
    clientId: `${process.env.NEXT_PUBLIC_MQTT_CLIENTID}_${Math.random().toString(16).substring(2, 8)}`,
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    keepalive: 60,

})

export default client
