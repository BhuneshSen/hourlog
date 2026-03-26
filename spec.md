# HourLog

## Current State
New project. Empty Motoko backend, empty React frontend.

## Requested Changes (Diff)

### Add
- Hourly beep notification system using Web Audio API (plays a beep sound at the top of each hour)
- Schedule window configuration: user sets a start time and end time (e.g., 9am - 6pm), beeps only fire within this window
- Note prompt: when a beep fires, a modal pops up asking "What did you accomplish in the last hour?"
- Notes storage: save notes with timestamp (date + hour) in the backend
- Daily notes view: show all notes for today grouped by hour
- Calendar/date selector to view past days' notes
- Daily summary view: aggregate all notes for a selected day into a readable summary list
- Backend stores all notes with date, hour, and note text
- Web Notifications API integration (request permission, show notification when beep fires)

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Backend: store notes (date string, hour int, noteText string, timestamp int), CRUD for notes, query notes by date
2. Frontend: 
   - App shell with bottom nav (Today, History, Settings)
   - Settings page: set schedule start/end time, stored in localStorage
   - Main "Today" page: shows today's notes grouped by hour, active/current hour highlighted
   - Hourly timer logic: setInterval checks every minute if current time is on the hour and within schedule window, plays beep + shows note modal
   - Note modal: textarea prompt, submit saves note
   - History page: date picker, shows notes for selected date
   - Summary section at bottom of each day view: bullet list of all notes for the day
   - Request notification permission on first load
