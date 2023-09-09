const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const dynamodbtable= `users`;

AWS.config.update({
    region: 'us-east-1'
});


exports.handler = async (event, context) => {
    console.log(JSON.parse(event.body));
    console.log(JSON.parse(event.body).team_id);
    console.log(JSON.parse(event.body).team_name);
    let response;
    response = await deleteTeamUser(JSON.parse(event.body));
    return response;
};

const deleteTeamUser = async (requestBody) => {
 try {
   const userID = requestBody.uid;
    const { Item } = await docClient.get({ TableName: 'users', Key: { user_id: userID } }).promise();

    if (Item) {
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


    console.log('Team member\'s  team id and team named removed successfully');
    return 'Team member\'s  team id and team named removed successfully';
  } catch (error) {
    console.error('Error remvoing member from the team:', error);
    return error;
  }
}