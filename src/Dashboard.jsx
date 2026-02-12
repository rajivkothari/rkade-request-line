import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ThumbsUp, CheckCircle, Music, LogOut, Archive } from "lucide-react";

export default function Dashboard({ setAdmin }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "requests"),
      where("status", "!=", "ARCHIVED"),
      orderBy("status", "asc"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateDoc(doc(db, "requests", id), { status: newStatus });
  };

  const handleArchive = async (id) => {
    await updateDoc(doc(db, "requests", id), {
      status: "ARCHIVED",
      archivedAt: serverTimestamp(),
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <Music /> DJ DASH
        </h1>
        <button
          onClick={() => setAdmin(false)}
          className="px-4 py-2 bg-slate-800 rounded-lg text-xs flex items-center gap-2"
        >
          <LogOut size={16} /> Exit
        </button>
      </header>

      <div className="grid gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className={`p-4 rounded-xl border-2 flex items-center justify-between ${
              req.status === "ACCEPTED"
                ? "border-green-600 bg-green-900/10"
                : "border-slate-800 bg-slate-900/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={req.cover}
                className="w-16 h-16 rounded shadow-md"
                alt="Cover"
              />
              <div>
                <h3 className="text-lg font-bold">{req.title}</h3>
                <p className="text-slate-400 text-sm">{req.artist}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {req.status === "PENDING" ? (
                <>
                  <button
                    onClick={() => handleArchive(req.id)}
                    className="p-3 bg-slate-800 text-slate-400 rounded-lg"
                  >
                    <Archive />
                  </button>
                  <button
                    onClick={() => handleStatusChange(req.id, "ACCEPTED")}
                    className="p-3 bg-blue-600 text-white rounded-lg shadow-lg"
                  >
                    <ThumbsUp />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-green-400 font-bold flex items-center gap-2">
                    <CheckCircle size={20} /> READY
                  </span>
                  <button
                    onClick={() => handleArchive(req.id)}
                    className="p-2 text-slate-500 hover:text-white"
                  >
                    <Archive size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="text-center py-20 text-slate-700 italic border-2 border-dashed border-slate-800 rounded-3xl">
            No active requests.
          </div>
        )}
      </div>
    </div>
  );
}
