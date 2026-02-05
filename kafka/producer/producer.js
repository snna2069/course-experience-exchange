const kafka = require("kafka-node");

// Create Kafka Client
const kafkaClient = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });
const producer = new kafka.Producer(kafkaClient);
const admin = new kafka.Admin(kafkaClient);

const topic = "courseEvents";

// Create Topic if it doesn't exist
admin.createTopics(
  [
    {
      topic,
      partitions: 1,
      replicationFactor: 1,
    },
  ],
  (err, res) => {
    if (err) {
      console.error("Error creating topic:", err);
    } else {
      console.log("Topic created successfully or already exists:", res);

      // Initialize Producer
      producer.on("ready", () => {
        console.log("Kafka Producer is connected and ready.");

        const payloads = [
          {
            topic,
            messages: JSON.stringify({
              event: "New Course Added",
              courseName: "Introduction to Kafka",
              timestamp: new Date(),
            }),
          },
        ];

        producer.send(payloads, (err, data) => {
          if (err) {
            console.error("Error sending message:", err);
          } else {
            console.log("Message sent:", data);
          }
        });
      });

      producer.on("error", (err) => {
        console.error("Error in Kafka Producer:", err);
      });
    }
  }
);
