"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, Loader2, Mail, Phone, MapPin, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getContactInfo, updateContactInfo } from "@/lib/supabase-queries";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ContactInfo } from "@/lib/content-types";

export default function ContactAdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contactId, setContactId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    location: "",
    availability: "",
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadContact();
  }, [user]);

  const loadContact = async () => {
    try {
      setLoading(true);
      const data = await getContactInfo();
      if (data) {
        setContactId(data.id || null);
        setFormData({
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          availability: data.availability || "",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId) {
      alert("No contact info record found");
      return;
    }
    try {
      setSubmitting(true);
      await updateContactInfo({ ...formData, id: contactId });
      alert("Contact info updated successfully");
    } catch (error) {
      alert("Failed to update contact info");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Information</h1>
          <p className="text-gray-600 dark:text-gray-400">Update your contact details and availability</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number *
              </label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4" />
                Address *
              </label>
              <textarea value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" required />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4" />
                Availability
              </label>
              <input type="text" value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })} placeholder="e.g., Available for freelance work" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 text-lg font-semibold" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
