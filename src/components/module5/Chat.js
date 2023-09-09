import React, { useState, useEffect } from 'react'
import { db } from './firebase';
import { addDoc, collection, onSnapshot, serverTimestamp, query, where, orderBy } from 'firebase/firestore';

function Chat(props) {
    const [newMessage, setNewMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const {user, teamId, teamName} = props;

    const messagesRef = collection(db, "messages");

    useEffect(() => {
        const queryMessages = query(messagesRef, where("team_id", "==", teamId), orderBy("createdAt"));
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id})
            });
            setMessages(messages);
        });

        return () => unsubscribe();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newMessage === "") return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: user, 
            team_id: teamId
        })

        setNewMessage("")
    }
  return (
    <div className='chat-app'>
    <div className='header'>
        <h1>Welcome to: {teamName}</h1>
    </div>
    <div className='messages'>{messages.map((message) => 
        <div className='message' key={message.id }>
            <span className='user'>
                {message.user}
            </span>
            {message.text}
        </div>)}
    </div>
      <form onSubmit={handleSubmit} className='new-message-form'>
        <input 
            className='new-message-input'
            placeholder='Type your message here...'
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
        />
        <button type="submit" className='send-button'>Send</button>
      </form>
    </div>
  )
}

export default Chat
