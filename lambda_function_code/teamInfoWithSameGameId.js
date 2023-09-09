const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const game_Id = JSON.parse(event.body).game_Id 

  try {
    const params = {
      TableName: 'MockTriviaTeams', 
      //IndexName: 'gameId-index', 
      KeyConditionExpression: 'game_Id = :game_Id',
      ExpressionAttributeValues: {
        ':game_Id': game_Id,
      },
    };

    const data = await dynamodb.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error('Error fetching teams:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching teams' }),
    };
  }
};
