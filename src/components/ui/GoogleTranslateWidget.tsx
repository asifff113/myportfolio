"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

export default function GoogleTranslateWidget() {
  const [mounted, setMounted] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { locale } = useLanguage();

  useEffect(() => {
    setMounted(true);

    // Clear Google Translate cookies to prevent auto-translation on page load
    const clearGoogleCookies = () => {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        if (name.trim().indexOf("googtrans") === 0) {
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=." + document.location.hostname + ";path=/";
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=" + document.location.hostname + ";path=/";
        }
      }
    };

    clearGoogleCookies();
    
    // Define the callback function that Google Translate will call
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            includedLanguages: "en,es,fr,de,bn,hi,zh-CN,ja",
          },
          "google_translate_element"
        );
        setScriptLoaded(true);
      }
    };
  }, []);

  // Only inject Google Translate script when a non-English language is selected
  useEffect(() => {
    if (!mounted) return;
    
    const scriptId = "google-translate-script";
    
    if (locale !== "en") {
      // Load script if not already loaded
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    } else {
      // When switching back to English, restore original page
      const googleTranslateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (googleTranslateCombo) {
        googleTranslateCombo.value = 'en';
        googleTranslateCombo.dispatchEvent(new Event('change'));
      }
      // Clear translation cookies
      document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      document.cookie = "googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=." + document.location.hostname + ";path=/";
    }
  }, [locale, mounted]);

  // Sync Google Translate combo with LanguageContext when widget is loaded
  useEffect(() => {
    if (!mounted || locale === 'en' || !scriptLoaded) return;

    const syncLanguage = () => {
      const googleTranslateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (googleTranslateCombo) {
        if (googleTranslateCombo.value !== locale) {
          googleTranslateCombo.value = locale;
          googleTranslateCombo.dispatchEvent(new Event('change'));
        }
      }
    };

    // Try immediately
    syncLanguage();

    // Retry a few times in case the widget is still loading
    const intervalId = setInterval(syncLanguage, 1000);
    
    // Clear interval after 10 seconds
    const timeoutId = setTimeout(() => clearInterval(intervalId), 10000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [locale, mounted, scriptLoaded]);

  if (!mounted) return null;

  return (
    <div className="hidden">
      <div id="google_translate_element" />
      <style jsx global>{`
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
        .skiptranslate > iframe { display: none !important; }
        body { top: 0px !important; }
        .goog-te-gadget-simple { display: none !important; }
        .goog-te-gadget-icon { display: none !important; }
        #google_translate_element { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
      `}</style>
    </div>
  );
}
