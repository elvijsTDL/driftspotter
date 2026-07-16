"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEventDocuments, useEventLinks, formatFileSize, type EventDocument } from "@/hooks/useEventDocuments";
import { useToast } from "@/components/ui/Toast";

/** Shared galleries / Drive links section with inline add form. */
export function EventLinksSection({ eventId, canAdd }: { eventId: string; canAdd: boolean }) {
  const { user } = useAuth();
  const { links, loading, addLink, deleteLink } = useEventLinks(eventId);
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!label.trim()) { toast("Give the link a name (e.g. Photo gallery)", "error"); return; }
    setSaving(true);
    const { error } = await addLink(label, url);
    setSaving(false);
    if (error) { toast(error, "error"); return; }
    setLabel(""); setUrl(""); setAdding(false);
    toast("Link shared with participants!");
  };

  if (loading) return null;
  if (links.length === 0 && !canAdd) return null;

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-heading font-semibold text-foreground uppercase tracking-wider">
          Media & Links <span className="text-muted-dark normal-case font-normal">— galleries, Drive folders, aftermovies</span>
        </p>
        {canAdd && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-drift-cyan/10 text-drift-cyan hover:bg-drift-cyan/20 border border-drift-cyan/20 transition-colors flex-shrink-0 ml-3"
          >
            + Add Link
          </button>
        )}
      </div>

      {adding && (
        <div className="p-3 rounded-xl bg-surface-lighter/50 border border-drift-cyan/20 space-y-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Name — e.g. Full photo gallery by @shooter"
            className="w-full px-3 py-2 bg-surface-lighter border border-border rounded-lg text-xs text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-cyan transition-colors"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="w-full px-3 py-2 bg-surface-lighter border border-border rounded-lg text-xs text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-cyan transition-colors"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-drift-cyan text-white hover:bg-drift-cyan-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add"}
            </button>
            <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded-lg text-xs text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {links.length === 0 && !adding ? (
        <p className="text-xs text-muted-dark py-1">
          No links yet — photos and videos usually land here after the event.
        </p>
      ) : (
        links.map((link) => (
          <div key={link.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-lighter/50 border border-border">
            <svg className="text-drift-cyan flex-shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 group">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-drift-cyan transition-colors">{link.label}</p>
              <p className="text-[11px] text-muted-dark truncate">{link.url}</p>
            </a>
            {user?.id === link.added_by && (
              <button
                onClick={async () => { const { error } = await deleteLink(link.id); if (error) toast(error, "error"); }}
                className="p-2 rounded-lg text-muted hover:text-red-400 border border-border hover:border-red-500/40 transition-colors flex-shrink-0"
                title="Remove link"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function DocRow({
  doc,
  onDownload,
  onDelete,
}: {
  doc: EventDocument;
  onDownload: (doc: EventDocument) => void;
  onDelete?: (doc: EventDocument) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-lighter/50 border border-border">
      <span className="text-drift-orange flex-shrink-0"><DocIcon /></span>
      <button onClick={() => onDownload(doc)} className="flex-1 min-w-0 text-left group">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-drift-orange transition-colors">{doc.name}</p>
        <p className="text-[11px] text-muted-dark">
          {formatFileSize(doc.size_bytes)}
          {doc.size_bytes ? " · " : ""}added {new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
      </button>
      <button
        onClick={() => onDownload(doc)}
        className="p-2 rounded-lg text-muted hover:text-drift-orange border border-border hover:border-drift-orange/40 transition-colors flex-shrink-0"
        title="Download"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
      </button>
      {onDelete && (
        <button
          onClick={() => onDelete(doc)}
          className="p-2 rounded-lg text-muted hover:text-red-400 border border-border hover:border-red-500/40 transition-colors flex-shrink-0"
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
        </button>
      )}
    </div>
  );
}

/** Organizer view: upload + manage documents for an event. */
export function EventDocumentsManager({ eventId }: { eventId: string }) {
  const { documents, loading, uploadDocument, deleteDocument, getDownloadUrl } = useEventDocuments(eventId);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const handleDownload = async (doc: EventDocument) => {
    const url = await getDownloadUrl(doc);
    if (url) window.open(url, "_blank");
    else toast("Could not open document", "error");
  };

  const handleDelete = async (doc: EventDocument) => {
    if (confirmingDelete !== doc.id) {
      setConfirmingDelete(doc.id);
      toast("Click delete again to confirm", "error");
      return;
    }
    setConfirmingDelete(null);
    const { error } = await deleteDocument(doc);
    if (error) toast(error, "error");
    else toast("Document deleted");
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          Briefings, timetables, regulations — visible only to <span className="text-badge-grassroots font-semibold">approved</span> participants.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setUploading(true);
            const { error } = await uploadDocument(file);
            setUploading(false);
            if (error) toast(error, "error");
            else toast("Document uploaded!");
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-drift-orange/10 text-drift-orange hover:bg-drift-orange/20 border border-drift-orange/20 transition-colors disabled:opacity-50 flex-shrink-0 ml-3"
        >
          {uploading ? "Uploading..." : "+ Upload"}
        </button>
      </div>

      {loading ? (
        <div className="h-14 bg-surface-lighter rounded-xl animate-pulse" />
      ) : documents.length === 0 ? (
        <p className="text-xs text-muted-dark py-2">No documents yet. PDF, Word, Excel, text or images up to 10MB.</p>
      ) : (
        documents.map((doc) => (
          <DocRow key={doc.id} doc={doc} onDownload={handleDownload} onDelete={handleDelete} />
        ))
      )}

      <EventLinksSection eventId={eventId} canAdd />
    </div>
  );
}

/** Participant view: shown on event pages once the viewer is approved. */
export function EventDocumentsList({ eventId }: { eventId: string }) {
  const { documents, loading, getDownloadUrl } = useEventDocuments(eventId);
  const { toast } = useToast();

  const handleDownload = async (doc: EventDocument) => {
    const url = await getDownloadUrl(doc);
    if (url) window.open(url, "_blank");
    else toast("Could not open document", "error");
  };

  if (loading) return null;

  return (
    <div className="mb-6 rounded-xl bg-badge-grassroots/5 border border-badge-grassroots/20 p-5">
      <div className="flex items-center gap-2 mb-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
        <h3 className="font-heading font-semibold text-sm text-badge-grassroots uppercase tracking-wider">Participant Area</h3>
      </div>
      <p className="text-xs text-muted-dark mb-3">You can see this because your application was approved.</p>
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <DocRow key={doc.id} doc={doc} onDownload={handleDownload} />
          ))}
        </div>
      )}
      <EventLinksSection eventId={eventId} canAdd />
    </div>
  );
}
