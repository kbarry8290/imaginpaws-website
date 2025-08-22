// Utility functions for password reset flow

// Parse URL parameters from both query string and hash fragment
export function parseUrlParams() {
    const params = {};
    
    // Parse query parameters
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    
    // Parse hash fragment parameters
    if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        for (const [key, value] of hashParams) {
            params[key] = value;
        }
    }
    
    return params;
}

// Validate password strength and confirmation
export function validatePassword(password, confirmPassword) {
    // Check minimum length
    if (password.length < 8) {
        return {
            isValid: false,
            error: 'Password must be at least 8 characters long'
        };
    }
    
    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasLetter || !hasNumber) {
        return {
            isValid: false,
            error: 'Password must contain at least one letter and one number'
        };
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        return {
            isValid: false,
            error: 'Passwords do not match'
        };
    }
    
    return {
        isValid: true,
        error: null
    };
}

// Show specific state and hide others
export function showState(stateName) {
    const states = ['loading', 'set-password', 'success', 'invalid'];
    
    states.forEach(state => {
        const element = document.getElementById(`${state}-state`);
        if (element) {
            if (state === stateName) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    });
}

// Set loading state
export function setLoading(isLoading) {
    const loadingElement = document.getElementById('loading-state');
    if (loadingElement) {
        if (isLoading) {
            loadingElement.classList.remove('hidden');
        } else {
            loadingElement.classList.add('hidden');
        }
    }
}

// Sanitize and validate email address
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Debounce function for performance
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Focus management for accessibility
export function focusFirstInput(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const firstInput = container.querySelector('input, button, a');
        if (firstInput) {
            firstInput.focus();
        }
    }
}

// Announce changes for screen readers
export function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.classList.add('sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Safe URL manipulation
export function safeRedirect(url) {
    try {
        // Ensure the URL is safe (same origin or trusted domains)
        const currentOrigin = window.location.origin;
        const targetUrl = new URL(url, currentOrigin);
        
        // Only allow same origin or trusted domains
        const trustedDomains = [
            'imaginpaws.com',
            'www.imaginpaws.com',
            'apps.apple.com',
            'play.google.com'
        ];
        
        const isTrusted = trustedDomains.some(domain => 
            targetUrl.hostname === domain || targetUrl.hostname.endsWith(`.${domain}`)
        );
        
        if (targetUrl.origin === currentOrigin || isTrusted) {
            window.location.href = targetUrl.href;
        } else {
            console.warn('Blocked redirect to untrusted domain:', targetUrl.href);
        }
    } catch (error) {
        console.error('Redirect error:', error);
    }
}

// Error handling utilities
export function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    
    // Don't log sensitive information
    const safeError = {
        message: error.message || 'An error occurred',
        code: error.code,
        status: error.status
    };
    
    return safeError;
}

// Check if running in mobile browser
export function isMobileBrowser() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Check if app is installed (basic detection)
export function isAppInstalled() {
    // This is a basic check - in production you might want more sophisticated detection
    return isMobileBrowser();
}

// Format error messages for display
export function formatErrorMessage(error) {
    if (typeof error === 'string') {
        return error;
    }
    
    if (error.message) {
        return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
}

// Generate a simple ID for tracking
export function generateTrackingId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Check if the current page is visible
export function isPageVisible() {
    return document.visibilityState === 'visible';
}

// Wait for a specified time
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
