---
title: Event Data
description: The platform is built around event tracking
order: 120
slug: /about/event-data
icon: about
tags: Event Data, insight, analytics, optimisation, AI learning,
---

> [CleverText text="Every meaningful action inside the app generates an event which gets logged centrally for later analysis."]

The platform is being designed with structured event tracking from the beginning so that, over time, it builds a valuable anonymised dataset around how beauty professionals work, how clients engage, and which treatments, recommendations and workflows are most effective.

That data can later be used to power:

- smarter AI features
- industry insights
- business benchmarking
- workflow optimisation
- trend analysis
- future premium products and reporting

In modern SaaS businesses, the long-term strategic value often comes not just from the software itself, but from the unique behavioural and operational data the platform accumulates over years of real-world usage.

Every time something like these things happen

- user signed up
- consultation started
- PDF generated
- recommendation edited
- payment completed
- feature abandoned halfway through
- client returned after 30 days

We log a bit of data like this

```json
{
  "event": "pdf.generated",
  "timestamp": "2026-05-15T18:42:11Z",
  "userId": "usr_48291",
  "organisationId": "org_102",
  "sessionId": "sess_a81f9c",
  "source": "web_app",
  "metadata": {
    "documentType": "aftercare_plan",
    "templateVersion": "v2",
    "generationTimeMs": 1840,
    "aiAssisted": true
  }
}
```

Each event records useful context such as:

- when it happened
- how long it took
- which feature was used
- anonymised user/account identifiers
- optional metadata related to the action

Over time, this creates a historical timeline of how the platform is actually being used.

The important distinction is not literally recording everything blindly, but deliberately attaching events to anything that may become useful for future insight, analytics, optimisation or AI learning.