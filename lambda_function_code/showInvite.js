const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});

const sqs = new AWS.SQS();

exports.handler = async (event,context) => {
   
   try{
   
   const response = await sqs.receiveMessage({
       QueueUrl: "https://sqs.us-east-1.amazonaws.com/304996596276/sqs",
       WaitTimeSeconds: 10,
       VisibilityTimeout: 0
   }).promise();
   
   console.log('Invitation sent:', response);
   return response.Messages;
   }
   catch (error) {
      console.error('Failed to send invitation:', error);
      return error;
   }
};