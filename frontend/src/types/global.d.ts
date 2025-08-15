// Global types for Google Identity Services
// Reference: https://developers.google.com/identity/gsi/web/reference/js-reference

interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
  clientId?: string;
}

interface GoogleID {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    ux_mode?: 'popup' | 'redirect';
    auto_select?: boolean;
    login_uri?: string;
    native_callback?: (...args: any[]) => void;
    cancel_on_tap_outside?: boolean;
    prompt_parent_id?: string;
    nonce?: string;
    context?: 'signin' | 'signup' | 'use';
  }) => void;
  renderButton: (parent: HTMLElement | null, options?: Record<string, any>) => void;
  prompt: (momentListener?: (notification: any) => void) => void;
}

interface GoogleAccounts {
  id: GoogleID;
}

interface GoogleNamespace {
  accounts: GoogleAccounts;
}

declare global {
  interface Window {
    google?: GoogleNamespace;
  }
}

export {};
