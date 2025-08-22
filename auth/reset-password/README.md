# ImaginPaws Password Reset Flow

A production-ready, framework-free password reset flow for ImaginPaws that handles Supabase authentication tokens and provides a seamless user experience across desktop and mobile browsers.

## Features

- ✅ Validates Supabase recovery tokens from email links
- ✅ Establishes temporary sessions securely
- ✅ Password strength validation with configurable requirements
- ✅ Mobile-responsive design with Tailwind CSS
- ✅ Accessibility compliant (WCAG 2.1 AA)
- ✅ Safe analytics tracking (no PII logged)
- ✅ Custom app scheme support (`imaginpaws://open`)
- ✅ Fallback handling for app opening
- ✅ Error handling and user feedback
- ✅ Security best practices

## File Structure

```
/auth/reset-password/
├── index.html          # Main HTML structure
├── reset-password.js   # Core logic and Supabase integration
├── utils.js           # Helper functions and utilities
├── mixpanel.js        # Safe analytics wrapper
├── styles.css         # Minimal custom styles
└── README.md          # This file
```

## Configuration

### Required Environment Variables

The Supabase configuration has been set up with your project credentials in the inline script in `index.html`:

```javascript
window.SUPABASE_CONFIG = {
    url: 'https://njfqprtaznrhvuydsayo.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

### Optional Analytics

To enable Mixpanel tracking, update in `mixpanel.js`:

```javascript
const MIXPANEL_TOKEN = 'your-mixpanel-token';
```

## URL Formats Supported

The flow handles these Supabase email link formats:

1. **Code-based recovery** (most common):
   ```
   https://imaginpaws.com/auth/reset-password?code=...&type=recovery
   ```

2. **Token-based recovery**:
   ```
   https://imaginpaws.com/auth/reset-password#access_token=...&refresh_token=...&type=recovery
   ```

## User Flow

1. **Loading State**: Shows "Verifying your link..." while processing
2. **URL Parsing**: Extracts and validates recovery tokens
3. **Session Establishment**: Creates temporary Supabase session
4. **Password Form**: User sets new password with validation
5. **Success State**: Confirms password update and offers app opening
6. **Invalid State**: Shows error and resend form if tokens are invalid

## Security Features

- **Token Scrubbing**: Removes sensitive tokens from URL after session establishment
- **No PII Logging**: Analytics wrapper prevents logging of sensitive data
- **Input Validation**: Client-side password strength validation
- **Error Handling**: Graceful error handling without exposing sensitive information
- **HTTPS Enforcement**: All assets and redirects use HTTPS

## Password Requirements

Configurable in `utils.js`:

- Minimum 8 characters
- At least 1 letter and 1 number
- Confirmation must match
- Real-time validation feedback

## Accessibility

- **Screen Reader Support**: Proper ARIA labels and announcements
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Automatic focus handling between states
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user motion preferences

## Mobile Support

- **Responsive Design**: Works on all screen sizes
- **Touch-Friendly**: Proper touch targets and spacing
- **iOS Zoom Prevention**: Prevents unwanted zoom on input focus
- **App Integration**: Custom scheme support with fallback

## Analytics Events

Safe tracking events (no sensitive data):

- `password_reset_page_viewed`
- `password_reset_link_valid`
- `password_reset_link_invalid`
- `password_reset_success`
- `password_reset_error`
- `password_reset_email_sent`
- `password_reset_open_app_clicked`

## Deployment

1. **Build CSS**: Run `npm run build` to generate Tailwind CSS
2. **Upload Files**: Deploy all files to your web server
3. **Configure Supabase**: Update environment variables
4. **Test Flow**: Verify with test recovery links

## Testing

### Manual Testing Checklist

- [ ] Valid recovery link with code parameter
- [ ] Valid recovery link with token parameters
- [ ] Invalid/expired link handling
- [ ] Password validation (strength, confirmation)
- [ ] Error handling and user feedback
- [ ] Mobile responsiveness
- [ ] App opening functionality
- [ ] Analytics tracking (if enabled)

### Test URLs

```bash
# Valid code-based recovery
https://imaginpaws.com/auth/reset-password?code=test-code&type=recovery

# Valid token-based recovery
https://imaginpaws.com/auth/reset-password#access_token=test-token&refresh_token=test-refresh&type=recovery

# Invalid link
https://imaginpaws.com/auth/reset-password
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Buildless**: No build step required
- **ESM Modules**: Modern JavaScript modules with CDN imports
- **Minimal Dependencies**: Only Supabase SDK (ESM from CDN) and optional Mixpanel
- **Optimized Assets**: Compressed CSS and efficient loading

## Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - Check network connectivity
   - Ensure CORS is configured correctly

2. **Token Validation Failures**
   - Verify token format and expiration
   - Check Supabase project settings
   - Ensure redirect URLs are configured

3. **App Opening Issues**
   - Verify custom scheme is registered
   - Test fallback redirect timing
   - Check mobile browser restrictions

### Debug Mode

Enable debug logging by setting:

```javascript
window.DEBUG_MODE = true;
```

## Contributing

1. Follow existing code style and patterns
2. Add appropriate error handling
3. Test on multiple devices and browsers
4. Ensure accessibility compliance
5. Update documentation as needed

## License

This code is part of the ImaginPaws project and follows the same licensing terms.
