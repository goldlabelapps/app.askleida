## Recommendations

Recommendations is the core workflow of Leida.

It is where a therapist:

1. Selects a client.
2. Adds clinical context and custom notes.
3. Generates personalised recommendation copy.
4. Reviews and exports a client-ready PDF.

The goal is to compress a process that usually takes 30-60 minutes into a guided flow that can be completed in under 2 minutes.

## Product Intent

Leida is built for solo skin therapists who need high-quality, personalised homecare recommendations without losing evenings to admin.

This module should produce output that feels handcrafted for each client:

1. Specific to that client profile and concerns.
2. Written in the practitioner's own tone.
3. Structured for easy client follow-through.
4. Beautifully formatted for sending as PDF.

## Current UX Flow

The Recommendations screen is a staged workflow:

1. Select client
2. Add therapist context and custom tips
3. Generate AI content
4. Review and export PDF

### Current data inputs

1. Client record from the clients slice.
2. Concern tags from client data.
3. Freeform therapist context.
4. Freeform custom tips.

### Current outputs

1. Generated recommendation text draft.
2. PDF export trigger (currently placeholder alert).

## Routing and Entry Points

Recommendations can be opened in two ways:

1. Direct route navigation to /recommendations.
2. From client detail via Create Recommendation, passing clientId in query params.

When clientId is present, the Recommendations screen preselects that client.

## Implementation Notes

The current implementation intentionally includes placeholders while the backend generation and PDF pipeline are integrated.

### Placeholder behavior (current)

1. Generate uses local mock generation logic.
2. Export PDF uses window alert.

### Production behavior (target)

1. Generate calls API endpoint(s) for AI content creation.
2. Export creates a real branded PDF and returns a downloadable/shareable asset.
3. Recommendation metadata is persisted for audit/history.

## Suggested API Contract (Target)

### Generate recommendation

POST /api/recommendations/generate

Request body (example):

```json
{
	"client_id": "uuid",
	"practitioner_id": "uuid",
	"therapist_context": "Client has wedding in 6 weeks",
	"tips": "Keep tone warm and reassuring",
	"voice": {
		"tone": "professional, warm",
		"brand": "clinic-default"
	}
}
```

Response body (example):

```json
{
	"id": "rec_uuid",
	"draft": "...generated content...",
	"sections": [
		{ "title": "AM Routine", "content": "..." },
		{ "title": "PM Routine", "content": "..." }
	]
}
```

### Export PDF

POST /api/recommendations/export

Request body (example):

```json
{
	"recommendation_id": "rec_uuid",
	"format": "pdf"
}
```

Response body (example):

```json
{
	"file_url": "https://...",
	"expires_at": "2026-09-01T12:00:00Z"
}
```

## Quality Bar for Generated Output

Every recommendation should:

1. Mention client-specific concerns naturally.
2. Include clear AM and PM routines.
3. Balance clinical accuracy with human tone.
4. Give practical advice for flare-ups and exceptions.
5. Be easy for a client to scan and follow.

## Security and Data Handling

Recommendations involve sensitive client data. Minimum expectations:

1. Auth required on all recommendation endpoints.
2. Practitioner-level access checks for client ownership.
3. No PII in logs by default.
4. Time-limited links for exported PDFs.
5. Explicit retention policy for generated documents.

## Roadmap

1. Replace mock generator with AI endpoint integration.
2. Add section templates and tone presets.
3. Add editable branding (logo, colors, footer).
4. Persist recommendation history per client.
5. Ship one-click share flows (email/WhatsApp-friendly links).

## Success Metric

North-star outcome for this module:

1. A solo therapist can produce a high-quality, personalised recommendation PDF between appointments, in under 2 minutes, without compromising care quality.
 