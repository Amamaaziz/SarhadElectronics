import React, { useEffect, useState } from 'react';
import { Mail, Clock } from 'lucide-react';
import { getAdminMessages } from '../services/adminApi';
import { AdminContactMessage } from '../types';

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);

  useEffect(() => {
    getAdminMessages().then(setMessages);
  }, []);

  return (
    <div className="px-10 pb-10 pt-6 space-y-4">
      {messages.length === 0 ? (
        <div className="p-12 text-center rounded-card bg-card border border-line shadow-card">
          <Mail className="w-10 h-10 text-muted mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-sm text-body font-medium">No inquiries in your inbox</p>
          <p className="text-xs text-muted mt-1">New messages from customers will appear here.</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className="p-6 rounded-card bg-card border border-line shadow-card space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-page border border-line flex items-center justify-center font-semibold text-xs text-body">
                  {msg.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-body">{msg.fullName}</h4>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-muted hover:text-body hover:underline"
                  >
                    {msg.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-page border border-line text-[11px] font-semibold text-body">
                  {msg.status}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-line">
              <h5 className="text-sm font-semibold text-body mb-1">
                {msg.subject}
              </h5>
              <p className="text-sm text-muted leading-relaxed bg-page p-3.5 rounded-lg border border-line">
                {msg.message}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};