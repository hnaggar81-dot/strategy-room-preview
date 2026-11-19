# The Strategy Room — Zero-Cost Validation MVP

Static, dependency-free validation MVP for testing demand for two services:

1. Build a business strategy from scratch.
2. Challenge an existing business plan.

## Run locally

Open `index.html` in a modern browser. For the most reliable local behavior, run any static file server from this directory.

## Zero-cost design

- No paid API calls.
- No backend or database.
- No account required.
- Answers and progress stay in the browser using `localStorage`.
- Funnel events are stored locally and can be exported from the validation dashboard.
- The diagnostic is rules-based and transparent; it does not pretend to be an AI-generated strategy.

## Validation hypothesis

Target executives will start a structured strategy experience, complete enough context to receive a diagnostic, inspect the result, and request access to a deeper service.

## Primary validation funnel

`landing_view → assessment_start → path_selected → assessment_complete → results_viewed → finding_opened → founding_interest`

Open `analytics.html` to inspect events stored in the current browser.

## Public zero-cost validation

The app runs without a backend. For a public round, add free collection endpoints in `config.js` so events and founding-interest submissions can be aggregated centrally. Until those values are configured, nothing leaves the user's browser.

## Privacy

The MVP encourages sample or approximate data. Data is stored only in the current browser and can be erased from the privacy panel.

