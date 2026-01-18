---
layout: post
title: "Building the Discord Bot for Tribal Trouble"
date: 2024-12-15
category: devlog
tags: [Tribal Trouble, Discord, Integration]
excerpt: "We wanted a way for players to interact with the game from Discord - checking match status, viewing replays, and getting notifications. Here's how we built it..."
---

We wanted a way for players to interact with the game from Discord - checking match status, viewing replays, and getting notifications. Here's how we built it.

## The Vision

Our Discord server is the heart of the Tribal Trouble community. Players chat, share strategies, and organize matches there. It made sense to bring the game closer to where the community already lives.

### Features We Wanted

- **Match notifications** - Know when games start and end
- **Replay sharing** - Post replays directly to Discord
- **Player stats** - Check rankings without launching the game
- **Match scheduling** - Organize games without leaving Discord

## Architecture

The bot runs as a separate service that communicates with the game server via a REST API:

```
Discord Bot <---> REST API <---> Game Server
                    |
                    v
                 Database
```

This separation means the bot can be updated independently of the game, and we can rate-limit API calls to prevent abuse.

## Implementation Highlights

### Real-time Match Updates

We use webhooks to push match events to Discord:

```python
@game_events.on('match_end')
async def notify_match_end(match):
    embed = create_match_embed(match)
    await webhook.send(embed=embed)
```

### Slash Commands

Discord's slash commands make interaction intuitive:

- `/tt stats @player` - View a player's stats
- `/tt match <id>` - Get match details
- `/tt replay <id>` - Post a replay link

## Lessons Learned

1. **Rate limiting is essential** - Discord has strict limits
2. **Cache aggressively** - Don't hit the game server for every command
3. **Graceful degradation** - The bot should work even if the game server is down

The bot has become an essential part of our community infrastructure!
