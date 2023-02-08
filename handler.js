const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DB_NAME;

exports.handler = async (event, context) => {
  let body = {};
  let statusCode = 200;
  // We need to define no cache so that Github doesn't cache the image
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'no-cache,no-store,must-revalidate',
    'Expires': 0,
    'Pragma': 'no-cache',
  };
  try {
    switch (`${event.httpMethod} ${event.resource}`) {
      case "GET /gh":
        // User is necessary
        if (!event.queryStringParameters.user) throw new Error('Missing user parameter.');

        // Making the request to dynamo, it increments the visits if present, otherwise it gets created
        let res = await dynamo.update({
          Key: {
            user: event.queryStringParameters.user
          },
          ReturnValues: "UPDATED_NEW",
          TableName: tableName,
          UpdateExpression: "SET visits = if_not_exists(visits, :initial) + :num",
          ExpressionAttributeValues: {
            ":num": 1,
            ":initial": 0,
          },
        }).promise();

        // Editing the variables to be able to properly fill the template
        let variables = {
          widthBase: 100,
          widthTotal: undefined,
          color: event.queryStringParameters.color || 'orange',
          numberWidth: undefined,
          numberPosition: undefined,
          number: res.Attributes.visits
        };
        variables.widthTotal = variables.widthBase + variables.number.toString().length * 10; // One number adds 10px in size
        variables.numberWidth = variables.widthTotal - variables.widthBase;
        variables.numberPosition = variables.widthBase + (variables.numberWidth / 2);

        // Populating the template
        body = `<svg width="${variables.widthTotal}" height="26" xmlns="http://www.w3.org/2000/svg">
        <g>
          <rect width="100" height="26" style="fill:#404040;"/>
          <text x="50" y="13" fill="white" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif">Profile Views</text>
        </g>
        <g>
          <rect x="100" width="${variables.numberWidth}" height="26" style="fill:${variables.color};"/>
          <text x="${variables.numberPosition}" y="13" fill="white" dominant-baseline="middle" text-anchor="middle" font-family="monospace">${variables.number}</text>
        </g>
        </svg>`
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}".`);
    }
  } catch (err) {
    console.log(err)
    statusCode = 400;
    body = err.message;
  }

  return {
    statusCode,
    body,
    headers
  };
};
