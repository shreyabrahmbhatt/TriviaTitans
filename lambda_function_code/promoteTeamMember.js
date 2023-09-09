const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1'
});

exports.handler = async (event, context) => {
  console.log(JSON.parse(event.body));
  console.log(JSON.parse(event.body).team_id);
  console.log(JSON.parse(event.body).promote_user);
  let response;
  response = await updateTeam(JSON.parse(event.body));
  return response;
};

const updateTeam = async (requestBody) => {
  try {
    const tID = requestBody.team_id;
    const { Item } = await docClient.get({ TableName: 'teams', Key: { team_id: tID } }).promise();
    console.log(Item.team_members);
    if (Item) {
      // Check if the promote_user key is provided, and perform the update accordingly
      if (requestBody.promote_user) {
        const existingTeamRoles = Item.team_roles || {};
        
        // Remove the user from the existing roles (if they exist)
        delete existingTeamRoles[requestBody.promote_user];
        
        // Set the user to the new role "Admin"
        existingTeamRoles[requestBody.promote_user] = "Admin";
        
        console.log(existingTeamRoles);

        await docClient.update({
          TableName: 'teams',
          Key: { team_id: tID },
          UpdateExpression: 'SET team_roles = :updatedTeamRoles',
          ExpressionAttributeValues: {
            ':updatedTeamRoles': existingTeamRoles,
          },
        }).promise();
      }
    } else {
      const item = {
        tID,
        team_members: [requestBody.promote_user],
      };

      await docClient.put({ TableName: 'teams', Item: item }).promise();
    }

    console.log('User promoted successfully.');
    return 'User promoted successfully.';
  } catch (error) {
    console.error('Error promoting user:', error);
    return error;
  }
};