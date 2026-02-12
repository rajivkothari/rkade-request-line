import React, { useState, useEffect } from "react";
import {
  Search,
  Music,
  Smartphone,
  Ban,
  Thermometer,
  AlertCircle,
} from "lucide-react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { searchSpotify, getSpotifyToken } from "./spotify";
import Dashboard from "./Dashboard.jsx";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState("SEARCH");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); // NEW ERROR STATE
  const [shakeId, setShakeId] = useState(null);
  const [vibeVote, setVibeVote] = useState(null);

  useEffect(() => {
    const searchTracks = async () => {
      if (query.length > 2) {
        setIsLoading(true);
        setErrorMsg(null);
        try {
          const token = await getSpotifyToken();
          const spotifyResults = await searchSpotify(query, token);
          setResults(spotifyResults);
        } catch (e) {
          setErrorMsg(
            "Spotify Connection Failed. Try opening in a new window."
          );
          console.error(e);
        }
        setIsLoading(false);
      } else {
        setResults([]);
      }
    };
    const timer = setTimeout(searchTracks, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = async (song) => {
    try {
      await addDoc(collection(db, "requests"), {
        title: song.title,
        artist: song.artist,
        cover: song.cover,
        status: "PENDING",
        timestamp: serverTimestamp(),
      });
      setView("WAITING");
    } catch (e) {
      alert("Database Error");
    }
  };

  if (isAdmin) return <Dashboard setAdmin={setIsAdmin} />;

  return (
    <div className="fixed inset-0 bg-black text-white font-sans max-w-md mx-auto flex flex-col border-x border-slate-800">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
        <h1
          className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer"
          onClick={() => setIsAdmin(true)}
        >
          Beats by RKADE
        </h1>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {view === "SEARCH" && (
          <div className="space-y-4 pb-24">
            <div className="relative sticky top-0 z-10 bg-black/80 py-2">
              <Search
                className={`absolute left-3 top-5 h-5 w-5 ${
                  isLoading ? "animate-spin text-blue-400" : "text-slate-500"
                }`}
              />
              <input
                className="w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none"
                placeholder="Search songs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* ERROR DISPLAY */}
            {errorMsg && (
              <div className="bg-amber-900/20 border border-amber-500 text-amber-500 p-3 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle size={14} /> {errorMsg}
              </div>
            )}

            {results.map((song) => (
              <div
                key={song.id}
                onClick={() => handleSelect(song)}
                className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-transparent hover:border-slate-700 cursor-pointer"
              >
                <img src={song.cover} className="w-12 h-12 rounded" alt="Art" />
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold text-sm truncate">{song.title}</h3>
                  <p className="text-xs text-slate-400 truncate">
                    {song.artist}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {view === "WAITING" && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Smartphone className="w-16 h-16 text-blue-400 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
            <button
              onClick={() => setView("SEARCH")}
              className="mt-4 px-8 py-2 bg-blue-600 rounded-full font-bold"
            >
              Back
            </button>
          </div>
        )}
      </div>

      {view === "SEARCH" && (
        <div className="bg-slate-900 border-t border-slate-800 p-4 pb-10">
          <div className="flex gap-2">
            {["Too Chill", "Perfect", "Pump It"].map((label) => (
              <button
                key={label}
                onClick={() => setVibeVote(label)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black border ${
                  vibeVote === label
                    ? "bg-blue-900 border-blue-500 text-blue-400"
                    : "bg-slate-800 border-slate-700 text-slate-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
