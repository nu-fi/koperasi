import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Halo! Saya asisten virtual Koperasi. Ada yang ingin Anda tanyakan seputar pinjaman atau simpanan?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll ke pesan terbaru
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input;
        setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
        setInput('');
        setIsLoading(true);

        try {
            // Ambil token
            const token = localStorage.getItem('access'); 
            
            // Siapkan Headers dasar
            const myHeaders = {
                'Content-Type': 'application/json'
            };

            // HANYA pasang Authorization jika token benar-benar ada
            if (token) {
                myHeaders['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('http://localhost:8000/chatbot/', {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({ message: userText })
            });

            const data = await response.json();
            setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);

        } catch (error) {
            console.error("Error fetching chatbot API:", error);
            setMessages((prev) => [...prev, { 
                sender: 'bot', 
                text: 'Maaf, terjadi gangguan koneksi ke server koperasi.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="relative z-50">
            {/* Tombol Bulat di Pojok */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex justify-center items-center text-2xl shadow-lg hover:scale-110 hover:bg-blue-700 transition-all duration-300 focus:outline-none"
                    aria-label="Buka Live Chat"
                >
                    💬
                </button>
            )}

            {/* Jendela Chat (dengan animasi fade in & slide up) */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[450px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease-out]">
                    
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 font-semibold flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <span>CS Koperasi AI</span>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white text-2xl leading-none focus:outline-none transition-colors"
                        >
                            &times;
                        </button>
                    </div>

                    {/* Body Chat */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`max-w-[80%] p-3 text-sm leading-relaxed ${
                                    msg.sender === 'user' 
                                    ? 'bg-blue-600 text-white self-end rounded-2xl rounded-br-sm shadow-sm' 
                                    : 'bg-white border border-gray-200 text-gray-800 self-start rounded-2xl rounded-bl-sm shadow-sm'
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="text-xs text-gray-500 self-start ml-2 italic animate-pulse">
                                AI sedang mengetik...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer / Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form className="flex gap-2 items-center" onSubmit={handleSend}>
                            <input
                                type="text"
                                className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                                placeholder="Tanya sisa pinjaman..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                className="bg-blue-600 text-white rounded-full w-10 h-10 flex justify-center items-center hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors focus:outline-none shadow-sm"
                                disabled={isLoading || !input.trim()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;