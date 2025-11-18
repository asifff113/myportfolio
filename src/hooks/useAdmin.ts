import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user || !user.email) {
          setIsAdmin(false);
          return;
        }
        
        // Check if user exists in admins table
        const { data, error } = await supabase
          .from('admins')
          .select('role')
          .eq('email', user.email)
          .single();
        
        if (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
          return;
        }
        
        setIsAdmin(!!data);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return isAdmin;
}
