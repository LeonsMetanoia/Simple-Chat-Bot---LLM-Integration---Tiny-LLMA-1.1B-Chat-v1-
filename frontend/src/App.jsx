import { useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Failed to fetch from backend');

      const data = await response.json();

      const botMessage = {
        role: 'bot',
        content: data.reply.trim(),  // ✅ Ganti di sini
      };

      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setChat((prev) => [
        ...prev,
        { role: 'bot', content: '⚠️ Sorry, failed to connect to backend.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-400 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-indigo-400 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Smart Simple ChatBot 🚀
          </h1>
          <p className="text-white/80 text-lg">Your colorful AI companion</p>
        </div>

        {/* Chat Container */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/20">
          {/* Chat Messages */}
          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-transparent">
            {chat.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-500 text-lg">Start a conversation!</p>
              </div>
            )}

            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                      : 'bg-gradient-to-r from-green-500 to-teal-600'
                  }`}>
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>

                  <div className={`px-5 py-3 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-bl-md'
                  }`}>
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                    🤖
                  </div>
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-5 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                className="w-full border-2 border-purple-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 text-gray-800 placeholder-gray-500 bg-white/80 backdrop-blur-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your colorful message... 🎨"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                disabled={isTyping}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                ✨
              </div>
            </div>

            <button
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={sendMessage}
              disabled={isTyping || !message.trim()}
            >
              {isTyping ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Send 🚀
                </div>
              )}
            </button>
          </div>

          <div className="text-center mt-4 text-gray-500 text-sm">
            Powered by colorful AI magic ✨
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-pink-300::-webkit-scrollbar-thumb {
          background-color: #f9a8d4;
          border-radius: 3px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

export default App;
