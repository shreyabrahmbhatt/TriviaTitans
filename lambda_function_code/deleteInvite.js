const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});

const sqs = new AWS.SQS();

exports.handler = async (event,context) => {
   
   console.log(event.body);
   const requestBody = JSON.parse(event.body);
   const receiptHandle = requestBody.receiptHandle;
   console.log(receiptHandle)
   
   try{
   
   const response = await sqs.deleteMessage({
       QueueUrl: "https://sqs.us-east-1.amazonaws.com/304996596276/sqs",
       ReceiptHandle: receiptHandle,
   }).promise();
   
   console.log('Deletion sucessful:', response);
   return response;
   }
   catch (error) {
      console.error('Failed to delete invitation:', error);
      return error;
   }
};