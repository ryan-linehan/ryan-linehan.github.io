---
layout: post
title: "Creating a Debug Console for Your Godot Game"
date: 2024-12-01
category: tutorial
tags: [Godot, C#, Debugging]
excerpt: "How to use limbo_console_sharp to add a powerful in-game debug console to your C# Godot project. Includes custom commands and variable inspection..."
---

How to use limbo_console_sharp to add a powerful in-game debug console to your C# Godot project. Includes custom commands and variable inspection.

## Why a Debug Console?

During development, you constantly need to:

- Tweak values without recompiling
- Teleport to specific locations
- Spawn items or enemies
- Check internal state

A debug console lets you do all this at runtime, dramatically speeding up iteration.

## Setting Up limbo_console_sharp

I created [limbo_console_sharp](https://github.com/ryan-linehan/limbo_console_sharp) specifically for Godot C# projects. Here's how to get started:

### Installation

1. Clone the repo into your `addons` folder
2. Enable the plugin in Project Settings
3. Add the console scene to your main scene

### Basic Usage

Press the backtick key (`) to open the console, then type commands:

```
> help
Available commands:
  help          - Show this help
  clear         - Clear console
  god           - Toggle god mode
  teleport x y  - Teleport player
```

## Creating Custom Commands

The real power comes from adding your own commands:

```csharp
public partial class GameCommands : Node
{
    public override void _Ready()
    {
        Console.RegisterCommand("spawn", SpawnEnemy, "Spawn an enemy");
        Console.RegisterCommand("gold", SetGold, "Set player gold");
    }

    private void SpawnEnemy(string[] args)
    {
        var enemyType = args.Length > 0 ? args[0] : "basic";
        EnemyManager.Spawn(enemyType, Player.Position + Vector2.Right * 100);
        Console.Print($"Spawned {enemyType} enemy");
    }

    private void SetGold(string[] args)
    {
        if (args.Length > 0 && int.TryParse(args[0], out int amount))
        {
            Player.Gold = amount;
            Console.Print($"Gold set to {amount}");
        }
    }
}
```

## Variable Watching

You can also watch variables in real-time:

```csharp
Console.Watch("FPS", () => Engine.GetFramesPerSecond());
Console.Watch("Player HP", () => Player.Health);
Console.Watch("Enemy Count", () => EnemyManager.Count);
```

These will display in a sidebar, updating every frame.

## Production Builds

Don't forget to disable or remove the console in release builds! You can use preprocessor directives:

```csharp
#if DEBUG
    AddChild(consoleScene.Instantiate());
#endif
```

Happy debugging!
