const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const dynamodbtable= `users`;

AWS.config.update({
    region: 'us-east-1'
});


exports.handler = async (event, context) => {
    console.log(JSON.parse(event.body));
    console.log(JSON.parse(event.body).team_id);
    let response;
    response = await deleteTeamUser(JSON.parse(event.body));
    return response;
};

const deleteTeamUser = async (requestBody) => {
 try {
   const userEmail = requestBody.user_email;
    // const { Item } = await docClient.queue({ TableName: 'users', Key: { user_email: userEmail } }).promise();
    
    // const team_id = 'your_team_id_value';

    const params = {
      TableName: 'users',
      FilterExpression: `user_email = :userEmail`,
      ExpressionAttributeValues: {
        ':userEmail': userEmail
      }
    };

    const { Items } = await docClient.scan(params).promise();
    console.log(Items[0].user_id);
    const userID = Items[0].user_id;

    if (Items) {
      const updateTeamName = requestBody.team_name;
      const updateTeamID = requestBody.team_id;

      await docClient.update({
        TableName: 'users',
        Key: { user_id: userID },
        UpdateExpression: 'SET team_name = :updateTeamName, team_id = :updateTeamID',
        ExpressionAttributeValues: {
          ':updateTeamName': updateTeamName,
          ':updateTeamID': updateTeamID,
        },
      }).promise();
    } 


    console.log('Team member\'s  team id and team named removed successfully by remove button');
    return 'Team member\'s  team id and team named removed successfully by remove button';
  } catch (error) {
    console.error('Error adding new user to the team:', error);
    return error;
  }
}