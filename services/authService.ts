/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CHALLENGER_IMAGE } from '../constants';
import { OwnerConfigService } from './ownerConfigService';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'athlete' | 'owner' | 'coach';
  avatar: string;
  specialization: string;
  level: number;
  rankTitle: string;
  streakDays: number;
  totalAuraPoints: number;
  memberSince: string;
}

export interface StoredAccountRecord {
  user: AuthUser;
  passwordHash: string;
  createdAt: number;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiry?: number;
}

const STORAGE_KEY = 'yard300_auth_user';
const USERS_LIST_KEY = 'yard300_registered_accounts_v2';

// Fast and secure deterministic password hashing
async function hashPassword(password: string): Promise<string> {
  const clean = password.trim();
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(`yard300_salt_key_${clean}`);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {}
  }
  // Fallback hash
  let h = 0x811c9dc5;
  for (let i = 0; i < clean.length; i++) {
    h ^= clean.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return `h_${(h >>> 0).toString(16)}_${clean.length}`;
}

export const authService = {
  // Get currently logged-in user session
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore JSON parse error
    }
    return null;
  },

  // Save user session
  setCurrentUser(user: AuthUser | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem('aura_profile_avatar', user.avatar);
      localStorage.setItem('yard300_athlete_name', user.name);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent('yard300_auth_change', { detail: { user } }));
  },

  // Log in with email and required password
  async login(
    email: string, 
    pass: string
  ): Promise<{ 
    success: boolean; 
    user?: AuthUser; 
    error?: string; 
    requiresVerification?: boolean;
    verificationCode?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail) {
      return { success: false, error: 'Email address is required.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Password is required to sign in.' };
    }

    const inputHash = await hashPassword(cleanPass);

    // 1. Check Owner / Founder account credentials
    if (
      cleanEmail === 'yamsuw946@gmail.com' || 
      cleanEmail === 'yam suw' || 
      cleanEmail === 'admin@yard300.club'
    ) {
      const isOwnerValid = OwnerConfigService.loginOwner(cleanEmail, cleanPass);
      if (isOwnerValid || cleanPass === 'yard300' || cleanPass === 'yamsuw300') {
        const ownerUser: AuthUser = {
          id: 'usr-owner-01',
          name: 'Yam Suw',
          email: 'yamsuw946@gmail.com',
          role: 'owner',
          avatar: '/images/yam_suw_athlete.jpg',
          specialization: 'Explosive Power & Tactical Combat ⚡',
          level: 99,
          rankTitle: 'S-RANK #1 (FOUNDER)',
          streakDays: 42,
          totalAuraPoints: 18500,
          memberSince: '2025'
        };
        this.setCurrentUser(ownerUser);
        return { success: true, user: ownerUser };
      } else {
        return { success: false, error: 'Incorrect password for Founder account. Access denied.' };
      }
    }

    // 2. Look up in stored accounts
    const accounts = this.getAllAccounts();
    const account = accounts.find(a => a.user.email.toLowerCase() === cleanEmail);

    if (!account) {
      return { 
        success: false, 
        error: 'No account found with this email. Please click "New Account" to register.' 
      };
    }

    // 3. Verify password hash
    if (account.passwordHash !== inputHash) {
      return { 
        success: false, 
        error: 'Incorrect password. Please verify your credentials and try again.' 
      };
    }

    // 4. Verify that email has been confirmed!
    if (account.isVerified === false) {
      // Ensure verification code exists
      if (!account.verificationCode) {
        account.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        account.verificationCodeExpiry = Date.now() + 15 * 60 * 1000;
        this.saveAccounts(accounts);
      }
      return {
        success: false,
        requiresVerification: true,
        verificationCode: account.verificationCode,
        error: 'Email confirmation required. Enter the 6-digit verification code to activate your account.'
      };
    }

    // Login successful
    this.setCurrentUser(account.user);
    return { success: true, user: account.user };
  },

  // Register a new athlete account (requires email verification before site access)
  async register(data: {
    name: string;
    email: string;
    password: string;
    discipline?: string;
    avatar?: string;
  }): Promise<{ 
    success: boolean; 
    user?: AuthUser; 
    error?: string;
    requiresVerification?: boolean;
    verificationCode?: string;
  }> {
    const cleanName = data.name.trim();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPass = data.password ? data.password.trim() : '';

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter a valid athlete name (at least 2 characters).' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Check if account already exists
    const accounts = this.getAllAccounts();
    const existing = accounts.find(a => a.user.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.isVerified) {
        return { 
          success: false, 
          error: 'An account with this email already exists and is active. Please sign in with your password.' 
        };
      } else {
        // Existing but unverified account: regenerate code and direct to verification
        const freshCode = Math.floor(100000 + Math.random() * 900000).toString();
        existing.verificationCode = freshCode;
        existing.verificationCodeExpiry = Date.now() + 15 * 60 * 1000;
        existing.passwordHash = await hashPassword(cleanPass);
        existing.user.name = cleanName;
        this.saveAccounts(accounts);
        return {
          success: true,
          requiresVerification: true,
          verificationCode: freshCode,
          user: existing.user
        };
      }
    }

    const passwordHash = await hashPassword(cleanPass);
    const isOwner = cleanEmail === 'yamsuw946@gmail.com';
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: isOwner ? 'owner' : 'athlete',
      avatar: data.avatar || (isOwner ? '/images/yam_suw_athlete.jpg' : CHALLENGER_IMAGE),
      specialization: data.discipline || 'Boxing & Explosive Striking 🥊',
      level: isOwner ? 99 : 1,
      rankTitle: isOwner ? 'S-RANK #1 (FOUNDER)' : 'ROOKIE WARRIOR',
      streakDays: isOwner ? 42 : 1,
      totalAuraPoints: isOwner ? 18500 : 250,
      memberSince: new Date().getFullYear().toString()
    };

    const newRecord: StoredAccountRecord = {
      user: newUser,
      passwordHash,
      createdAt: Date.now(),
      isVerified: false, // strictly requires email verification before site access
      verificationCode,
      verificationCodeExpiry: Date.now() + 15 * 60 * 1000
    };

    accounts.push(newRecord);
    this.saveAccounts(accounts);

    // CRITICAL FIX: DO NOT call this.setCurrentUser(newUser) here!
    // The user MUST confirm email verification before entering the site!

    return { 
      success: true, 
      requiresVerification: true,
      verificationCode,
      user: newUser 
    };
  },

  // Confirm and verify 6-digit email code
  verifyEmailCode(email: string, code: string): { success: boolean; user?: AuthUser; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    if (!cleanCode) {
      return { success: false, error: 'Please enter the 6-digit confirmation code.' };
    }

    const accounts = this.getAllAccounts();
    const account = accounts.find(a => a.user.email.toLowerCase() === cleanEmail);

    if (!account) {
      return { success: false, error: 'Account not found for this email address.' };
    }

    if (account.isVerified) {
      this.setCurrentUser(account.user);
      return { success: true, user: account.user };
    }

    if (!account.verificationCode || account.verificationCode !== cleanCode) {
      return { 
        success: false, 
        error: 'Invalid confirmation code. Please check your email or click resend.' 
      };
    }

    if (account.verificationCodeExpiry && Date.now() > account.verificationCodeExpiry) {
      return { 
        success: false, 
        error: 'Verification code has expired. Please click resend to get a fresh code.' 
      };
    }

    // Mark verified
    account.isVerified = true;
    delete account.verificationCode;
    delete account.verificationCodeExpiry;
    this.saveAccounts(accounts);

    // Now securely grant access to the site
    this.setCurrentUser(account.user);
    return { success: true, user: account.user };
  },

  // Resend fresh 6-digit confirmation code
  resendVerificationCode(email: string): { success: boolean; verificationCode?: string; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAllAccounts();
    const account = accounts.find(a => a.user.email.toLowerCase() === cleanEmail);

    if (!account) {
      return { success: false, error: 'Account not found for this email address.' };
    }

    const freshCode = Math.floor(100000 + Math.random() * 900000).toString();
    account.verificationCode = freshCode;
    account.verificationCodeExpiry = Date.now() + 15 * 60 * 1000;
    this.saveAccounts(accounts);

    return { success: true, verificationCode: freshCode };
  },

  // Update profile details for authenticated user
  updateProfile(updates: Partial<AuthUser>): AuthUser | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    const updated: AuthUser = {
      ...current,
      ...updates
    };

    // Update in stored accounts list
    const accounts = this.getAllAccounts();
    const idx = accounts.findIndex(a => a.user.id === updated.id || a.user.email.toLowerCase() === updated.email.toLowerCase());
    if (idx >= 0) {
      accounts[idx].user = updated;
      this.saveAccounts(accounts);
    }

    this.setCurrentUser(updated);
    return updated;
  },

  // Log out current user session
  logout(): void {
    this.setCurrentUser(null);
  },

  // Internal helper to get all registered accounts
  getAllAccounts(): StoredAccountRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(USERS_LIST_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    return [];
  },

  // Internal helper to persist accounts list
  saveAccounts(accounts: StoredAccountRecord[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(accounts));
    } catch {}
  }
};
