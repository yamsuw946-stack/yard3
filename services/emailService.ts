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
  verificationLink?: string;
  previewUrl?: string;
  directMailtoUrl: string;
  gmailWebUrl: string;
}

export const emailService = {
  /**
   * Dispatches 6-digit email confirmation code and direct activation link with native notifications & web links
   */
  async sendVerificationCode(
    recipientEmail: string, 
    athleteName: string, 
    code: string
  ): Promise<EmailDispatchResult> {
    const cleanEmail = recipientEmail.trim();
    const cleanName = athleteName.trim() || 'Champion Athlete';
    const timestamp = new Date().toLocaleString();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yard300.club';
    const verificationLink = `${origin}/#verify=${encodeURIComponent(code)}&email=${encodeURIComponent(cleanEmail)}`;
    const subject = `[YARD 300] Your Account Verification Code: ${code}`;
    const bodyText = `Welcome to YARD 300, ${cleanName}!%0D%0A%0D%0AYour 6-digit confirmation code is: ${code}%0D%0A%0D%0ADirect 1-Click Activation Link:%0D%0A${encodeURIComponent(verificationLink)}%0D%0A%0D%0AEnter this code or click the activation link to verify your email address (${cleanEmail}) and activate your athlete credentials.%0D%0A%0D%0ADispatched at: ${timestamp}%0D%0AYARD 300 Combat Health & High Performance Arena.`;

    const directMailtoUrl = `mailto:${encodeURIComponent(cleanEmail)}?subject=${encodeURIComponent(subject)}&body=${bodyText}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${encodeURIComponent(subject)}&body=${bodyText}`;

    // Browser Web Notification
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission === 'granted') {
          new Notification('YARD 300 - Email Verification Link & Code', {
            body: `Your activation code is: ${code}. Click the notification or link to activate.`,
            icon: '/images/yam_suw_athlete.jpg'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification('YARD 300 - Email Verification Link & Code', {
                body: `Your activation code is: ${code}. Click the notification or link to activate.`,
                icon: '/images/yam_suw_athlete.jpg'
              });
            }
          });
        }
      } catch {
        // Ignore notification permission error
      }
    }

    return {
      sent: true,
      recipient: cleanEmail,
      subject,
      code,
      verificationLink,
      timestamp,
      directMailtoUrl,
      gmailWebUrl
    };
  },

  /**
   * Dispatches official itemized order receipt notification
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
    
    const itemsList = order.items
      .map(i => `• ${i.name} ($${i.price})`)
      .join('%0D%0A');

    const bodyText = `YARD 300 OFFICIAL ORDER RECEIPT%0D%0A=====================================%0D%0AOrder Number: #${order.id}%0D%0ADate: ${timestamp}%0D%0APayment Method: ${order.paymentMethod}%0D%0AStatus: CONFIRMED & PAID%0D%0A%0D%0APURCHASED GEAR:%0D%0A${itemsList}%0D%0A%0D%0ATOTAL PAID: $${order.total}%0D%0A%0D%0AYour gear shipment is being prepared. Thank you for training with YARD 300!`;

    const directMailtoUrl = `mailto:${encodeURIComponent(cleanEmail)}?subject=${encodeURIComponent(subject)}&body=${bodyText}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${encodeURIComponent(subject)}&body=${bodyText}`;

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission === 'granted') {
          new Notification('YARD 300 - Order Confirmed', {
            body: `Order #${order.id} cleared successfully for $${order.total}. Payment received.`,
            icon: '/images/yam_suw_athlete.jpg'
          });
        }
      } catch {}
    }

    return {
      sent: true,
      recipient: cleanEmail,
      subject,
      timestamp,
      directMailtoUrl,
      gmailWebUrl
    };
  },

  /**
   * Dispatches welcome notification and generates mail client verification links
   */
  async sendWelcomeConfirmation(recipientEmail: string, athleteName: string): Promise<EmailDispatchResult> {
    const cleanEmail = recipientEmail.trim();
    const cleanName = athleteName.trim() || 'Champion';
    const timestamp = new Date().toLocaleString();
    const subject = `Welcome to YARD 300 - Athlete Account Confirmation [${cleanName}]`;
    const bodyText = `Welcome to YARD 300, ${cleanName}!%0D%0A%0D%0AYour athlete profile has been registered and verified successfully.%0D%0AEmail: ${cleanEmail}%0D%0ARegistration Date: ${timestamp}%0D%0A%0D%0AYARD 300 Combat Health & Athletic Performance Platform.`;

    const directMailtoUrl = `mailto:${encodeURIComponent(cleanEmail)}?subject=${encodeURIComponent(subject)}&body=${bodyText}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanEmail)}&su=${encodeURIComponent(subject)}&body=${bodyText}`;

    return {
      sent: true,
      recipient: cleanEmail,
      subject,
      timestamp,
      directMailtoUrl,
      gmailWebUrl
    };
  }
};
