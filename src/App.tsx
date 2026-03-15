import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'model',
    text: 'شبيك لبيك، الجني بين يديك! 🧞‍♂️\nأنا هنا لتحقيق أمنياتك المعرفية والإجابة على أسئلتك. ماذا تطلب يا مولاي؟'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    try {
      // تم وضع المفتاح مباشرة هنا كما طلبت لتجاوز أي مشكلة
      const apiKey = "AIzaSyByyz9uLuLtHqNpSxnSXqrgmN6MHebFWTo";
      
      if (!apiKey) {
        console.warn("API Key is missing! Please ensure VITE_GEMINI_API_KEY is set in your .env file or Netlify settings.");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      chatRef.current = ai.chats.create({
        model: 'gemini-3.1-pro-preview',
        config: {
          systemInstruction: "أنت جني سحري حكيم ومرح. تعيش في مصباح سحري وتتحدث مع المستخدمين. تجيب على أسئلتهم بحكمة وسحر، وتستخدم لغة عربية فصحى أو عامية محببة مع بعض الكلمات السحرية مثل 'شبيك لبيك' و'يا مولاي' و'أمرك مطاع'. لا تستخدم الصوت أبداً، أنت دردشة نصية فقط. كن مفيداً ولكن حافظ على شخصية الجني السحري.",
        }
      });
    } catch (error) {
      console.error("Failed to initialize Gemini:", error);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        setMessages(prev => [...prev, { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          text: 'عذراً يا مولاي! يبدو أنني لم أجد المفتاح السري (API Key). يرجى التأكد من وضعه في ملف .env قبل القيام بعملية البناء (Build) أو إضافته في إعدادات الموقع إذا كنت تستخدم GitHub. 🔑' 
        }]);
        setIsLoading(false);
        return;
      }
      
      const response = await chatRef.current.sendMessage({ message: userText });
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: response.text }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: 'عذراً يا مولاي، يبدو أن هناك تشويشاً في السحر الدفين! هل يمكنك إعادة طلبك؟ ✨' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="relative w-full h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 overflow-hidden flex flex-col font-sans">
      {/* Magical Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Header / Genie Visual */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-10 pb-6 shadow-2xl bg-black/30 backdrop-blur-md border-b border-purple-500/20">
        <motion.div
          animate={isLoading ? { y: [0, -10, 0], scale: [1, 1.05, 1] } : { y: [0, -5, 0], scale: 1 }}
          transition={{ repeat: Infinity, duration: isLoading ? 1.5 : 4, ease: "easeInOut" }}
          className="relative flex flex-col items-center justify-center mt-4"
        >
          <motion.div
            animate={isLoading ? { y: [-20, -40, -20], scale: [1, 1.5, 1], rotate: [0, 180, 360] } : { y: [0, -10, 0], scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: isLoading ? 1.5 : 3, ease: "easeInOut" }}
            className="absolute -top-12 text-5xl z-10 drop-shadow-[0_0_20px_rgba(250,204,21,1)]"
          >
            ✨
          </motion.div>
          <div className="text-8xl drop-shadow-[0_0_40px_rgba(250,204,21,0.8)] z-20">
            🪔
          </div>
          <motion.div
            animate={isLoading ? { opacity: [0.6, 1, 0.6], scale: [1, 1.5, 1] } : { opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: isLoading ? 1.5 : 2 }}
            className="absolute -inset-4 bg-yellow-500/20 rounded-full blur-2xl -z-10"
          />
        </motion.div>
        <h1 className="mt-6 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 tracking-wider">
          الجني السحري
        </h1>
        <p className="text-purple-300/80 text-sm mt-2 font-medium">شبيك لبيك، اطلب وتمنى ✨</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 z-10 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 sm:p-5 rounded-3xl shadow-lg relative ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tl-sm'
                      : 'bg-gradient-to-br from-slate-800 to-slate-900 text-purple-50 border border-purple-500/30 rounded-tr-sm'
                  }`}
                >
                  {msg.role === 'model' && (
                    <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base font-medium">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-slate-800 border border-purple-500/30 text-purple-300 p-4 rounded-3xl rounded-tr-sm shadow-lg flex items-center gap-3">
                  <Sparkles className="w-5 h-5 animate-spin text-yellow-400" />
                  <span className="text-sm font-medium animate-pulse">الجني يحضر التعويذة...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-black/40 backdrop-blur-xl border-t border-purple-500/20 z-10">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب أمنيتك أو سؤالك هنا..."
            className="w-full bg-slate-900/80 border border-purple-500/50 text-white placeholder-purple-300/50 rounded-full py-4 pr-6 pl-16 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute left-2 p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 rotate-180" />
          </button>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        body { font-family: 'Cairo', sans-serif; background: #020617; }
        
        /* Custom Scrollbar for Chat */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.8);
        }
      `}} />
    </div>
  );
}
