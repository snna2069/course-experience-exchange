const kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const consumer = new kafka.Consumer(
  client,
  [{ topic: "courseEvents", partition: 0 }],
  { autoCommit: true }
);

consumer.on("message", (message) => {
  console.log("Message received:", message.value);
});

consumer.on("error", (err) => {
  console.error("Error in Kafka Consumer", err);
});

module.exports = consumer;
