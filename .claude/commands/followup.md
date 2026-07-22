# /followup - Email Follow-up Drafting

You are orchestrating an email follow-up workflow. The user will provide context about an application or interview they want to follow up on.

Follow these steps **exactly in order**.

---

## Step 1: Collect Context

Gather the following information from the user:

1. **Company name**
2. **Role/title applied for**
3. **Contact person** (if known - recruiter, hiring manager, etc.)
4. **Follow-up type**:
   - Application follow-up (after applying, no response)
   - Interview follow-up (after interview, waiting for decision)
   - Thank you note (after interview)
   - Status check (checking on application status)
5. **Timeline**:
   - When did you apply/interview?
   - How long has it been since last communication?
6. **Any specific points to mention** (optional)

If the user provides information from tracked applications (via `/outcome`), use that context automatically.

---

## Step 2: Read Writing Style

Read the candidate's writing style from:
- `.claude/skills/job-application-assistant/03-writing-style.md`

This ensures the follow-up matches the candidate's natural voice and tone.

---

## Step 3: Determine Follow-up Timing

Evaluate if the follow-up is appropriate:

| Situation | Wait Time | Status |
|-----------|-----------|--------|
| After application, no response | 7-10 business days | ✅ Appropriate |
| After first interview | 5-7 business days | ✅ Appropriate |
| After final interview | 3-5 business days | ✅ Appropriate |
| After offer received | 2-3 business days | ✅ Appropriate |
| Same week as application | Too soon | ❌ Wait longer |
| After rejection | N/A | ⚠️ Use different approach |

---

## Step 4: Draft the Follow-up Email

### Email Structure

**Subject Line:**
- Application follow-up: [Role] at [Company]
- Following up on [Role] application
- Thank you - [Role] interview

**Opening:**
- Professional greeting
- Reference to specific interaction/application

**Body:**
- Reiterate interest in the role
- Briefly mention key qualifications or discussion points
- Include any new relevant information (if applicable)
- Express enthusiasm for next steps

**Closing:**
- Professional sign-off
- Contact information
- Call to action (optional)

### Tone Guidelines

- **Professional but warm** - not overly formal or casual
- **Concise** - respect their time (150-250 words max)
- **Specific** - reference actual discussions or job requirements
- **Confident but not pushy** - show interest without desperation
- **Personalized** - avoid generic templates

---

## Step 5: Create Multiple Versions

Provide 2-3 versions:

1. **Version A: Professional & Direct**
   - Standard business tone
   - Focus on facts and qualifications

2. **Version B: Warm & Relationship-Focused**
   - Slightly more personal
   - References specific conversations or connections

3. **Version C: Brief & Action-Oriented**
   - Very concise
   - Gets straight to the point

---

## Step 6: Personalization Checklist

Before presenting, verify:

- [ ] Company name is correct
- [ ] Role title is correct
- [ ] Contact person name is spelled correctly (if used)
- [ ] Timeline is accurate
- [ ] Specific discussion points are mentioned
- [ ] Tone matches candidate's writing style
- [ ] No grammar or spelling errors
- [ ] Subject line is clear and professional

---

## Step 7: Present Output

Format the output as:

### Recommended Version

**Subject:** [Subject line]

**Email Body:**

[Full email text]

---

### Alternative Versions

**Version 2:**
[Alternative text]

**Version 3:**
[Alternative text]

---

### Sending Notes

- Best time to send: [recommendation based on day/time]
- Follow-up if no response: [timeline recommendation]
- CC/BCC considerations: [if applicable]

---

## Step 8: Additional Assistance

Ask the user:
- "Would you like me to adjust the tone or content?"
- "Should I add or remove any specific points?"
- "Would you like me to help you track this follow-up in the application tracker?"
