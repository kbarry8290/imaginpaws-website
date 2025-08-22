# Deployment Checklist for Password Reset Flow

## Pre-Deployment Configuration

### 1. Supabase Setup
- [ ] Create Supabase project if not exists
- [ ] Get project URL and anon key from Supabase dashboard
- [ ] Configure authentication settings in Supabase
- [ ] Set up email templates for password reset
- [ ] Configure redirect URLs in Supabase auth settings

### 2. File Configuration
- [ ] Copy `config.example.js` to `config.js`
- [ ] Update `SUPABASE.URL` with your project URL
- [ ] Update `SUPABASE.ANON_KEY` with your anon key
- [ ] Update `URLS.RESET_PASSWORD` with your domain
- [ ] Update `URLS.LOGIN` with your login page URL
- [ ] Update `APP.CUSTOM_SCHEME` if different from `imaginpaws://open`

### 3. Analytics Setup (Optional)
- [ ] Create Mixpanel project if using analytics
- [ ] Get Mixpanel token from dashboard
- [ ] Update `ANALYTICS.MIXPANEL_TOKEN` in config
- [ ] Test analytics events in development

### 4. CSS Build
- [ ] Run `npm run build` to generate Tailwind CSS
- [ ] Verify `dist/output.css` is up to date
- [ ] Test that styles load correctly

## Deployment Steps

### 1. File Upload
- [ ] Upload all files to `/auth/reset-password/` directory
- [ ] Ensure proper file permissions (644 for files, 755 for directories)
- [ ] Verify all files are accessible via HTTPS

### 2. Server Configuration
- [ ] Configure web server to serve static files
- [ ] Set up proper MIME types for `.js` files
- [ ] Enable CORS if needed for Supabase
- [ ] Configure HTTPS redirects
- [ ] Set up proper caching headers

### 3. Domain Configuration
- [ ] Ensure `imaginpaws.com` points to your server
- [ ] Configure SSL certificate
- [ ] Test HTTPS access
- [ ] Verify subdomain routing

## Testing Checklist

### 1. Basic Functionality
- [ ] Page loads without errors
- [ ] All CSS and JavaScript files load
- [ ] No console errors in browser
- [ ] Responsive design works on mobile
- [ ] Accessibility features work (keyboard navigation, screen readers)

### 2. URL Handling
- [ ] Test with code-based recovery URL: `?code=test&type=recovery`
- [ ] Test with token-based recovery URL: `#access_token=test&refresh_token=test&type=recovery`
- [ ] Test with invalid/empty URL
- [ ] Verify URL scrubbing works (tokens removed from address bar)

### 3. Password Reset Flow
- [ ] Loading state displays correctly
- [ ] Password validation works (length, complexity, confirmation)
- [ ] Error messages display properly
- [ ] Success state shows after password update
- [ ] App opening button works
- [ ] Fallback redirect works after app open attempt

### 4. Error Handling
- [ ] Invalid tokens show appropriate error
- [ ] Network errors are handled gracefully
- [ ] Form validation errors display correctly
- [ ] Resend email functionality works

### 5. Mobile Testing
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify touch targets are appropriate size
- [ ] Test app opening on mobile devices
- [ ] Verify no unwanted zoom on input focus

### 6. Analytics (if enabled)
- [ ] Verify events are being tracked
- [ ] Check that no sensitive data is logged
- [ ] Test all tracking events
- [ ] Verify Mixpanel dashboard shows data

## Security Verification

### 1. Token Security
- [ ] Verify tokens are scrubbed from URL after session establishment
- [ ] Check that tokens are not logged anywhere
- [ ] Ensure HTTPS is enforced
- [ ] Verify CORS settings are correct

### 2. Input Validation
- [ ] Test password strength requirements
- [ ] Verify email validation
- [ ] Check for XSS vulnerabilities
- [ ] Test SQL injection prevention (if applicable)

### 3. Privacy
- [ ] Verify no PII is logged in analytics
- [ ] Check that sensitive data is not stored in localStorage
- [ ] Ensure proper data handling compliance

## Performance Testing

### 1. Load Times
- [ ] Page loads under 3 seconds on 3G
- [ ] CSS and JS files are optimized
- [ ] Images are compressed
- [ ] No render-blocking resources

### 2. Browser Compatibility
- [ ] Chrome 80+
- [ ] Firefox 75+
- [ ] Safari 13+
- [ ] Edge 80+
- [ ] Mobile browsers

## Post-Deployment Monitoring

### 1. Error Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor console errors
- [ ] Track failed password resets
- [ ] Monitor analytics for issues

### 2. User Experience
- [ ] Track completion rates
- [ ] Monitor time spent on each step
- [ ] Track app opening success rates
- [ ] Monitor mobile vs desktop usage

### 3. Security Monitoring
- [ ] Monitor for suspicious activity
- [ ] Track failed authentication attempts
- [ ] Monitor token usage patterns
- [ ] Check for unusual traffic patterns

## Rollback Plan

### 1. Backup
- [ ] Keep backup of previous version
- [ ] Document current configuration
- [ ] Save database state if applicable

### 2. Rollback Steps
- [ ] Revert to previous file versions
- [ ] Update configuration if needed
- [ ] Clear any cached data
- [ ] Test rollback functionality

## Documentation

### 1. Update Documentation
- [ ] Update README with actual configuration
- [ ] Document any customizations made
- [ ] Update deployment procedures
- [ ] Document troubleshooting steps

### 2. Team Communication
- [ ] Notify team of deployment
- [ ] Share testing results
- [ ] Document any issues found
- [ ] Update runbooks if needed

## Final Verification

- [ ] All tests pass
- [ ] No critical errors in logs
- [ ] Analytics tracking correctly
- [ ] Mobile functionality verified
- [ ] Security measures confirmed
- [ ] Performance metrics acceptable
- [ ] Documentation updated
- [ ] Team notified of deployment

## Emergency Contacts

- **Supabase Support**: [Your Supabase support contact]
- **Server Admin**: [Your server admin contact]
- **Security Team**: [Your security team contact]
- **Development Team**: [Your development team contact]
