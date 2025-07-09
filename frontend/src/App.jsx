import { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post('http://localhost:8000/chat', { message });
      setChat([...chat, { role: 'user', content: message }, { role: 'bot', content: res.data.reply }]);
      setMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧠 Simple Chatbot</h1>
      <div className="space-y-2 mb-4">
        {chat.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <span className="inline-block px-4 py-2 bg-gray-200 rounded">{msg.content}</span>
          </div>
        ))}
      </div>
      <input
        className="border p-2 w-full"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="mt-2 bg-blue-500 text-white px-4 py-2" onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
