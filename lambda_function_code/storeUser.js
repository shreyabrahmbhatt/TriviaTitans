const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const dynamodbtable= `users`;

AWS.config.update({
    region: 'us-east-1'
});


exports.handler = async (event, context) => {
    let response;
    response = await storeUser(JSON.parse(event.body));
    return response;
};

const storeUser = async (requestBody) => {
    const params = {
        TableName: dynamodbtable,
        Item: requestBody
    }
    return await docClient.put(params).promise().then(() => {
        const body = {
            Operation: 'Store',
            Message: 'Success',
            Item: requestBody
        }
        return buildResponse(200, body);
    }, (error) => {
            console.log(error);
    })
}

function buildResponse (statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
} 
        
