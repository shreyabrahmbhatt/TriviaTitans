const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
   
exports.handler = async (event, context) => {
    try{
        const params = {
            region: 'us-east-1',
            accessKeyId: 'ASIAUL2C7S772XYUASII', 
            secretAccessKey: 'w72TLdvqcBaAnW0C3yCjbwPws0y4pwA4GwyJ1YSH',
            sessionToken: 'FwoGZXIvYXdzEP7//////////wEaDFT/qld95BrPgax+BSLAASxnXPYx326YtB1JM+n2iFsCCrFUP/0ERhfE2ZglrfL6dj7ccxuiA604KXIlenjDjk0j3Ps8prZ7r4RLqZbFcZUxp/2AIvPt5DQUDBEniiJu0eol4J9TAX38Gkw/kYAdGR9RHTMBGe0B1s4B4kMPKhTHTF9JRYnUq6g/RqnIMMvF9aAUR0GlsQBqbYoJCjrGkNSGQapRa18wI44hx01Tv6aZR0MUdJ+8aEjAn+CTs8N7pRg4bAT6JHwVB/5dPw7/niilyOmkBjItxErQuNDGh9kApG+I86SC4H2II1HOn17qU8XU2rL9m18M/hLNMx+427ouvZIJ',
            TableName: 'Games',
        }
   
       const data = await ddb.scan(params).promise();
       console.log(data);
       
       return {
           statusCode: '200',
           body: JSON.stringify(data)
       }
    }
    catch(error){
        return{
            statusCode: '500',
            body: JSON.stringify({message: 'Error retrieving games'})
        }
    }
};
