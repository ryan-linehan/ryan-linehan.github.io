---
title: "Tribal Trouble Revival: Adding Multiplayer Islands"
date: 2025-01-15
category: devlog
tags: [Tribal Trouble, Java, Multiplayer]
excerpt: "One of the most requested features for the Tribal Trouble revival has been the ability to have multiple islands on a single map."
---

One of the most requested features for the Tribal Trouble revival has been the ability to have multiple islands on a single map. Today I'm excited to share our progress on implementing this feature.

## The Challenge

The original Tribal Trouble engine was designed with single-island maps in mind. The pathfinding, AI, and rendering systems all assumed a contiguous landmass. Adding multiple islands meant rethinking several core systems.

### Pathfinding Overhaul

The biggest hurdle was pathfinding. Units needed to understand that:

1. Some destinations are unreachable by land
2. Boats become necessary for inter-island travel
3. The AI needs to plan multi-step journeys

```java
public class IslandPathfinder {
    public Path findPath(Unit unit, Position target) {
        Island sourceIsland = getIsland(unit.getPosition());
        Island targetIsland = getIsland(target);

        if (sourceIsland.equals(targetIsland)) {
            return landPathfinder.findPath(unit, target);
        }

        // Need to find a boat route
        return planBoatJourney(unit, sourceIsland, targetIsland, target);
    }
}
```

## What's Next

We're currently testing the multiplayer synchronization to ensure all players see the same island state. Stay tuned for more updates!
