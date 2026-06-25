---
title: "Hexagonal Architecture"
date: 2026-06-25
description: "The underrated architecture that every developer should know" 
cover: "/images/blog/hex-arch.png"
---

Every developer writes code, lots of code. Good developers design ahead — they don't just write code, they want to build something that lasts, code that is maintainable by design. They know the story doesn't end with delivery; it just starts, and requirement changes are inevitable! Code design structure has moved through a notable journey — engineers have tried different structures and observed the pros and cons. In this article, I'd like to explain the most underrated code design I've ever seen: The Hexagonal Architecture.

## Short History  
Hexagonal architecture, aka "ports and adapters architecture," is a software design. It was designed by Alistair Cockburn as an attempt to avoid common problems discovered in other designs. In 2005, he announced this design for building object-oriented systems; yet, hexagonal architecture is generic enough to handle non-object-oriented systems too. Alistair wanted to design something that would reduce coupling between its components. Despite the fact that this is a software design mainly translated into the code layer, you'll observe that the intuition behind its core building blocks came purely from supportive components and infrastructure used in systems like databases and external remote system calls.

The idea behind this architecture is something most engineers already know: separation of concerns. This architecture generalizes it in a way that looks at the system from both layer and component perspective — every system is built to do something, "the core domain," and everything else is support. Such support can be inbound, "from outside in," or outbound, "from inside out" — and this is why it's also called ports and adapters architecture.

## The Core Pillars 

The good thing about understanding architecture and software design is the relationships you'll find among them. If you're already familiar with Domain-Driven Design (DDD), this part should be familiar to you. Building software should focus on understanding and crunching the core domain it will serve. Watching the bigger scope after that crunching, it looks like a circle centered on the business domain, with everything around it being supportive — the ports and adapters architecture embraces this vision.

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/hex-2.webp)

### The core domain 
This is the central component that includes the core functionalities, typically the business requirements. This architecture recommends keeping this layer native by nature; it's the component that should work and solve the problem without being tightly coupled to any other layer. It should be designed this way to be flexible and testable. If you're using Go, it should be native Go without any external libraries or frameworks — the same goes if you're using Java, Python, or any other language.

This idea is really well defined: if you build this part natively, it becomes extremely easy to swap the components around it — they become interchangeable — while your core domain keeps working.

### Adapters 
Adapters are logically the doors to the outside world. A system needs to store data in a data store (database, messaging broker, cache system), and it needs to fetch data from external systems via RPC. Since these doors do many things like managing network and I/O, you'll ultimately find them in the form of libraries or frameworks. For instance, exposing an API requires handling layer 7 over the HTTP server you're using — you don't need to do all of this yourself; it's better to use ready-made technology, something like controllers in Spring Boot, or handlers in Go Gin.


The following C-Sharp controller is doing many things that most of the engineers don't need to do manually, this class should represent adapter component.
![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/c-sharp-controller.png)


### Ports
This component defines the interface that the core domain understands. This interface works similarly regardless of whether the port is inbound or outbound. The interface defines the expected message that the core domain can use — this message is the "domain object." It's different from the adapter's received message, the "raw message," which comes from the external system. The domain object always reflects domain fields; a good domain object should have proper field names. The raw object transformation is typically the adapter's responsibility — however, you can define a mapper utility for simplicity.

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/adapter-to-core.png)


### Dependency Direction 
A common mistake engineers make when using this design recently is reversing the dependency, which makes components tightly coupled. It's important to remember the dependency direction while building hexagonal architecture — the rule is that adapters and ports should always point toward the core domain. Logically, this is the objective; however, technically, this may change based on the technology you're using. Let's take an example: suppose you have an API that receives data and stores it in a database — it looks something like this, visually:

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/hexa-database-access-1.png)

To build this correctly, you should strictly use dependency inversion. You should rely on abstraction not implementation, the following class diagram explains the design, You can see the core component in the middle and the direction is pointing to it using inversion of control.

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/hexa-class-diagram.png)

### Benefits of Hexagonal Architecture

- **Testability** — the core domain has no dependency on databases, HTTP frameworks, or message brokers, so you can test business logic with plain unit tests and in-memory fakes, no test containers or mocked servers required.
- **Technology independence** — swapping a database, message broker, or web framework means writing a new adapter, not touching the core domain. The business logic doesn't know or care what's outside the port.
- **Maintainability** — changes triggered by infrastructure (a new API version, a different cache, a vendor migration) stay isolated to adapters, reducing the blast radius of change across the codebase.
- **Clear boundaries** — ports make the contract between the core domain and the outside world explicit, so engineers always know exactly what the domain expects and exposes, rather than discovering it by tracing through framework code.
- **Longevity** — because the core domain isn't tied to any specific framework or library version, it's far less exposed to deprecations, breaking upgrades, or vendor lock-in over the system's lifetime.
- **Easier onboarding** — new engineers can understand the business rules by reading the core domain alone, without needing to first untangle infrastructure code.

### Conclusion 
Hexagonal architecture isn't about hexagons or strict folder layouts — it's a discipline: keep your core domain free of infrastructure concerns, and let ports and adapters absorb the volatility of the outside world. Get that boundary right, and swapping a database or an HTTP framework becomes a non-event instead of a rewrite.
