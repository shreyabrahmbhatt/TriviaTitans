const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    console.log("This is the log of event!");
    console.log(event);
    console.log("This is the end of log of event!");

    const teamName = event.inputTranscript;
    console.log("This team name is from lambda");
    console.log(teamName);
    console.log("This team name is from lambda ends here");

    const data = await readMessage(teamName);
    if (data.Items.length === 0) {
      console.log('Team not found');
      return {
        sessionState: {
          dialogAction: {
            type: 'Close',
            fulfillmentState: 'Fulfilled'
          },
          intent: {
            confirmationState: 'Confirmed',
            name: 'FetchTeamName',
            state: 'Failed'
          }
        },
        messages: [
          {
            contentType: 'PlainText',
            content: 'Team not found'
          }
        ]
      };
    }

    console.log(data.Items);
    return {
     sessionState: {
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Fulfilled'
        },
        intent: {
          confirmationState: 'Confirmed',
          name: 'FetchTeamName',
          state: 'Fulfilled'
        }
      },
      messages: [
        {
          contentType: 'PlainText',
          content: `The score for ${teamName} is ${data.Items[0].Score}`
        }
      ]
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

async function readMessage(teamName) {
  const params = {
    region: 'us-east-1',
    accessKeyId: 'ASIAUL2C7S772XYUASII', 
    secretAccessKey: 'w72TLdvqcBaAnW0C3yCjbwPws0y4pwA4GwyJ1YSH',
    sessionToken: 'FwoGZXIvYXdzEP7//////////wEaDFT/qld95BrPgax+BSLAASxnXPYx326YtB1JM+n2iFsCCrFUP/0ERhfE2ZglrfL6dj7ccxuiA604KXIlenjDjk0j3Ps8prZ7r4RLqZbFcZUxp/2AIvPt5DQUDBEniiJu0eol4J9TAX38Gkw/kYAdGR9RHTMBGe0B1s4B4kMPKhTHTF9JRYnUq6g/RqnIMMvF9aAUR0GlsQBqbYoJCjrGkNSGQapRa18wI44hx01Tv6aZR0MUdJ+8aEjAn+CTs8N7pRg4bAT6JHwVB/5dPw7/niilyOmkBjItxErQuNDGh9kApG+I86SC4H2II1HOn17qU8XU2rL9m18M/hLNMx+427ouvZIJ',
    TableName: 'MockTriviaTeams',
    FilterExpression: 'team_name = :team_name',
    ExpressionAttributeValues: {
      ':team_name': teamName,
    },
  };
  return ddb.scan(params).promise();
}
