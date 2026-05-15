# Technical Decisions Log

## Event based Analysis

“Everything meaningful emits events.”

“The platform is designed around structured event tracking, allowing anonymised behavioural and operational insights to be collected over time.”

“We’re using an event-driven data model.”

In technical terms, the platform would be built around an “event tracking” system.

Every meaningful action inside the app generates an event which gets logged centrally for later analysis.

For example:

- user signed up
- consultation started
- PDF generated
- recommendation edited
- payment completed
- feature abandoned halfway through
- client returned after 30 days

Each event records useful context such as:

- when it happened
- how long it took
- which feature was used
- anonymised user/account identifiers
- optional metadata related to the action

Over time, this creates a historical timeline of how the platform is actually being used.

The important distinction is:

not literally recording everything blindly, but deliberately attaching events to anything that may become useful for future insight, analytics, optimisation or AI learning.

## Notion for Project Management

Reason: It does Agile brilliantly