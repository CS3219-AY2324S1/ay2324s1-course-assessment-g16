module.exports = {
  PORT: 3004,
  questionServiceUrl: "http://question-service:3003/api/questions",
  // questionServiceUrl: "http://127.0.0.1:3003/api/questions",
  mongodbUri: "mongodb://matching-service-database:27017/peer-prep",
  // mongodbUri: "mongodb://127.0.0.1:27020/peer-prep",
  // mongodbUri: "mongodb://127.0.0.1:27017/peer-prep",
  rabbitmqUrl: "amqp://rabbitmq:5672",
  // rabbitmqUrl: "amqp://127.0.0.1:5672",
  refreshDuration: 3000, // 3 seconds
  waitingDuration: 3000,
  matchingDuration: 57000,
  queueName: "matchingQueue",
};
