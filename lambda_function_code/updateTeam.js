const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const dynamodbtable= `teams`;

AWS.config.update({
    region: 'us-east-1'
});


exports.handler = async (event, context) => {
    console.log(JSON.parse(event.body));
    console.log(JSON.parse(event.body).team_id);
    console.log(JSON.parse(event.body).new_user);
    console.log(JSON.parse(event.body).role_update);
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
      const updatedUsers = [...existingUsers, requestBody.new_user];
      
      const existingTeamRoles = Item.team_roles || {};
      const updatedTeamRoles = {
        ...existingTeamRoles,
        ...requestBody.role_update,
      };

      await docClient.update({
        TableName: 'teams',
        Key: { team_id: tID },
        UpdateExpression: 'SET team_members = :updatedUsers, team_roles = :updatedTeamRoles',
        ExpressionAttributeValues: {
          ':updatedUsers': updatedUsers,
          ':updatedTeamRoles': updatedTeamRoles,
        },
      }).promise();
    } 
    else {
      const item = {
        tID,
        team_members: [requestBody.new_user],
        team_roles: requestBody.role_update,
      };

      await docClient.put({ TableName: 'teams', Item: item }).promise();
    }

    console.log('New user added to the team successfully.');
    return 'New user added to the team successfully.';
  } catch (error) {
    console.error('Error adding new user to the team:', error);
    return error;
  }
}