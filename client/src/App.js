import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Register from './components/Register';
import Login from './components/Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const socket = io('http://localhost:5000');

const App = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:5000/api/auth/');
      setUsers(response.data);
    };

    fetchUsers();

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // Check for user in local storage on app load
  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      console.log(currentUser);
      console.log(chatUser);
      if (currentUser && chatUser) {
        try {
          const response = await axios.get(`http://localhost:5000/api/messages/${currentUser.userId}/${chatUser}`);
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };
  
    fetchMessages();
  }, [currentUser, chatUser]);
  

  const handleSendMessage = () => {
    const message = { sender: currentUser.userId, recipient: chatUser, text: messageText };
    socket.emit('sendMessage', message);
    axios.post('http://localhost:5000/api/messages', message);
    setMessageText('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSendMessage();
    }
};

  const handleRegister = () => {
    alert('Registration successful! You can now log in.');
    navigate('/login');
  };

  const handleLogin = (data) => {
    setCurrentUser(data);
    localStorage.setItem('currentUser', JSON.stringify(data)); // Store user data in local storage
    navigate('/');
    window.location.reload();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser'); // Clear user data from local storage
    navigate('/login');
  };

  // Filter messages for the selected chat user
  const filteredMessages = messages.filter((msg) => {
    return (
      (msg.sender === currentUser?.userId && msg.recipient === chatUser) || 
      (msg.sender === chatUser && msg.recipient === currentUser?.userId)
    );
  }).slice(-50); // Get the last 50 messages

  const selectedChatUser = users.find(user => user._id === chatUser);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredMessages]);

  // Filter users based on the search query
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='container'>
      <div className='navbar'>
        <Link to="/" className='app-title'>
          <h1>Messaging App</h1>
        </Link>
        {currentUser ? (
          <div className='user-info'>
          <h2>Welcome, {currentUser.username}</h2>
          <button onClick={handleLogout}>Logout</button>
          </div>
         ) : null}
      </div>
    {currentUser ? (
      <div className='app-body'>
      <div className='sidebar'>
      <input 
        type='text' 
        placeholder='Search users or select below to start conversation..' 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
        <ul>
          {filteredUsers.map((user) => (
            <li key={user._id} onClick={() => setChatUser(user._id)}>
              {user.username}
            </li>
          ))}
        </ul>
        </div>
        <div className='content'>
        {chatUser && selectedChatUser ? (
          <>
          <h2 className="chat-navbar" style={{color: 'black'}}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '20px', marginLeft: '10px' }}/>
            {selectedChatUser.username}
            <FontAwesomeIcon 
                icon={faEllipsisV} 
                style={{ position: 'absolute', right: '0', marginRight: '40px' }} 
            />
          </h2>
        <div className="messages">
          {filteredMessages.map((msg) => (
            <div 
              key={msg._id} 
              className={`message ${msg.sender === currentUser.userId ? 'sender' : 'recipient'}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
          </div>
          <div className='input-container'>
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message"
          />
          <button onClick={handleSendMessage}>Send</button>
          </div>
          </>
        ):(
          <div className="no-chat-message" style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
          <p>Select a user to start conversation..</p>
        </div>
        )}
        </div>
      </div>
    ) : (
      <Routes>
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={
          <div className='start-page'>
            <h2>Please log in or register</h2>
            <a href="/login">Login</a>  <a href="/register">Register</a>
          </div>
        } />
      </Routes>
    )}
  </div>
);
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
