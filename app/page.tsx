"use client";

import { useState, useEffect } from "react";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`h-screen w-screen transition-colors ${
        darkMode
          ? "bg-gradient-to-br from-black via-gray-950 to-black text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* ================= TOGGLE ================= */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-full text-sm font-medium border
          bg-white/10 hover:bg-white/20 dark:border-gray-700"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* ================= HERO ================= */}
      <section className="h-full flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">
          Kenmark ITan AI Assistant
        </h1>
        <p className="text-gray-400 max-w-2xl mb-10">
          An AI-powered virtual assistant designed to help users understand
          Kenmark ITan Solutions, its services, offerings, and company
          information through intelligent conversations.
        </p>

        {/* ================= ADMIN PANEL ================= */}
        <div
          className={`w-full max-w-xl rounded-xl p-6 shadow-lg border ${
            darkMode
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-2">
            Admin Knowledge Management
          </h2>
          <p className="text-sm text-gray-500 mb-4">
  Excel upload is supported in local/admin environments.
  In production, the chatbot uses a structured knowledge base.
</p>

          <input
            type="file"
            accept=".xlsx"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);

              const res = await fetch("/api/admin/upload-knowledge", {
                method: "POST",
                body: formData,
              });

              const data = await res.json();
              alert(data.message);
            }}
            className="block w-full text-sm
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700 cursor-pointer"
          />
        </div>
      </section>

      {/* ================= CHAT BUTTON ================= */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-full shadow-2xl text-lg font-medium"
      >
        Chat
      </button>

      {/* ================= CHAT WINDOW ================= */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-8 w-[420px] h-[520px] rounded-2xl shadow-2xl flex flex-col border ${
            darkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <div className="p-4 border-b font-semibold">
            Kenmark ITan Assistant
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto text-sm">
            {messages.length === 0 && (
              <p className="text-gray-400">
                Ask me anything about Kenmark ITan Solutions.
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-xl ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-gray-700 text-white"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="mr-auto bg-gray-700 px-4 py-2 rounded-xl text-gray-300">
                Typing...
              </div>
            )}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-lg border outline-none bg-transparent"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
