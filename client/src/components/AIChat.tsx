import { useState, useRef, useEffect } from 'react';
import Layout from './Layout';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

const AIChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'ai',
            text: "Hi! I'm your Job Assistant. I can help you find jobs, explain match scores, or answer questions about your applications. Try asking 'Show me remote React jobs'!",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            let responseText = "I can help with that.";
            const lowerInput = userMsg.text.toLowerCase();

            // Mock Logic (Client-side for now, can move to backend)
            if (lowerInput.includes('remote')) {
                responseText = "I found 3 remote jobs in your feed. You can use the 'Remote' filter to see them.";
            } else if (lowerInput.includes('react')) {
                responseText = "There are several React roles available. The 'Senior React Developer' at TechCorp is a 95% match for you!";
            } else if (lowerInput.includes('apply') || lowerInput.includes('application')) {
                responseText = "You can track your applications in the Dashboard. You currently have 3 active applications.";
            } else if (lowerInput.includes('upload') || lowerInput.includes('resume')) {
                responseText = "You can upload your resume on the Job Feed page using the drag-and-drop area.";
            } else {
                responseText = "That's a great question. I'm focusing on finding the best job matches for your skills. Try asking about specific roles or skills.";
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: responseText,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
            setTyping(false);
        }, 1500);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            Job Assistant <Sparkles size={14} className="text-yellow-500" />
                        </h2>
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-600'
                                    }`}
                            >
                                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div
                                className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}

                    {typing && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-slate-200">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for job recommendations..."
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default AIChat;
