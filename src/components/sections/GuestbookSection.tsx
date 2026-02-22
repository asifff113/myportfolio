"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Github, MessageSquare, User as UserIcon, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import Avatar from "@/components/ui/Avatar";
import { GuestbookMessage } from "@/lib/content-types";

export default function GuestbookSection() {
  const { user, loginWithGitHub, loading: authLoading } = useAuth();
  const isAdmin = useAdmin();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [customName, setCustomName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('guestbook_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook_messages' }, (payload) => {
        // Only add if not hidden (default is visible)
        if (!(payload.new as any).is_hidden) {
          setMessages((prev) => [payload.new as GuestbookMessage, ...prev].slice(0, 5));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("guestbook_messages")
        .select("*")
        .eq("is_hidden", false)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching guestbook messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const { error } = await supabase.from("guestbook_messages").delete().eq("id", id);
      if (error) throw error;

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const userName = user
        ? (user.user_metadata.full_name || user.user_metadata.name || "Anonymous")
        : (customName.trim() || "Anonymous");

      const { error } = await supabase.from("guestbook_messages").insert({
        user_id: user?.id || null,
        user_name: userName,
        user_avatar: user?.user_metadata.avatar_url || null,
        message: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
      setCustomName("");

      // Refresh to show the new message immediately
      fetchMessages();
    } catch (error) {
      console.error("Error submitting message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="guestbook" sectionId="guestbook">
      <SectionTitle
        title="Digital Guestbook"
        subtitle="Leave a mark on my digital space"
        gradient="from-sky-400 via-blue-400 to-sky-300"
      />

      <div className="max-w-4xl mx-auto">
        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-zinc-900/60 border border-zinc-800 p-6 md:p-8 rounded-2xl relative overflow-hidden">
            {/* Top gradient bar: sky-blue to lavender */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-violet-400" />

            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="hidden md:block">
                  <Avatar
                    src={user?.user_metadata.avatar_url}
                    alt={user?.user_metadata.full_name || "Guest"}
                    size="md"
                    fallbackText={user ? undefined : "?"}
                  />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-zinc-400">
                      {user ? (
                        <>Posting as <span className="text-sky-400 font-bold">{user.user_metadata.full_name || "Anonymous"}</span></>
                      ) : (
                        "Leave a message"
                      )}
                    </label>

                    {!user && (
                      <input
                        type="text"
                        placeholder="Your Name (Optional)"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-1 text-sm text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all w-full sm:w-auto"
                        maxLength={50}
                      />
                    )}
                  </div>

                  <div className="relative">
                    <textarea
                      id="message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={user ? "Write a message..." : "Write a message... (Sign in with GitHub to add your avatar)"}
                      className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl p-4 min-h-[100px] text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none"
                      maxLength={500}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-zinc-500">
                      {newMessage.length}/500
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
                    {!user ? (
                      <button
                        type="button"
                        onClick={loginWithGitHub}
                        disabled={authLoading}
                        className="text-xs flex items-center gap-1 text-zinc-400 hover:text-sky-400 transition-colors"
                      >
                        <Github size={14} />
                        Sign in with GitHub
                      </button>
                    ) : (
                      <div /> /* Spacer */
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || !newMessage.trim()}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:hover:bg-sky-500 ml-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Sign Guestbook
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Messages List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-100">
            <span className="w-2 h-8 bg-sky-400 rounded-full" />
            Recent Messages ({messages.length})
          </h3>

          {isLoadingMessages ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-sky-400" size={32} />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/60 rounded-xl border-dashed border-2 border-zinc-800">
              <p className="text-zinc-400">No messages yet. Be the first to sign!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-zinc-800/50 border border-zinc-700/30 p-4 rounded-xl hover:border-sky-400/20 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={msg.user_avatar}
                        alt={msg.user_name}
                        size="sm"
                        fallbackText={msg.user_name}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm truncate pr-2 text-zinc-100">{msg.user_name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500 whitespace-nowrap">
                              {new Date(msg.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            {(user?.id === msg.user_id || isAdmin) && (
                              <button
                                onClick={() => handleDelete(msg.id)}
                                className="text-zinc-500 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
                                title="Delete message"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed break-words">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
