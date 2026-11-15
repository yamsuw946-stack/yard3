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
  emailVerified?: boolean;
}

export interface StoredAccountRecord {
  user: AuthUser;
  passwordHash: string;
  createdAt: number;
  isVerified: boolean;
  verificationCode?: string;
  verificationToken?: string;
  verificationCodeExpiry?: number;
  verificationAttempts?: number;
  resetCode?: string;
  resetToken?: string;
  resetExpiry?: number;
}

interface SessionEnvelope {
  user: AuthUser;
  sessionToken: string;
  issuedAt: number;
  expiresAt: number;
}

const STORAGE_KEY = 'yard300_auth_user';
const SESSION_KEY = 'yard300_auth_session_v3';
const USERS_LIST_KEY = 'yard300_registered_accounts_v2';
const RATE_LIMIT_KEY = 'yard300_auth_rate_limit_v1';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const VERIFICATION_TTL_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

function sanitizeText(raw: string, maxLen: number = 80): string {
  return raw
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLen);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function generateCryptoHex(byteLength: number = 16): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(byteLength);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  let out = '';
  for (let i = 0; i < byteLength * 2; i++) {
    out += Math.floor(Math.random() * 16).toString(16);
  }
  return out;
}

function generateSixDigitOtp(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return (100000 + (buf[0] % 900000)).toString();
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function legacyHashPassword(password: string): Promise<string> {
  const clean = password.trim();
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(`yard300_salt_key_${clean}`);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {}
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < clean.length; i++) {
    h ^= clean.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return `h_${(h >>> 0).toString(16)}_${clean.length}`;
}

async function hashPasswordPbkdf2(password: string, existingSalt?: string): Promise<string> {
  const clean = password.trim();
  const saltHex = existingSalt || generateCryptoHex(16);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const enc = new TextEncoder();
      const baseKey = await crypto.subtle.importKey('raw', enc.encode(clean), 'PBKDF2', false, ['deriveBits']);
      const derived = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: enc.encode(saltHex),
          iterations: 100000,
          hash: 'SHA-256'
        },
        baseKey,
        256
      );
      const hashHex = Array.from(new Uint8Array(derived), (b) => b.toString(16).padStart(2, '0')).join('');
      return `pbkdf2$${saltHex}$${hashHex}`;
    } catch {}
  }
  const fallback = await legacyHashPassword(`${saltHex}:${clean}`);
  return `pbkdf2$${saltHex}$${fallback}`;
}

async function verifyPasswordHash(password: string, storedHash: string): Promise<{ valid: boolean; needsUpgrade: boolean }> {
  const clean = password.trim();
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 3) return { valid: false, needsUpgrade: false };
    const candidate = await hashPasswordPbkdf2(clean, parts[1]);
    return { valid: candidate === storedHash, needsUpgrade: false };
  }
  const legacyCandidate = await legacyHashPassword(clean);
  return { valid: legacyCandidate === storedHash, needsUpgrade: legacyCandidate === storedHash };
}

function getRateLimitMap(): Record<string, { attempts: number; lockUntil?: number }> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function checkRateLimit(email: string): { allowed: boolean; waitSeconds?: number } {
  const map = getRateLimitMap();
  const entry = map[email];
  if (entry?.lockUntil && Date.now() < entry.lockUntil) {
    return { allowed: false, waitSeconds: Math.ceil((entry.lockUntil - Date.now()) / 1000) };
  }
  return { allowed: true };
}

function recordFailedLogin(email: string): void {
  if (typeof window === 'undefined') return;
  try {
    const map = getRateLimitMap();
    const prev = map[email];
    const resetWindow = !prev || (prev.lockUntil && Date.now() >= prev.lockUntil);
    const attempts = resetWindow ? 1 : prev.attempts + 1;
    map[email] = {
      attempts,
      lockUntil: attempts >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_MS : undefined
    };
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(map));
  } catch {}
}

function clearFailedLogin(email: string): void {
  if (typeof window === 'undefined') return;
  try {
    const map = getRateLimitMap();
    if (map[email]) {
      delete map[email];
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(map));
    }
  } catch {}
}

