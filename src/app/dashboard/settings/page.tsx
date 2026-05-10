'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { userAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth()
  const [name, setName]   = useState(user?.displayName || '')
  const [saving, setSaving] = useState(false)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await userAPI.update({ displayName: name })
      await refreshUser()
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update') }
    finally { setSaving(false) }
  }

  const deleteAccount = async () => {
    if (!confirm('Delete your account? All data will be permanently lost.')) return
    try { await userAPI.deleteMe(); logout() }
    catch { toast.error('Failed to delete account') }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your account</p>
      </div>
      <div className="card p-5 mb-5">
        <div className="text-sm font-semibold text-gray-800 mb-4">Profile</div>
        <form onSubmit={save} className="space-y-4">
          <div><label className="lbl">Display name</label>
            <input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div><label className="lbl">Email</label>
            <input className="inp" value={user?.email || ''} disabled />
          </div>
          <div><label className="lbl">Plan</label>
            <input className="inp capitalize" value={user?.plan || 'free'} disabled />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save changes'}</button>
        </form>
      </div>
      <div className="card p-5 border-red-100">
        <div className="text-sm font-semibold text-red-600 mb-2">Danger zone</div>
        <p className="text-xs text-gray-400 mb-3">Permanently delete your account and all associated data.</p>
        <button onClick={deleteAccount} className="btn-danger text-sm">Delete account</button>
      </div>
    </div>
  )
}
