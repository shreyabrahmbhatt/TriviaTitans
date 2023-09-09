const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1',
});

const sns = new AWS.SNS();

exports.handler = async (event,context) => {
    console.log(event.body);
    const requestBody = JSON.parse(event.body);
    const email = requestBody.email;
    const team_name = requestBody.team_name;
    const mess=requestBody.message;
    console.log(mess)
    console.log(email);
    console.log(team_name);

    try {
      const response = await sns.publish({
        Message: mess,
        TopicArn: 'arn:aws:sns:us-east-1:304996596276:sns',
        MessageAttributes: {
          "email": {
            DataType: 'String',
            StringValue: email,
          },
          "team_name": {
            DataType: 'String',
            StringValue: team_name,
          }
        },
      }).promise();

      console.log('Invitation sent:', response);
      return response;
    } catch (error) {
      console.error('Failed to send invitation:', error);
      return error;
    }
    
};