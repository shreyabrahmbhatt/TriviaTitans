const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = 'leaderboard';

// Create a DynamoDB service object
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  // console.log(data)

  // Save leaderboard data to DynamoDB
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: uuidv4(),
      entity_type: data.entity_type,
      entity_name: data.name,
      score: data.score,
      right_answers: data.right_answers,
      wrong_answers: data.wrong_answers,
      category: data.category,
      create_time: Math.floor(Date.now() / 1000),
    },
  };

  try {
    console.log(params.Item);
    await dynamodb.put(params).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Leaderboard data saved successfully' }),
    };

    return response;
  } catch (error) {
    console.error('Error saving leaderboard data:', error);

    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error saving leaderboard data' }),
    };

    return response;
  }
};


