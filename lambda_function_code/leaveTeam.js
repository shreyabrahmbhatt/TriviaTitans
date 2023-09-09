const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: 'us-east-1'
});

exports.handler = async (event, context) => {
  console.log(JSON.parse(event.body));
  console.log(JSON.parse(event.body).team_id);
  console.log(JSON.parse(event.body).delete_user);
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
      const existingUsers = Item.team_members || [];
      const updatedUsers = existingUsers.filter(user => user !== requestBody.delete_user);

      // Check if the delete_role key is provided, and perform the update accordingly
      if (requestBody.delete_user) {
        const existingTeamRoles = Item.team_roles || {};
        delete existingTeamRoles[requestBody.delete_user]; // Use delete directly on the object key

        await docClient.update({
          TableName: 'teams',
          Key: { team_id: tID },
          UpdateExpression: 'SET team_members = :updatedUsers, team_roles = :updatedTeamRoles',
          ExpressionAttributeValues: {
            ':updatedUsers': updatedUsers,
            ':updatedTeamRoles': existingTeamRoles,
          },
        }).promise();
      } else {
        // If delete_role is not provided, perform the update without modifying team_roles
        await docClient.update({
          TableName: 'teams',
          Key: { team_id: tID },
          UpdateExpression: 'SET team_members = :updatedUsers',
          ExpressionAttributeValues: {
            ':updatedUsers': updatedUsers,
          },
        }).promise();
      }
    } else {
      const item = {
        tID,
        team_members: [requestBody.delete_user],
      };

      await docClient.put({ TableName: 'teams', Item: item }).promise();
    }

    console.log('User left the team successfully.');
    return 'User left the team successfully.';
  } catch (error) {
    console.error('Error removing user from the team:', error);
    return error;
  }
};