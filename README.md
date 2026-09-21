<!-- learn-with-phoebe hub banner -->
> ### 📚 Part of [**Learn with Phoebe**](https://phoebefu6.github.io/learn-with-phoebe/)
> The shelf of free, hands-on courses on AI, data, and the craft around them. **[Browse every course ↗](https://phoebefu6.github.io/learn-with-phoebe/)**
<!-- /learn-with-phoebe hub banner -->

# Learn Data Thinking with Phoebe

Six 45-minute sessions for the knowledge worker who has been asked for numbers. No models, no
p-values, no code, in any session. The job is the thinking that happens before and after the
calculation, which is where most wrong answers actually come from.

**Live site:** https://phoebefu6.github.io/learn-data-thinking-with-phoebe/

| # | Session | Signature thing |
|---|---|---|
| 1 | The question behind the question | Four slots that make a request answerable; the 80% claim taken apart |
| 2 | What you would need to know | Ideal data before real data, because the other order rewrites the question |
| 3 | Look before you model | The first twenty minutes: rows, missing, duplicated, impossible |
| 4 | The four answers bench | One dataset, three questions, four levels of answer each; one reverses |
| 5 | When a count is the answer | Count, rate, comparison, and knowing which rung to stop on |
| 6 | Reading somebody else's analysis | Six questions that find the weak spot; final scorecard |

The bench in session 4 (`assets/dt-live.js`) holds 1,186 constructed customer-weeks, twelve
before a promotion and twelve after, and answers three real business questions at four levels
each: the headline, split by channel, split by customer type, and like-for-like with the
before-period mix held fixed. Every figure is computed in the browser from the rows.

What it finds: conversion is up **+2.9 points** at the headline and still up at every level, so
the cheap answer was the right one. Revenue per order is up **13 pence** at the headline while
email orders fell by **GBP 3.83** and social orders by **GBP 2.97**, and the like-for-like
figure is **minus GBP 3.57**. Both numbers are arithmetically correct; the promotion shifted the
mix toward the higher-value channel, so the blend rose while every part of it fell. The third
question, whether the promotion brought in customers who stay, has **no column that answers it**
at any of the four levels, and saying so is the answer.

The dataset is constructed and labelled as such on the page: it is written so that the three
questions behave differently from each other. The arithmetic is real; the business is not.

Every fact, its verification tier, the two defects caught during verification, and the claims
deliberately left unstated are in `materials/official-course-map.md`.

Static HTML, CSS and JS. No build step. by Phoebe Fu.
