import React, { useState } from 'react';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const getChatReply = async (userInput) => {
    let prompt = '<|system|>You are graduation coach helping a student pick their next semester courses.';
    messages.forEach(msg => {
      prompt += msg.sender === 'user' ? `<|user|>${msg.text}` : `<|assistant|>${msg.text}`;
    });
    prompt += `<|user|>${userInput}`;

    const response = await fetch('http://44.223.26.195:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'tinyllama', prompt, stream: false })
    });
    const data = await response.json();
    return data.response;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const botReply = await getChatReply(input);
    setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '300px' }}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close Chat' : 'Open Chat'}
      </button>
      {isOpen && (
        <div style={{ border: '1px solid #ccc', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '5px 0' }}>
                <span style={{
                  background: msg.sender === 'user' ? '#007bff' : '#ccc',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  display: 'inline-block'
                }}>
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{ width: '70%' }}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;