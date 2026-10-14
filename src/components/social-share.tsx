import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { SOCIAL_TEXT, shareUrl } from "@/lib/social";

const ICONS = {
  Facebook: "M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V4a22 22 0 0 0-2.8-.2c-2.8 0-4.7 1.7-4.7 4.8V10H7v3h2.5v8z",
  X: "M18.9 3H22l-6.8 7.8L23 21h-6.1l-4.8-6.3L6.6 21H3.4l7.2-8.3L1 3h6.3l4.4 5.8L18.9 3zm-1.1 16.2h1.7L6.4 4.7H4.6z",
  LinkedIn: "M5.4 7.3a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM3.7 9H7v12H3.7V9zm5.6 0h3.2v1.6h.1a3.5 3.5 0 0 1 3.2-1.8c3.4 0 4 2.2 4 5.1V21h-3.3v-6.3c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21H9.3V9z",
  WhatsApp: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.7s-.4-.1-.5.2l-.8 1c-.1.1-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.7-.2-.2 0-.4.1-.5l.4-.5.3-.4c.1-.2 0-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4H9c-.2 0-.4.1-.6.3-.2.3-.8.9-.8 2.1s.9 2.4 1 2.6c.1.1 1.8 2.7 4.3 3.8.6.2 1 .4 1.4.5.6.2 1.1.1 1.5.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.1-.1-1-.6z",
  Telegram: "M21.5 3.5 2.7 10.8c-1.3.5-1.3 1.2-.3 1.5l4.8 1.5 1.8 5.5c.2.6.1.8.7.8.4 0 .6-.2.9-.4l2.3-2.3 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.8-1-1.6zM8 13.5l10.8-6.8c.5-.3.9-.1.5.2l-8.9 8-.4 3.4-2-4.8z",
};

export function SocialShare() {
  const lang = useLang();
  const t = SOCIAL_TEXT[lang];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const url = shareUrl(lang, pathname);
  const [native, setNative] = useState(false);
  const [status, setStatus] = useState<"" | "copied" | "failed">("");
  useEffect(() => { setNative(typeof navigator.share === "function"); }, []);
  useEffect(() => { setStatus(""); }, [url]);
  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(""), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);
  const u = encodeURIComponent(url);
  const text = encodeURIComponent(t.text);
  const links = {
    Facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    X: `https://twitter.com/intent/tweet?url=${u}&text=${text}`,
    LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    WhatsApp: `https://wa.me/?text=${encodeURIComponent(`${t.text} ${url}`)}`,
    Telegram: `https://t.me/share/url?url=${u}&text=${text}`,
  };
  async function copy() {
    try { await navigator.clipboard.writeText(url); setStatus("copied"); }
    catch { setStatus("failed"); }
  }
  async function share() {
    try { await navigator.share({ title: t.title, text: t.text, url }); }
    catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) await copy(); }
  }
  return (
    <div className="mt-7" aria-label={t.share}>
      <p className="mb-3 text-xs font-semibold text-primary-foreground/80">{t.share}</p>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(links) as (keyof typeof links)[]).map((platform) => (
          <Button key={platform} asChild variant="ghost" size="icon" className="size-10 border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <a href={links[platform]} target="_blank" rel="noopener noreferrer" aria-label={`${t.on} ${platform}`} title={`${t.on} ${platform}`}>
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true"><path d={ICONS[platform]} /></svg>
            </a>
          </Button>
        ))}
        <Button variant="ghost" size="icon" onClick={copy} aria-label={status === "copied" ? t.copied : t.copy} title={t.copy} className="size-10 border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">{status === "copied" ? <Check size={17} /> : <Copy size={17} />}</Button>
        {native ? <Button variant="ghost" size="icon" onClick={share} aria-label={t.native} title={t.native} className="size-10 border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Share2 size={17} /></Button> : null}
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-4 text-xs text-primary-foreground/80">{status ? t[status] : ""}</p>
    </div>
  );
}