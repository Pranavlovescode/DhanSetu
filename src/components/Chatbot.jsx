"use client";
import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AIChat } from '@/utils/apis/aiChat';

export function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const aiResponse = await AIChat.sendMessage(inputValue);
    // if (aiResponse.status !== 200) {  
    //   console.error("Error sending message:", aiResponse);
    //   return;
    // }


    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse || "I'm not sure how to respond to that.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={onClose} />
      
      {/* Chatbot Container */}
      <div className="fixed bottom-0 right-0 z-40 md:bottom-24 md:right-6">
        <Card className="w-screen h-screen md:w-80 md:h-96 bg-black border-zinc-700 md:shadow-2xl flex flex-col overflow-hidden md:rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-700 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-zinc-700">
                <AvatarFallback className="text-white text-sm">AI</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-white font-medium">DhanSetu Assistant</h3>
                <p className="text-gray-400 text-xs">Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="h-5 w-5 md:h-4 md:w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[80%] p-3 rounded-lg ${
                        message.isBot
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-black'
                      }`}
                    >
                      <p className="text-sm break-words">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isBot ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-white p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="p-3 md:p-4 border-t border-gray-700 flex-shrink-0 pb-safe">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 h-10 md:h-9"
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-white text-black hover:bg-gray-200 h-10 w-10 md:h-9 md:w-auto px-3"
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}