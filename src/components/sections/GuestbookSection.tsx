"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Github, MessageSquare, User as UserIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import Section from "@/components/ui/Section";
import SectionTitle from "@/components/ui/SectionTitle";
import Avatar from "@/components/ui/Avatar";
import { GuestbookMessage } from "@/lib/content-types";

export default function GuestbookSection() {
  const { user, loginWithGitHub, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('guestbook_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook_messages' }, (payload) => {
        setMessages((prev) => [payload.new as GuestbookMessage, ...prev]);
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
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching guestbook messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("guestbook_messages").insert({
        user_id: user.id,
        user_name: user.user_metadata.full_name || user.user_metadata.name || "Anonymous",
        user_avatar: user.user_metadata.avatar_url,
        message: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error submitting message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="guestbook" className="bg-muted/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <SectionTitle
        title="Digital Guestbook"
        subtitle="Leave a mark on my digital space"
      />

      <div className="max-w-4xl mx-auto">
        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="glass-ultra p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
            
            {!user ? (
              <div className="text-center py-8">
                <MessageSquare size={48} className="mx-auto mb-4 text-primary opacity-80" />
                <h3 className="text-2xl font-bold mb-2">Sign the Guestbook</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Share a message, feedback, or just say hello! Sign in with GitHub to leave your mark.
                </p>
                <button
                  onClick={loginWithGitHub}
                  disabled={authLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#24292e] hover:bg-[#2f363d] text-white rounded-full font-bold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {authLoading ? <Loader2 className="animate-spin" size={20} /> : <Github size={20} />}
                  Sign in with GitHub
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:block">
                    <Avatar
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata.full_name || "User"}
                      size="md"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-muted-foreground">
                      Posting as <span className="text-primary font-bold">{user.user_metadata.full_name || "Anonymous"}</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Write a message..."
                        className="w-full bg-background/50 border border-white/10 rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                        maxLength={500}
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                        {newMessage.length}/500
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting || !newMessage.trim()}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-full font-bold shadow-lg hover:shadow-primary/25 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
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
            )}
          </div>
        </motion.div>

        {/* Messages List */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Recent Messages ({messages.length})
          </h3>

          {isLoadingMessages ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 glass rounded-xl border-dashed border-2 border-white/10">
              <p className="text-muted-foreground">No messages yet. Be the first to sign!</p>
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
                    className="glass p-5 rounded-xl border border-white/5 hover:border-primary/20 transition-colors group"
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
                          <h4 className="font-bold text-sm truncate pr-2">{msg.user_name}</h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(msg.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed break-words">
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
