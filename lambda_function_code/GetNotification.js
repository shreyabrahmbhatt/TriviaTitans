const AWS = require("aws-sdk");
const sns = new AWS.SNS();

exports.handler = async (event) => {
  try {
    const { topic, message } = event;
    console.log(topic, message);

    await sns
      .publish({
        TopicArn: `arn:aws:sns:us-east-1:967720732140:${topic}`,
        Message: JSON.stringify(message),
      })
      .promise();

    return {
      statusCode: 200,
      body: "Notification sent successfully",
    };
  } catch (error) {
    console.error("Error sending notification:", error);
    return {
      statusCode: 500,
      body: "Error sending notification",
    };
  }
};
