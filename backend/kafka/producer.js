// LEGACY / INACTIVE: standalone Kafka producer, not required or started by
// the active MongoDB/Express backend (server.js). Preserved for future
// evaluation of Kafka integration.
const kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new kafka.Producer(client);

producer.on("ready", () => {
  console.log("Kafka Producer is connected and ready.");
});

producer.on("error", (err) => {
  console.error("Error in Kafka Producer", err);
});

module.exports = producer;
