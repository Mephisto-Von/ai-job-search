# /salary-negotiate - Salary Negotiation Scripts

You are orchestrating a salary negotiation workflow. The user wants help negotiating their salary or compensation package.

Follow these steps **exactly in order**.

---

## Step 1: Collect Negotiation Context

Gather the following from the user:

1. **Current situation**:
   - Are you negotiating a new offer?
   - Are you negotiating a raise at your current job?
   - Are you negotiating with a potential employer?

2. **Compensation details**:
   - Current salary (if applicable)
   - Offered salary
   - Your target salary
   - Other compensation elements (bonus, equity, benefits)

3. **Your leverage**:
   - Years of experience
   - Key skills and certifications
   - Competing offers
   - Market demand for your skills
   - Recent achievements

4. **Company context**:
   - Company size and stage (startup, enterprise)
   - Industry norms
   - Budget constraints (if known)

---

## Step 2: Research Market Data

Before negotiating, gather market intelligence:

1. **Salary benchmarking**:
   - Use `salary_lookup.py` if configured
   - Research Glassdoor, Payscale, Levels.fyi
   - Check industry salary surveys

2. **Company research**:
   - Funding stage and financial health
   - Recent news (layoffs, growth, funding rounds)
   - Company policies on compensation

3. **Role-specific data**:
   - Market rate for this role in this location
   - Demand/supply for your skill set
   - Typical compensation range

---

## Step 3: Negotiation Strategy

### Determine Your Approach

| Situation | Strategy | Tone |
|-----------|----------|------|
| New offer (no competing offers) | Collaborative, focus on mutual value | Warm, professional |
| New offer (with competing offers) | Confident, leverage options | Direct, factual |
| Raise request (current job) | Achievement-based, ROI focused | Appreciative, ambitious |
| Counter-offer | Data-driven, specific asks | Professional, firm |

### Key Principles

1. **Always negotiate** — Most offers have room for negotiation
2. **Be specific** — "I'm targeting $X" not "I want more"
3. **Justify with data** — Market rates, your skills, achievements
4. **Consider total compensation** — Not just base salary
5. **Get it in writing** — Verbal promises mean nothing

---

## Step 4: Create Negotiation Scripts

### Scenario A: New Offer Negotiation

**Email Script:**

```
Subject: Re: [Role] Offer Discussion

Dear [Hiring Manager],

Thank you for the offer for the [Role] position at [Company]. I'm very excited about the opportunity to join the team and contribute to [specific project or goal].

After reviewing the offer and considering my experience in [relevant skills] and the market rate for this role in [location], I'd like to discuss the base salary.

Based on my research and the value I'll bring to the team, I'm targeting a base salary of $[target] rather than the offered $[offered]. This aligns with the market rate for [role] with [X] years of experience in [location].

I'm confident this reflects the impact I'll make on [specific project/team goal], and I'm excited to bring my skills in [key skills] to [Company].

Looking forward to your thoughts.

Best regards,
[Your Name]
```

### Scenario B: Raise Request (Current Job)

**Meeting Script:**

```
Opening:
"I appreciate the opportunity to discuss my compensation. I've been with [Company] for [X years/months] and I'm proud of what we've accomplished together."

Achievements:
"Over the past [period], I've:
- [Achievement 1 with metrics]
- [Achievement 2 with metrics]
- [Achievement 3 with metrics]

Market Research:
"Based on my research, the market rate for [role] with my experience in [location] is $[range]. Currently, I'm at $[current], which is [below/at] the market rate."

Ask:
"Given my contributions and the market data, I'd like to request an adjustment to $[target]. This reflects my value to the team and keeps us competitive in attracting talent."

Close:
"I'm committed to [Company]'s success and look forward to continuing to contribute. What are your thoughts on this?"
```

### Scenario C: Counter-Offer Response

**Email Script:**

```
Subject: Re: Offer for [Role] Position

Dear [Hiring Manager],

Thank you for extending the offer for the [Role] position. I'm genuinely excited about the opportunity to join [Company] and contribute to [specific goal].

After careful consideration, I'd like to propose the following adjustments to the compensation package:

1. Base Salary: $[counter] (vs. offered $[offered])
   - Justification: Market rate for this role with my experience is $[range]

2. Signing Bonus: $[amount] (if not offered or to increase)
   - Justification: Helps bridge the transition from current role

3. Equity/Stock: [Additional shares/options] (if applicable)
   - Justification: Aligns with my long-term commitment to [Company]

4. Additional PTO: [X days] (if important to you)
   - Justification: Important for work-life balance

5. Remote Work: [Flexible/remote arrangement] (if applicable)
   - Justification: Proven productivity in remote settings

I believe these adjustments reflect the value I'll bring and are in line with market standards. I'm very excited about this opportunity and confident we can find a package that works for both of us.

Best regards,
[Your Name]
```

---

## Step 5: Negotiation Tactics

### DO:
- ✅ Express enthusiasm for the role
- ✅ Use silence strategically (pause after your ask)
- ✅ Focus on facts and data
- ✅ Negotiate total compensation (not just salary)
- ✅ Get everything in writing
- ✅ Have a BATNA (Best Alternative to Negotiated Agreement)

### DON'T:
- ❌ Apologize for negotiating
- ❌ Make ultimatums (unless you have a real alternative)
- ❌ Lie about competing offers
- ❌ Negotiate via text/chat (use email or phone)
- ❌ Accept immediately (take 24-48 hours to consider)
- ❌ Focus on personal needs ("I need more because...")

---

## Step 6: Practice Responses

Prepare for common pushback:

**"This is our best offer."**
→ "I understand. Can you help me understand how this number was determined? I'd like to understand the components better."

**"We don't negotiate."**
→ "I appreciate that. Can we discuss other aspects of the package like equity, bonus, or additional PTO?"

**"We're a startup, we can't match enterprise salaries."**
→ "I understand the constraints. Can we discuss equity acceleration, a signing bonus, or a performance review at 6 months?"

**"You're already above market."**
→ "I appreciate that perspective. Can you share the data you're using? I've found [specific source] shows $[range] for this role."

---

## Step 7: Present Output

Format the output as:

### Negotiation Strategy
[Recommended approach based on situation]

### Scripts
[Customized email/meeting scripts]

### Key Talking Points
- [Point 1]
- [Point 2]
- [Point 3]

### Potential Objections & Responses
[Common pushback and how to handle it]

### Next Steps
1. [When to send/make the ask]
2. [How to follow up]
3. [Timeline for response]

---

## Step 8: Additional Assistance

Ask the user:
- "Would you like me to help you practice the negotiation conversation?"
- "Should I research specific salary data for this role?"
- "Would you like me to help you prepare a negotiation email?"
