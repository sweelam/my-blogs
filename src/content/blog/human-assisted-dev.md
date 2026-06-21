---
title: "Assisted-Human Development"
date: 2026-06-21
description: "When AI relies on Human!"
cover: "/images/blog/assited-human.png"
---


## AI Agents "The New Norm"

Using AI in software development has become the new norm. Engineers use AI for coding in several ways—such as prompting and spec-driven generation—to significantly increase productivity and reduce time-to-market. In fact, most companies actively encourage this practice today. When you outline requirements for an AI agent, it will attempt to execute exactly what you requested. However, because AI also tries to infer implicit intentions, providing a clear and thorough context is highly recommended.

Because AI relies heavily on clear requirements, development in greenfield systems demands special attention. Source code is not just text; it is the core asset that dictates the system's future quality and maintainability. Therefore, a software engineering team must align on several critical aspects before coding begins: the architectural design, the programming language, and the infrastructure components that will support the system.

> It turns out that AI relies on humans almost as much as humans rely on AI.

## Common Pitfalls

I have observed several common pitfalls when using AI to write code. When software engineers fully delegate control to an AI agent, it often results in source code plagued by issues—ranging from over-complication and duplication to, most critically, violations of established architectural rules. For a simple example, consider a standard layered architecture. This approach requires strict adherence to layer boundaries; an API or Business layer should never call the Persistence layer directly, and vice versa. While some advanced AI models are intelligent enough to identify and respect these constraints, relying on the models implicitly without clear guidance is a risk.

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/open-closed-l.png)

The other side of the coin is when the engineer explicitly requests an architectural violation or an anti-pattern. The AI will generally not refuse to execute the prompt. Combining this tendency with the aforementioned risk of over-complication results in source code that is extremely difficult to maintain.

To avoid these pitfalls, it is crucial to establish practices that govern the coding phase:

- **Pair Review**: This is likely the fastest way to get feedback, especially if you practice pair programming or mobbing. This approach not only safeguards code quality but also rapidly increases the team's collective AI experience. Ultimately, however, this relies more on team culture than a rigid process.

- **Code Review**: This approach is also beneficial because feedback is naturally surfaced when the team reviews Merge or Pull Requests. However, *both of these methods are prone to human error and lack a systematic structure*.

### The systematic approach is to use AI itself to verify its work

- **AI Rules**: If you are using spec-driven development, you can define rule files that the AI agent must always follow. For example, you might define a simple constraint like the following:

```
Do not add extra code unless it is strictly necessary, and always adhere to the YAGNI principle.
```

- **AI Skills**: A rule defines a single constraint for the AI to follow. A skill is a set of steps—often composed of several rules—that together form a workflow you can instruct the AI to execute.

```
- Do not add extra code unless it is strictly necessary, and always adhere to the YAGNI principle.
- Follow Single Responsibility 
- Follow the ArchUnit rules 
- ... 
```

By Defining these, the AI agent will validate its work before and after writing. It executes a verification process to ensure any new code strictly follows your established guidelines.

## Example: Greenfield Project 

Wessam is a T-shaped engineer with in-depth expertise in JVM technologies. For one of the new systems he worked on, the team decided to develop in Golang due to a few factors—performance being the major one. Wessam set up the project structure and decided to use AI-Assisted Development via *Spec-Driven Development*. The first task he assigned the AI agent was to write a simple API.

Because Wessam comes from a JVM background, he asked the AI to implement common patterns found in Java frameworks, such as Dependency Injection. This is an excellent way to manage dependencies across different layers or modules. In Java's Spring Boot, this relies on a reflection-based mechanism, which looks like this:

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/java-di.png)

Consequently, Wessam asked the AI to use a reflection mechanism to achieve the same result in Go. The AI explored available libraries and implemented one that supported reflection. Over time, however, the team began to observe performance degradation. After investigating, they discovered that most of the execution time was being consumed by the reflection library they had chosen.

They decided to research best practices and the idiomatic way to handle this in Go. They discovered that Go's philosophy generally discourages the use of reflection, especially in high-performance systems; instead, dependencies should be handled natively. To prevent this from happening again, Wessam's teammate, Alex, recommended adding a new rule to their AI instructions:

```
- Evaluate the technical requirements and recommend better approaches if the requests violate idiomatic language patterns or common best practices.
```

## Conclusion 

"AI-Assisted Development" quietly flips into **Assisted-Human Development** once you look at how teams actually ship code with AI agents. The AI writes the code, but it still leans on something human-authored to know what "good" looks like—a rule, a skill, a boundary someone had to define first. Wessam's team didn't get faster Go code because the AI got smarter; they got it because a human understood *why* it failed and turned that into a constraint the AI could follow. The AI executed. The human supplied the judgment.

Pair review and code review catch problems after the fact. Rules and skills catch them before the fact—but only if someone takes the time to write them.

So the honest framing isn't that AI develops and humans review. It's the reverse: humans decide what correct looks like, and AI assists by writing it down at a speed no team could match alone. Get that backwards, and you ship fast code nobody—including the AI—understands the constraints of.