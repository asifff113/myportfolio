"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Search,
  ArrowLeft,
  MessageSquare,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Avatar from "@/components/ui/Avatar";
import { GuestbookMessage } from "@/lib/content-types";

// Extend type to include is_hidden
interface AdminGuestbookMessage extends GuestbookMessage {
  is_hidden?: boolean;
}

export default function GuestbookAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<AdminGuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadMessages();
    }
  }, [user]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("guestbook_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (id: string, currentHidden: boolean) => {
    try {
      const { error } = await supabase
        .from("guestbook_messages")
        .update({ is_hidden: !currentHidden })
        .eq("id", id);

      if (error) throw error;

      // Optimistic update
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, is_hidden: !currentHidden } : msg
        )
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
      alert("Failed to update visibility.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const { error } = await supabase
        .from("guestbook_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Optimistic update
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message. Please try again.");
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      msg.user_name.toLowerCase().includes(searchLower) ||
      msg.message.toLowerCase().includes(searchLower)
    );
  });

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Guestbook Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Moderate messages left by visitors
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg">
              <MessageSquare className="w-5 h-5 mr-2" />
              <span className="font-bold">{messages.length}</span>
              <span className="ml-1">Total Messages</span>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No messages found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? "Try adjusting your search terms" : "The guestbook is empty"}
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center group"
                >
                  <div className="flex-shrink-0">
                    <Avatar
                      src={msg.user_avatar}
                      alt={msg.user_name}
                      size="md"
                      fallbackText={msg.user_name}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {msg.user_name}
                      </h3>
                      {msg.is_hidden && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-2 py-0.5 rounded-full font-medium">
                          Hidden
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                        {new Date(msg.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${msg.is_hidden ? "opacity-50" : ""}`}>
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleVisibility(msg.id, !!msg.is_hidden)}
                      className={`p-2 rounded-lg transition-colors ${
                        msg.is_hidden
                          ? "text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      title={msg.is_hidden ? "Show Message" : "Hide Message"}
                    >
                      {msg.is_hidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Message"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
