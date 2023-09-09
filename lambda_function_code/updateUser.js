const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const dynamodbtable= `users`;

AWS.config.update({
    region: 'us-east-1'
});


exports.handler = async (event, context) => {
    console.log(JSON.parse(event.body));
    console.log(JSON.parse(event.body).team_id);
    console.log(JSON.parse(event.body).new_user);
    let response;
    response = await updateTeam(JSON.parse(event.body));
    return response;
};

const updateTeam = async (requestBody) => {
 try {
   const userID = requestBody.uid;
    const { Item } = await docClient.get({ TableName: 'users', Key: { user_id: userID } }).promise();

    if (Item) {
      const updateTeamName = requestBody.team_id;
      const updateTeamID = requestBody.team_name;

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


    console.log('Team name updated successfully');
    return 'Team name updated successfully';
  } catch (error) {
    console.error('Error adding new user to the team:', error);
    return error;
  }
}