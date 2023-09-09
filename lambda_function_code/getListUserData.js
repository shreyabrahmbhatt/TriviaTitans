const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: `users`
}
const listItems = async () => {
    try{
        const data = await docClient.scan(params).promise();
        return data;
    }
    catch(error){
        return error;
    }
} 
exports.handler = async (event, context) => {
    try{
        const data = await listItems();
        return { body: JSON.stringify(data)}
    }
    catch(error){
        return { error: error }
    }
};