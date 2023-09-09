const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const dynamodbtable= `teams`;

AWS.config.update({
    region: 'us-east-1'
});


exports.handler = async (event, context) => {
    console.log(JSON.parse(event.body));
    console.log(JSON.parse(event.body).team_id);
    console.log(JSON.parse(event.body).game_id);
    let response;
    response = await updateTeam(JSON.parse(event.body));
    return response;
};

const updateTeam = async (requestBody) => {
 try {
   const tID = requestBody.team_id;
    const { Item } = await docClient.get({ TableName: 'teams', Key: { team_id: tID } }).promise();
    console.log(Item);
    if (Item) {
      const game_id = requestBody.game_id;

      await docClient.update({
        TableName: 'teams',
        Key: { team_id: tID },
        UpdateExpression: 'SET game_id = :game_id',
        ExpressionAttributeValues: {
          ':game_id': game_id,
        },
      }).promise();
    } 
    else {
      
    }

    console.log('Game ID updated successfully.');
    return 'Game ID updated successfully.';
  } catch (error) {
    console.error('Error updating Game ID', error);
    return error;
  }
}