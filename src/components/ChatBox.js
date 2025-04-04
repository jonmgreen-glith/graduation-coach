import React, { useState, useEffect } from 'react';
// import { pipeline, env } from '@huggingface/transformers';



function ChatBox() {

  // useEffect(() => {
  //   async function runGenerator() {
  //     try {
  //       // Enable local model loading
  //       env.allowLocalModels = true;

  //       // Verify file access
  //       const tokenizerResponse = await fetch('/models/tokenizer.json');
  //       const modelResponse = await fetch('/models/onnx/model.onnx');

  //       console.log("Model:", modelResponse.status, modelResponse.ok);

  //       if (!tokenizerResponse.ok || !modelResponse.ok) {
  //         throw new Error("Files not accessible");
  //       }

  //       console.log("Files confirmed - loading pipeline...");

  //       // Load pipeline without forcing local_files_only
  //       const generator = await pipeline("text-generation", "/models");

  //       console.log("Pipeline loaded successfully");

  //       const messages = [
  //         { role: "system", content: "You are a friendly assistant." },
  //         { role: "user", content: "Please explain thermodynamics in less than 100 words." },
  //       ];
  //       const output = await generator(messages, { max_new_tokens: 512 });
  //       console.log(output[0].generated_text.at(-1).content);
  //     } catch (error) {
  //       console.error("Error:", error.message, error.stack);
  //     }
  //   }

  //   runGenerator();
  // }, []); // Empty dependency array so it only runs once on mount

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'Hello! How can I help?', sender: 'bot' }]);
      }, 1000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '300px',
    }}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close Chat' : 'Open Chat'}
      </button>
      {isOpen && (
        <div style={{
          border: '1px solid #ccc',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                margin: '5px 0'
              }}>
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
              onKeyUp={(e) => e.key === 'Enter' && handleSend()}
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