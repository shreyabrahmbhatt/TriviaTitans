const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "leaderboard";

exports.handler = async (event, context) => {
  const category = event.queryStringParameters?.category || null;
  const time_frame = event.queryStringParameters?.timeFrame || null;

  const entity_type = event.queryStringParameters?.entityType || null;
  const entity_name = event.queryStringParameters?.name || null;

  console.log(category);
  console.log(time_frame);
  console.log(entity_type);
  console.log(entity_name);

  let filter_expression = {
    expression: "#et = :entity_type",
    values: { ":entity_type": entity_type },
    names: { "#et": "entity_type" },
  };

  let create_date = null;

  if (category !== null) {
    filter_expression.expression += " AND #c = :category";
    filter_expression.values[":category"] = category;
    filter_expression.names["#c"] = "category";
  }

  const current_time = new Date();
  current_time.setUTCHours(0, 0, 0, 0);

  if (time_frame === "daily") {
    create_date = current_time;
  } else if (time_frame === "weekly") {
    create_date = new Date(current_time);
    create_date.setDate(current_time.getDate() - current_time.getDay());
  } else if (time_frame === "monthly") {
    create_date = new Date(current_time);
    create_date.setDate(1);
  }

  if (create_date !== null) {
    filter_expression.expression += " AND #ct >= :create_time";
    filter_expression.values[":create_time"] = Math.floor(
      create_date.getTime() / 1000
    );
    filter_expression.names["#ct"] = "create_time";
  }

  if (entity_name !== null) {
    filter_expression.expression += " AND #en = :entity_name";
    filter_expression.values[":entity_name"] = entity_name;
    filter_expression.names["#en"] = "entity_name";
    return getEntityStats(filter_expression);
  } else {
    return getLeaderboard(filter_expression);
  }
};

async function getLeaderboard(filter_expression) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: filter_expression.expression,
    ProjectionExpression: "entity_name, score, right_answers, wrong_answers",
    ExpressionAttributeValues: filter_expression.values,
    ExpressionAttributeNames: filter_expression.names,
    Select: "SPECIFIC_ATTRIBUTES",
  };

  try {
    const response = await dynamodb.scan(params).promise();

    const leaderboard_data = response.Items;
    const entity_data = {};

    for (const entity of leaderboard_data) {
      const entity_name = entity.entity_name;

      if (!(entity_name in entity_data)) {
        entity_data[entity_name] = {
          name: entity_name,
          total_games: 0,
          total_score: 0,
          total_right_answers: 0,
          total_wrong_answers: 0,
        };
      }

      entity_data[entity_name].total_games += 1;
      entity_data[entity_name].total_score += entity.score;
      entity_data[entity_name].total_right_answers += entity.right_answers;
      entity_data[entity_name].total_wrong_answers += entity.wrong_answers;
    }

    for (const entity_name in entity_data) {
      const entity = entity_data[entity_name];
      entity.efficiency =
        Math.floor(
          (entity.total_right_answers /
            (entity.total_right_answers + entity.total_wrong_answers)) *
            100
        ) || 0;
    }

    const leaderboardData = Object.values(entity_data).sort(
      (a, b) => b.total_score - a.total_score
    );

    for (let i = 0; i < leaderboardData.length; i++) {
      leaderboardData[i].rank = i + 1;
    }

    const responsePayload = {
      statusCode: 200,
      body: JSON.stringify(leaderboardData, null, 2),
    };

    return responsePayload;
  } catch (error) {
    console.error("Error retrieving leaderboard:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}

async function getEntityStats(filter_expression) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: filter_expression.expression,
    ProjectionExpression:
      "entity_name, score, right_answers, wrong_answers, category, entity_type, create_time",
    ExpressionAttributeValues: filter_expression.values,
    ExpressionAttributeNames: filter_expression.names,
    Select: "SPECIFIC_ATTRIBUTES",
  };
  console.log("Filter Expression:", filter_expression.expression);
  console.log("Expression Attribute Values:", filter_expression.values);
  console.log("Expression Attribute Names:", filter_expression.names);

  try {
    const response = await dynamodb.scan(params).promise();
    console.log(response);
    const entity_data = response.Items;
    console.log(entity_data);

    const responsePayload = {
      statusCode: 200,
      body: JSON.stringify(entity_data, null, 2),
    };

    return responsePayload;
  } catch (error) {
    console.error("Error retrieving entity stats:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}
