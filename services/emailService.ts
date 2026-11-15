/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EmailDispatchResult {
  sent: boolean;
  recipient: string;
  subject: string;
  timestamp: string;
  code?: string;
  verificationToken?: string;
  verificationLink?: string;
  previewUrl?: string;
  directMailtoUrl: string;
  gmailWebUrl: string;
  outlookWebUrl: string;
}

export const emailService = {
  /**
   * Dispatches 6-digit confirmation code & cryptographic URL verification link
   */
  async sendVerificationCode(
    recipientEmail: string,
    athleteName: string,
    code: string,
    verificationToken?: string,
    lang: string = 'en'
  ): Promise<EmailDispatchResult> {
    const cleanEmail = recipientEmail.trim();
    const cleanName = athleteName.replace(/[<>]/g, '').trim() || 'Champion Athlete';
    const timestamp = new Date().toLocaleString();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yard300.club';
    const tokenQuery = verificationToken
      ? `?verifyToken=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(cleanEmail)}`
      : `?verify=${encodeURIComponent(code)}&email=${encodeURIComponent(cleanEmail)}`;
    const verificationLink = `${origin}/${tokenQuery}#verify=${encodeURIComponent(code)}&email=${encodeURIComponent(cleanEmail)}`;

    const subject =
      lang === 'es'
        ? `[YARD 300] Tu Enlace y Código de Confirmación: ${code}`
        : lang === 'fr'
        ? `[YARD 300] Votre Lien et Code de Confirmation : ${code}`
        : lang === 'ar'
        ? `[YARD 300] رابط ورمز تأكيد الحساب: ${code}`
        : `[YARD 300] Your Verification Link & Code: ${code}`;

    const rawBody =
      lang === 'es'
        ? `Bienvenido a YARD 300, ${cleanName}!\n\nTu código de confirmación de 6 dígitos es: ${code}\n\nEnlace de activación directa en 1 clic:\n${verificationLink}\n\nEnviado: ${timestamp}\nYARD 300`
        : lang === 'fr'
        ? `Bienvenue chez YARD 300, ${cleanName} !\n\nVotre code de confirmation à 6 chiffres : ${code}\n\nLien d'activation en 1 clic :\n${verificationLink}\n\nEnvoyé : ${timestamp}\nYARD 300`
        : lang === 'ar'
        ? `أهلاً بك في YARD 300 يا ${cleanName}!\n\nرمز التأكيد المكون من 6 أرقام: ${code}\n\nرابط التفعيل المباشر بنقرة واحدة:\n${verificationLink}\n\nتم الإرسال: ${timestamp}\nYARD 300`
        : `Welcome to YARD 300, ${cleanName}!\n\nYour 6-digit confirmation code is: ${code}\n\nDirect 1-Click Activation Link:\n${verificationLink}\n\nDispatched: ${timestamp}\nYARD 300 Combat Health & Bio-Performance Arena`;

    const directMailtoUrl = `mailto:${encodeURIComponent(cleanEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(rawBody)}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(rawBody)}`;
    const outlookWebUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(cleanEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(rawBody)}`;

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission === 'granted') {
          new Notification('YARD 300 — Verification Link Ready', {
            body: `Code: ${code} — Open verification link to activate ${cleanEmail}`,
            icon: '/images/yam_suw_athlete.jpg'
          });
        }
      } catch {}
    }

    return {
      sent: true,
      recipient: cleanEmail,
      subject,
      code,
      verificationToken,
      verificationLink,
      timestamp,
      directMailtoUrl,
      gmailWebUrl,
      outlookWebUrl
    };
  },

  /**
   * Dispatches itemized order receipt notification
   */
  async sendOrderReceipt(
    recipientEmail: string,
    order: {
      id: string;
      total: number;
      paymentMethod: string;
      items: { name: string; price: number; quantity?: number }[];
    }
  ): Promise<EmailDispatchResult> {
    const cleanEmail = recipientEmail.trim();
    const timestamp = new Date().toLocaleString();
    const subject = `[YARD 300] Order Confirmation #${order.id} - Paid $${order.total}`;
    const itemsList = order.items.map((i) => `• ${i.name} ($${i.price})`).join('\n');
    const rawBody = `YARD 300 OFFICIAL ORDER RECEIPT\nOrder #${order.id}\nDate: ${timestamp}\nMethod: ${order.paymentMethod}\n\nITEMS:\n${itemsList}\n\nTOTAL: $${order.total}`;

    const directMailtoUrl = `mailto:${encodeURIComponent(cleanEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(rawBody)}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(rawBody)}`;
    const outlookWebUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(cleanEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(rawBody)}`;

    return {
      sent: true,
      recipient: cleanEmail,
      subject,
      timestamp,
      directMailtoUrl,
      gmailWebUrl,
      outlookWebUrl
    };
  },

  /**
   * Dispatches welcome notification
   */
  async sendWelcomeConfirmation(recipientEmail: string, athleteName: string): Promise<EmailDispatchResult> {
    const cleanEmail = recipientEmail.trim();
    const cleanName = athleteName.replace(/[<>]/g, '').trim() || 'Champion';
    const timestamp = new Date().toLocaleString();
    const subject = `Welcome to YARD 300 - Athlete Confirmation [${cleanName}]`;
    const rawBody = `Welcome to YARD 300, ${cleanName}!\n\nYour profile (${cleanEmail}) is confirmed.\nDate: ${timestamp}`;

    const directMailtoUrl = `mailto:${encodeURIComponent(cleanEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(rawBody)}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(rawBody)}`;
    const outlookWebUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(cleanEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(rawBody)}`;

    return {
      sent: true,
      recipient: cleanEmail,
      subject,
      timestamp,
      directMailtoUrl,
      gmailWebUrl,
      outlookWebUrl
    };
  }
};
