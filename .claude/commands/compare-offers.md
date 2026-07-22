# /compare-offers - Job Offer Comparison Tool

You are orchestrating a job offer comparison workflow. The user will provide details about two or more job offers for comparison.

Follow these steps **exactly in order**.

---

## Step 1: Collect Offer Details

For each job offer the user wants to compare, collect the following information:

1. **Company name**
2. **Job title/role**
3. **Base salary**
4. **Bonus structure** (annual bonus %, signing bonus, etc.)
5. **Equity/stock options** (if applicable)
6. **Benefits package**:
   - Health insurance (medical, dental, vision)
   - Retirement plan (401k match, pension, etc.)
   - PTO/vacation days
   - Sick leave
   - Parental leave
   - Other perks (gym, commuter, meal allowance, etc.)
7. **Remote work policy** (remote, hybrid, onsite)
8. **Location** (city, state/country)
9. **Work hours** (expected hours, flexibility)
10. **Start date**
11. **Contract type** (permanent, fixed-term, contractor)
12. **Any other relevant details**

If the user provides offers as documents or URLs, extract the information automatically. If they provide partial information, ask for the missing details.

---

## Step 2: Calculate Total Compensation

For each offer, calculate:

1. **Base salary** (annual)
2. **Total cash compensation** (base + expected bonus + signing bonus amortized over 3 years)
3. **Total compensation value** (cash + estimated equity value + benefits value)

Benefits valuation estimates (adjust based on local market):
- Health insurance: $5,000-15,000/year (depending on coverage)
- Retirement match: Match amount up to cap
- PTO: Daily rate × days
- Other perks: Actual cost if known

---

## Step 3: Side-by-Side Comparison Table

Create a comprehensive comparison table:

| Category | Offer A | Offer B | Notes |
|----------|---------|---------|-------|
| **Company** | | | |
| **Role** | | | |
| **Base Salary** | | | |
| **Annual Bonus** | | | |
| **Signing Bonus** | | | |
| **Equity/Stock** | | | |
| **Total Cash** | | | |
| **Health Insurance** | | | |
| **Retirement Match** | | | |
| **PTO Days** | | | |
| **Remote Policy** | | | |
| **Location** | | | |
| **Work Hours** | | | |
| **Start Date** | | | |
| **Contract Type** | | | |
| **TOTAL COMP** | | | |

---

## Step 4: Qualitative Analysis

Beyond numbers, analyze:

### Career Growth
- Which role offers better advancement potential?
- Which company has stronger brand recognition?
- Which skills will you develop?

### Work-Life Balance
- Remote flexibility
- Expected hours
- PTO policies
- Commute time

### Company Culture
- Glassdoor ratings (if available)
- Recent news or reputation
- Team size and structure

### Risk Assessment
- Company stability (funding, layoffs, market position)
- Role stability
- Contract terms

### Personal Fit
- Alignment with career goals
- Interest in the work
- Location preference
- Team dynamics

---

## Step 5: Recommendation

Provide a clear recommendation based on:

1. **If comp is primary concern:** Recommend highest total comp
2. **If growth is primary concern:** Recommend best career trajectory
3. **If balance is primary concern:** Recommend best work-life fit
4. **If risk-averse:** Recommend most stable option

Include caveats:
- "If you value X, then Offer A is better"
- "If Y is important to you, consider Offer B"

---

## Step 6: Present Output

Format the comparison as:

1. **Executive Summary** (2-3 sentences on top recommendation)
2. **Detailed Comparison Table**
3. **Total Compensation Breakdown**
4. **Qualitative Analysis**
5. **Final Recommendation with Caveats**

Save the comparison to `documents/offer_comparisons/` as a markdown file with timestamp.

---

## Step 7: Follow-up Questions

Ask the user:
- "Do you have any questions about the comparison?"
- "Would you like me to help you negotiate any of these offers?"
- "Should I look into any specific aspect of these companies further?"
