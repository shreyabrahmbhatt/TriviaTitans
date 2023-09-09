import React, { useState } from 'react';
import axios from 'axios';
import { Paper, TextField, Button, Typography } from '@mui/material';

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const sendMessageToLex = async () => {
    try {
      const userMessage = {
        type: 'user',
        reply: userInput
      };

      setConversation((prevConversation) => [...prevConversation, userMessage]);

      const response = await axios.post(
        'https://vwpdahrbjhrkczrxpvtbax75zq0kmbna.lambda-url.us-east-1.on.aws/',
        {
          userInput: userInput,
          sessionState: { sessionState: null } // Provide the session state if required
        }
      );

      const lexMessage = {
        type: 'lex',
        reply: response.data.responseText
      };

      setConversation((prevConversation) => [...prevConversation, lexMessage]);

      // Clear the user input field after sending the message
      setUserInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen((prevOpen) => !prevOpen);
  };

  return (
    <div>
      {isChatOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', position: 'fixed', bottom: '70px', right: '20px', margin: '10px', zIndex: 999 }}>
          <Paper elevation={3} style={{ border: '1px solid #ccc', backgroundColor: 'white', padding: '10px', maxWidth: '400px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '5px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            {conversation.map((message, index) => (
              <div key={index} style={{ padding: '5px 10px', borderRadius: '5px', marginBottom: '10px', backgroundColor: message.type === 'user' ? '#eaf6ff' : '#d7f3d9', alignSelf: message.type === 'user' ? 'flex-start' : 'flex-end', minHeight: '15px', maxWidth: '70%' }}>
                <Typography variant="body1" style={{ color: 'black' }}>
                  {message.type.charAt(0).toUpperCase() + message.type.slice(1)}: {message.reply}
                </Typography>
              </div>
            ))}

            {/* User input area */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <TextField
                variant="outlined"
                label="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{ flex: 1, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '5px' }}
              />
              <Button variant="contained" onClick={sendMessageToLex} style={{ marginLeft: '10px', padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Send
              </Button>
            </div>
          </Paper>
        </div>
      )}

      {/* Floating button to toggle chat */}
      <Button variant="contained" onClick={toggleChat} style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', borderRadius: '50%', cursor: 'pointer', zIndex: 999 }}>
        Chat
      </Button>
    </div>
  );
};

export default Chatbot;
