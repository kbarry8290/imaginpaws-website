// Configuration template for ImaginPaws Password Reset Flow
// Copy this file to config.js and update with your actual values

export const CONFIG = {
    // Supabase Configuration (REQUIRED)
    SUPABASE: {
        URL: 'https://njfqprtaznrhvuydsayo.supabase.co',
        ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZnFwcnRhem5yaHZ1eWRzYXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MDc1NjQsImV4cCI6MjA2MTE4MzU2NH0.PYKzo-2lj1rZOUsttjyf67HnQvL1z7XCzMA6mK52L08'
    },
    
    // Analytics Configuration (OPTIONAL)
    ANALYTICS: {
        MIXPANEL_TOKEN: 'your-mixpanel-token', // Set to null to disable
        ENABLED: true
    },
    
    // App Configuration
    APP: {
        CUSTOM_SCHEME: 'imaginpaws://open',
        FALLBACK_URL: '/login',
        FALLBACK_DELAY: 1200 // milliseconds
    },
    
    // Password Requirements
    PASSWORD: {
        MIN_LENGTH: 8,
        REQUIRE_LETTER: true,
        REQUIRE_NUMBER: true,
        REQUIRE_SPECIAL: false // Set to true if you want special characters
    },
    
    // URLs
    URLS: {
        RESET_PASSWORD: 'https://imaginpaws.com/auth/reset-password',
        LOGIN: '/login',
        HOME: '/'
    },
    
    // Security
    SECURITY: {
        TOKEN_SCRUBBING: true,
        HTTPS_ONLY: true,
        TRUSTED_DOMAINS: [
            'imaginpaws.com',
            'www.imaginpaws.com',
            'apps.apple.com',
            'play.google.com'
        ]
    },
    
    // UI Configuration
    UI: {
        LOADING_DELAY: 100, // milliseconds
        ANIMATION_DURATION: 200, // milliseconds
        MOBILE_BREAKPOINT: 640 // pixels
    }
};

// Development/Testing Configuration
export const DEV_CONFIG = {
    DEBUG_MODE: false,
    MOCK_SUPABASE: false,
    LOG_LEVEL: 'warn' // 'debug', 'info', 'warn', 'error'
};

// Usage Instructions:
// 1. Copy this file to config.js
// 2. Update the values with your actual configuration
// 3. Import and use in reset-password.js:
//    import { CONFIG } from './config.js';
// 4. Replace hardcoded values with CONFIG.SUPABASE.URL, etc.
