import json
import base64
import boto3
import time
import uuid

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table_name = 'project'
bucket_name = 'projectbucketsdp5'

def lambda_handler(event, context):
    try:
        # Parse the data from the event
        data = event
        name = data['name']
        contact = data['phone']
        email = data['email']
        userId = data['userid']
        image_data_json = data['image_data']

        # Convert the JSON string back to a base64-encoded string
        image_data = json.loads(image_data_json)
        
        # Base64-decode the image data
        image_bytes = base64.b64decode(image_data)

        # Replace 'YOUR_IMAGE_KEY' with the desired key/filename for the image in S3
        image_key = f'{name}_{int(time.time())}.jpg'

        # Upload the image to S3
        s3.put_object(Bucket=bucket_name, Key=image_key, Body=image_bytes, ContentType='image/jpeg')

        # Get the S3 link for the uploaded image
        s3_link = f'https://{bucket_name}.s3.amazonaws.com/{image_key}'
        item_id = str(uuid.uuid4())

        # Perform a full table scan and filter the results by email
        table = dynamodb.Table(table_name)
        response = table.scan(FilterExpression=boto3.dynamodb.conditions.Attr('email').eq(email))

        if response['Items']:
            # If the record with the email exists, update the name, contact, and imageLink attributes
            item = response['Items'][0]
            table.update_item(
                Key={'id': item['id']},
                UpdateExpression='SET #n = :name, #c = :contact, #i = :image_url',
                ExpressionAttributeNames={'#n': 'name', '#c': 'contact', '#i': 'image_url'},
                ExpressionAttributeValues={':name': name, ':contact': contact, ':image_url': s3_link}
            )
        else:
            # If the record with the email doesn't exist, create a new item
            table.put_item(Item={'id': item_id, 'name': name, 'contact': contact, 'email': email, 'imageLink': s3_link})

        # Return a success response
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Form submitted successfully'}),
        }
    except Exception as e:
        # Return an error response
        print("this is the error")
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Form submission failed'}),
        }
