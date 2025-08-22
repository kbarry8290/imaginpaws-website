// Main password reset flow logic
import { createClient } from 'https://esm.run/@supabase/supabase-js@^2';
import { parseUrlParams, validatePassword, showState, setLoading } from './utils.js';
import { trackEvent } from './mixpanel.js';

// Get Supabase configuration from inline script
const SUPABASE_CONFIG = window.SUPABASE_CONFIG || {};

console.log('Supabase Config:', SUPABASE_CONFIG);

// IMPORTANT: use implicit flow for recovery links
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    flowType: 'implicit',        // ✅ force implicit
    detectSessionInUrl: false,   // ✅ don't auto-run PKCE
    persistSession: true,
    autoRefreshToken: true,
  },
});

console.log('Supabase client created with implicit flow');

// State management
let currentState = 'loading';

// DOM elements
const elements = {
    loading: document.getElementById('loading-state'),
    setPassword: document.getElementById('set-password-state'),
    success: document.getElementById('success-state'),
    invalid: document.getElementById('invalid-state'),
    forms: {
        setPassword: document.getElementById('set-password-form'),
        resend: document.getElementById('resend-form')
    },
    inputs: {
        newPassword: document.getElementById('new-password'),
        confirmPassword: document.getElementById('confirm-password'),
        email: document.getElementById('email')
    },
    buttons: {
        submit: document.getElementById('submit-button'),
        resend: document.getElementById('resend-button'),
        openApp: document.getElementById('open-app-button')
    },
    errors: {
        password: document.getElementById('password-error'),
        resend: document.getElementById('resend-error')
    },
    success: {
        resend: document.getElementById('resend-success')
    }
};

// Helper functions for bootstrap
function renderLoading() {
    setLoading(true);
    trackEvent('password_reset_page_viewed');
}

function renderInvalidLink() {
    setLoading(false);
    showInvalidState();
}

function renderPasswordForm(onSubmit) {
    setLoading(false);
    showSetPasswordState();
    
    // Set up form submission handler
    const form = document.getElementById('set-password-form');
    const originalSubmit = form.onsubmit;
    
    form.onsubmit = async (event) => {
        event.preventDefault();
        
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validate password
        const validation = validatePassword(newPassword, confirmPassword);
        if (!validation.isValid) {
            showFormError(validation.error);
            return;
        }
        
        // Clear previous errors
        showFormError('');
        
        // Show loading state
        setFormLoading('submit', true);
        
        try {
            await onSubmit(newPassword);
        } catch (error) {
            showFormError(error.message || 'Failed to update password');
        } finally {
            setFormLoading('submit', false);
        }
    };
}

function showFormError(message) {
    const errorElement = document.getElementById('password-error');
    if (message) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    } else {
        errorElement.classList.add('hidden');
    }
}

function renderSuccess() {
    showSuccessState();
    trackEvent('password_reset_success');
}

// Bootstrap logic (handle hash first, then code)
async function bootstrap() {
    renderLoading();

    const url = new URL(location.href);
    const query = url.searchParams;
    const hash = new URLSearchParams(location.hash.slice(1));

    try {
        if (hash.get('access_token') && hash.get('refresh_token')) {
            // Preferred: direct tokens
            await supabase.auth.setSession({
                access_token: hash.get('access_token'),
                refresh_token: hash.get('refresh_token'),
            });
        } else if (query.get('code')) {
            // Only attempt if implicit flow is enabled (no PKCE)
            await supabase.auth.exchangeCodeForSession(query.get('code'));
        } else {
            return renderInvalidLink();
        }

        // Scrub tokens/params
        history.replaceState({}, document.title, '/auth/reset-password');

        // Now it's safe to check user and render form
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) return renderInvalidLink();

        renderPasswordForm(async (newPassword) => {
            const { error: upErr } = await supabase.auth.updateUser({ password: newPassword });
            if (upErr) return showFormError(upErr.message);
            renderSuccess();
        });
    } catch (err) {
        renderInvalidLink();
    }
}

// Handle successful recovery - verify user and show password form
async function handleSuccessfulRecovery() {
    try {
        // Verify the user exists and can update password
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
            throw new Error('Unable to verify your account. Please try again or contact support.');
        }
        
        // Show password reset form
        showSetPasswordState();
        trackEvent('password_reset_link_valid');
        
    } catch (error) {
        console.error('Recovery validation failed:', error);
        showInvalidState();
    }
}

// Show the set password state
function showSetPasswordState() {
    currentState = 'set-password';
    showState('set-password');
    
    // Focus on the first input
    setTimeout(() => {
        elements.inputs.newPassword.focus();
    }, 100);
}

// Show the invalid/expired state
function showInvalidState() {
    currentState = 'invalid';
    showState('invalid');
    trackEvent('password_reset_link_invalid');
}

// Show the success state
function showSuccessState() {
    currentState = 'success';
    showState('success');
    trackEvent('password_reset_success');
}

