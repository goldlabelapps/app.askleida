# Anthropic API Route

This directory contains the API route for handling all Anthropic (Claude) AI-related requests on the server side.

## Overview
- All AI logic and requests to Anthropic are handled server-side in this route.
- There is no direct client-to-Anthropic access; the client communicates with this API route only.

## Usage
- Send POST requests to `/api/anthropic` with the required payload for AI completions or chat.
- The route will handle authentication, request formatting, and response parsing.

## Example Request
```
POST /api/anthropic
Content-Type: application/json

{
  "prompt": "Your question or message here"
}
```

## Security
- API keys and sensitive logic should remain server-side and never be exposed to the client.

## Implementation
- See `route.ts` for the main handler logic.
