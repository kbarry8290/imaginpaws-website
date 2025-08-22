// Safe Mixpanel analytics wrapper for password reset flow
// No PII or sensitive data is ever logged

// Mixpanel configuration - replace with your actual token
const MIXPANEL_TOKEN = 'your-mixpanel-token';

// Initialize Mixpanel (only if token is provided)
let mixpanel = null;

try {
    if (MIXPANEL_TOKEN && MIXPANEL_TOKEN !== 'your-mixpanel-token') {
        // Load Mixpanel script dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2.2.0.min.js';
        script.onload = () => {
            if (window.mixpanel) {
                window.mixpanel.init(MIXPANEL_TOKEN);
                mixpanel = window.mixpanel;
            }
        };
        document.head.appendChild(script);
    }
} catch (error) {
    console.warn('Mixpanel initialization failed:', error);
}

// Safe event tracking - never logs sensitive data
export function trackEvent(eventName, properties = {}) {
    try {
        // Ensure we don't track sensitive information
        const safeProperties = sanitizeProperties(properties);
        
        if (mixpanel) {
            mixpanel.track(eventName, safeProperties);
        }
        
        // Also log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Analytics Event:', eventName, safeProperties);
        }
    } catch (error) {
        console.warn('Analytics tracking failed:', error);
    }
}

// Sanitize properties to remove any sensitive data
function sanitizeProperties(properties) {
    const safeProperties = { ...properties };
    
    // Remove any properties that might contain sensitive data
    const sensitiveKeys = [
        'email', 'password', 'token', 'access_token', 'refresh_token',
        'code', 'hash', 'secret', 'key', 'auth', 'session'
    ];
    
    sensitiveKeys.forEach(key => {
        if (safeProperties[key]) {
            safeProperties[key] = '[REDACTED]';
        }
    });
    
    // Add some safe context
    safeProperties.timestamp = Date.now();
    safeProperties.user_agent = navigator.userAgent ? 'present' : 'missing';
    safeProperties.platform = getPlatform();
    safeProperties.screen_size = `${window.screen.width}x${window.screen.height}`;
    
    return safeProperties;
}

// Get platform information
function getPlatform() {
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        return 'iOS';
    } else if (/Android/.test(navigator.userAgent)) {
        return 'Android';
    } else if (/Windows/.test(navigator.userAgent)) {
        return 'Windows';
    } else if (/Mac/.test(navigator.userAgent)) {
        return 'macOS';
    } else if (/Linux/.test(navigator.userAgent)) {
        return 'Linux';
    } else {
        return 'Unknown';
    }
}

// Track page view
export function trackPageView(pageName) {
    trackEvent('page_view', {
        page_name: pageName,
        url: window.location.pathname
    });
}

// Track form interaction
export function trackFormInteraction(formName, action) {
    trackEvent('form_interaction', {
        form_name: formName,
        action: action
    });
}

// Track error (without sensitive details)
export function trackError(errorType, errorCode = null) {
    trackEvent('error', {
        error_type: errorType,
        error_code: errorCode
    });
}

// Track success
export function trackSuccess(action) {
    trackEvent('success', {
        action: action
    });
}

// Track user journey step
export function trackJourneyStep(step, status = 'completed') {
    trackEvent('journey_step', {
        step: step,
        status: status
    });
}

// Track app open attempt
export function trackAppOpenAttempt(method) {
    trackEvent('app_open_attempt', {
        method: method,
        platform: getPlatform()
    });
}

// Track performance metrics
export function trackPerformance(metric, value) {
    trackEvent('performance', {
        metric: metric,
        value: value
    });
}

// Track user engagement
export function trackEngagement(action, duration = null) {
    const properties = { action };
    if (duration) {
        properties.duration = duration;
    }
    trackEvent('engagement', properties);
}

// Initialize tracking for the page
export function initializeTracking() {
    trackPageView('password_reset');
    
    // Track initial page load performance
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        trackPerformance('page_load_time', loadTime);
    }
}

// Track form validation errors
export function trackValidationError(field, errorType) {
    trackEvent('validation_error', {
        field: field,
        error_type: errorType
    });
}

// Track password strength
export function trackPasswordStrength(strength) {
    trackEvent('password_strength', {
        strength: strength
    });
}

// Track resend email attempts
export function trackResendAttempt(success) {
    trackEvent('resend_attempt', {
        success: success
    });
}

// Track session establishment
export function trackSessionEstablishment(method, success) {
    trackEvent('session_establishment', {
        method: method,
        success: success
    });
}

// Track URL parameter parsing
export function trackUrlParsing(hasCode, hasTokens) {
    trackEvent('url_parsing', {
        has_code: hasCode,
        has_tokens: hasTokens
    });
}

// Track state transitions
export function trackStateTransition(fromState, toState) {
    trackEvent('state_transition', {
        from_state: fromState,
        to_state: toState
    });
}

// Track accessibility interactions
export function trackAccessibility(action) {
    trackEvent('accessibility', {
        action: action
    });
}

// Track mobile vs desktop usage
export function trackDeviceType() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    trackEvent('device_type', {
        is_mobile: isMobile
    });
}

// Initialize tracking when the module loads
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTracking);
    } else {
        initializeTracking();
    }
}