// Handle password form submission
async function handlePasswordSubmit(event) {
    event.preventDefault();
    
    const newPassword = elements.inputs.newPassword.value;
    const confirmPassword = elements.inputs.confirmPassword.value;
    
    // Clear previous errors
    elements.errors.password.classList.add('hidden');
    
    // Validate password
    const validation = validatePassword(newPassword, confirmPassword);
    if (!validation.isValid) {
        elements.errors.password.textContent = validation.error;
        elements.errors.password.classList.remove('hidden');
        elements.inputs.newPassword.focus();
        return;
    }
    
    try {
        // Show loading state
        setFormLoading('submit', true);
        
        // Update user password
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        
        if (error) {
            throw error;
        }
        
        // Success - show success state
        showSuccessState();
        
    } catch (error) {
        console.error('Password update error:', error);
        
        // Show error message
        elements.errors.password.textContent = error.message || 'Unable to update your password. Please try again.';
        elements.errors.password.classList.remove('hidden');
        
        // Focus on password field
        elements.inputs.newPassword.focus();
        
        trackEvent('password_reset_error', { error: error.message });
    } finally {
        setFormLoading('submit', false);
    }
}

// Handle resend form submission
async function handleResendSubmit(event) {
    event.preventDefault();
    
    const email = elements.inputs.email.value.trim();
    
    if (!email) {
        return;
    }
    
    try {
        // Show loading state
        setFormLoading('resend', true);
        
        // Clear previous messages
        elements.errors.resend.classList.add('hidden');
        elements.success.resend.classList.add('hidden');
        
        // Send password reset email
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://imaginpaws.com/auth/reset-password'
        });
        
        if (error) {
            throw error;
        }
        
        // Show success message
        elements.success.resend.classList.remove('hidden');
        elements.inputs.email.value = '';
        
        trackEvent('password_reset_email_sent');
        
    } catch (error) {
        console.error('Resend error:', error);
        
        // Show error message
        elements.errors.resend.textContent = error.message || 'Unable to send reset email. Please try again.';
        elements.errors.resend.classList.remove('hidden');
        
        trackEvent('password_reset_resend_error', { error: error.message });
    } finally {
        setFormLoading('resend', false);
    }
}

// Handle open app button click
function handleOpenApp() {
    try {
        // Try to open the app with custom scheme
        window.location.href = 'imaginpaws://open';
        
        // Fallback: redirect to login after delay
        setTimeout(() => {
            if (document.visibilityState !== 'hidden') {
                window.location.href = '/login';
            }
        }, 1200);
        
        trackEvent('password_reset_open_app_clicked');
        
    } catch (error) {
        console.error('Open app error:', error);
        window.location.href = '/login';
    }
}

// Set form loading state
function setFormLoading(formType, isLoading) {
    const button = formType === 'submit' ? elements.buttons.submit : elements.buttons.resend;
    const text = formType === 'submit' ? 'submit-text' : 'resend-text';
    const spinner = formType === 'submit' ? 'submit-spinner' : 'resend-spinner';
    
    if (isLoading) {
        button.disabled = true;
        document.getElementById(text).classList.add('hidden');
        document.getElementById(spinner).classList.remove('hidden');
    } else {
        button.disabled = false;
        document.getElementById(text).classList.remove('hidden');
        document.getElementById(spinner).classList.add('hidden');
    }
}

// Event listeners
function setupEventListeners() {
    // Password form submission
    elements.forms.setPassword.addEventListener('submit', handlePasswordSubmit);
    
    // Resend form submission
    elements.forms.resend.addEventListener('submit', handleResendSubmit);
    
    // Open app button
    elements.buttons.openApp.addEventListener('click', handleOpenApp);
    
    // Real-time password validation
    elements.inputs.newPassword.addEventListener('input', () => {
        const newPassword = elements.inputs.newPassword.value;
        const confirmPassword = elements.inputs.confirmPassword.value;
        
        if (confirmPassword) {
            const validation = validatePassword(newPassword, confirmPassword);
            if (!validation.isValid) {
                elements.errors.password.textContent = validation.error;
                elements.errors.password.classList.remove('hidden');
            } else {
                elements.errors.password.classList.add('hidden');
            }
        }
    });
    
    elements.inputs.confirmPassword.addEventListener('input', () => {
        const newPassword = elements.inputs.newPassword.value;
        const confirmPassword = elements.inputs.confirmPassword.value;
        
        if (newPassword && confirmPassword) {
            const validation = validatePassword(newPassword, confirmPassword);
            if (!validation.isValid) {
                elements.errors.password.textContent = validation.error;
                elements.errors.password.classList.remove('hidden');
            } else {
                elements.errors.password.classList.add('hidden');
            }
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupEventListeners();
        bootstrap();
    });
} else {
    setupEventListeners();
    bootstrap();
}
