import React, { useEffect, useState } from 'react';
import {
  Mail,
  Clock,
  Trash2,
  Reply,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Inbox,
} from 'lucide-react';
import { getAdminMessages, updateAdminMessageStatus, deleteAdminMessage } from '../services/adminApi';
import { AdminContactMessage } from '../types';

const statusConfig: Record<string, { label: string; badge: string }> = {
  UNREAD: { label: 'Unread', badge: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  READ: { label: 'Read', badge: 'bg-slate-500/10 text-slate-600 border-slate-200' },
  REPLIED: { label: 'Replied', badge: 'bg-sky-500/10 text-sky-600 border-sky-200' },
  RESOLVED: { label: 'Resolved', badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
};

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getAdminMessages();
      setMessages(data);
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    // Optimistic update
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus as any } : m))
    );

    try {
      await updateAdminMessageStatus(id, newStatus);
    } catch (err: any) {
      console.error('Failed to update status:', err);
      // Revert if needed
      await loadMessages();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, senderName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the inquiry from "${senderName}"?`)) {
      return;
    }

    // Optimistic removal
    setMessages((prev) => prev.filter((m) => m.id !== id));

    try {
      await deleteAdminMessage(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete inquiry');
      await loadMessages();
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesStatus = filterStatus === 'ALL' || msg.status === filterStatus;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      msg.fullName.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.subject.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === 'UNREAD').length;
  const resolvedCount = messages.filter((m) => m.status === 'RESOLVED').length;

  return (
    <div className="px-6 md:px-10 pb-10 pt-6 space-y-6">
      {/* Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-line shadow-card">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-heading">Customer Inquiries</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-page border border-line text-body">
              {messages.length} Total
            </span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-200 animate-pulse">
                {unreadCount} New Unread
              </span>
            )}
            {resolvedCount > 0 && (
              <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-200">
                {resolvedCount} Resolved
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-1">
            Incoming support requests, wholesale quotation inquiries, and messages from the contact page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sender, email, subject..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-page border border-line text-body placeholder:text-muted focus:outline-hidden focus:border-body"
            />
            <Search className="w-3.5 h-3.5 text-muted absolute left-2.5 top-2.5" />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-page border border-line text-body focus:outline-hidden focus:border-body cursor-pointer"
          >
            <option value="ALL">All Inquiries ({messages.length})</option>
            <option value="UNREAD">Unread ({unreadCount})</option>
            <option value="READ">Read</option>
            <option value="REPLIED">Replied</option>
            <option value="RESOLVED">Resolved ({resolvedCount})</option>
          </select>

          <button
            onClick={loadMessages}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-medium rounded-xl bg-body text-card hover:bg-heading transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh Inquiries"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-card bg-card border border-line shadow-card space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-page" />
                <div className="space-y-1.5">
                  <div className="h-4 w-36 bg-page rounded" />
                  <div className="h-3 w-48 bg-page rounded" />
                </div>
              </div>
              <div className="pt-3 border-t border-line space-y-2">
                <div className="h-4 w-48 bg-page rounded" />
                <div className="h-16 w-full bg-page rounded-lg" />
              </div>
            </div>
          ))
        ) : filteredMessages.length === 0 ? (
          <div className="p-14 text-center rounded-card bg-card border border-line shadow-card">
            <Inbox className="w-12 h-12 text-muted mx-auto mb-3 opacity-40" strokeWidth={1.5} />
            <p className="text-sm text-body font-semibold">No inquiries found</p>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
              {filterStatus !== 'ALL' || search
                ? 'No inquiries match your current search and filter settings.'
                : 'When customers fill out the Contact Us form on your storefront, messages will appear here in real-time.'}
            </p>
            {(filterStatus !== 'ALL' || search) && (
              <button
                onClick={() => {
                  setFilterStatus('ALL');
                  setSearch('');
                }}
                className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-page border border-line hover:bg-card text-body transition-colors"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const conf = statusConfig[msg.status] || {
              label: msg.status || 'UNREAD',
              badge: 'bg-slate-100 text-slate-700 border-slate-200',
            };

            return (
              <div
                key={msg.id}
                className="p-6 rounded-card bg-card border border-line shadow-card space-y-4 hover:border-body/20 transition-all"
              >
                {/* Top Row: Sender details & Action buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center font-bold text-xs shrink-0 tracking-wider shadow-xs">
                      {msg.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-body">{msg.fullName}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${conf.badge}`}
                        >
                          {conf.label}
                        </span>
                      </div>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="text-xs text-muted hover:text-blue-600 transition-colors block mt-0.5"
                      >
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  {/* Right side controls: Date, Status Selector, Reply, Delete */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="flex items-center gap-1 text-muted text-[11px] mr-1">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      {new Date(msg.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {/* Status Dropdown */}
                    <select
                      value={msg.status}
                      disabled={updatingId === msg.id}
                      onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-page border border-line text-xs font-semibold text-body focus:outline-hidden focus:border-body cursor-pointer transition-all disabled:opacity-50"
                      title="Update Inquiry Status"
                    >
                      <option value="UNREAD">Mark Unread</option>
                      <option value="READ">Mark Read</option>
                      <option value="REPLIED">Mark Replied</option>
                      <option value="RESOLVED">Mark Resolved</option>
                    </select>

                    {/* Quick Reply button */}
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="px-2.5 py-1.5 rounded-lg bg-page border border-line hover:bg-body hover:text-card text-body transition-colors flex items-center gap-1.5 font-medium"
                      title="Reply via Email"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reply</span>
                    </a>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(msg.id, msg.fullName)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete this message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="pt-3 border-t border-line space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-body">
                    <MessageSquare className="w-3.5 h-3.5 text-muted shrink-0" />
                    <span>Subject: {msg.subject}</span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed bg-page/70 p-4 rounded-xl border border-line whitespace-pre-wrap font-sans">
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};