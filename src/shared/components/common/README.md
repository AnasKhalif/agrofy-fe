# Standby Mode Component

## Overview
The `StandbyMode` component provides a full-screen standby/screensaver functionality for authenticated users. It automatically activates when a user is idle for a specified period (default: 1 minute) and shows a branded full-screen image.

## Features
- ✅ Only activates for authenticated users
- ✅ Configurable timeout (default: 1 minute)
- ✅ Multiple background image options
- ✅ App branding with logo
- ✅ Responsive design
- ✅ Error handling for missing images
- ✅ Customizable wake-up callbacks

## Usage

### Basic Usage
```tsx
import StandbyMode from '@/shared/components/common/StandbyMode';

// In your layout component
<StandbyMode />
```

### Advanced Usage
```tsx
<StandbyMode 
  timeout={30000} // 30 seconds
  backgroundImage="WELCOME_2" // Use predefined image
  logo="NEX_HEALTHCARE" // Use predefined logo
  showBranding={true}
  onWake={() => {
    console.log('User became active');
    // Add any wake-up logic here
  }}
/>
```

### Custom Images
```tsx
<StandbyMode 
  backgroundImage="/path/to/custom/image.jpg"
  logo="/path/to/custom/logo.png"
/>
```

## Configuration

The component uses the centralized configuration from `@/app/constants/standby`:

- **Timeout**: Default 1 minute (60000ms)
- **Background Images**: Predefined options (WELCOME, WELCOME_2, LOGIN, PROFILE, WEATHER)
- **Logos**: Predefined options (RSIA_MELINDA, NEX_HEALTHCARE)
- **Activity Events**: Mouse, keyboard, touch, and scroll events

## Integration

The component is integrated into `HealthcareLayout` and will automatically:
1. Check if user is authenticated
2. Start monitoring user activity
3. Show standby screen after 1 minute of inactivity
4. Hide standby screen on any user interaction

## Customization

### Changing the Timeout
```tsx
// In HealthcareLayout.tsx
<StandbyMode timeout={120000} /> // 2 minutes
```

### Using Different Background Images
```tsx
// Use predefined images
<StandbyMode backgroundImage="WELCOME_2" />

// Use custom image
<StandbyMode backgroundImage="/custom/path/image.jpg" />
```

### Disabling Branding
```tsx
<StandbyMode showBranding={false} />
```

## Technical Details

- **Z-index**: 9999 (highest priority)
- **Position**: Fixed, full-screen overlay
- **Event Listeners**: Automatically cleaned up on unmount
- **Error Handling**: Graceful fallbacks for missing images
- **Performance**: Minimal impact, only active for authenticated users
