# /interview-scheduler - Interview Schedule Management

You are orchestrating an interview scheduling workflow. The user wants to track and manage their interview schedules.

Follow these steps **exactly in order**.

---

## Step 1: Collect Interview Information

Gather the following from the user:

1. **New interview to add**:
   - Company name
   - Role/title
   - Interview date and time
   - Interview type (phone screen, technical, behavioral, final)
   - Interviewers (if known)
   - Location (office, video call link)
   - Preparation materials needed

2. **Existing interviews to view**:
   - All upcoming interviews
   - Past interviews
   - Interviews by company

---

## Step 2: Interview Data Structure

### Interview Record

```yaml
id: unique-id
company: Company Name
role: Job Title
stage: phone-screen | technical | behavioral | final | offer
date: YYYY-MM-DD
time: HH:MM
timezone: UTC+X
duration: minutes
type: video | phone | onsite | coding
location: office address or video link
interviewers:
  - name: John Smith
    title: Engineering Manager
    linkedin: linkedin.com/in/johnsmith
preparation:
  - Review company research
  - Practice coding problems
  - Prepare STAR stories
status: scheduled | completed | cancelled | rescheduled
notes: ""
```

---

## Step 3: Interview Tracker

### Create/Update Interview Tracker

Read existing tracker from `documents/interview_tracker.md` or create new:

```markdown
# Interview Tracker

## Upcoming Interviews

| Date | Time | Company | Role | Stage | Type | Link/Location |
|------|------|---------|------|-------|------|---------------|
| 2024-01-15 | 10:00 | TechCorp | Senior Engineer | Technical | Video | zoom.us/j/123 |
| 2024-01-17 | 14:00 | StartupXYZ | Lead Developer | Final | Onsite | 123 Main St |

## Completed Interviews

| Date | Company | Role | Stage | Outcome | Notes |
|------|---------|------|-------|---------|-------|
| 2024-01-10 | BigCo | Software Engineer | Phone Screen | Passed | Good cultural fit |

## Interview Pipeline

| Company | Role | Applied | Screen | Technical | Final | Offer |
|---------|------|---------|--------|-----------|-------|-------|
| TechCorp | Senior Engineer | ✓ | ✓ | - | - | - |
| StartupXYZ | Lead Developer | ✓ | ✓ | ✓ | ✓ | - |
```

---

## Step 4: Calendar Integration

### Generate Calendar Entry

For each interview, generate:

**Google Calendar Format:**
```
Event: [Company] - [Role] Interview ([Stage])
Date: [Date]
Time: [Time] - [End Time]
Location: [Video link or office address]
Description:
- Company: [Company]
- Role: [Role]
- Stage: [Stage]
- Interviewers: [Names]
- Preparation: [Key items]
- Your Notes: [Any notes]
```

**ICS File Content:**
```ics
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20240115T100000Z
DTEND:20240115T110000Z
SUMMARY:TechCorp - Senior Engineer Interview (Technical)
DESCRIPTION:Company: TechCorp\nRole: Senior Engineer\nStage: Technical\nInterviewers: John Smith\nPreparation: Review system design concepts
LOCATION:zoom.us/j/123
END:VEVENT
END:VCALENDAR
```

---

## Step 5: Interview Preparation Checklist

### For Each Interview Stage

**Phone Screen:**
- [ ] Review job description
- [ ] Prepare elevator pitch
- [ ] Research company basics
- [ ] Prepare 3 questions to ask
- [ ] Test phone/connection
- [ ] Have resume ready

**Technical Interview:**
- [ ] Review relevant algorithms
- [ ] Practice coding problems
- [ ] Review system design concepts
- [ ] Prepare to discuss past projects
- [ ] Set up coding environment
- [ ] Have water and snacks ready

**Behavioral Interview:**
- [ ] Prepare STAR stories (5-7)
- [ ] Research company values
- [ ] Prepare examples for common questions
- [ ] Practice with mock interview
- [ ] Review job requirements

**Final Interview:**
- [ ] Deep dive on company strategy
- [ ] Prepare thoughtful questions
- [ ] Review all previous interviews
- [ ] Prepare salary expectations
- [ ] Research interviewers on LinkedIn

---

## Step 6: Interview Day Checklist

### Morning Of
- [ ] Confirm interview time and location
- [ ] Review company research
- [ ] Review your resume and cover letter
- [ ] Prepare questions to ask
- [ ] Test technology (video/audio)
- [ ] Have water ready
- [ ] Find quiet space (if remote)
- [ ] Arrive 10 minutes early (if onsite)

### Right Before
- [ ] Use restroom
- [ ] Take deep breaths
- [ ] Review key talking points
- [ ] Have STAR examples ready
- [ ] Prepare to take notes

### During Interview
- [ ] Take notes on questions asked
- [ ] Note interviewer names and titles
- [ ] Ask about next steps
- [ ] Get contact information
- [ ] Take notes on your performance

---

## Step 7: Post-Interview Tasks

### Immediately After
- [ ] Send thank you email within 24 hours
- [ ] Update interview tracker with outcome
- [ ] Note any follow-up items
- [ ] Record questions you were asked
- [ ] Note areas for improvement

### Thank You Email Template

```
Subject: Thank you - [Role] Interview

Dear [Interviewer Name],

Thank you for taking the time to speak with me today about the [Role] position at [Company]. I really enjoyed learning about [specific topic discussed].

Our conversation reinforced my interest in this opportunity, particularly [specific aspect of role/company]. I'm excited about the possibility of contributing to [specific project or goal].

I look forward to hearing about next steps. Please don't hesitate to reach out if you need any additional information.

Best regards,
[Your Name]
```

---

## Step 8: Present Output

Format the output as:

### Interview Schedule
[Table of all upcoming interviews]

### Today's Interviews
[Details for today's interviews]

### This Week's Prep
[Preparation tasks for the week]

### Calendar Entries
[Ready to add to calendar]

### Follow-up Tasks
[Pending thank you emails, etc.]

---

## Step 9: Additional Assistance

Ask the user:
- "Would you like me to add a specific interview to your tracker?"
- "Should I help you prepare for an upcoming interview?"
- "Would you like me to generate calendar entries for your interviews?"
- "Should I help you draft thank you emails?"
