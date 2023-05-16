
import './home.css';
import React from 'react';



function HomePage({userName, setIsLoading, setErrorMessage, errorMessage, cookies}) {

  
   const [toId, setToId] = React.useState('');
   const [message, setMessage] = React.useState('');

   // new variables for displaying message history
   const [conversationId, setConversationId] = React.useState('');
   const [messageThread, setMessageThread] = React.useState([]);

   const [conversations, setConversations] = React.useState([]); // default empty array
   const [users, setUsers] = React.useState([]); // users array

   // this will run anytime conversationId changes
   React.useEffect(() => {   getConversation(); }, [conversationId]) // plug in list of variables 

  // renders getConversations once
  React.useEffect(() => { getConversations(); getAllUsers(); }, []);


  async function getConversation() {
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // utility to retrive cookie from cookies
      }
    };
    const result = await fetch('/getConversation?conversationId=' + conversationId, httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) { // api res status either true or false
      // worked
      setMessageThread(apiRes.data); // java side should return list of all convos objs for this user
    } else {
      setErrorMessage(apiRes.message); // java side returns message which in this case is an error mssg
    }
  }
  
   async function getConversations() {
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // utility to retrive cookie from cookies
      }
    };
    const result = await fetch('/getConversations', httpSettings);
    const apiRes = await result.json();
    if (apiRes.status) {
      // worked
      setConversations(apiRes.data); // java side should return list of all convos for this user
    } else {
      setErrorMessage(apiRes.message);
    }
  
  
  }

  async function handleSendMessage() {
    setIsLoading(true);
    setErrorMessage(''); // fresh error message each time
    const body = {
      fromId: userName,
      toId: toId,
      message: message,
    };
    const httpSettings = {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        auth: cookies.get('auth'), // utility to retrive cookie from cookies
      }
    };
    const result = await fetch('/createMessage', httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      setMessage('');
      getConversations();
      setConversationId(apiRes.data[0].conversationId)
      getConversation();
    } else {
      setErrorMessage(apiRes.message);
    }
    setIsLoading(false);
  };

  async function getAllUsers() {
    setErrorMessage('')
    const httpSettings = {
      method: 'GET',
      headers: {
        auth: cookies.get('auth'), // utility to retrive cookie from cookies
      }
    };
    const result = await fetch('/getAllUsers', httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // worked
      setUsers(apiRes.data); // java side should return list of all convos for this user
    } else {
      setUsers(apiRes.message);
    }
  }

  
    return (

            <div className="homepage-container">
              <h1 className='home-title center-text'>Welcome {userName}</h1>
              <div className='flex-container'>
                <div className='message-box'>
                  <h3 className='send-mess-title'>Send Message</h3>
                  <div>
                  <span className='right-padding'>To:</span><input className='to-padding' value={toId} onChange={e => setToId(e.target.value)} />
                  </div>
                  <textarea className='message-textarea' value={message} onChange={e => setMessage(e.target.value)} />
                  <div>
                    <button onClick={handleSendMessage}>Send Message</button>
                    <div className='top-space'>{errorMessage}</div>
                  </div>
                </div>
                <div>
                <div className='convo-box center-text'>
                  <h3 className='curr-convo-title center-text'>Current Convos</h3>
                    {conversations.map(conversation => <div  
                    onClick={() => setConversationId(conversation.conversationId)}>Convo: {conversation.conversationId}
                    </div>)}
                </div>
                </div>
                <div className='curr-users-box'>
                    <h3>Current Users:</h3>
                    { users.map(user => <div className='to-padding'> {user.userName} </div>)}
                </div>
                <div className='view-messages-box'>
                  <div className='view-mssg-title'>View messages to {messageThread[0].toId}</div>
                  {messageThread.map(message => <div className='mssg-text'>{message.message}</div>)}
                </div>
              </div>
            </div>
            
          );
    
}


export default HomePage;