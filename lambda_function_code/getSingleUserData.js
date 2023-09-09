const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: `users`,
    KeyConditionExpression: 'user_id = :userIdValue',
    ExpressionAttributeValues: {
    ':userIdValue': 1
  }
};
const listItems = async () => {
    try{
        const data = await docClient.query(params).promise();
        return data;
    }
    catch(error){
        return error;
    }
} 
exports.handler = async (event, context) => {
    try{
        const data = await listItems();
        console.log(data);
        return { body: JSON.stringify(data)}
    }
    catch(error){
        return { error: error }
    }
};