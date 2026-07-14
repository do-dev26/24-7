'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { userAPI } from '@/lib/api'
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  reauthenticateWithPopup,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, fbUser, refreshUser, logout } = useAuth()

  // Profile
  const [name,    setName]    = useState(user?.displayName || '')
  const [saving,  setSaving]  = useState(false)

  // Password change
  const [curPass,  setCurPass]  = useState('')
  const [newPass,  setNewPass]  = useState('')
  const [confPass, setConfPass] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [showPw,   setShowPw]   = useState(false)

  // Detect if user signed in with Google (no password)
  const isGoogleUser = fbUser?.providerData?.some(p => p.providerId === 'google.com')

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await userAPI.update({ displayName: name })
      await refreshUser()
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass.length < 8) { toast.error('New password must be at least 8 characters'); return }
    if (newPass !== confPass) { toast.error('Passwords do not match'); return }
    if (!fbUser) return

    setPwSaving(true)
    try {
      // Re-authenticate before changing password (Firebase security requirement)
      if (isGoogleUser) {
        const provider = new GoogleAuthProvider()
        await reauthenticateWithPopup(fbUser, provider)
      } else {
        const credential = EmailAuthProvider.credential(fbUser.email!, curPass)
        await reauthenticateWithCredential(fbUser, credential)
      }
      await updatePassword(fbUser, newPass)
      toast.success('Password changed successfully!')
      setCurPass(''); setNewPass(''); setConfPass('')
    } catch (err: any) {
      if (err.code === 'auth/wrong-password') toast.error('Current password is incorrect')
      else if (err.code === 'auth/too-many-requests') toast.error('Too many attempts — try again later')
      else toast.error(err.message || 'Failed to change password')
    } finally { setPwSaving(false) }
  }

  const deleteAccount = async () => {
    const confirmed = prompt(
      'This will permanently delete your account and ALL data. Type DELETE to confirm:'
    )
    if (confirmed !== 'DELETE') return
    try {
      await userAPI.deleteMe()
      logout()
    } catch { toast.error('Failed to delete account') }
  }

  return (
    <div className="max-w-xl space-y-5">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your account and security</p>
      </div>

      {/* Profile */}
      <div className="card p-5">
        <div className="text-sm font-semibold text-gray-800 mb-4">Profile</div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="lbl">Display name</label>
            <input className="inp" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="lbl">Email address</label>
            <input className="inp" value={user?.email || ''} disabled />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed here — contact support if needed</p>
          </div>
          <div>
            <label className="lbl">Current plan</label>
            <input className="inp capitalize" value={user?.plan || 'free'} disabled />
          </div>
          <div>
            <label className="lbl">Sign-in method</label>
            <input className="inp" value={isGoogleUser ? 'Google' : 'Email & Password'} disabled />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Password change */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-gray-800">Password</div>
            {isGoogleUser && (
              <div className="text-xs text-gray-400 mt-0.5">You signed in with Google — set a password below to also enable email login</div>
            )}
          </div>
          <button type="button" onClick={() => setShowPw(v => !v)}
            className="text-xs text-brand hover:underline">
            {showPw ? 'Hide' : 'Change password'}
          </button>
        </div>

        {showPw && (
          <form onSubmit={changePassword} className="space-y-3">
            {!isGoogleUser && (
              <div>
                <label className="lbl">Current password</label>
                <input type="password" className="inp" value={curPass}
                  onChange={e => setCurPass(e.target.value)}
                  placeholder="Enter current password" required />
              </div>
            )}
            {isGoogleUser && (
              <div className="text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
                You'll be asked to verify your Google account before setting a password.
              </div>
            )}
            <div>
              <label className="lbl">New password</label>
              <input type="password" className="inp" value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="Min 8 characters" required />
            </div>
            <div>
              <label className="lbl">Confirm new password</label>
              <input type="password" className="inp" value={confPass}
                onChange={e => setConfPass(e.target.value)}
                placeholder="Re-enter new password" required />
            </div>
            {newPass && confPass && newPass !== confPass && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
            <button type="submit" disabled={pwSaving}
              className="btn-secondary">
              {pwSaving ? 'Changing…' : 'Change password'}
            </button>
          </form>
        )}
      </div>

      {/* Logout */}
      <div className="card p-5">
        <div className="text-sm font-semibold text-gray-800 mb-1">Sign out</div>
        <p className="text-xs text-gray-400 mb-3">Sign out from this device. You can sign back in anytime.</p>
        <button onClick={logout} className="btn-secondary text-sm">
          Sign out
        </button>
      </div>

      {/* Danger zone */}
      <div className="card p-5 border border-red-100">
        <div className="text-sm font-semibold text-red-600 mb-1">Danger zone</div>
        <p className="text-xs text-gray-400 mb-3">
          Permanently delete your account, all widgets, leads, and conversations. This cannot be undone.
        </p>
        <button onClick={deleteAccount} className="btn-danger text-sm">
          Delete my account
        </button>
      </div>
    </div>
  )
}
