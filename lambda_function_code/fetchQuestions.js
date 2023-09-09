const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Lambda handler function
exports.handler = async (event, context) => {
  // Question type to fetch
  console.log(event)
  const questionTypeToFetch = JSON.parse(event.body).questionType;

  // Prepare the scan parameters
  const params = {
    TableName: 'Questions',
    FilterExpression: 'questionType = :questionType',
    ExpressionAttributeValues: {
      ':questionType': questionTypeToFetch,
    },
  };

  try {
    // Perform the DynamoDB scan
    const data = await dynamodb.scan(params).promise();

    // Extract the items from the response
    const items = data.Items;

    // Return the results
    const response = {
      statusCode: 200,
      body: JSON.stringify(items),
    };

    return response;
  } catch (error) {
    // Handle the error
    console.error('Error fetching data from DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching data' }),
    };
  }
};
