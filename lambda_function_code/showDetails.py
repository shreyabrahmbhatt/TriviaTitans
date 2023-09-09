import boto3
import json
from decimal import Decimal


dynamodb = boto3.resource('dynamodb')
table_name = 'project' 

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    try:
        # Parse the email from the event
        #data = json.loads(event['body'])
        email = event['email']

        # Perform a scan operation to find all items with the provided email
        table = dynamodb.Table(table_name)
        response = table.scan(FilterExpression='email = :email', ExpressionAttributeValues={':email': email})

        # Extract the items from the response
        items = response['Items']
        items = json.loads(json.dumps(items, default=decimal_default))


        # Return the items in the response body
        return {
            'statusCode': 200,
            'body': json.dumps(items)
        }
    except Exception as e:
        # Return an error response
        print("Error:", e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to retrieve data'}),
        }
