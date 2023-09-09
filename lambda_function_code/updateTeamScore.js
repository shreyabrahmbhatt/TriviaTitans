const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const team_id = JSON.parse(event.body).team_id;

  try {
    // Fetch team information from DynamoDB
    const params = {
      TableName: 'MockTriviaTeams',
      Key: { team_id },
    };

    const { Item: team } = await dynamodb.get(params).promise();

    if (!team) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Team not found.' }),
      };
    }

    // Increase the team score by 5
    const updatedScore = team.Score + 5;

    // Update the team score in DynamoDB
    const updateParams = {
      TableName: 'MockTriviaTeams', 
      Key: { team_id },
      UpdateExpression: 'SET Score = :Score',
      ExpressionAttributeValues: {
        ':Score': updatedScore,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    await dynamodb.update(updateParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Team score updated successfully.' }),
    };
  } catch (error) {
    console.error('Error updating team score:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating team score.' }),
    };
  }
};
