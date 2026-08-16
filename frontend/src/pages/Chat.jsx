import { useState } from 'react';
import { chatAPI } from '../api';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I can help with medicine availability, stock, pricing, and category search. Try: "Paracetamol", "Show antibiotics", or "Stock summary".', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSendMessage() {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatAPI.send(input);
      const botMessage = { id: Date.now() + 1, text: res.data.reply, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = { id: Date.now() + 1, text: 'Sorry, there was an error. Please try again.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = ['Check stock', 'Show offers', 'Search medicine', 'View antibiotics'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-8 py-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">💬 Pharmacy Assistant</h1>
        <p className="text-slate-600 dark:text-slate-400">Ask about medicines, stock, pricing, and availability</p>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[65%] ${msg.sender === 'user' ? 'bg-medical-100 dark:bg-medical-600/20 border border-medical-200 dark:border-medical-700 rounded-2xl rounded-br-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-md'} px-4 py-3 shadow-sm`}>
              <p className="text-slate-800 dark:text-slate-100">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
              <p className="text-slate-600 dark:text-slate-400 animate-pulse">typing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 md:px-8 py-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((sug) => (
            <button key={sug} onClick={() => setInput(sug)} className="px-3 py-1.5 text-sm rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
              {sug}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-400"
          />
          <button onClick={handleSendMessage} disabled={loading} className="px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white rounded-lg font-medium disabled:opacity-50">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
