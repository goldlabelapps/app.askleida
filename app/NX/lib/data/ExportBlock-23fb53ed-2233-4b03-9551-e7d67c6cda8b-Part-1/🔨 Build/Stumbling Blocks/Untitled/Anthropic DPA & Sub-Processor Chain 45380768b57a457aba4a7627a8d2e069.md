# Anthropic DPA & Sub-Processor Chain

Existential Risk: Client skin data and concerns passed raw to the Claude API may constitute special category data. This creates a GDPR sub-processor obligation and potential data breach risk if not handled correctly.
Mitigation Required: Review Anthropic's Data Processing Agreement for special category data provisions. Architect prompts to minimise or anonymise identifiable data before it reaches the API — pass concern taxonomy and product selections, not client names or identifiers. Chris to review what data is included in API calls and strip accordingly.
Owner: Chris
Priority: High
Status: Not started