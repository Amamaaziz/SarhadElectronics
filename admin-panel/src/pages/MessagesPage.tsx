import React, { useEffect, useState } from 'react';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import { getAdminMessages } from '../services/adminApi';
import { AdminContactMessage } from '../types';

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);

  useEffect(() => {
    getAdminMessages().then(setMessages);
  }, []);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
          Customer Inquiries & Technical Requests
        </h2>
        <p className="text-xs text-textMuted">
          Submissions received from the storefront Contact page & showroom inquiries.
        </p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-surface/20 border border-surface-border">
            <Mail className="w-10 h-10 text-textMuted mx-auto mb-2 opacity-40" />
            <p className="text-sm text-white font-medium">No inquiries in your inbox</p>
            <p className="text-xs text-textMuted">New messages from users will appear here.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-3 hover:border-cyan-neon/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20 flex items-center justify-center font-bold text-xs">
                    {msg.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{msg.fullName}</h4>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-cyan-neon hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-textMuted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-neon/10 text-cyan-neon text-[10px] font-bold uppercase tracking-wider">
                    {msg.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-border/50">
                <h5 className="text-xs font-semibold text-white mb-1">
                  Subject: {msg.subject}
                </h5>
                <p className="text-xs text-textMuted leading-relaxed bg-navy-900/60 p-3.5 rounded-xl border border-surface-border/40">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

