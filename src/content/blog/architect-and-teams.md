---
title: "Architect and Teams"
date: 2026-04-17
description: "Communication creates clarity across different perspectives — and for engineers, that means learning to talk non-tech. Anyone building a system to deliver..."
cover: "https://cdn.hashnode.com/uploads/covers/69e12ea8ffbb787634ea29f2/a1cc22f5-907e-48f0-9007-7f8117569d22.jpg"
---

Communication creates clarity across different perspectives — and for engineers, that means learning to talk non-tech. Anyone building a system to deliver business value must master this. Consider the difference: "We need to build a scalable system using X architecture style" versus "We need a system that can serve a lot of users." Same intent, completely different audiences. The architect's job is to move fluently between both.

As an architect, you will never work in isolation where you dont communicate with different midsets. The world is not only about 0s and 1s; it is about the real world. You will work with different people from different backgrounds. Some have technical backgrounds; some don't care about the technical world and tech terms. Speaking only in technical terms is like talking in another language that those business people don't understand.

What is the common language to use? Eric Evans, the author of Domain-Driven Design "DDD", defined a core strategic language that engineers should use to communicate with business people—**Ubiquitous Language**. It is the language that engineers define by understanding the business domain from the domain expert—the most knowledgeable person about the business and business terms.

This language should be globally understandable within any business domain scope. It is not necessary to be well understood by the whole organization, but it should be well understood by all parties involved in a specific project building a specific part of the business "Context Boundary".

The architect and engineering team should crunch the business domain to understand the common business terms, and define the ubiquitous language out of those terms. In fact, these terms should be translated into code models in the codebase while building the software; this way, the engineering team removes any ambiguity in the business domain, and reduces the confusion when communicating with business owners.

It is worth mentioning that the same Ubiquitous Language terms can have different meaning in different contexts "Context Boundary" within the same organization. For example, the term "Order" can have different meaning in different contexts, such as "Order" in the sales context and "Order" in the inventory context.

![DDD Ubiquitous Language](https://cdn.hashnode.com/uploads/covers/69e12ea8ffbb787634ea29f2/5976d671-609b-4059-bf2f-2412eb25288b.png align="center")

The architect's role extends beyond system design—it includes facilitating understanding between technical and non-technical stakeholders. Mastering Ubiquitous Language is not optional; it's essential for preventing miscommunication and building software that truly solves business problems.

This is why the architect must be the one to define and defend this language — ambiguity at the language level becomes confusion at the team level.

## Conflicts Resolution

Architects should always have strong communication skills. They should be skilled at persuading others, whether they are part of the business team or the engineering team. An architect should act as an enabler—listening to problems and finding the best solutions. They may face conflicts with the engineering team, who may see their decisions as adding no value. Engineers read the documentation that requests adopting a new technology or architecture, and they may have different opinions!

Relying solely on documentation for communication is not a good practice, especially when conflicts arise. The architect should be ready to listen and prepare for meetings with the engineering team to discuss their concerns, address solutions, and provide trade-off analysis. This helps the team understand the impact of each decision and the consequences of not following it.

The architect should be flexible and open to feedback from the engineering team; they should collaborate with them to find the best way to adopt their decision. They might miss something that can change the whole picture, and the engineering teams are the source of truth for sharing those missed details. It is not about right or wrong; it is about the better way to solve the problem. That's why the architect should share their proposals to get feedback from the engineering team before announcing their final decision.

In a previous discussion with Neal Ford, I asked him about the right way to convince others to adopt his architectural decisions. He said:

> "In the discussion demonstration, stop talking. You're never convincing anybody by only talking. You need to provide evidence of how that's causing problems, and how your solution is solving those problems."

People prefer evidence; it is human nature to believe what we see and hear rather than what we read in a document. This is exactly how trade-off analysis works. Architects should provide that analysis in an accessible way to the engineering team, which may require a meeting or a presentation. That's fine; the goal is to make sure the engineering team understands the trade-offs and can make informed decisions.

## Conclusion

Communication is not a soft skill for architects — it is a core competency. The language you use shapes how the team thinks. The decisions you make in isolation will be resisted. The proposals you share early will be owned collectively. None of this requires you to be the loudest voice in the room. It requires you to be the clearest one.

> If you found this useful, these topics are explored in much greater depth in our [book](https://leanpub.com/thehighwaypathtoscalablesystems) **The Highway Path to Scalable Systems**, co-authored with Jasser Mahmoud.