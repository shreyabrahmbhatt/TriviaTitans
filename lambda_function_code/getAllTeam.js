const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});


exports.handler = async (event, context) => {
    // Set up the DynamoDB client
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const tableName = "teams";

    try {
        // Scan the DynamoDB table to get all items
        const params = {
            TableName: tableName
        };
        
        const response = await dynamoDB.scan(params).promise();
        const items = response.Items;
        
        // Return the teams in the response
        return {
            statusCode: 200,
            body: JSON.stringify(items)
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify("Error: " + error.message)
        };
    }
};