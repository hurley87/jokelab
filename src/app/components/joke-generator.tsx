'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { 
  StopCircle, 
  AlertCircle, 
  RefreshCw, 
  ThumbsUp, 
  BarChart2, 
  Star, 
  Tag, 
  MessageSquare, 
  Mic, 
  Zap, 
  Radio, 
  Lightbulb,
  Volume2,
  Sparkles,
  Bot,
  Cpu
} from 'lucide-react';

// Define types for joke preferences
type JokePreferences = {
  topic: string;
  tone: string;
  type: string;
  temperature: boolean;
};

// Define the structure for joke evaluation
type JokeEvaluation = {
  funnyRating: number;
  appropriatenessRating: number;
  originalityRating: number;
  tags: string[];
  feedback: string;
};

// Predefined options for joke preferences
const jokeTopics = ['Work', 'People', 'Animals', 'Food', 'Television', 'Technology', 'Sports', 'Music', 'Movies', 'Travel'];
const jokeTones = ['Witty', 'Sarcastic', 'Silly', 'Dark', 'Goofy', 'Clean', 'Clever', 'Absurd'];
const jokeTypes = ['Pun', 'Knock-knock', 'Story', 'One-liner', 'Dad joke', 'Riddle', 'Wordplay'];

export default function JokeGenerator() {
  // Joke preferences state
  const [jokePreferences, setJokePreferences] = useState<JokePreferences>({
    topic: 'Work',
    tone: 'Witty',
    type: 'Pun',
    temperature: false
  });
  
  // Joke evaluation state
  const [jokeEvaluation, setJokeEvaluation] = useState<JokeEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  
  // Animation states
  const [isRobotTalking, setIsRobotTalking] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  
  // Main joke generation chat
  const { messages, input, handleInputChange, handleSubmit, status, stop, error, reload, setMessages } =
    useChat({
      api: '/api/chat',
      body: {
        jokePreferences
      },
      onError: (error) => {
        console.error('Chat error:', error);
      },
    });
  
  // Separate chat instance for joke evaluation
  const evaluationChat = useChat({
    api: '/api/chat',
    body: {
      evaluateJoke: true
    },
    onFinish: (message) => {
      try {
        // Parse the evaluation JSON from the response
        const evaluationData = JSON.parse(message.content);
        setJokeEvaluation(evaluationData);
        setIsEvaluating(false);
        setShowEvaluation(true);
      } catch (error) {
        console.error('Failed to parse joke evaluation:', error);
        setIsEvaluating(false);
      }
    },
    onError: (error) => {
      console.error('Evaluation error:', error);
      setIsEvaluating(false);
    }
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Robot talking animation effect
  useEffect(() => {
    if (status === 'streaming') {
      setIsRobotTalking(true);
    } else {
      setIsRobotTalking(false);
    }
  }, [status]);
  
  // Spotlight effect when joke is delivered
  useEffect(() => {
    if (messages.length > 0 && status === 'ready') {
      setShowSpotlight(true);
    } else {
      setShowSpotlight(false);
    }
  }, [messages, status]);

  // Handle preference change
  const handlePreferenceChange = (key: keyof JokePreferences, value: string | boolean) => {
    setJokePreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Generate a joke with current preferences
  const generateJoke = () => {
    const jokePrompt = `Generate a joke with these preferences: Topic: ${jokePreferences.topic}, Tone: ${jokePreferences.tone}, Type: ${jokePreferences.type}`;
    
    // Clear previous messages, evaluation, and reset UI state
    setMessages([]);
    setJokeEvaluation(null);
    setShowEvaluation(false);
    
    // Use setTimeout to ensure the messages are cleared before submitting
    setTimeout(() => {
      const event = new Event('submit', { bubbles: true });
      handleInputChange({ target: { value: jokePrompt } } as React.ChangeEvent<HTMLInputElement>);
      
      setTimeout(() => {
        const form = document.querySelector('form');
        if (form) form.dispatchEvent(event);
      }, 0);
    }, 0);
  };

  // Reset the joke and clear messages
  const resetJoke = () => {
    setMessages([]);
    setJokeEvaluation(null);
    setShowEvaluation(false);
  };

  // Evaluate the current joke
  const evaluateJoke = () => {
    if (messages.length < 2) return;
    
    setIsEvaluating(true);
    
    // Send the evaluation request
    evaluationChat.setMessages([
      ...messages.slice(-2) // Get the last user prompt and AI response
    ]);
    
    const event = new Event('submit', { bubbles: true });
    evaluationChat.handleInputChange({ target: { value: 'Evaluate this joke' } } as React.ChangeEvent<HTMLInputElement>);
    
    setTimeout(() => {
      const evaluationForm = document.querySelector('form[data-evaluation-form]');
      if (evaluationForm) evaluationForm.dispatchEvent(event);
    }, 0);
  };

  // Render rating stars
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className={`w-3 h-3 rounded-full mx-0.5 ${
              i < rating ? 'bg-yellow-400' : 'bg-gray-200'
            }`}
          />
        ))}
        <span className="ml-2 font-medium">{rating}/10</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gradient-to-b from-sky-100 to-indigo-100 text-slate-800">

      
      <main className="flex-1 overflow-hidden p-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Joke preferences panel - styled as control panel */}
          <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg shadow-lg border border-blue-200 relative overflow-auto">
            <div className="sticky top-0 left-0 right-0 h-6 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 rounded-t-lg flex items-center justify-center z-10">
              <div className="w-2 h-2 rounded-full bg-red-400 mx-1"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400 mx-1"></div>
              <div className="w-2 h-2 rounded-full bg-green-400 mx-1"></div>
            </div>
            
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-4 text-center pt-2 text-blue-600 flex items-center justify-center">
                <Cpu className="w-5 h-5 mr-2 text-blue-500" />
                ROBO-COMEDIAN CONTROL PANEL
              </h2>
              
              {/* Topic selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-blue-700">TOPIC SELECTION</label>
                <div className="flex flex-wrap gap-2">
                  {jokeTopics.map(topic => (
                    <button
                      key={topic}
                      onClick={() => handlePreferenceChange('topic', topic)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        jokePreferences.topic === topic
                          ? 'bg-blue-500 text-white shadow-glow'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tone selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-blue-700">HUMOR ALGORITHM</label>
                <div className="flex flex-wrap gap-2">
                  {jokeTones.map(tone => (
                    <button
                      key={tone}
                      onClick={() => handlePreferenceChange('tone', tone)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        jokePreferences.tone === tone
                          ? 'bg-blue-500 text-white shadow-glow'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Type selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-blue-700">JOKE FORMAT</label>
                <div className="flex flex-wrap gap-2">
                  {jokeTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => handlePreferenceChange('type', type)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        jokePreferences.type === type
                          ? 'bg-blue-500 text-white shadow-glow'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Temperature selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-blue-700">CREATIVITY CIRCUITS</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreferenceChange('temperature', false)}
                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                      !jokePreferences.temperature
                        ? 'bg-blue-500 text-white shadow-glow'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    }`}
                  >
                    <Zap className="w-4 h-4 inline mr-1" />
                    Standard
                  </button>
                  <button
                    onClick={() => handlePreferenceChange('temperature', true)}
                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                      jokePreferences.temperature
                        ? 'bg-blue-500 text-white shadow-glow'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Overclocked
                  </button>
                </div>
              </div>
              
              {/* Generate button */}
              <button
                onClick={generateJoke}
                disabled={status !== 'ready'}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-lg flex items-center justify-center transition-colors disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed mb-2 font-bold shadow-lg"
              >
                <Bot className="w-5 h-5 mr-2" />
                ACTIVATE JOKE ROUTINE
              </button>
            </div>
          </div>

          {/* Joke display area - styled as stage */}
          <div className="lg:col-span-2 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-lg shadow-lg border border-blue-200 flex flex-col relative overflow-hidden">
            <div className="p-4 md:p-6 flex-1 flex flex-col overflow-hidden">
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4 flex items-center relative z-10">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>Error: {error.message || 'System malfunction! Humor circuits offline.'}</span>
                </div>
              )}
              
              <div className="flex-1 overflow-y-auto mb-4 relative z-10">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-blue-500">
                    <div className="w-24 h-24 mb-6 relative">
                      <Bot className="w-full h-full text-blue-400" />
                      <div className={`absolute top-0 right-0 w-4 h-4 rounded-full ${isRobotTalking ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
                    </div>
                    <p className="text-center text-lg">
                      Program my joke parameters and activate my comedy routines!
                    </p>
                    <p className="text-center text-blue-400 italic mt-2">
                      "Humor circuits fully charged!"
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-sm text-blue-500">
                      <span className="font-medium">PARAMETERS:</span> {jokePreferences.topic} • {jokePreferences.tone} • {jokePreferences.type} • {jokePreferences.temperature ? 'Overclocked' : 'Standard'}
                    </div>
                    
                    <div className="bg-white/70 p-6 rounded-lg text-slate-800 text-lg mb-4 border border-blue-200 relative">
                      
                      {isRobotTalking && (
                        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                          <Volume2 className="w-6 h-6 text-blue-500 animate-pulse" />
                        </div>
                      )}
                      
                      <div className="pl-6">
                        {messages.map((message) => (
                          message.role === 'assistant' && (
                            <div key={message.id} className="font-mono">
                              {message.content}
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                    
                    {/* Joke Evaluation Section */}
                    {messages.length > 0 && !isEvaluating && !showEvaluation && status === 'ready' && (
                      <div className="flex justify-center">
                        <button
                          onClick={evaluateJoke}
                          className="flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-lg transition-colors shadow-lg"
                        >
                          <BarChart2 className="w-5 h-5 mr-2" />
                          ANALYZE HUMOR EFFECTIVENESS
                        </button>
                      </div>
                    )}
                    
                    {isEvaluating && (
                      <div className="text-center py-4">
                        <div className="animate-pulse flex flex-col items-center">
                          <BarChart2 className="w-8 h-8 text-purple-500 mb-2" />
                          <p className="text-purple-600">Processing audience response data...</p>
                        </div>
                      </div>
                    )}
                    
                    {showEvaluation && jokeEvaluation && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                        <h3 className="font-semibold text-lg mb-3 flex items-center text-purple-700">
                          <BarChart2 className="w-5 h-5 mr-2" />
                          AUDIENCE FEEDBACK ANALYSIS
                        </h3>
                        
                        <div className="space-y-3">
                          {/* Ratings */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="flex items-center text-sm font-medium mb-1 text-purple-700">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Humor Rating
                              </div>
                              {renderRatingStars(jokeEvaluation.funnyRating)}
                            </div>
                            
                            <div>
                              <div className="flex items-center text-sm font-medium mb-1 text-purple-700">
                                <Star className="w-4 h-4 mr-1" />
                                Appropriateness
                              </div>
                              {renderRatingStars(jokeEvaluation.appropriatenessRating)}
                            </div>
                            
                            <div>
                              <div className="flex items-center text-sm font-medium mb-1 text-purple-700">
                                <Lightbulb className="w-4 h-4 mr-1" />
                                Originality
                              </div>
                              {renderRatingStars(jokeEvaluation.originalityRating)}
                            </div>
                          </div>
                          
                          {/* Tags */}
                          <div>
                            <div className="flex items-center text-sm font-medium mb-2 text-purple-700">
                              <Tag className="w-4 h-4 mr-1" />
                              Classification Tags
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {jokeEvaluation.tags.map((tag, index) => (
                                <span 
                                  key={index} 
                                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Feedback */}
                          <div>
                            <div className="flex items-center text-sm font-medium mb-2 text-purple-700">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Performance Notes
                            </div>
                            <p className="text-sm text-purple-800">{jokeEvaluation.feedback}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Control buttons */}
              <div className="flex justify-between mt-auto relative z-10">
                {(status === 'submitted' || status === 'streaming') && (
                  <button 
                    type="button" 
                    onClick={() => stop()}
                    className="flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
                  >
                    <StopCircle className="w-5 h-5 mr-1" />
                    <span>ABORT ROUTINE</span>
                  </button>
                )}
                
                {messages.length > 0 && status === 'ready' && (
                  <div className="flex gap-4">
                    <button 
                      onClick={resetJoke}
                      className="flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5 mr-1" />
                      <span>RESET</span>
                    </button>
                    
                    <button 
                      onClick={generateJoke}
                      className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Bot className="w-5 h-5 mr-1" />
                      <span>NEW ROUTINE</span>
                    </button>
                  </div>
                )}
              </div>
              
              {status === 'submitted' && (
                <div className="text-sm text-blue-500 mt-2 text-center animate-pulse relative z-10">
                  Activating humor algorithms...
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Hidden forms for joke submission and evaluation */}
      <form onSubmit={handleSubmit} className="hidden">
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
        />
      </form>
      
      <form onSubmit={evaluationChat.handleSubmit} className="hidden" data-evaluation-form>
        <input
          name="evaluation-prompt"
          value={evaluationChat.input}
          onChange={evaluationChat.handleInputChange}
        />
      </form>
      
      {/* Add some custom styles for the robot theme */}
      <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 8px 2px rgba(59, 130, 246, 0.4);
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-blink {
          animation: blink 1.5s infinite;
        }
      `}</style>
    </div>
  );
} 