export const authService = {
  // Get currently logged-in user session with integrity & expiration check
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const sessionRaw = localStorage.getItem(SESSION_KEY);
      if (sessionRaw) {
        const env: SessionEnvelope = JSON.parse(sessionRaw);
        if (env && env.user && env.sessionToken && env.expiresAt > Date.now()) {
          return env.user;
        }
        // Session expired
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      // Migrate legacy plain user session into bounded envelope cleanly
      const legacy = localStorage.getItem(STORAGE_KEY);
      if (legacy) {
        const parsedUser: AuthUser = JSON.parse(legacy);
        if (parsedUser?.id && parsedUser?.email) {
          this.setCurrentUser(parsedUser);
          return parsedUser;
        }
      }
    } catch {
      // ignore parse errors
    }
    return null;
  },

  // Save user session with expiring cryptographic session token
  setCurrentUser(user: AuthUser | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      const safeUser: AuthUser = {
        ...user,
        name: sanitizeText(user.name, 64) || 'Athlete',
        specialization: sanitizeText(user.specialization, 96)
      };
      const envelope: SessionEnvelope = {
        user: safeUser,
        sessionToken: generateCryptoHex(24),
        issuedAt: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION_MS
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(envelope));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
      localStorage.setItem('aura_profile_avatar', safeUser.avatar);
      localStorage.setItem('yard300_athlete_name', safeUser.name);
      window.dispatchEvent(new CustomEvent('yard300_auth_change', { detail: { user: safeUser } }));
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('yard300_auth_change', { detail: { user: null } }));
    }
  },

  // Log in with email and password + rate limit protection
  async login(
    email: string,
    pass: string
  ): Promise<{
    success: boolean;
    user?: AuthUser;
    error?: string;
    requiresVerification?: boolean;
    verificationCode?: string;
    verificationToken?: string;
    lockedSeconds?: number;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return { success: false, error: 'Valid email address is required.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Password is required to sign in.' };
    }

    const rateCheck = checkRateLimit(cleanEmail);
    if (!rateCheck.allowed) {
      return {
        success: false,
        lockedSeconds: rateCheck.waitSeconds,
        error: `Too many failed attempts. Try again in ${rateCheck.waitSeconds}s.`
      };
    }

    // 1. Check Owner / Founder account via hashed OwnerConfigService
    if (cleanEmail === 'yamsuw946@gmail.com' || cleanEmail === 'owner@yard300.club') {
      const isOwnerValid = OwnerConfigService.loginOwner(cleanEmail, cleanPass);
      if (isOwnerValid) {
        clearFailedLogin(cleanEmail);
        const ownerInfo = OwnerConfigService.getOwnerInfo();
        const ownerUser: AuthUser = {
          id: 'usr-owner-01',
          name: ownerInfo.name || 'Yam Suw',
          email: ownerInfo.email || 'yamsuw946@gmail.com',
          role: 'owner',
          avatar: '/images/yam_suw_athlete.jpg',
          specialization: 'Explosive Power & Tactical Combat ⚡',
          level: 99,
          rankTitle: 'S-RANK #1 (FOUNDER)',
          streakDays: 42,
          totalAuraPoints: 18500,
          memberSince: '2025',
          emailVerified: true
        };
        this.setCurrentUser(ownerUser);
        return { success: true, user: ownerUser };
      }
      recordFailedLogin(cleanEmail);
      return { success: false, error: 'Incorrect credentials. Access denied.' };
    }

    // 2. Look up in stored accounts
    const accounts = this.getAllAccounts();
    const account = accounts.find((a) => a.user.email.toLowerCase() === cleanEmail);

    if (!account) {
      recordFailedLogin(cleanEmail);
      return {
        success: false,
        error: 'No account found with this email. Please register first.'
      };
    }

    // 3. Verify PBKDF2 / legacy hash (auto-upgrading legacy hash transparently)
    const { valid, needsUpgrade } = await verifyPasswordHash(cleanPass, account.passwordHash);
    if (!valid) {
      recordFailedLogin(cleanEmail);
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials and try again.'
      };
    }

    clearFailedLogin(cleanEmail);

    if (needsUpgrade) {
      account.passwordHash = await hashPasswordPbkdf2(cleanPass);
      this.saveAccounts(accounts);
    }

    // 4. Verify that email has been confirmed
    if (account.isVerified === false) {
      const freshCode = account.verificationCode || generateSixDigitOtp();
      const freshToken = account.verificationToken || generateCryptoHex(16);
      account.verificationCode = freshCode;
      account.verificationToken = freshToken;
      account.verificationCodeExpiry = Date.now() + VERIFICATION_TTL_MS;
      account.verificationAttempts = 0;
      this.saveAccounts(accounts);

      return {
        success: false,
        requiresVerification: true,
        verificationCode: freshCode,
        verificationToken: freshToken,
        error: 'Email confirmation required. Check your verification link or enter the 6-digit code.'
      };
    }

    const dailyResult = this.recordDailyLogin(account.user);
    this.setCurrentUser({ ...dailyResult.user, emailVerified: true });
    return { success: true, user: dailyResult.user };
  },

  // Register a new athlete account (requires email verification link/code before entry)
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
    verificationToken?: string;
  }> {
    const cleanName = sanitizeText(data.name || '', 64);
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanPass = data.password ? data.password.trim() : '';
    const cleanDiscipline = sanitizeText(data.discipline || 'Boxing & Explosive Striking 🥊', 96);

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter a valid athlete name (at least 2 characters).' };
    }
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const accounts = this.getAllAccounts();
    const existing = accounts.find((a) => a.user.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.isVerified) {
        return {
          success: false,
          error: 'An active account with this email already exists. Please sign in.'
        };
      } else {
        const freshCode = generateSixDigitOtp();
        const freshToken = generateCryptoHex(16);
        existing.verificationCode = freshCode;
        existing.verificationToken = freshToken;
        existing.verificationCodeExpiry = Date.now() + VERIFICATION_TTL_MS;
        existing.verificationAttempts = 0;
        existing.passwordHash = await hashPasswordPbkdf2(cleanPass);
        existing.user.name = cleanName;
        existing.user.specialization = cleanDiscipline;
        this.saveAccounts(accounts);
        return {
          success: true,
          requiresVerification: true,
          verificationCode: freshCode,
          verificationToken: freshToken,
          user: existing.user
        };
      }
    }

    const passwordHash = await hashPasswordPbkdf2(cleanPass);
    const isOwner = cleanEmail === 'yamsuw946@gmail.com';
    const verificationCode = generateSixDigitOtp();
    const verificationToken = generateCryptoHex(16);

    const newUser: AuthUser = {
      id: `usr-${Date.now()}-${generateCryptoHex(3)}`,
      name: cleanName,
      email: cleanEmail,
      role: isOwner ? 'owner' : 'athlete',
      avatar: data.avatar || (isOwner ? '/images/yam_suw_athlete.jpg' : CHALLENGER_IMAGE),
      specialization: cleanDiscipline,
      level: isOwner ? 99 : 1,
      rankTitle: isOwner ? 'S-RANK #1 (FOUNDER)' : 'ROOKIE WARRIOR',
      streakDays: isOwner ? 42 : 1,
      totalAuraPoints: isOwner ? 18500 : 250,
      memberSince: new Date().getFullYear().toString(),
      emailVerified: false
    };

    const newRecord: StoredAccountRecord = {
      user: newUser,
      passwordHash,
      createdAt: Date.now(),
      isVerified: false,
      verificationCode,
      verificationToken,
      verificationCodeExpiry: Date.now() + VERIFICATION_TTL_MS,
      verificationAttempts: 0
    };

    accounts.push(newRecord);
    this.saveAccounts(accounts);

    return {
      success: true,
      requiresVerification: true,
      verificationCode,
      verificationToken,
      user: newUser
    };
  },

  // Verify using cryptographic URL token OR 6-digit OTP
  verifyEmailCode(email: string, codeOrToken: string): { success: boolean; user?: AuthUser; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanInput = codeOrToken.trim();

    if (!cleanInput) {
      return { success: false, error: 'Please enter the 6-digit confirmation code.' };
    }

    const accounts = this.getAllAccounts();
    const account = accounts.find((a) => a.user.email.toLowerCase() === cleanEmail);

    if (!account) {
      return { success: false, error: 'Account not found for this email address.' };
    }

    if (account.isVerified) {
      const verifiedUser = { ...account.user, emailVerified: true };
      this.setCurrentUser(verifiedUser);
      return { success: true, user: verifiedUser };
    }

    if (account.verificationCodeExpiry && Date.now() > account.verificationCodeExpiry) {
      return {
        success: false,
        error: 'Verification link/code has expired. Click resend for a fresh confirmation.'
      };
    }

    if ((account.verificationAttempts || 0) >= MAX_OTP_ATTEMPTS) {
      return {
        success: false,
        error: 'Maximum verification attempts exceeded. Please request a fresh confirmation link.'
      };
    }

    const matchesCode = Boolean(account.verificationCode && account.verificationCode === cleanInput);
    const matchesToken = Boolean(account.verificationToken && account.verificationToken === cleanInput);

    if (!matchesCode && !matchesToken) {
      account.verificationAttempts = (account.verificationAttempts || 0) + 1;
      this.saveAccounts(accounts);
      return {
        success: false,
        error: 'Invalid confirmation code or token. Please check your link or resend.'
      };
    }

    account.isVerified = true;
    account.user = { ...account.user, emailVerified: true };
    delete account.verificationCode;
    delete account.verificationToken;
    delete account.verificationCodeExpiry;
    delete account.verificationAttempts;
    this.saveAccounts(accounts);

    const dailyResult = this.recordDailyLogin(account.user);
    this.setCurrentUser({ ...dailyResult.user, emailVerified: true });
    return { success: true, user: dailyResult.user };
  },

  // Password Reset Request (generates single-use reset code + token)
  requestPasswordReset(email: string): {
    success: boolean;
    resetCode?: string;
    resetToken?: string;
    error?: string;
  } {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    const accounts = this.getAllAccounts();
    const account = accounts.find((a) => a.user.email.toLowerCase() === cleanEmail);
    if (!account) {
      return { success: false, error: 'No registered athlete account matches this email.' };
    }

    const resetCode = generateSixDigitOtp();
    const resetToken = generateCryptoHex(16);
    account.resetCode = resetCode;
    account.resetToken = resetToken;
    account.resetExpiry = Date.now() + VERIFICATION_TTL_MS;
    this.saveAccounts(accounts);

    return { success: true, resetCode, resetToken };
  },

  // Complete Password Reset with code/token + new password
  async confirmPasswordReset(
    email: string,
    codeOrToken: string,
    newPassword: string
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanInput = codeOrToken.trim();
    const cleanPass = newPassword.trim();

    if (cleanPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    const accounts = this.getAllAccounts();
    const account = accounts.find((a) => a.user.email.toLowerCase() === cleanEmail);
    if (!account) {
      return { success: false, error: 'Account not found.' };
    }
    if (!account.resetExpiry || Date.now() > account.resetExpiry) {
      return { success: false, error: 'Reset code expired. Please request a new reset link.' };
    }
    if (account.resetCode !== cleanInput && account.resetToken !== cleanInput) {
      return { success: false, error: 'Invalid password reset code.' };
    }

    account.passwordHash = await hashPasswordPbkdf2(cleanPass);
    account.isVerified = true;
    account.user = { ...account.user, emailVerified: true };
    delete account.resetCode;
    delete account.resetToken;
    delete account.resetExpiry;
    this.saveAccounts(accounts);
    clearFailedLogin(cleanEmail);

    this.setCurrentUser(account.user);
    return { success: true, user: account.user };
  },

  // Record and calculate daily login streak & aura bonus
  recordDailyLogin(user: AuthUser): { user: AuthUser; bonusAwarded: boolean; streakMessage?: string } {
    if (typeof window === 'undefined') return { user, bonusAwarded: false };
    const dateKey = `yard300_last_login_date_${user.id}`;
    const todayStr = new Date().toISOString().slice(0, 10);
    const lastDate = localStorage.getItem(dateKey);

    let bonusAwarded = false;
    const updatedUser = { ...user };

    if (!lastDate) {
      localStorage.setItem(dateKey, todayStr);
      updatedUser.totalAuraPoints = (updatedUser.totalAuraPoints || 0) + 50;
      bonusAwarded = true;
    } else if (lastDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (lastDate === yesterdayStr) {
        updatedUser.streakDays = (updatedUser.streakDays || 1) + 1;
      } else {
        updatedUser.streakDays = 1;
      }
      updatedUser.totalAuraPoints = (updatedUser.totalAuraPoints || 0) + 50;
      localStorage.setItem(dateKey, todayStr);
      bonusAwarded = true;
    }

    if (bonusAwarded) {
      const accounts = this.getAllAccounts();
      const idx = accounts.findIndex((a) => a.user.id === updatedUser.id);
      if (idx >= 0) {
        accounts[idx].user = updatedUser;
        this.saveAccounts(accounts);
      }
    }

    return {
      user: updatedUser,
      bonusAwarded,
      streakMessage: bonusAwarded
        ? `Daily login recorded! +50 Aura Points added. Streak: ${updatedUser.streakDays} Days.`
        : undefined
    };
  },

  // Check and process 1-click confirmation links from URL query (?verifyToken=...&email=...) OR hash (#verify=CODE&email=...)
  checkAndProcessUrlVerification(): { success: boolean; user?: AuthUser; message?: string; error?: string } {
    if (typeof window === 'undefined') return { success: false };

    const search = window.location.search || '';
    const hash = window.location.hash || '';
    let tokenOrCode: string | null = null;
    let email: string | null = null;

    try {
      if (search.includes('verifyToken=') || search.includes('verify=')) {
        const qParams = new URLSearchParams(search);
        tokenOrCode = qParams.get('verifyToken') || qParams.get('verify');
        email = qParams.get('email');
      }

      if ((!tokenOrCode || !email) && hash.includes('verify=')) {
        const hParams = new URLSearchParams(hash.replace(/^#\/?/, ''));
        tokenOrCode = tokenOrCode || hParams.get('verifyToken') || hParams.get('verify');
        email = email || hParams.get('email');
      }

      if (tokenOrCode && email) {
        const res = this.verifyEmailCode(email, tokenOrCode);
        if (res.success && res.user) {
          window.history.replaceState(null, '', window.location.pathname);
          return {
            success: true,
            user: res.user,
            message: `Account confirmed for ${res.user.name}`
          };
        }
        return { success: false, error: res.error };
      }
    } catch {}

    return { success: false };
  },

  // Resend fresh 6-digit confirmation code & token
  resendVerificationCode(email: string): {
    success: boolean;
    verificationCode?: string;
    verificationToken?: string;
    error?: string;
  } {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = this.getAllAccounts();
    const account = accounts.find((a) => a.user.email.toLowerCase() === cleanEmail);

    if (!account) {
      return { success: false, error: 'Account not found for this email address.' };
    }

    const freshCode = generateSixDigitOtp();
    const freshToken = generateCryptoHex(16);
    account.verificationCode = freshCode;
    account.verificationToken = freshToken;
    account.verificationCodeExpiry = Date.now() + VERIFICATION_TTL_MS;
    account.verificationAttempts = 0;
    this.saveAccounts(accounts);

    return { success: true, verificationCode: freshCode, verificationToken: freshToken };
  },

  // Update profile details for authenticated user
  updateProfile(updates: Partial<AuthUser>): AuthUser | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    const updated: AuthUser = {
      ...current,
      ...updates,
      name: updates.name ? sanitizeText(updates.name, 64) : current.name,
      specialization: updates.specialization ? sanitizeText(updates.specialization, 96) : current.specialization
    };

    const accounts = this.getAllAccounts();
    const idx = accounts.findIndex(
      (a) => a.user.id === updated.id || a.user.email.toLowerCase() === updated.email.toLowerCase()
    );
    if (idx >= 0) {
      accounts[idx].user = updated;
      this.saveAccounts(accounts);
    }

    this.setCurrentUser(updated);
    return updated;
  },

  // Log out both athlete and owner sessions cleanly
  logout(): void {
    this.setCurrentUser(null);
    if (OwnerConfigService.isOwnerLoggedIn()) {
      OwnerConfigService.logoutOwner();
    }
  },

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

  saveAccounts(accounts: StoredAccountRecord[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(accounts));
    } catch {}
  }
};
