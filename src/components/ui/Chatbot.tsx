import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { FaRobot } from 'react-icons/fa';

const Chatbot: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hi! How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;
        const userMsg = input;
        // Lấy lịch sử hội thoại (không tính message đang nhập)
        const history = messages.map((msg) => ({ from: msg.from, text: msg.text }));
        setMessages((prev) => [...prev, { from: 'user', text: userMsg }]);
        setInput('');
        console.log('User message:', userMsg);
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '/api';
            const res = await fetch(`${apiUrl}/ai-chatbot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, history })
            });
            if (!res.body) throw new Error('No response body');
            let botMsg = '';
            setMessages((prev) => [...prev, { from: 'bot', text: '' }]);
            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let done = false;
            let buffer = '';
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
                let lines = buffer.split('\n\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (!line.trim()) continue;
                    // Log toàn bộ dòng nhận được
                    console.debug('[Chatbot stream] raw line:', line);
                    let json = null;
                    try {
                        if (line.startsWith('data:')) {
                            json = JSON.parse(line.replace('data: ', ''));
                        } else if (line.trim().startsWith('{')) {
                            json = JSON.parse(line);
                        }
                        if (json) {
                            if (json.chunk) {
                                botMsg += json.chunk;
                                setMessages((prev) => {
                                    const last = prev[prev.length - 1];
                                    if (last && last.from === 'bot') {
                                        return [...prev.slice(0, -1), { from: 'bot', text: botMsg }];
                                    }
                                    return prev;
                                });
                            }
                            if (json.error) {
                                setMessages((prev) => [...prev, { from: 'bot', text: json.error }]);
                            }
                        }
                    } catch (err) {
                        console.error('[Chatbot stream] JSON parse error:', err, line);
                    }
                }
            }
        } catch (error) {
            console.error('[Chatbot stream] error:', error);
            setMessages((prev) => [...prev, { from: 'bot', text: 'Bot is not available. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm chuyển markdown đơn giản sang HTML cho bot message
    function renderBotMessage(text: string): string {
        if (!text) return '';
        let html = text;
        // Bold **text**
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Heading **1. ...**
        html = html.replace(/\*\*(\d+\..+?)\*\*/g, '<div style="margin-top:8px;font-weight:bold;">$1</div>');
        // List - ...
        html = html.replace(/\n- ([^\n]+)/g, '<li>$1</li>');
        // List * ...
        html = html.replace(/\n\* ([^\n]+)/g, '<li>$1</li>');
        // Gộp các <li> liên tiếp thành <ul>
        html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
        // Newline to <br>
        html = html.replace(/\n/g, '<br>');
        // Emoji spacing (chỉ hỗ trợ emoji phổ biến)
        html = html.replace(/([\u263a-\u263c\u2764])/g, '<span style="font-size:1.1em;">$1</span>');
        return html;
    }

    return (
        <>
            {/* Floating Robot Icon */}
            <button
                className="fixed z-50 bottom-6 right-6 bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg rounded-full p-4 flex items-center justify-center hover:scale-110 transition-transform"
                style={{ boxShadow: '0 4px 24px 0 rgba(80, 63, 205, 0.15)' }}
                onClick={() => setOpen(true)}
                aria-label="Open chatbot"
                tabIndex={0}
            >
                <FaRobot className="text-white w-7 h-7" />
            </button>

            {/* Chatbot Modal */}
            {open && (
                <div className="fixed z-50 bottom-6 right-6 w-[420px] max-w-[98vw] bg-white rounded-2xl shadow-2xl border border-purple-100 flex flex-col overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                        <div className="flex items-center gap-2">
                            <span className="bg-white rounded-full p-1">
                                <FaRobot className="w-7 h-7 text-purple-600" />
                            </span>
                            <span className="font-semibold text-lg">Eventastic Bot</span>
                        </div>
                        <button onClick={() => setOpen(false)} className="hover:bg-white/20 rounded-full p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Messages */}
                    <div className="flex-1 px-4 py-3 bg-gray-50 overflow-y-auto" style={{ maxHeight: 480 }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex mb-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.from === 'bot' && (
                                    <span className="w-7 h-7 rounded-full mr-2 bg-white border border-purple-100 flex items-center justify-center">
                                        <FaRobot className="w-5 h-5 text-purple-600" />
                                    </span>
                                )}
                                {msg.from === 'bot' ? (
                                    <div
                                        className="px-3 py-2 rounded-xl text-sm max-w-[75%] bg-white text-gray-800 border border-purple-100"
                                        dangerouslySetInnerHTML={{ __html: renderBotMessage(msg.text) }}
                                    />
                                ) : (
                                    <div
                                        className="px-3 py-2 rounded-xl text-sm max-w-[75%] bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                                    >
                                        {msg.text}
                                    </div>
                                )}
                                {msg.from === 'user' && (
                                    <div className="ml-2 w-7 h-7" />
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex mb-2 justify-start">
                                <span className="w-7 h-7 rounded-full mr-2 bg-white border border-purple-100 flex items-center justify-center">
                                    <FaRobot className="w-5 h-5 text-purple-600 animate-bounce" />
                                </span>
                                <div className="px-3 py-2 rounded-xl text-sm max-w-[75%] bg-white text-gray-400 border border-purple-100 italic">
                                    Đang xử lý...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    {/* Input */}
                    <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-100">
                        <input
                            className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(); }}
                            autoFocus
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full px-4 py-2 font-semibold hover:from-indigo-600 hover:to-purple-600 transition-colors"
                            disabled={loading}
                        >
                            {loading ? '...' : 'Send'}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
