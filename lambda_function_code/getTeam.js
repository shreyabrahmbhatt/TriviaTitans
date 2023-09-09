const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const listItems = async (uid) => {
  const params = {
    TableName: 'teams',
    KeyConditionExpression: 'team_id = :teamIdValue',
    ExpressionAttributeValues: {
      ':teamIdValue': uid,
    }
  };

  try {
    const data = await docClient.query(params).promise();
    return data;
  } catch (error) {
    return error;
  }
};

exports.handler = async (event, context) => {
  console.log(event.body);
  console.log(JSON.parse(event.body));
  console.log(JSON.parse(event.body).id);
  
  const uid = JSON.parse(event.body).id;

  try {
    const data = await listItems(uid);
    console.log(data);
    return { body: JSON.stringify(data) };
  } catch (error) {
    return { error: error };
  }
};