import { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const res = await axios.post('http://localhost:8000/chat', { message });
    setChat([...chat, { role: 'user', content: message }, { role: 'bot', content: res.data.reply }]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-pink-50 text-gray-800 p-6">
      <div className="max-w-2xl mx-auto shadow-lg rounded-2xl bg-white p-6 border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">💬 Smart Chatbot</h1>
        
        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto px-2">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[75%] ${
                  msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
