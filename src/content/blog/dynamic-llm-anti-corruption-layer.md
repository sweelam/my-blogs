---
title: "Managing What You Can't Control"
date: 2026-04-18
description: "In this blog, I'm assuming you have foundational knowledge about AI and"
cover: "https://cdn.hashnode.com/uploads/covers/69e12ea8ffbb787634ea29f2/dc0f13b5-041d-47a6-9e50-6db91c6a7c53.png"
---

*In this blog, I'm assuming you have foundational knowledge about AI and LLM*

Many business domains depend on external providers in their workflows — mainly to fetch data to display to users, to use in verification processes, or to consume internally during refinement activities. This common pattern is useful; however, it has a fundamental limitation: you can't control what you don't own!

Data control usually means control over data structure and formatting. Imagine you want to integrate via API a complementary information but can't find a single trusted source, so you decide to use multiple providers and consolidate their data internally — something like the following:

![](https://cdn.hashnode.com/uploads/covers/69e12ea8ffbb787634ea29f2/0540af2e-0ed0-4280-a359-fae2524176c7.png align="center")

Because providers are external entities you don't control, their responses—often in JSON—will likely have different structures, it becomes like a free-text input, and suffers from:

*   Schema drift over time when providers change their responses
    
*   Versioning conflicts across multiple providers
    
*   Testing surface explosion as provider combinations grow
    

This is a common problem; Eric Evans describes a solution for it in Domain-Driven Design (DDD): the Anti-Corruption Layer, which refines the data model exposed by any source into the model your system expects.

![](https://cdn.hashnode.com/uploads/covers/69e12ea8ffbb787634ea29f2/8ec792ae-4203-4a86-892f-d0c5b8178e96.png align="center")

This approach is common and works well, but it has one drawback: increased complexity—especially when implementing the architecture shown in the previous diagram. Whatever design you choose for the anti-corruption layer—whether a dedicated module or a similar component—you'll likely end up with code containing many if‑else statements or design patterns that replicate the same behavior. Over time, such a module becomes a blurry area that few people understand.

## AI Assistance

AI "LLM Model" can be an excellent fit for this use case because of its pattern‑recognition capabilities; it can handle this responsibility on the fly. However, it's essential to provide the chosen model with clear context, explicit requirements, and supporting examples.

> Remember: AI can do mistakes, so having a double validation layer like JSON schema validation, field presence checks, that applies minimum verification on AI result will increase system reliability.

One approach is to consult an AI model via API—treating the model as a separate service and invoking it as a step in your core business workflow. This can work well, but it has a significant drawback: it can make the system noticeably slower, since AI calls often take several seconds before returning a response.

![](https://cdn.hashnode.com/uploads/covers/69e12ea8ffbb787634ea29f2/e65c9fec-64e1-4a1f-a181-ab38fab57d50.png align="center")

Another approach is delayed invocation, where you perform the core logic without data unification and set up a periodic background job to fetch data from the master DB, unify it, and write it back. This reduces user wait time by moving work to a background step, but it has a common drawback: updates will be delayed and may become stale over time.

### Real-time Processing

The third approach is event-based solution, where the process is conducted at real-time using event-driven data flow. Data flows and gets unified in real time, as events are processed the moment they arrive.This approach is better than the previous in term of data flow, Yet, adding some complexities like coding design and operational maintenance.

![](https://cdn.hashnode.com/uploads/covers/69e12ea8ffbb787634ea29f2/35dfa2b0-029f-4590-928a-dfedabf872cc.png align="center")

> You should evaluate every approach, check pros and cons, and decide which one is the best fit for your environment case.

## Conclusion

All three approaches are valid — the right choice depends on what your system can and cannot tolerate. Synchronous AI calls are the simplest to implement but will hurt latency under load. Background jobs protect the user experience but accept that data will sometimes be stale. Event-driven processing gives you the best of both, at the cost of greater operational complexity.

The Anti-Corruption Layer problem isn't going away — external providers will always have opinions about their data structures. What's changed is that LLMs give you a new tool to handle that variability dynamically, rather than encoding every mapping rule by hand. Used carefully, with proper validation in place, this approach can significantly reduce the maintenance burden of integration-heavy systems.