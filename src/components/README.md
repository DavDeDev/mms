# Component Documentation

This document provides an overview of all components in the Mentorship Management System.

## Common Components

### Button
A versatile button component with multiple variants, sizes, and states.
- Supports icons, loading state, and full-width display
- Variants: primary, secondary, outline, danger
- Sizes: sm, md, lg

### Card
A container component for displaying content with consistent styling.
- Supports header with icon
- Optional action button
- Customizable content area

### Input
A form input component with built-in label and error handling.
- Supports labels, error messages, and helper text
- Consistent styling with focus states
- Type-safe props

### LoadingSpinner
An animated loading indicator component.
- Customizable size and color
- Used in loading states throughout the application

### Modal
A modal dialog component for displaying content in an overlay.
- Handles click outside to close
- Supports custom header and footer
- Multiple size options

### Select
A dropdown selection component with consistent styling.
- Supports labels and error messages
- Type-safe options
- Customizable styling

### StatusBadge
A component for displaying session status with appropriate colors.
- Visual indicators for different states
- Consistent styling across the application

## Dashboard Components

### AvailabilityCalendar
Displays a weekly calendar view with availability indicators.
- Shows available time slots
- Supports date selection
- Visual indicators for selected date

### QuickActionCard
A card component for displaying actionable items in the dashboard.
- Icon with title and description
- Click handler for actions
- Consistent styling

### SessionCard
Displays session information with relevant actions.
- Shows session details and status
- Dynamic action buttons based on session state
- Support for confirming sessions and viewing threads

### StatCard
Displays statistics with an icon and optional action.
- Shows numerical values with labels
- Support for action buttons
- Consistent styling across dashboard

### TimeSlotCard
Displays a single availability time slot with management actions.
- Shows time range
- Edit and delete actions
- Clean, minimal design

### TimeSlotForm
Form component for adding or editing availability time slots.
- Time input fields with validation
- Submit and cancel actions
- Clean form layout

### WelcomeHeader
Displays a personalized welcome message with session statistics.
- Different content for mentors and mentees
- Shows relevant session counts
- Gradient background design

## Page Components

### AuthPage
Authentication page component with sign-in and sign-up forms.
- Handles user authentication
- Form validation
- Error handling

### Dashboard
Main dashboard component with role-specific views.
- Different layouts for mentors and mentees
- Session management
- Availability management

### LandingPage
Public landing page component.
- Marketing content
- Call-to-action buttons
- Feature showcase

### Layout
Main layout component with navigation and user menu.
- Consistent header
- Navigation links
- User actions

## Feature Components

### MentorSchedule
Component for managing mentor availability and scheduling.
- Calendar view
- Time slot management
- Session scheduling

### Progress
Displays mentee progress with timeline view.
- Progress updates
- Resource completion tracking
- Message history

### Resources
Manages session resources and materials.
- Resource upload/linking
- Completion tracking
- File management

### SessionThread
Real-time chat and collaboration component.
- Message thread
- Resource sharing
- Progress tracking