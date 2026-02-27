
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAiBot } from '../../hooks/useAiBot';
import { marked } from 'marked';

interface AiBotWindowProps {
  onClose: () => void;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const AiBotWindow: React.FC<AiBotWindowProps> = ({ onClose }) => {
  const { messages, isTyping, sendMessage, setMessages } = useAiBot();
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  const handleCopy = (text: string, id: number) => {
    // This strips HTML from the markdown before copying
    const plainText = text.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
    navigator.clipboard.writeText(plainText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const handleClear = () => {
     setMessages([]); 
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[110] w-[calc(100vw-2rem)] sm:w-full max-w-sm h-[75vh] sm:h-[70vh] max-h-[600px] bg-brand-surface/95 backdrop-blur-xl border border-brand-outline rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden origin-bottom-right"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-brand-outline bg-brand-surface/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-brand-accent-dark flex items-center justify-center text-brand-dark shadow-lg shadow-brand-accent/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M12 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM15.293 8.293a1 1 0 0 0-1.414 0L12 10.586 10.121 8.707a1 1 0 0 0-1.414 1.414L10.586 12l-1.879 1.879a1 1 0 1 0 1.414 1.414L12 13.414l1.879 1.879a1 1 0 0 0 1.414-1.414L13.414 12l1.879-1.879a1 1 0 0 0 0-1.414z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-brand-light">Spirit Shelf AI</h3>
            <p className="text-xs text-brand-muted">Your Personal Spirit Guide</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={handleClear} className="p-2 text-brand-muted hover:text-brand-light transition-colors rounded-full hover:bg-brand-outline text-xs font-semibold" title="Clear Chat">
                Clear
            </button>
            <button onClick={onClose} className="p-2 text-brand-muted hover:text-brand-light transition-colors rounded-full hover:bg-brand-outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.sender === 'bot' && <div className="w-6 h-6 rounded-full bg-brand-accent flex-shrink-0 shadow-sm"></div>}
              <div className="relative group">
                <div
                  className={`prose prose-invert prose-sm max-w-[80vw] sm:max-w-[85%] rounded-2xl p-3.5 shadow-md ${msg.sender === 'user'
                    ? 'bg-brand-accent text-brand-dark rounded-br-sm'
                    : 'bg-brand-outline/80 text-brand-light rounded-bl-sm border border-brand-outline'
                    }`}
                  dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }}
                ></div>
                {msg.sender === 'bot' && (
                  <button
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="absolute -top-2 -right-2 p-1.5 bg-brand-dark border border-brand-outline rounded-full text-brand-muted opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-sm"
                    aria-label="Copy response"
                  >
                    {copiedId === msg.id ? <CheckIcon className="text-green-400"/> : <CopyIcon />}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            className="flex items-end gap-2 justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-6 h-6 rounded-full bg-brand-accent flex-shrink-0 shadow-sm"></div>
            <div className="bg-brand-outline/80 border border-brand-outline rounded-2xl rounded-bl-sm p-4 flex items-center space-x-1.5">
              <motion.div className="w-1.5 h-1.5 bg-brand-light rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} />
              <motion.div className="w-1.5 h-1.5 bg-brand-light rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} />
              <motion.div className="w-1.5 h-1.5 bg-brand-light rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex-shrink-0 flex items-center p-3 border-t border-brand-outline gap-2 bg-brand-surface/50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-grow w-full bg-brand-dark/50 border-2 border-brand-outline rounded-full px-5 py-2.5 text-brand-light placeholder-brand-muted focus:outline-none focus:ring-0 focus:border-brand-accent transition-all duration-300"
          autoFocus
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="w-11 h-11 flex-shrink-0 rounded-full bg-brand-accent text-brand-dark flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md shadow-brand-accent/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </motion.div>
  );
};

export default AiBotWindow;
