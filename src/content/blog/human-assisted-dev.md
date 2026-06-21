---
title: "Assisted-AI"
date: 2026-04-17
description: "When AI looking for your support"
cover: "https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/a1cc22f5-907e-48f0-9007-7f8117569d22.jpg"
---


## Assisted-AI Development 

Using AI in software development has become the new norm. Engineers utilize AI for coding in several ways—such as prompting and spec-driven generation—to significantly increase productivity and reduce time to market. In fact, most companies actively encourage this practice today. When you outline requirements for an AI agent, it will attempt to execute exactly what you requested. However, because AI also tries to infer implicit intentions, providing a clear and thorough context is highly recommended.

Because AI relies heavily on clear requirements, development in greenfield systems demands special attention. Source code is not just text; it is the core asset that dictates the system's future quality and maintainability. Therefore, a software engineering team must align on several critical aspects before coding begins: the architectural design, the programming language, and the infrastructure components that will support the system.

## Common Pitfalls

I have observed several common pitfalls when using AI to write code. When software engineers fully delegate control to an AI agent, it often results in source code plagued by issues—ranging from over-complication and duplication to, most critically, violations of established architectural rules. For a simple example, consider a standard layered architecture. This approach requires strict adherence to layer boundaries; an API or Business layer should never call the Data layer directly, and vice versa. While some advanced AI models are intelligent enough to identify and respect these constraints, relying on them implicitly without clear guidance is a risk.

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/open-closed-l.png)

The other side of the coin is when the engineer explicitly requests an architectural violation or an anti-pattern. The AI will generally not refuse to execute the prompt. Combining this tendency with the aforementioned risk of over-complication results in source code that is extremely difficult to maintain.

To avoid these pitfalls, it is crucial to establish practices that govern the coding phase:

Pair Review: This is likely the fastest way to get feedback, especially if you practice pair programming or mobbing. This approach not only safeguards code quality but also rapidly increases the team's collective AI experience. Ultimately, however, this relies more on team culture than a rigid process.

AI Rules: If you are using spec-driven development, you can define rule files that the AI agent must always follow. For example, you might define a simple constraint like the following:

```
- Do not add extra code unless it is strictly necessary, and always adhere to the YAGNI principle.
```

By implementing this rule, the AI agent will validate its work before and after writing. It executes a verification process to ensure any new code strictly follows your established guidelines.
