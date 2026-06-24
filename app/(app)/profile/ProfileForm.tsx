"use client";
import { useState, useRef } from "react";
import { signOut } from "next-auth/react";

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  age: number | null;
  dateOfBirth: Date | null;
  currentWeight: number | null;
  weightUnit: string;
} | null;

// Compress image client-side to a JPEG data URL ≤ maxBytes
async function compressImage(file: File, maxBytes = 800_000): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      // Scale down if wider than 400px (plenty for an avatar)
      const scale = Math.min(1, 400 / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Try quality steps until under maxBytes
      let quality = 0.85;
      const tryExport = () => {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const bytes = Math.round((dataUrl.length * 3) / 4);
        if (bytes <= maxBytes || quality <= 0.2) {
          resolve(dataUrl);
        } else {
          quality -= 0.1;
          tryExport();
        }
      };
      tryExport();
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function ProfileForm({ user }: { user: User }) {
  const [form, setForm] = useState({
    name: user?.name ?? "",
    age: user?.age?.toString() ?? "",
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
    currentWeight: user?.currentWeight?.toString() ?? "",
    weightUnit: user?.weightUnit ?? "kg",
  });
  const [image, setImage] = useState(user?.image ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      // Compress client-side before sending
      const dataUrl = await compressImage(file);

      const res = await fetch("/api/profile/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        setImage(data.url);
      } else {
        const data = await res.json().catch(() => ({}));
        setUploadError(data.error ?? "Upload failed — please try again");
      }
    } catch {
      setUploadError("Could not process image — please try a different file");
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, image }),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  const initials = (user?.name?.[0] || user?.email?.[0] || "?").toUpperCase();

  return (
    <div className="p-4 space-y-6">
      <div className="pt-2 flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">Profile</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Sign out
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt="Profile"
              className="rounded-full object-cover border-2 border-violet-500"
              style={{ width: 88, height: 88 }}
            />
          ) : (
            <div
              className="rounded-full bg-violet-600 flex items-center justify-center text-white text-3xl font-bold border-2 border-violet-500"
              style={{ width: 88, height: 88 }}
            >
              {initials}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 w-7 h-7 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {uploading ? "⌛" : "📷"}
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {uploading && (
          <p className="text-violet-400 text-xs">Uploading photo...</p>
        )}
        {uploadError && (
          <p className="text-red-400 text-xs text-center">{uploadError}</p>
        )}
        {!uploading && !uploadError && image && image !== (user?.image ?? "") && (
          <p className="text-emerald-400 text-xs">Photo updated ✓</p>
        )}

        <p className="text-slate-400 text-sm">{user?.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Display Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Date of Birth</label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => {
              const dob = e.target.value;
              const age = dob
                ? Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                : "";
              setForm({ ...form, dateOfBirth: dob, age: age.toString() });
            }}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Age</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
            placeholder="25"
            min="10"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Current Weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={form.currentWeight}
              onChange={(e) => setForm({ ...form, currentWeight: e.target.value })}
              className="flex-1 bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
              placeholder="75"
              min="30"
              max="300"
              step="0.1"
            />
            <select
              value={form.weightUnit}
              onChange={(e) => setForm({ ...form, weightUnit: e.target.value })}
              className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className={`w-full font-semibold py-3 rounded-xl transition-colors ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-violet-600 hover:bg-violet-500 text-white"
          } disabled:opacity-50`}
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
