const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const dynamodbtable= `teams`;

AWS.config.update({
    region: 'us-east-1'
});


exports.handler = async (event, context) => {
    console.log(JSON.parse(event.body));
    console.log(JSON.parse(event.body).team_id);
    console.log(JSON.parse(event.body).Score);
    console.log(JSON.parse(event.body).right_answers);
    console.log(JSON.parse(event.body).wrong_answers);
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
     const update_score = requestBody.Score;
     const update_right_answers = requestBody.right_answers;
     const update_wrong_answers = requestBody.wrong_answers;

      await docClient.update({
        TableName: 'teams',
        Key: { team_id: tID },
        UpdateExpression: 'SET right_answers = :update_right_answers, wrong_answers = :update_wrong_answers, Score = :update_score',
        ExpressionAttributeValues: {
          ':update_right_answers': update_right_answers,
          ':update_wrong_answers': update_wrong_answers,
          ':update_score': update_score,
        },
      }).promise();
    } 
    else {

    }

    console.log('Game details updated successfully.');
    return 'Game details updated successfully.';
  } catch (error) {
    console.error('Error updating game details:', error);
    return error;
  }
}