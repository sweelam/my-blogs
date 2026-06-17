---
title: "The Cognitive Load Trap"
date: 2026-04-23
description: "In software industry, they issues that may break systems are not only technical issues, sometimes the primary issue is organizational. System sustainability..."
cover: "https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/e70b7370-bc5c-4548-8ceb-cd9374a2fbd0.png"
---

In software industry, they issues that may break systems are not only technical issues, sometimes the primary issue is organizational. System sustainability refers to how well a software system can continue operating, evolving, and delivering value over time without degrading in performance, quality, cost, or maintainability.

**Organizational Sustainability**: Refers to the ability of a team to work together effectively and continue delivering value over time.

### Case Study: The Cognitive Load Trap

In 2017, I was working at a company with a strong reputation in the banking sector. It was a mid-sized company selling a core banking product. At that time, the system had good observable performance—a large monolithic architecture designed efficiently—and the product features were robust enough to serve a significant market segment. However, there was a notable problem: the team size was too small to handle both system maintenance and development.

Another issue the company faced was the reliance on individuals who knew too much about specific parts of the system—This is a common pattern called "The Golden Engineer, or Key Person Dependency Risk". These engineers were often the only ones who understood how certain components work, they were the *Single Points of Knowledge*. When one of them took leave, progress would stall until they returned.

Business requirements were also growing—which is normal in the banking sector. Things got even worse when the team encountered a critical bug in one of the core modules, or faced a security concern. It became increasingly challenging for the team to keep up with all of this. Over time, developers began to leave due to the pressure and workload. This attrition occurred simultaneously with the demand for new features, creating a high cognitive load that the team simply couldn't handle.

The company eventually hired a couple of developers, hoping to reduce the cognitive load by bringing more hands on deck. However, they didn't expect to face another major challenge; It was too late because the system contained several complex modules built by developers who had already left the company. These modules were difficult to grasp, implementing complex banking rules without any documentation to explain the underlying logic.

> Technical Documentation is as important as code. Without it, everyone will be guessing, practical approaches like *Doc as Code* which includes **ADR** (Architecture Decision Records), **Runbooks**, and **READMEs** are essential to maintain system sustainability.

The primary problem was that the team size was never given the necessary attention by the company. While the system grew over time, the team size did not. A growing system increases the cognitive load on the team, eventually making it unmanageable. Ideally, the company should have scaled the team to match the system's growth.

You might also think of redesigning the system into smaller, manageable parts to reduce the cognitive load. That is a valid option too, but in such a scenario — where a live system is in play — business continuity is the top priority, and any significant architectural change would put it at risk. So, typically, dealing with the current situation by increasing the team size is a good starting point.

> At some point, adding more developers will not help because of the architectural complexity of the system, this is a red flag that the system needs to be redesigned into smaller, manageable parts. It's time to step back and ask: Which Architecture Style should we adopt?

### Team Size

Team size is a critical factor in system sustainability. A team that is too small cannot handle the increasing cognitive load of a growing system. On the other hand, simply adding more people—as the company did—doesn't always solve the problem and can introduce new communication challenges.

Assuming the company migrated to a modern distributed architecture. A popular concept in the industry that will support this modern transformation is the **Two Pizza Rule** coined by Jeff Bezos at Amazon, which suggests that a team should be small enough to be fed by two pizzas (typically 6-9 people). This size is optimal for communication and decision-making. However, the key is not just the number of people, but how the team is structured and what they are responsible for.

When a system grows beyond the capacity of a single two-pizza team, we shouldn't just make the team larger. Instead, we should split the system into smaller, manageable parts to reduce cognitive load and assign a dedicated team to each part. This aligns with the **Team Topologies** approach, where teams are organized around business flow (Stream-aligned teams) to ensure fast delivery and system sustainability. But, is it possible to divide a team building monolithic system? Of course this will require the architecture to be refactored to be more modular.

Finding the right balance is the responsibility of engineering leadership. They must continuously monitor the team's health and the system's complexity. If the team is struggling to keep up with maintenance and new features, it is a clear sign that the system architecture or the team structure needs to evolve.

> The Two Pizza Rule is not a golden rule, in fact, it can be adjusted based on the objective, we already discussed that part in chapter 7 on team topologies and single-threaded team (STT)

### **Conclusion: The High Cost of Ignoring the Invisible Load**

The case study reveals an uncomfortable truth about software leadership: **Cognitive load is a liability that does not appear on the balance sheet until it is too late.** While we diligently monitor CPU usage, memory leaks, and response latencies, we rarely instrument the *human* system for signs of overload—until the Golden Engineers walk out the door.

The trap is insidious because it feels like productivity in the short term. A small, heroic team delivers features quickly on a monolithic codebase. But without deliberate, incremental investment in both **team growth** and **modular architecture**, that velocity is borrowed against future stability.

The most sustainable system is not the one with the cleverest code; it is the one that a new hire can understand on their second Monday. Protect that, and you protect the business.

> If you found this useful, these topics are explored in much greater depth in our [book](https://leanpub.com/thehighwaypathtoscalablesystems) **The Highway Path to Scalable Systems**, co-authored with Jasser Mahmoud.