# learn-data-thinking-with-phoebe · source map

Research for a 6-session tier-1 on-ramp course on the work before any model or test: turning a
vague question into an answerable one, knowing what data you'd need, looking before modelling,
knowing when a count/chart is the right answer, and reading someone else's analysis critically.
Research date: 2026-09-21. by Phoebe Fu

---

## How this was verified

Every PDF was pulled with `curl` (Safari user-agent) and read with PyMuPDF (`fitz`), then
grepped directly for the numbers used below -  not summarised. Every HTML page was pulled raw
with `curl` and stripped of markup with a Python regex script before reading, except where noted
as WebFetch (flagged explicitly, and cross-checked against a raw pull wherever the claim mattered).

**One WebFetch/raw-fetch cross-check was run specifically as a summariser-trap test on the DARPA
Heilmeier Catechism page.** WebFetch returned all eight questions verbatim; the raw HTML was then
pulled independently with `curl` and grepped line-by-line. Both matched exactly, word for word,
including the smart-quote on `"exams"` in question 8. No fabrication found this pass on that
claim, but the double-check is recorded because the brief for this estate has twice caught a
summariser inventing a fully-formed statistic (a fake PIM number, a fake "spacing doubles
recall" claim) on other course builds -  the check is now routine, not proof this run is clean of
the failure mode elsewhere.

**Paywall/bot-gate failures, logged rather than worked around:** `science.org` (403 on every
attempt -  the Bickel/Hammel/O'Connell 1975 primary paper was never read directly), the PMC "view
PDF" endpoint for both the Charig 1986 full text and the Julious & Mullee 1994 letter (both sit
behind a JS proof-of-work challenge that a plain `curl` cannot solve -  only the PMC *abstract*
pages were reachable, not the full-text PDFs), `visit.crowdflower.com` (503 on five separate
attempts, spaced out, different referrers -  the original CrowdFlower 2016 PDF itself was never
read; the numbers below come from the CrowdFlower press release as quoted verbatim in a KDnuggets
repost, and from a third party who had already dug through the original survey pages), Forbes
(403), `s2.smu.edu`'s SAS SEMMA PDF mirror (403).

---

## Verified facts, by tier

Tier A = read the primary source's own text (raw HTML/PDF, or an abstract genuinely authored by
the paper's own authors, e.g. a PMC-hosted abstract page). Tier B = a reliable secondary citing
the primary; primary itself unreached or only partially reached. Tier C = search-snippet
corroboration only.

### Simpson's paradox -  the Berkeley 1973 case (session 4 spine)

| Fact | Tier | Source |
|---|---|---|
| Bickel, P. J., Hammel, E. A., O'Connell, J. W. (1975). "Sex Bias in Graduate Admissions: Data from Berkeley." *Science*, 187(4175), 398-404. | B | Citation confirmed via PubMed and Science.org's own DOI-resolving metadata (`10.1126/science.187.4175.398`); the paper body itself returned HTTP 403 on every fetch attempt and was **not read directly**. |
| **Aggregate, fall 1973, all ~101 departments: 12,763 total applicants, 41% admitted overall. Men: 8,442 applicants, 44% admitted. Women: 4,321 applicants, 35% admitted.** The gap was large enough that it was "unlikely to be due to chance." | B | Three independent secondaries reproduce this exact table and agree to the digit: Wikipedia's "Simpson's paradox" article (raw HTML, citing Bickel et al. directly), Alex Reinhart's `refsmmat.com` post (a statistics-textbook author, quoting a WSJ interview with Peter Bickel himself), and UIUC's Data Science Discovery dataset page (which hosts the raw 12,763-row dataset derived from the same study). Not independently confirmed against the Science.org body text (403). |
| **The six-largest-departments breakdown** (this is the actual disaggregation the paper is famous for): Dept A -  933 applicants, 64% admitted overall (men 825/62%, women 108/82%); Dept B -  585, 63% (men 560/63%, women 25/68%); Dept C -  918, 35% (men 325/37%, women 593/34%); Dept D -  792, 34% (men 417/33%, women 375/35%); Dept E -  584, 25% (men 191/28%, women 393/24%); Dept F -  714, 6% (men 373/6%, women 341/7%). Six-department total: 4,526 applicants, 39% admitted (men 2,691/45%, women 1,835/30%). | B | Same three sources; Wikipedia reproduces the table with per-cell counts, refsmmat corroborates the department pattern in prose, UIUC's raw CSV (12,763 rows, columns Year/Major/Gender/Admission, majors anonymized A-F + Other) is the underlying microdata the aggregate and department tables are computed from. |
| **What the authors actually concluded, precisely:** four of 85 departments were significantly biased against women; six were significantly biased against men. Women disproportionately applied to the more competitive, lower-admission-rate departments (e.g. humanities/English) while men disproportionately applied to less competitive, higher-admission-rate departments (e.g. engineering). "The pooled and corrected data showed a 'small but statistically significant bias **in favor of** women.'" **The count of biased departments was explicitly not the basis for this conclusion** -  the conclusion rested on pooling admission rates across departments while weighting by each department's own rejection rate. | B | Wikipedia, quoting the paper's own conclusion in quotation marks, citing Bickel et al. directly; corroborated by refsmmat's independent retelling of the same mechanism. |
| **Correction of the popular version: there was no lawsuit.** The oft-repeated framing ("Berkeley was sued for gender bias") is a documented academic urban legend. A Wall Street Journal interview with Peter Bickel himself makes clear Berkeley's graduate division *feared* being sued and asked Bickel to investigate -  no suit was ever filed. Reinhart traces the myth through at least six textbooks/papers (including *Math on Trial*, a psych-methods paper in *Psychological Methods* 2009, and a 2012 *Journal of Physics A* paper) and notes a Wikipedia editor had already removed the lawsuit claim from the Simpson's-paradox article for lack of a source. | B | `refsmmat.com` (Alex Reinhart, author of the stats textbook *Statistics Done Wrong*), a dedicated post specifically investigating and debunking this claim, citing the WSJ interview and listing the specific books/papers that repeat the myth. **This is the exact kind of pop-science-vs-actual-paper gap the brief asked to check for, and it is real** -  the course should state "feared a lawsuit, was never sued" rather than "was sued." |
| A clean general statement of what Simpson's paradox *is*: "a phenomenon in probability and statistics in which a trend appears in several groups of data but disappears or reverses when the groups are combined." First described by Edward H. Simpson in a 1951 technical paper; similar effects noted earlier by Karl Pearson (1899) and Udny Yule (1903); the name "Simpson's paradox" was coined by Colin R. Blyth in 1972. Also called Simpson's reversal, the Yule-Simpson effect, or the amalgamation paradox. | B | Wikipedia "Simpson's paradox," raw HTML, opening definition + attribution chain. The Simpson (1951), Pearson (1899), Yule (1903) and Blyth (1972) primary papers were **not independently read this pass** -  attribution is Wikipedia's own, not re-verified against those four originals. |

### Simpson's paradox -  the kidney-stone case (Charig et al. 1986)

| Fact | Tier | Source |
|---|---|---|
| Charig, C. R., Webb, D. R., Payne, S. R., Wickham, J. E. (1986). "Comparison of treatment of renal calculi by open surgery, percutaneous nephrolithotomy, and extracorporeal shockwave lithotripsy." *British Medical Journal (Clinical Research Ed.)*, 292(6524), 879-882. | A | PMC1339981 abstract page, `pmc.ncbi.nlm.nih.gov`, PMID 3083922 -  the abstract text itself was read directly (raw HTML, grepped). The full-text PDF sits behind a JS proof-of-work challenge and was **not reached**. |
| **Aggregate result, all 1,052 patients, as stated in the authors' own abstract:** 350 underwent open surgery, 350 percutaneous nephrolithotomy (PCNL), 328 extracorporeal shockwave lithotripsy (ESWL), 24 both PCNL and ESWL. Success (stone eliminated or reduced to <2mm at 3 months): open surgery **273/350 = 78%**; PCNL **289/350 = 83%**; ESWL **301/328 = 92%**; both PCNL+ESWL **15/24 = 62%**. Costs to the NHS (their own estimates): open surgery £3,500; PCNL £1,861; ESWL £1,789; both £3,210. | A | Same PMC1339981 abstract, verbatim numbers extracted from raw HTML. |
| **The stratified (Simpson's-paradox) table, open surgery vs. PCNL only, by stone size:** small stones -  open surgery 81/87 = **93.1%** vs. PCNL 234/270 = **86.7%**; large stones -  open surgery 192/263 = **73.0%** vs. PCNL 55/80 = **68.8%**. Open surgery wins in *both* strata. Combined (ignoring size): open surgery 273/350 = **78%** vs. PCNL 289/350 = **83%** -  PCNL wins in the aggregate. This is the reversal. | B | This exact stratified table is **not in the Charig abstract** (the abstract only gives the four-arm aggregate above) -  it comes from Julious, S. A. & Mullee, M. A. (1994), "Confounding and Simpson's paradox," *BMJ* 309(6967), 1480-1481, a letter that re-analysed Charig's own published data to make the confounding point explicit. The Julious & Mullee full text is also behind the PMC proof-of-work gate (PMCID PMC2541623, confirmed to exist and to cite Charig 1986 directly, but body text not reached). The numbers above are corroborated **identically** across three independent tellings that all attribute them to Julious & Mullee 1994: a university statistics textbook (`bookdown.org/pkaldunn/Book`, "Scientific Research and Methodology," ch. 14, full worked table with row/column percentages), Wikipedia's "Simpson's paradox" article (raw HTML, same four cell counts, same aggregate), and cross-checked against the Charig abstract's own combined totals (273/350 and 289/350 match exactly). Given three-way agreement and an exact match to the one number Charig's own abstract does give (the 78%/83% combined figures), this is graded Tier B with high confidence rather than Tier C, but it is **not** a page read from Julious & Mullee's own text. |
| The confounding mechanism, stated plainly: doctors preferentially used open surgery (the objectively better treatment at every stone size) on the harder large-stone cases, and used PCNL more on the easier small-stone cases. Stone size drove the success rate more than treatment choice did, so the treatment used more often on easy cases (PCNL) looks better in the aggregate purely because of *which patients* got it. | B | Wikipedia, explanatory paragraph following the table (not itself a numeric claim, so not elevated above Tier B). |

### Process models for analysis work

| Fact | Tier | Source |
|---|---|---|
| **CRISP-DM's six phases, verbatim and in order: Business Understanding, Data Understanding, Data Preparation, Modeling, Evaluation, Deployment.** "The life cycle of a data mining project consists of six phases... The sequence of the phases is not rigid. Moving back and forth between different phases is always required." | A | `CRISP-DM 1.0: Step-by-step data mining guide` -  the original consortium document itself, PDF text extracted directly with PyMuPDF and grepped (fetched from a University of Kassel course mirror; matches the near-identical IBM SPSS Modeler documentation PDF fetched in parallel). |
| **Authorship, date, origin:** authored by Pete Chapman (NCR), Julian Clinton (SPSS), Randy Kerber (NCR), Thomas Khabaza (SPSS), Thomas Reinartz (DaimlerChrysler), Colin Shearer (SPSS), Rüdiger Wirth (DaimlerChrysler). "CRISP-DM was conceived in late 1996 by three 'veterans' of the young and immature data mining market" (DaimlerChrysler/then-Daimler-Benz, SPSS/then-ISL, NCR). Formed into a consortium the following year; joined by a Dutch financial-services sector partner, OHRA. EC-funded phase produced a first version by mid-1999; this 1.0 document is dated **August 2000**. Copyright line reads "Copyright © 1999, 2000." | A | Same PDF, foreword section, read directly. |
| One-line phase definitions, verbatim: Business Understanding -  "focuses on understanding the project objectives and requirements from a business perspective, then converting this knowledge into a data mining problem definition." Data Understanding -  "starts with an initial data collection and proceeds with activities in order to get familiar with the data, to identify data quality problems, to discover first insights... or to detect interesting subsets to form hypotheses." Data Preparation -  "covers all activities to construct the final dataset... from the initial raw data." Modeling -  "various modeling techniques are selected and applied and their parameters are calibrated to optimal values." Evaluation -  "more thoroughly evaluate the model and review the steps executed... to determine if there is some important business issue that has not been sufficiently considered." Deployment -  can be "as simple as generating a report or as complex as implementing a repeatable data mining process across the enterprise." | A | Same PDF, section II, read directly. |
| **Is CRISP-DM still the most-used process model? The evidence is real but thin and dated, and both available "surveys" are self-selected blog-reader polls, not scientific samples.** KDnuggets ran a reader poll in 2007 and again in October 2014 ("What main methodology are you using for your analytics, data mining, or data science projects?"); the 2014 poll had **200 total votes**, of which CRISP-DM got 86 (**43%**, vs. 42% in 2007), "My own" 27.5%, SEMMA 8.5%, KDD Process 7.5%. A second, more recent reader poll run by the blog `datascience-pm.com` (last updated Nov 18, 2024) had **109 respondents**, of whom "nearly half" -  the site's own headline figure is **49%** -  most commonly used CRISP-DM, ahead of Scrum, Kanban and "My Own." | A/B | The 2014 KDnuggets poll numbers (200 votes, 86 CRISP-DM, all comparison percentages) are Tier A -  raw HTML of the poll results page itself, read directly. The 2024 datascience-pm.com figure is Tier B -  raw HTML read directly, but it is the blog's own self-reported poll of its own (self-selected) reader base, sample size and methodology not otherwise disclosed. |
| **A stronger, academic-literature-level corroboration exists, though it measures something narrower:** a 2022 systematic literature review (open access, PeerJ Computer Science, PMCID PMC9044260, PMID 35494858) of 68 primary studies on "current approaches for executing big data science projects" found that "the findings regarding workflow approaches consist mainly of adaptations to CRISP-DM (vs entirely new proposed methodologies)." This is evidence that CRISP-DM remains the dominant reference point **in the published academic literature on data-science workflow**, which is a different and more defensible claim than "most practitioners use it," which rests only on the two self-selected polls above. | A | PMC9044260, full text read directly (raw HTML, abstract and introduction sections). |
| **TDSP** (Microsoft's Team Data Science Process): five stages -  Business Understanding, Data Acquisition and Understanding, Modeling, Deployment, Customer Acceptance. Documented on GitHub (`Azure/Microsoft-TDSP`), doc dated 2016-09-22 in its own metadata. Notably, TDSP's own Business Understanding phase explicitly recommends asking a "sharp question" and links out to a practitioner blog post on how to do that (see question-formulation section below) -  a direct, citable link between a named process model and the "ask a good question first" material this course needs. | A | Raw markdown, `raw.githubusercontent.com/Azure/Microsoft-TDSP/master/Docs/lifecycle-detail.md`, read directly. |
| **SEMMA** (SAS): five phases -  Sample, Explore, Modify, Model, Assess. Developed by SAS Institute as "a logical organization of the functional tool set of" SAS Enterprise Miner, not originally pitched as a general-purpose methodology (SAS's own stated framing, per Wikipedia's paraphrase). | B | Wikipedia "SEMMA," raw HTML, read directly. The SAS Institute's own SEMMA documentation PDF returned HTTP 403 and was not read. |
| **OSEMN**: Obtain, Scrub, Explore, Model, iNterpret. Originated in a 2010 post, "A Taxonomy of Data Science," by Hilary Mason and Chris Wiggins, on a now-defunct site. | B | `planspace.org` blog post (2015) naming the 2010 Mason/Wiggins post directly; the original 2010 post itself is defunct and was not located/read this pass. |

### The "80% of time cleaning data" claim -  traced to its origin

**Bottom line: the number is real as a self-report survey statistic, but it is soft, inconsistent
year to year, conflates two different tasks (cleaning vs. collecting), and every later citation
of "80%" is copying an earlier citation rather than re-measuring anything. No source in this
literature is a measurement of actual time use -  all of them are self-report surveys or ad hoc
interview estimates.**

| Fact | Tier | Source |
|---|---|---|
| **The citation chain, traced backwards, is exactly the copy-without-checking pattern the brief predicted:** an IBM data-science product marketing page cites a 2018 *Harvard Business Review* blog post, which cites a 2017 IBM blog post, which cites the 2016 CrowdFlower survey -  four links deep, no one re-measuring, each just re-citing the last. | B | Leigh Dodds ("Lost Boy" blog, Jan 2020), a named practitioner (CTO at EnergySparks, ex-Director of Delivery at the UK's Open Data Institute) who did the actual archaeology -  followed each citation, named the specific pages in the chain, and linked them. Read directly (raw HTML). |
| **What CrowdFlower's own surveys actually said, year by year (not "80%" in any single year):** 2015 -  "66.7% said cleaning and organizing data is one of their most time-consuming tasks" (no time-percentage estimate given). 2016 -  "cleaning and organizing data: 60%, collecting data sets: 19%" as answers to "what do data scientists spend the most time doing"; **80% only appears if you add these two different tasks together**, which is not how the survey itself framed the number. 2017 (rebranded Figure Eight) -  "51% [answered] collecting, labeling, cleaning and organizing data" as a single combined activity. Figure Eight 2018 -  did not ask this question. Figure Eight 2019 -  "nearly three quarters of technical respondents (73.5%) spend 25% or more of their time managing, cleaning, and/or labeling data" -  a *different metric entirely* (proportion of respondents spending ≥25% of time, not "80% of time spent"). | B | Same Dodds post, which itself quotes each year's CrowdFlower/Figure Eight report page by page; independently corroborated for the 2016 figure by a KDnuggets repost of CrowdFlower's own press release ("60% said they spent the most time cleaning and organizing data"), read directly (raw HTML). The original CrowdFlower 2016 PDF itself returned HTTP 503 on five separate fetch attempts and was **never read directly** -  both corroborating sources are secondaries quoting/reposting the same primary release text. |
| **Kaggle's independent survey series gives much lower numbers:** Kaggle 2017 did not ask this question. Kaggle 2018: "~11% Gathering data, 15% Cleaning data" out of total project time -  roughly **26% combined**, well under half of "80%." | B | Same Dodds post, quoting the Kaggle 2018 survey results directly. Kaggle source itself not independently re-fetched this pass. |
| **The oldest and vaguest version of the claim is not survey-based at all:** an August 2014 *New York Times* article states data scientists "spend from 50 percent to 80 percent of their time" on data collection/preparation, sourced to "interviews and expert estimates" -  explicitly not a named survey. A 2015 bizreport.com article separately claims "between 50% and 90%" of business-intelligence workers' time goes to data prep, again without linking to an underlying study. | C | Both claims are reported only inside Dodds's post (which itself flags them as unlinked/unsourced); neither the NYT article nor the bizreport article was independently located and read this pass. **Flagged Tier C accordingly -  do not upgrade.** |
| **No source anywhere in this chain is a measurement of actual time use** (time-tracking, diary study, or observation). Every number is either a self-report survey question ("what do you spend the most time on") or an unlinked expert estimate. This absence -  not any single percentage -  is what the course should teach. | B | Synthesis of the above; the absence itself is corroborated by Dodds's own explicit search for "an ongoing survey" measuring this, which turned up only the self-report instruments listed above. |

### Question formulation -  what is real here

| Fact | Tier | Source |
|---|---|---|
| **The Heilmeier Catechism, verbatim, all eight questions:** "1. What are you trying to do? Articulate your objectives using absolutely no jargon. 2. How is it done today, and what are the limits of current practice? 3. What is new in your approach and why do you think it will be successful? 4. Who cares? If you are successful, what difference will it make? 5. What are the risks? 6. How much will it cost? 7. How long will it take? 8. What are the mid-term and final 'exams' to check for success?" Created by George H. Heilmeier, who directed DARPA 1975-1977; DARPA states it still uses this catechism "to assess and think through every proposed research program." | A | `darpa.mil/about/heilmeier-catechism`, raw HTML fetched with `curl` and grepped line-by-line (not just WebFetch -  the WebFetch summary was independently cross-checked against this raw pull and matched word for word, including the smart-quoted "exams"). |
| **"Ask a sharp question"** -  a named, citable practitioner heuristic for question formulation, directly and explicitly linked from Microsoft's own TDSP documentation (see above). Author Brandon Rohrer (then a Senior Data Scientist at Microsoft), in "How to do Data Science": "Data science is the process of using names and numbers to answer a question. The more precisely you ask your question the better chance you have of finding an answer... Examples of poor questions are 'What can my data tell me about my business?', 'What should I do?' or 'How can I increase my profits?' These leave wiggle room for useless answers. In contrast, clear answers to questions like 'How many Model Q Gizmos will I sell in Montreal during the third quarter?' or 'Which car in my fleet is going to fail first?' are impossible to avoid." He also names the resulting quantity your "target" and ties the whole exercise directly back to whether your data actually contains an example of that target -  a direct, practitioner-level link from "ask a sharp question" to "know what data you'd need," which is exactly the seam this course sits on. | A | `learn.microsoft.com` (originally a 2016 Microsoft TechNet blog post, now hosted on Microsoft Learn), raw HTML fetched and grepped directly. |
| **This is genuinely practitioner-level material, not research-level, and that gap should be stated plainly.** No peer-reviewed study of question-formulation practice in analytics, no measured rework rate from asking the wrong question, and no controlled comparison of "sharp question" training vs. not, was located in this pass. A general "start with a question, not the data" framing recurs across data-journalism practitioner writing (e.g. journalism-training sites describing story-first vs. data-first workflows) and in Max Shron's practitioner book *Thinking with Data* (a framework of Context → Needs → Vision → Outcome for scoping an analysis before touching data) -  but neither of these was independently fetched and read this pass; they are named here as leads, not verified facts. | C | Search-snippet level only for the data-journalism framing and for Shron's book; **do not state specifics from either without a further read.** |
| **No measured rework rate for "analysts answering the wrong question" was located.** This was searched for directly and returned nothing beyond anecdote and consultant-blog assertion (no disclosed sample, no method). | -  | UNVERIFIED -  see list below. |

### Numbers for session 4's bench

| Fact | Tier | Source |
|---|---|---|
| **No published figure on how often naive aggregate comparisons reverse under stratification in real-world business data was located.** Academic work on the *mathematical* frequency of Simpson's-paradox-shaped reversals exists but answers a different question than "how often does this happen in typical business reporting": a proof (Hadjicostas) puts the chance of the reversal in a *uniformly random* 2×2×2 contingency table at exactly 1/60; a Dirichlet-prior simulation approach gives ~4.29% for random binary tables; a study by Kock on path models with two predictors gives ~12.8%; and a 2023-era data-mining paper on "redundant" Simpson's paradoxes in four public benchmark datasets (Adult, Mushroom, Loan, Diabetes) reports that, of the paradoxes their algorithm *did* find in those datasets, 20-48% were "redundant" (explainable by a simpler sub-relationship). **None of this is a base rate for "how often would a business analyst's naive aggregate comparison be wrong."** These are answers to a different, narrower, more mathematical question and should not be repurposed as if they were. | C | Search-snippet summary only, citing a Stanford Encyclopedia of Philosophy entry, an AAAI paper (Xu, "Detecting Simpson's Paradox"), and an arXiv paper on redundant-paradox detection; none of the three underlying papers was independently fetched and read this pass. **Do not state any of these percentages as "how often this happens in real analysis" -  they answer a different, technical question.** |
| **Conclusion for the bench design:** the Berkeley and kidney-stone cases above are the real-world anchors -  precise, well-documented, and now double- and triple-corroborated. The bench's own constructed dataset, and its "one question flips, one is unanswerable" design, has **no published base-rate to be compared against** and must be labelled as a built teaching example, the same way the PKM course labelled its 48-note corpus as constructed rather than sampled. | -  | Synthesis; consistent with the "no controlled study of X" finding pattern already established twice in this course estate (PKM course, ML Epistemology course -  see MEMORY.md). |

---

## The evidence stated honestly, both halves

- **Simpson's paradox itself is completely real and unusually well-documented for a stats teaching
  example** -  two independent, real, published cases (Berkeley 1975, Charig 1986), each with
  numbers now confirmed across 3+ independent sources. **But** the popular retelling of both
  cases over-simplifies: Berkeley was never sued (it feared being sued), and the kidney-stone
  paradox's *stratified* table comes from a follow-up letter (Julious & Mullee 1994)
  re-analysing Charig's data, not from Charig's own abstract, which only reports the aggregate.
  A course page citing "the kidney stone study" should credit both papers, not just Charig 1986.
- **CRISP-DM's six phases and 1999-2000 origin are rock-solid** (read from the primary document
  itself). **But** "still the most-used methodology" rests on two self-selected blog-reader
  polls (200 and 109 respondents) twelve and two years apart respectively, not a probability
  sample of practitioners. The stronger claim the evidence actually supports is narrower:
  CRISP-DM dominates the *published academic literature* on data-science workflow adaptations
  (PMC9044260), which is not the same as "most working analysts use it."
- **The 80% cleaning-data claim is real in the sense that surveys exist and some of them do
  approach that number** -  but only by adding two different tasks together (2016 CrowdFlower:
  60% cleaning + 19% collecting), and every other year of the same survey series, plus a
  completely independent survey series (Kaggle), gives noticeably lower numbers (51%, 26%).
  No source in the whole citation chain is an actual time-use measurement.
- **The Heilmeier Catechism and the "sharp question" heuristic are genuinely practitioner-grade
  and well-sourced (DARPA's own page; Microsoft's own docs, cross-linked to a specific author).**
  But there is no research-level literature behind "asking a good question improves analysis
  outcomes" beyond these two practitioner artifacts -  the seam this course sits on (formulating
  a question) is real practice with no controlled-study backing, and the course should say so
  the same way the PKM course said so about PARA.

---

## What is contested

- **The Berkeley "lawsuit" framing** -  actively wrong, not just simplified, per Reinhart's
  documented myth-tracing (WSJ interview with Bickel directly denies a suit was filed).
- **Whether CRISP-DM is "the" standard or merely "a" standard among several actively-used
  alternatives** -  the two reader polls both show a large "My Own" / custom-methodology
  segment (27.5% in 2014) alongside CRISP-DM, meaning even inside the weak self-selected-poll
  evidence, CRISP-DM is a plurality leader, not anything close to universal practice.
- **Whether "80%" means anything as a single number** -  CrowdFlower's own year-to-year answers
  to essentially the same question move between 51% and "80% only if you add two tasks," which
  is itself evidence the number is not measuring a stable quantity.

---

## Claims deliberately NOT stated (UNVERIFIED)

- Any measured rework rate for analysts who answered the wrong question, or any controlled
  study of question-formulation training improving analysis outcomes -  searched for directly,
  nothing beyond consultant-blog assertion found.
- Any base rate for "how often does a naive aggregate comparison reverse under stratification"
  in ordinary business/analytics data -  the academic figures that exist (1/60 for random 2×2×2
  tables, ~4.29% under a Dirichlet prior, ~12.8% for two-predictor path models, 20-48%
  "redundant paradoxes" in four ML benchmark datasets) answer a different, more technical
  question and must not be quoted as if they estimated this course's actual teaching claim.
- Max Shron's *Thinking with Data* framework details, and the data-journalism "question-first"
  practitioner literature beyond the one Al Jazeera Media Institute / general journalism-training
  search snippets -  named as leads only, not independently fetched and read this pass.
- The original 2010 Hilary Mason / Chris Wiggins OSEMN post -  the site is defunct; only a 2015
  third-party post naming it was reached.
- The Simpson (1951), Pearson (1899), Yule (1903) and Blyth (1972) primary papers behind the
  "who coined this and when" attribution chain -  taken from Wikipedia's own citations, not
  independently re-verified against those four originals.
- The full text of Charig et al. 1986 and Julious & Mullee 1994 -  both sit behind a PMC
  proof-of-work JS gate that a plain `curl` cannot pass; only their abstracts/metadata pages
  and third-party retellings of their tables were reached.
- The original CrowdFlower 2016 "State of Data Science" PDF -  503 on five attempts; the 60%/19%
  figures rest on two independent parties (Leigh Dodds, KDnuggets) quoting the same press
  release text, not on the report itself.
- Any claim that a controlled or measured study exists showing PARA/CRISP-DM/any named process
  model improves analysis quality or speed -  not searched for exhaustively in this pass, but
  nothing of the kind surfaced incidentally either, consistent with the pattern already
  documented twice elsewhere in this course estate (PKM, ML Epistemology).

---

## Fetched-sources appendix

| URL / file | Gave |
|---|---|
| `pmc.ncbi.nlm.nih.gov/articles/PMC1339981/` (raw HTML) | Charig et al. 1986 abstract in full: four-arm success rates (78%/83%/92%/62%), sample sizes, cost figures -  all Tier A |
| `en.wikipedia.org/wiki/Simpson%27s_paradox` (raw HTML) | Berkeley aggregate + 6-department table, kidney-stone stratified table, general Simpson's-paradox definition and attribution history |
| `refsmmat.com/posts/2016-05-08-simpsons-paradox-berkeley.html` (raw HTML) | The "no lawsuit" correction, WSJ-Bickel quote, list of books/papers repeating the myth |
| `discovery.cs.illinois.edu/dataset/berkeley/` (raw HTML) | Confirms the 12,763-row Berkeley microdata's structure (Year/Major/Gender/Admission) and its provenance from Bickel et al. 1975 |
| `bookdown.org/pkaldunn/Book/PercentagesKStones.html` (raw HTML) | Full worked kidney-stone stratified table with row/column percentages, citing Julious & Mullee 1994 |
| `kde.cs.uni-kassel.de/.../CRISPWP-0800.pdf` + `public.dhe.ibm.com/.../CRISP-DM.pdf` (PDF text via PyMuPDF) | CRISP-DM 1.0 full document: six phase names/definitions, consortium history, 1996-2000 timeline, authorship |
| `raw.githubusercontent.com/Azure/Microsoft-TDSP/master/Docs/lifecycle-detail.md` (raw markdown) | TDSP's 5 phases, 2016 doc metadata, the "sharp question" cross-link |
| `en.wikipedia.org/wiki/SEMMA` (raw HTML) | SEMMA's 5 phases, SAS's own framing of it as tool-organization rather than general methodology |
| `planspace.org/20150220-data_science_isnt_magic/osemn/` (raw HTML) | OSEMN acronym expansion, attribution to Mason & Wiggins 2010 |
| `kdnuggets.com/polls/2014/analytics-data-mining-data-science-methodology.html` (raw HTML) | 2014 poll's exact vote counts and percentages (200 votes, CRISP-DM 86/43%) vs. 2007 |
| `datascience-pm.com/crisp-dm-still-most-popular/` (raw HTML) | 2024-dated poll, 109 respondents, "nearly half"/49% headline figure, methodology list |
| `ncbi.nlm.nih.gov/pmc/articles/PMC9044260/` (raw HTML) | 2022 systematic literature review (PeerJ Computer Science), 68 studies, CRISP-DM-adaptation finding |
| `blog.ldodds.com/2020/01/31/do-data-scientists-spend-80-of-their-time-cleaning-data-turns-out-no/` (raw HTML) | The full citation-chain trace and year-by-year CrowdFlower/Figure Eight/Kaggle figures |
| `kdnuggets.com/2016/04/crowdflower-2016-data-science-repost.html` (raw HTML) | CrowdFlower's own press-release text, verbatim, corroborating the 60% figure |
| `darpa.mil/about/heilmeier-catechism` (raw HTML, cross-checked against a separate WebFetch pull) | All 8 Heilmeier Catechism questions verbatim, Heilmeier's 1975-77 DARPA tenure |
| `learn.microsoft.com` "How to do Data Science" (raw HTML, Brandon Rohrer) | The "sharp question" concept, verbatim quotes, the "target" concept linking question to data requirement |

## Unfetchable on this pass

- `science.org/doi/10.1126/science.187.4175.398` -  403 on every attempt (both `curl` and
  WebFetch). The Bickel/Hammel/O'Connell 1975 primary text itself was never read; every number
  above is via secondaries that cite it.
- `pmc.ncbi.nlm.nih.gov/articles/PMC1339981/pdf/...` and the PMC2541623 (Julious & Mullee 1994)
  full-text PDF -  both gated behind a client-side JS proof-of-work challenge (`cloudpmc-viewer`)
  that a plain `curl` request cannot solve. Abstract/metadata pages were reachable; full text
  was not.
- `visit.crowdflower.com/rs/416-ZBE-142/images/CrowdFlower_DataScienceReport_2016.pdf` -  HTTP 503
  on five separate attempts across the session, with delays and a changed referrer header in
  between. The original report itself was never read.
- `forbes.com/sites/gilpress/...` (the Forbes writeup of the 2016 CrowdFlower survey named in
  the brief) -  403 on the only attempt.
- `s2.smu.edu/.../SAS%20_%20SEMMA.pdf` (a university-hosted mirror of SAS's own SEMMA
  documentation) -  403.
- `www2.cs.uh.edu/~ceick/UDM/CFDS16.pdf` (a university mirror that appeared in search results as
  a possible CrowdFlower 2016 PDF alternative) -  downloaded (200, 284KB) but PyMuPDF reports 0
  pages of extractable text; not usable as a source and not pursued further given the two
  working corroborations (Dodds, KDnuggets) already in hand.


---

## Sessions

| # | Title | Signature thing |
|---|---|---|
| 1 | The question behind the question | What makes a request answerable; the 80% claim taken apart |
| 2 | What you would need to know | Ideal data before real data; the gap list |
| 3 | Look before you model | The first twenty minutes; rows, missing, duplicated, impossible |
| 4 | **The four answers bench** | **One dataset, three questions, four levels; one reverses** |
| 5 | When a count is the answer | Count, rate, comparison, and knowing when to stop |
| 6 | Reading somebody else's analysis | The questions that find the weak spot; final scorecard |

---

## The bench (`assets/dt-live.js`)

One constructed dataset of 1,186 customer-weeks (12 weeks before an autumn promotion, 12 after),
three business questions, four levels of answer each. Every figure is computed from the rows: a
real filter, a real group-by, a real weighted average.

### The four levels

| Level | What it does | What it holds fixed |
|---|---|---|
| 1 Headline | one number for everybody, before against after | nothing |
| 2 Split by channel | the same comparison inside email and social | channel |
| 3 Split by customer type | the same comparison inside new and returning | customer type |
| 4 Like-for-like | the after period reweighted to the before period's channel mix | the mix |

### Verified ladder

Derived headlessly (Playwright) on 2026-09-21 via `window.DT_LIVE`, before any page quoted a
number.

| Question | Headline | Each channel | Each type | Like-for-like | Outcome |
|---|---|---|---|---|---|
| Did conversion rise? | **+2.9 pts** | +2.0, +3.5 | +1.6, +4.5 | **+2.5 pts** | Headline held |
| Did revenue per order rise? | **+GBP 0.13** | **-3.83, -2.97** | -0.82, +0.59 | **-GBP 3.57** | **Headline reversed** |
| Did it bring in customers who stay? | no column | no column | no column | no column | Not answerable |

Three rows, three different kinds of outcome, and nothing in the headline tells you which one you
have. Two details carry the teaching:

- **The reversal is a mix effect.** Revenue per order fell inside both channels, but the promotion
  moved the channel mix from roughly 30% social to roughly 60%, and social orders are worth more.
  The blend rose on composition while every part of it fell.
- **The first split does not always find it.** Splitting by customer type gives -0.82 and +0.59,
  which reads as noise and would have reassured the analyst. Only the channel split reveals the
  fall. This is why level 3 exists in the ladder at all.

### Honest limits

- **The dataset is constructed**, written so the three questions behave differently. It is not
  sampled from a real business, and no claim is made about how often reversals occur in practice
  because no published base rate was found (see UNVERIFIED above). The real-world anchor is
  Berkeley 1973, quoted with its own tier.
- **Which mix to hold fixed is a judgement**, not an output. The bench holds the channel mix
  because the promotion targeted channels; a different choice gives a different level-4 number.
- **Four levels is where a careful person starts, not where the subject stops.** Confidence
  intervals, formal tests and causal designs live in `learn-statistics-with-phoebe` and
  `learn-experimentation-with-phoebe`.
- The verdict line is a heuristic and is badged as one on the widget.

---

## Design system

| Token | Value | Role |
|---|---|---|
| `--indigo` | `#3F5D45` | Moss accent, page chrome |
| `--indigo-deep` | `#2A4030` | Headings, agenda band 1 (white text, 11.20:1) |
| `--indigo-mid` | `#5A7D62` | Agenda band 2 (white text, 4.62:1) |
| `--indigo-soft` | `#C3D6C7` | Agenda band 4 (ink text, 9.74:1) |
| `--clay` | `#B0562C` | Clay flagship: measured badges, agenda band 3 (white text, 4.98:1) |
| `--clay-ink` | `#7C3A1C` | Clay text on paper (8.23:1) |
| `--ink` | `#1F2A22` | Body text (14.45:1 on paper) |
| `--paper` | `#FBFCFA` | Surface |

Recomputed from the `learn-pkm` donor on scaffold day and contrast-checked before the first page.
Body line-height 1.85. Attribution "by Phoebe Fu". Hyphens only. `?v=` bumped on every css/js change.

---

## Scope boundaries (decided before the first page was written)

| Question | Owning course |
|---|---|
| Training a model, metrics, overfitting, scikit-learn | `learn-intro-ml-with-phoebe` (live, d2) |
| Distributions, sampling, confidence intervals, hypothesis tests | `learn-statistics-with-phoebe` (live, d2) |
| Breiman's two cultures, Tukey as philosophy, frequentist vs Bayesian | `learn-two-cultures-with-phoebe` (planned, d3) |
| Which chart, and is the chart honest | `learn-dataviz-with-phoebe` (live) |
| Designing and running an A/B test | `learn-experimentation-with-phoebe` (live) |
| Writing the SQL to pull the rows | `learn-sql-with-phoebe` (live) |
| **Turning a request into an answerable question, and checking a number before quoting it** | **here** |

This is the `ds` bucket's d1 on-ramp: 18 live courses above it and, until now, no tier-1 door.
It touches no model and no hypothesis test.


---

## Build record

Built 2026-09-21. Six sessions, landing page, one computed bench.

**Verification actually run before publish**

| Check | Result |
|---|---|
| `gate.sh` (Playwright geometry + static checks) | 6 pages, 15 figures, 0 defects, PASSED |
| Quiz engine, all 6 pages | 3/3 clears on every page, correct answer indices honoured |
| Console and page errors, all 6 pages plus landing | zero |
| SVG text outside its own viewBox | zero on all 15 figures |
| Bench driven headlessly through all three questions | conv holds, value reverses, stay reports no column; 1,186 rows |
| Painted bench figures against the derived ladder | identical to the digit |
| Passport key and journey array | `lwp-passport:data-thinking`, six correct filenames |
| Prev/next chain and landing links | complete and correct across all six |
| Internal `materials/` paths on audience pages | zero |
| Em and en dashes in session pages | zero |
| Self-referential "this course" text | zero (5 removed from session 6, 1 from the bench hint) |

**Two defects found and fixed during verification**

1. Session 4's callout promised a published case "in part 2" and part 2 had none. The Berkeley
   1973 card was written into part 2, carrying the no-lawsuit correction and its Tier B label.
2. Session 6 summarised session 4's reversal as "both channels fell by three to four pounds".
   The real figures are GBP 3.83 and GBP 2.97, and 2.97 is not in that range. Replaced with the
   exact figures as session 4 states them.

**Session 6 sourcing note**

Session 6 restates findings that are sourced in the sessions they came from, and adds no new
factual claims of its own beyond the two already recorded above: the 80% citation chain and the
Berkeley lawsuit correction. Its "covered" block labels the Berkeley figures as secondary tier
because the 1975 paper would not load on any attempt during this build.
