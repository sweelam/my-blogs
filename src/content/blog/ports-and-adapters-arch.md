---
title: "Hexagonal Architecture"
date: 2026-06-25
description: "The underrated architecture that every developer should know" 
cover: "/images/blog/hex-arch.png"
---

Every developer writes code, lots of code. Good developers design ahead — they don't just write code, they want to build something that lasts, code that is maintainable by design. They know the story doesn't end with delivery; it just starts, and requirement changes are inevitable! Code design structure has moved through a notable journey — engineers have tried different structures and observed the pros and cons. In this article, I'd like to explain the most underrated code design I've ever seen: The Hexagonal Architecture.

## Short History  
Hexagonal architecture, aka "ports and adapters architecture," is a software design. It was designed by Alistair Cockburn as an attempt to avoid common problems discovered in other designs. In 2005, he announced this design for building object-oriented systems; yet, hexagonal architecture is generic enough to handle non-object-oriented systems too. Alistair wanted to design something that would reduce coupling between its components. Despite the fact that this is a software design mainly translated into the code layer, you'll observe that the intuition behind its core building blocks came purely from supportive components and infrastructure used in systems like databases and external remote system calls.

The idea behind this architecture is something most engineers already know: separation of concerns. This architecture generalizes it in a way that looks at the system from a layer perspective — every system is built to do something, "the core domain," and everything else is support. Such support can be inbound, "from outside in," or outbound, "from inside out" — and this is why it's also called ports and adapters architecture.

## The Core Pillars 

The good thing about understanding architecture and software design is the relationships you'll find among them. If you're already familiar with Domain-Driven Design (DDD), this part should be familiar to you. Building software should focus on understanding and crunching the core domain it will serve. Watching the bigger scope after that crunching, it looks like a circle centered on the business domain, with everything around it being supportive — the ports and adapters architecture embraces this vision.

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/hex-2.webp)

