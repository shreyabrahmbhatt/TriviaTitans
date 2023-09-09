// Import required modules
const express = require('express');
const app = express();
const language = require('@google-cloud/language'); 
const client = new language.LanguageServiceClient();

const PORT = 5000; // The port the server will listen on

app.use(express.json());

// Route handler for POST requests to '/post'
app.post('/post', async (req, res) => {
    const text = req.body.question;

    // Prepare a document to be analyzed by the Natural Language API
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    try {
        const [classification] = await client.classifyText({document});
        
        // If the classification was successful and categories were returned, get the first category
        // Otherwise, set the category to 'TAG'
        const categoryFullPath = classification.categories.length > 0 ?
            classification.categories[0].name :
            'TAG';
            
        const category = categoryFullPath.split('/').pop();
        res.send({category});
        
    } catch (error) {
        // If an error occurred, log the error and respond with a status of 500 and a descriptive error message
        console.error(`Failed to classify text: ${error}`);
        res.status(500).send({error: 'Failed to classify text'});
    }
});

// Start the server on the specified port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the app for use in other modules
module.exports = {
    app
};
