# Doodle Chat App

A responsive chat interface for the Doodle frontend challenge. Built with Next.js and TypeScript, it fetches and sends messages against the provided Chat API.

## Running locally

The backend (from the [Chat API repo](https://github.com/DoodleScheduling/frontend-challenge-chat-api)) must be running first — it serves on port 3000.

```bash
# 1. Start the backend (in the API repo, with Docker)
docker compose up

# 2. Install and configure the frontend
npm install
cp .env.example .env.local        # then set NEXT_PUBLIC_CURRENT_USER to your name

# 3. Run the frontend on a different port (3000 is taken by the API)
npm run dev -- -p 3001
```

Open http://localhost:3001.

## Testing

```bash
npm test              # watch mode
npm run test:coverage # coverage report
```

19 unit tests cover the API service, date/entity utilities, and the message components.

## Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend base URL (default `http://localhost:3000`) |
| `NEXT_PUBLIC_AUTH_TOKEN` | Bearer token for the API |
| `NEXT_PUBLIC_CURRENT_USER` | The name your sent messages appear under |

## Architecture

Everything chat-related lives under one feature folder, split by responsibility:

```text
src/
├── app/                      # Next.js entry (layout, page, query provider)
├── config/constants.ts       # Env vars and tunables in one place
├── lib/apiClient.ts          # Axios instance — base URL + auth header
└── features/chat/
    ├── types/                # Message and payload interfaces
    ├── services/             # API calls (no React)
    ├── hooks/                # useMessages (query + polling), useSendMessage (mutation + optimistic)
    ├── utils/                # Date formatting, HTML-entity decoding
    └── components/           # UI only
```
The point of this split is that the UI never knows *how* messages arrive. Components consume hooks; hooks call services; services own the transport. Swapping the data layer (see below) touches one file, not the components.

## Decisions & trade-offs

**TanStack Query for the data layer.** Rather than hand-roll fetching, polling, caching, and optimistic updates, the app uses TanStack Query. `useMessages` is a `useQuery` with `refetchInterval` for polling; `useSendMessage` is a `useMutation` with the standard optimistic pattern (`onMutate` writes to the cache, `onError` rolls back from a snapshot, `onSettled` invalidates to resync). This removes a class of bugs — deduplication, cache consistency, and rollback are handled by a well-tested library instead of custom code, and the components stay unaware of how data is fetched.

**Polling for updates.** The provided API is REST-only, so updates come from polling every 5s. This is isolated in the query config, see the scaling note for what production would use instead. Because polling is declared via `refetchInterval`, swapping to a push-based transport later means changing the hook, not the components.

**Optimistic sending.** Sent messages appear instantly via the cache, then reconcile against the server on the next fetch. On failure the cache rolls back to its prior snapshot and an error is shown, so the UI stays responsive without hiding failures. Rollback is snapshot-based, so identical messages sent in quick succession are handled correctly.

**HTML entity decoding.** Some seed data is stored encoded (e.g. `It&#39;s`). A small util decodes it at render time so messages read correctly.

**Design.** Colours are sampled directly from the provided design assets rather than eyeballed; spacing (640px max bubble width, 16px padding, 24px edge margin) comes from the annotated spec images. Layout uses `100dvh` so the input bar stays put on mobile browsers.

**Accessibility.** The feed is a `role="log"` with `aria-live="polite"`; inputs and the send button are labelled; focus states are visible; `prefers-reduced-motion` is respected.

## Scaling this beyond a toy

Polling is fine here but would not survive real scale, every client hits the server on a timer whether or not anything changed. The progression I would follow:

1. **Server-Sent Events or WebSockets** to replace polling — push instead of pull. SSE suits a mostly-read feed; WebSockets suit bidirectional chat. Either slots behind the existing `useMessages` hook without touching the UI.
2. **At large scale the protocol is the easy part.** The hard problems are connection fan-out and offline delivery: a pub/sub backbone (Redis/Kafka) so the server holding the sender's connection can route a message to the servers holding the recipients' connections; durable per-user queues so offline users receive messages on reconnect; and sharding conversations across storage by conversation ID. A presence service tracks who's online and where.

I deliberately didn't build any of this because the brief is a 4–6 hour task and over-engineering it would be the wrong signal. The abstraction boundary (transport isolated in one hook) is what makes that evolution cheap.

## What I would add with more time

- WebSocket transport behind the existing hook
- Pagination / infinite scroll upward using the `before` param
- An error boundary around the chat with a retry action
- E2E coverage (Playwright) for the full send/receive round-trip
