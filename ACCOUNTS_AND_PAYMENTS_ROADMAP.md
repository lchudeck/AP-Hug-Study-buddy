# Student Accounts and Payments Roadmap

## Decisions already made

- Laura's AP Human Geography class is the free founding classroom for the full 2026–27 school year.
- Founding-class students will not see subscription prompts, checkout screens, advertisements, or feature limits.
- The class will test the product throughout the year and help shape what is useful, confusing, or unnecessary.
- The current no-login experience remains available while accounts are designed and approved.
- Accounts and payments will not be added to PR #7. This avoids mixing major infrastructure work with the Unit Mastery improvements.

## Recommended account experience

1. A student selects **Join my class**.
2. The student enters a private class code.
3. The student signs in with an approved school email or an invitation.
4. Study Buddy syncs topic completion, quiz history, missed questions, flashcard progress, and saved Apply responses.
5. The home page shows one simple **Continue where I left off** action.
6. The teacher sees class-level progress and topic patterns without reading students' private draft responses by default.

## Technical direction for the account PR

- Use the supported `@netlify/identity` package. Do not use the deprecated Identity Widget or `gotrue-js`.
- Use invite-only registration for the founding classroom rather than open public signup.
- Keep roles server-controlled: `student`, `teacher`, and `admin`.
- Store only the minimum data needed for progress syncing and class membership.
- Never place payment status, roles, or class access decisions in user-editable profile metadata.
- Continue saving locally when a student is signed out, then offer a clear merge/sync step after sign-in.
- Preserve a no-account route so a student can study without providing personal information.

Before real students create accounts, confirm district requirements for student accounts, school email use, parent notice/consent where applicable, data retention, and approved vendors. The implementation should be tested with non-student accounts first.

## Founding-class access

- Create a permanent founding-class entitlement tied to Laura's teacher account and class code.
- The entitlement lasts through the entire 2026–27 school year and does not require a payment method.
- Students retain access if pricing changes during the beta.
- At the end of the year, export or delete class data according to the district-approved retention decision.

## Payment options to evaluate after the classroom beta

### Recommended starting model

Keep the essential student study experience free. Charge for optional convenience and classroom-management features after the beta demonstrates real value.

| Audience | Free | Possible paid value later |
| --- | --- | --- |
| Individual student | CED learning, core vocabulary, basic practice, basic FRQ help | Advanced analytics, larger adaptive review, additional simulations, optional ad-free/supporter plan |
| Teacher | Small trial class and basic overview | Multiple classes, assignments, progress reports, exports, intervention groups, and teacher-created sets |
| School/district | Evaluation access | Central rostering, administration, reporting, support, and organization-wide licensing |

### Checkout options

- Monthly subscription: easiest entry, but families may dislike another recurring charge.
- Annual individual plan: simpler and aligned with one AP course year.
- Annual teacher plan: likely the cleanest first paid product if the dashboard saves teachers time.
- School license: higher value but requires a longer approval and sales process.
- One-time exam-season pass: useful for late adopters, but could make the product feel focused only on cramming.

The first paid experiment should be an annual teacher plan or optional individual supporter plan. Final pricing should wait until the founding class has used the product long enough to identify which features students and teachers repeatedly value.

## Payment safeguards

- Use a hosted checkout page from a reputable payment provider; do not collect or store card numbers in Study Buddy.
- Keep payment webhooks and entitlements on the server.
- Make renewal timing, cancellation, refunds, and trial terms visible before purchase.
- Never let a failed payment remove the founding classroom's free access.
- Keep account deletion and progress export available independently of subscription status.

## Proposed sequence

1. PR #7: improve Units 3–7, topic progress, saved responses, and case studies.
2. PR #8: account foundation and cross-device progress for a small adult test group.
3. District/privacy review and non-student security testing.
4. Invite the founding classroom and test throughout 2026–27.
5. Build the teacher dashboard from actual classroom needs.
6. Test payment options only after the free classroom beta produces reliable usage evidence.
