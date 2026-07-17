"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { useUpdateProfile, useEmergencyContact } from "@/hooks/useProfile";
import { uploadImage, validateImage } from "@/lib/uploadMedia";
import CarGarage from "@/components/CarGarage";
import ProfileSavedScreen from "@/components/ProfileSavedScreen";

const inputClass =
  "w-full px-4 py-3 bg-surface-lighter border border-border rounded-xl text-sm text-foreground placeholder:text-muted-dark focus:outline-none focus:border-drift-orange transition-colors";
const labelClass = "block text-xs text-muted uppercase tracking-wider font-medium mb-2";

export default function ProfileEditor() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const { updateProfile, saving } = useUpdateProfile();
  const { contact: emergencyContact, saveContact, clearContact } = useEmergencyContact(user?.id ?? null);
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  ), []);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState(() => ({
    username: profile?.username ?? "",
    bio: profile?.bio ?? "",
    skill_level: profile?.skill_level ?? "",
    instagram: profile?.instagram ?? "",
    facebook: profile?.facebook ?? "",
    tiktok: profile?.tiktok ?? "",
    youtube: profile?.youtube ?? "",
    profile_visibility: profile?.profile_visibility ?? "public",
  }));
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? null);

  const [emergency, setEmergency] = useState({ name: "", phone: "", relationship: "" });
  // Hydrate once the (async, RLS-gated) contact loads.
  useEffect(() => {
    if (emergencyContact) {
      setEmergency({
        name: emergencyContact.contact_name ?? "",
        phone: emergencyContact.contact_phone ?? "",
        relationship: emergencyContact.contact_relationship ?? "",
      });
    }
  }, [emergencyContact]);

  if (!user || !profile) {
    return (
      <div className="glass rounded-2xl p-6 sm:p-12 text-center">
        <p className="text-muted">Please sign in to edit your driver profile.</p>
      </div>
    );
  }

  const handleAvatarUpload = async (file: File) => {
    const invalid = validateImage(file);
    if (invalid) { toast(invalid, "error"); return; }
    setUploadingAvatar(true);
    const { url, error } = await uploadImage(supabase, "profile-media", user.id, file);
    setUploadingAvatar(false);
    if (error || !url) { toast(error || "Upload failed", "error"); return; }
    setAvatarUrl(url);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim()) { toast("Username is required", "error"); return; }

    // Emergency contact: name + phone go together, or leave both blank.
    const emName = emergency.name.trim();
    const emPhone = emergency.phone.trim();
    if ((emName && !emPhone) || (!emName && emPhone)) {
      toast("Emergency contact needs both a name and a phone number", "error");
      return;
    }

    const { error } = await updateProfile(user.id, {
      username: form.username.trim(),
      avatar_url: avatarUrl,
      bio: form.bio,
      skill_level: (form.skill_level || null) as "beginner" | "intermediate" | "advanced" | null,
      instagram: form.instagram || null,
      facebook: form.facebook || null,
      tiktok: form.tiktok || null,
      youtube: form.youtube || null,
      profile_visibility: form.profile_visibility as "public" | "organizers",
    });

    if (error) {
      toast(error, "error");
      return;
    }

    // Persist the emergency contact (separate, RLS-gated table)
    const emRelationship = emergency.relationship.trim();
    let emError: string | null = null;
    if (emName && emPhone) {
      ({ error: emError } = await saveContact({
        contact_name: emName,
        contact_phone: emPhone,
        contact_relationship: emRelationship || null,
      }));
    } else if (emergencyContact) {
      // Cleared out — remove the stored contact
      ({ error: emError } = await clearContact());
    }
    if (emError) {
      toast(`Profile saved, but emergency contact failed: ${emError}`, "error");
      return;
    }

    await refreshProfile();
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (showSuccess) {
    return <ProfileSavedScreen onKeepEditing={() => setShowSuccess(false)} />;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Identity */}
      <div className="glass rounded-2xl p-6 md:p-8 space-y-5">
        <h3 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider">Identity</h3>

        <div className="flex items-center gap-5">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="relative group flex-shrink-0"
            disabled={uploadingAvatar}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-border group-hover:border-drift-orange transition-colors" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-drift-orange/20 flex items-center justify-center text-2xl font-semibold text-drift-orange border-2 border-border group-hover:border-drift-orange transition-colors">
                {form.username[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </button>
          <div className="flex-1">
            <label className={labelClass}>Username *</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Your driver name"
              className={inputClass}
            />
            {uploadingAvatar && <p className="text-xs text-drift-orange mt-1">Uploading avatar...</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell organizers about yourself — how long you've been drifting, what events you run..."
            rows={3}
            maxLength={500}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>Skill Level</label>
          <div className="flex flex-wrap gap-2">
            {[{ v: "", l: "Not set" }, { v: "beginner", l: "Beginner" }, { v: "intermediate", l: "Intermediate" }, { v: "advanced", l: "Advanced" }].map(({ v, l }) => (
              <button
                key={v}
                type="button"
                onClick={() => setForm({ ...form, skill_level: v })}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  form.skill_level === v ? "bg-drift-orange text-white" : "bg-surface-lighter text-muted hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Profile Visibility</label>
          <div className="flex flex-wrap gap-2">
            {([
              { v: "public" as const, l: "Public" },
              { v: "organizers" as const, l: "Organizers Only" },
            ]).map(({ v, l }) => (
              <button
                key={v}
                type="button"
                onClick={() => setForm({ ...form, profile_visibility: v })}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  form.profile_visibility === v ? "bg-drift-orange text-white" : "bg-surface-lighter text-muted hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-dark mt-2">
            {form.profile_visibility === "public"
              ? "Anyone can view your driver profile."
              : "Only organizers of events you apply to (and admins) can view your profile. Your name and avatar stay visible in comments and attendee lists."}
          </p>
        </div>
      </div>

      {/* Garage — saves independently of the profile form */}
      <CarGarage userId={user.id} />

      {/* Emergency contact — private; only organizers of events you're approved for can see it */}
      <div className="glass rounded-2xl p-6 md:p-8 space-y-5">
        <div>
          <h3 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider">Emergency Contact</h3>
          <p className="text-xs text-muted-dark mt-2 flex items-start gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0 text-drift-orange">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>Many track days require this. It stays private — only shown to organizers of events you get <span className="text-foreground">approved</span> for. Never public.</span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Contact Name</label>
            <input
              type="text"
              value={emergency.name}
              onChange={(e) => setEmergency({ ...emergency, name: e.target.value })}
              placeholder="e.g. Jane Doe"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Contact Phone</label>
            <input
              type="tel"
              value={emergency.phone}
              onChange={(e) => setEmergency({ ...emergency, phone: e.target.value })}
              placeholder="e.g. +371 20 000 000"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Relationship <span className="text-muted-dark normal-case tracking-normal">(optional)</span></label>
            <input
              type="text"
              value={emergency.relationship}
              onChange={(e) => setEmergency({ ...emergency, relationship: e.target.value })}
              placeholder="e.g. Partner, Parent, Friend"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Socials */}
      <div className="glass rounded-2xl p-6 md:p-8 space-y-5">
        <h3 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider">Socials</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Instagram</label>
            <input
              type="text"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              placeholder="@yourhandle"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>TikTok</label>
            <input
              type="text"
              value={form.tiktok}
              onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
              placeholder="@yourhandle"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>YouTube</label>
            <input
              type="text"
              value={form.youtube}
              onChange={(e) => setForm({ ...form, youtube: e.target.value })}
              placeholder="Channel URL or @handle"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Facebook</label>
            <input
              type="text"
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              placeholder="Profile or page URL"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || uploadingAvatar}
          className="px-8 py-3.5 bg-drift-orange hover:bg-drift-orange-light text-white font-heading font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-drift-orange/20 active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        <Link href={`/drivers/${user.id}`} className="text-sm text-muted hover:text-drift-orange transition-colors underline">
          View public profile
        </Link>
      </div>
    </form>
  );
}
