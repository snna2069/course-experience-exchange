// LEGACY / INACTIVE: standalone Kafka consumer, not wired into the active
// MongoDB/Express backend (server.js). Preserved for future evaluation.
const kafka = require("kafka-node");

const kafkaClient = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = new kafka.Consumer(
  kafkaClient,
  [{ topic: "courseEvents", partition: 0 }],
  { autoCommit: true }
);

consumer.on("message", (message) => {
  console.log("Message received from Kafka:", JSON.parse(message.value));
});

consumer.on("error", (err) => {
  console.error("Error in Kafka Consumer:", err);
});

module.exports = consumer;
