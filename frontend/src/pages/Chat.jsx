import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { AiOutlineSend } from "react-icons/ai";

function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const chatContainerRef = useRef(null);

  // Scroll to bottom of chat messages when new message arrives or on initial load
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const generateAnswer = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      return; // If question is empty, do nothing
    }
    setGeneratingAnswer(true);
    const userMessage = { text: question, from: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyB-scXq-SGLrVJChjxbHQb191NZ87FIzek",
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );

      const aiMessage = {
        text: response.data.candidates[0].content.parts[0].text,
        from: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Failed to generate answer", error);
      const errorMessage = {
        text: "Sorry - Something went wrong. Please try again!",
        from: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setGeneratingAnswer(false);
    setQuestion("");
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundImage: `url(https://d157qvbc2uf2q6.cloudfront.net/app/uploads/2023/09/Customer-Interactions-with-AI-powered-Chatbots.jpg)`, backgroundSize: 'cover', backgroundPosition: 'left center' }}>
      <div className="max-w-screen-md mx-auto p-4 flex-1 bg-white bg-opacity-80">
        <h1 className="text-3xl text-center mb-4 font-bold">Chiranjivi</h1>
        <p className="text-center mb-4">Provide symptoms and get help</p>
        
        <div
          ref={chatContainerRef}
          className="flex-1 h-96 border border-gray-200 rounded-lg overflow-y-auto shadow-md bg-white"
        >
          <div className="p-4">
            {messages.map((message, index) => (
              <div key={index} className={`chat ${message.from === 'user' ? 'chat-start' : 'chat-end'}`}>
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt={message.from === 'user' ? "User Avatar" : "AI Avatar"}
                      src={message.from === 'user' 
                        ? "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                        : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                      }
                    />
                  </div>
                </div>
                <div className="chat-header">
                  {message.from === 'user' ? 'User' : 'AI'}
                  <time className="text-xs opacity-50">{new Date().toLocaleTimeString()}</time>
                </div>
                <div className="chat-bubble">{message.text}</div>
                <div className="chat-footer opacity-50">
                  {message.from === 'user' ? 'Sent' : 'Received'}
                </div>
              </div>
            ))}
            {generatingAnswer && (
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Loading"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    />
                  </div>
                </div>
                <div className="chat-header">
                  AI
                  <time className="text-xs opacity-50">{new Date().toLocaleTimeString()}</time>
                </div>
                <div className="chat-bubble">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.83A9.93 9.93 0 004.17 11H2a10 10 0 0010 10c2.76 0 5.26-1.14 7.07-2.97l-1.42-1.42A7.96 7.96 0 0112 20c-4.42 0-8-3.58-8-8z"></path>
                  </svg>
                  Loading your answer...
                </div>
                <div className="chat-footer opacity-50">Processing</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 mt-4 rounded-lg bg-white bg-opacity-80">
          <form onSubmit={generateAnswer} className="flex items-center">
            <input
              type="text"
              className="flex-1 py-2 px-4 border border-gray-300 rounded-l-lg focus:outline-none bg-gray-100"
              placeholder="Ask anything..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              type="submit"
              className={`py-2 px-4 bg-blue-500 text-white rounded-r-lg flex items-center justify-center ${generatingAnswer || !question.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              disabled={generatingAnswer || !question.trim()}
            >
              {generatingAnswer ? (
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.83A9.93 9.93 0 004.17 11H2a10 10 0 0010 10c2.76 0 5.26-1.14 7.07-2.97l-1.42-1.42A7.96 7.96 0 0112 20c-4.42 0-8-3.58-8-8z"></path>
                </svg>
              ) : <AiOutlineSend className="text-lg" />}
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
