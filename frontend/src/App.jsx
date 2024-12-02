import axios from "axios";
import React, { useState } from "react";
import { Loader } from "lucide-react";

const App = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedData, setFeedData] = useState(null);
  const [grabedData, setGrabedData] = useState(JSON.parse(localStorage.getItem("grabedData")) || null);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3030/api/v1", { url });
      setFeedData(response.data);
      console.log(response.data);
      localStorage.setItem("grabedData", JSON.stringify(response.data));
      setGrabedData(response.data);
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-tr from-cyan-500 to-blue-500 items-center min-h-screen justify-center p-4">
      <div className="bg-black/40 p-6 rounded-md items-center flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white">Feedly</h1>
        <form onSubmit={submitHandler} className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="px-4 py-2 rounded-md flex-1"
              placeholder="Enter website URL"
            />
            <button 
              type="submit" 
              className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
              disabled={loading || !url}
            >
              {loading ? <Loader className="animate-spin" /> : "Submit"}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="text-red-200 text-sm mt-2">
            Error: {error}
          </div>
        )}

        {grabedData && (
          <div className="text-white mt-4">
            {grabedData.images && grabedData.images.url && (
              <img 
                src={grabedData.images.url} 
                alt={grabedData.images.title || grabedData.title}
                className="w-full h-32 object-contain mb-4"
              />
            )}
            <h2 className="text-xl font-bold">{grabedData.title}</h2>
            <div className="mt-4 space-y-4">
              {grabedData.items?.map((item, index) => (
                <div key={item.guid || index} className="border-t border-white/20 pt-4">
                  {item.content && (
                    <div 
                      className="w-full h-48 mb-4 overflow-hidden rounded-md"
                      dangerouslySetInnerHTML={{ 
                        __html: item.content.match(/<img[^>]+>/)?.[0] || ''
                      }}
                    />
                  )}
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:underline"
                  >
                    {item.title}
                  </a>
                  <p className="text-sm text-gray-200 mt-1">
                    {new Date(item.pubDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2">{item.contentSnippet}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
