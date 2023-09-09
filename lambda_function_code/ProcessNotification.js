const AWS = require("aws-sdk");
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  const id = event.queryStringParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing ID query parameter" }),
    };
  }

  const queues = [
    "AchievementUnlocked",
    "GameInvite",
    "NewTriviaGame",
    "RankChange",
    "TeamUpdates",
  ];
  const matchingNotifications = [];

  try {
    for (const queue of queues) {
      const messages = await receiveMessagesFromQueue(queue);
      for (const message of messages) {
        const messageBody = JSON.parse(message.Body);
        const messageMessage = JSON.parse(messageBody.Message);
        if (messageMessage.id === id) {
          matchingNotifications.push(messageMessage.message);
          await deleteMessageFromQueue(queue, message.ReceiptHandle);
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ notifications: matchingNotifications }),
    };
  } catch (error) {
    console.error("Error processing notifications:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error processing notifications" }),
    };
  }
};

const receiveMessagesFromQueue = async (queueName) => {
  const params = {
    QueueUrl: `https://sqs.us-east-1.amazonaws.com/967720732140/${queueName}`,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 5,
  };

  const response = await sqs.receiveMessage(params).promise();
  return response.Messages || [];
};

const deleteMessageFromQueue = async (queueName, receiptHandle) => {
  const params = {
    QueueUrl: `https://sqs.us-east-1.amazonaws.com/967720732140/${queueName}`,
    ReceiptHandle: receiptHandle,
  };

  await sqs.deleteMessage(params).promise();
};
