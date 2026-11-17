---
title: "The Approval Was Right. The Request Was Not."
date: 2026-11-16
description: "Every approval check passed, yet the customer was refunded $310 instead of $120. A guest post by Hoda Osama on the last mile between an approved effect and the request a downstream system actually executes."
cover: "/images/blog/approval-last-mile.jpeg"
tags: ["Agentic AI", "Human in the Loop", "Idempotency", "Reliability", "Distributed Systems"]
author:
  name: "Hoda Osama"
  role: "Principal Software Engineer"
  avatar: "/images/authors/hoda-osama.jpg"
  bio: "More than 18 years in .NET and distributed systems, and a PhD researcher at Nile University working on AI in the medical domain. She writes the LinkedIn newsletter Agents in Production, about how AI agents survive production, and publishes the Arabic YouTube series System Design بالعربي."
  links:
    website: "https://hodausama.github.io"
    linkedin: "https://www.linkedin.com/in/hodaosama/"
    youtube: "https://www.youtube.com/@Hoda_Osama_AI"
---

Consider a hypothetical refund workflow. An AI agent handles customer refund requests, and any tool call that moves money pauses until a human approves it.

Order 8472 was paid with a single $310 payment. One item, worth $120, arrived damaged.

At 10:00, the agent proposes a partial refund. The reviewer sees the full effect: $120.00 USD, original payment method, order version 14.

At 10:05, a manager approves. The approval is bound to that exact refund, not expired, not used. Just before the side effect, the tool revalidates: same order version, same amount, same policy. By the usual standard of human-in-the-loop design, this approval is done right.

At 10:06, the `RefundOrder` tool builds the HTTP request to the payment service. A mapping bug leaves the amount as `null`. The JSON serializer is configured to skip nulls, so the field disappears from the payload.

The payment service receives `{ "orderId": "8472" }`. Its API treats a missing amount as "refund everything that is left".

The customer receives $310.

Now a second version of the same morning. This time the amount is sent correctly, but the call times out. Nobody knows whether the refund happened. The workflow marks it as Unknown and schedules a retry. The retry runs 30 hours later, with the same idempotency key.

By then, the payment service no longer remembers the key. It treats the retry as a new request. The customer receives $120 twice.

In both versions, every approval check passed. The leak was in the last mile: between the approved effect and the request the downstream system actually executed.

## 1. What a well-designed approval already covers

A human approval is a control only if it binds the business effect, not just the name of the tool being called. In practice that means three things:

- **The approved request carries the effect itself:** amount, currency, destination, order version and policy version. The reviewer approves those values, not "call `RefundOrder`".
- **The approval expires and can be used once.** A click from yesterday cannot authorize a refund today, and one approval cannot authorize two refunds.
- **The tool revalidates immediately before the side effect.** If the order, the amount or the policy changed since the reviewer saw them, the tool fails closed and asks for a new approval.

Without these, a reviewer can approve $120 and the agent can still execute something else, because the arguments or the world changed between the click and the call.

That design ends at the tool boundary. This article continues past it, to the request that leaves your process. Two more gaps sit there:

- **Defaults.** A field you do not send is decided by the receiver.
- **Clocks.** Every duplicate guard remembers for a limited time, and that time has nothing to do with your approval or your workflow.

Neither gap is specific to payments or to one provider. Both appear wherever a .NET service calls another system.

## 2. A missing field is a decision someone else makes

Here is how the amount disappears in an ordinary .NET codebase:

```csharp
public sealed class RefundRequest
{
    public string OrderId { get; set; } = default!;
    public decimal? Amount { get; set; }
    public string? Currency { get; set; }
}

var json = JsonSerializer.Serialize(request, new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
});

// {"orderId":"8472"}
```

Nothing throws. Nothing is logged. Skipping nulls is a common setting to keep payloads small, and for most fields it is harmless.

For an approved effect, it is a silent change of meaning. The receiver does not see "amount: unknown". It sees no amount at all, and applies its own default.

That default is often the largest possible effect. Payment APIs commonly treat a missing refund amount as a full refund. Stripe's Create a refund API, for example, documents `amount` as optional, and its support documentation states that without an amount the refund is for the full charge.

The same thing happens with optional parameters:

```csharp
Task RefundAsync(string orderId, decimal? amount = null);

await payments.RefundAsync(order.Id);   // compiles, and refunds everything
```

So the familiar approval rule, "what you see is what you approve", needs a second half: **what you approve is what you send, field by field, with no defaults.**

## 3. Make the missing field impossible, then check anyway

I would design the outgoing command so that an approved effect cannot be built without its effect fields:

```csharp
public sealed record Money(long MinorUnits, string Currency);

public sealed class RefundCommand
{
    public required string OperationId { get; init; }
    public required string ApprovalId  { get; init; }
    public required string PaymentId   { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.Never)]
    public required Money Amount { get; init; }
}
```

Three choices matter here:

- **`required` members.** The compiler refuses to create the command without setting them. Note what this does not guarantee: a caller can still set a value that is wrong, or null with a warning. It removes the "forgot to set it" path, not the need to validate.
- **Amount and currency travel together** as one value. An amount without a currency is not an effect.
- **The effect field is never skipped by the serializer**, even if the global options skip nulls.

Then a guard at the single place where the command is built from the approval:

```csharp
static RefundCommand FromApproval(ApprovedRefund approved)
{
    // Explicit currency table; throws for any currency it does not know.
    var amount = Currencies.ToMinorUnits(approved.Amount, approved.Currency);

    if (amount.MinorUnits <= 0)
        throw new ApprovalViolationException("Approved amount is missing or invalid.");

    return new RefundCommand
    {
        OperationId = approved.OperationId,
        ApprovalId  = approved.ApprovalId,
        PaymentId   = approved.PaymentId,
        Amount      = amount
    };
}
```

The conversion to minor units belongs to the approved effect too. The reviewer approved "120.00 USD"; the downstream API may expect 12000. Some currencies have no minor unit at all, so a conversion that multiplies everything by 100 will, in one of them, send a hundred times the approved amount. I would keep the conversion as a tested table, not a formula, and make it fail closed.

## 4. Every duplicate guard has a clock

The standard protection against duplicate side effects is an idempotency key. The caller sends a unique key with the request; when the receiver sees the same key again, it returns the original result instead of executing a second time. That makes retries of the same refund safe, but only while the receiver remembers the key. Every duplicate guard I know of remembers for a limited time:

- **Azure Service Bus** duplicate detection keeps a history of message IDs for a configured window. According to Microsoft Learn, the default is 10 minutes and the maximum is 7 days. A message sent with the same `MessageId` after the window is accepted as new.
- **Your own idempotency middleware**, if it stores keys in `IDistributedCache` or Redis with an expiration, stops protecting you the moment the entry expires.
- **Payment providers** document their own windows, and they differ. Stripe says keys can be removed once they are at least 24 hours old, and a key reused after that generates a new request. Adyen documents a minimum of 7 days.

A workflow with human approval runs on at least four clocks:

| Clock | Owned by | What it limits |
| --- | --- | --- |
| Approval validity | Your system | When the first send may happen |
| Workflow wait | Your checkpoints | Nothing by default; a paused workflow can resume days later |
| Downstream duplicate window | The broker, cache or provider | How long a reused key is recognized as a retry |
| Your operation record | Your system | How long you can answer "did this already happen?" |

It is tempting to fix the gap by making the approval expire sooner. That does not work. The approval protects the **first** send. A retry is not a new approval; it is the same, already-consumed approval being carried out again. Retries can happen long after the approval expired, and they should, when the outcome is unknown.

So the downstream window is not a limit on approvals. It is a limit on how long someone else can protect you from your own retries.

## 5. Your database is the ledger

The fix is a record you own, in your database, that lives as long as the operation matters:

```csharp
public sealed class RefundOperation
{
    public required string OperationId    { get; init; }
    public required string ApprovalId     { get; init; }
    public required string IdempotencyKey { get; init; }
    public required string PaymentId      { get; init; }
    public required long   AmountMinor    { get; init; }
    public required string Currency       { get; init; }
    public OperationState  State          { get; set; }   // Pending, Sent, Unknown, Succeeded, Failed
    public string?         ExternalRefundId { get; set; }
}

modelBuilder.Entity<RefundOperation>()
    .HasIndex(o => o.OperationId)
    .IsUnique();
```

The unique index is the important part. It is a duplicate guard with no expiry.

The second half is a link from the downstream side back to this record. Send the `OperationId` with every request: as a field, a header, or provider metadata. Then the downstream system's own records can answer "has this logical operation already been executed?" even after its duplicate window has passed.

One detail makes this necessary rather than nice to have. A refund API usually refuses to refund more than what is left on the payment. That ceiling does not stop a duplicate partial refund: on a $310 payment, two $120 refunds total $240, well under it. Both succeed.

## 6. Reconcile before you retry

With that link in place, a retry from the Unknown state starts with a question, not a send:

```text
retry(operation):
  existing = downstream.FindRefunds(paymentId = operation.PaymentId)
             where operationId == operation.OperationId

  if existing found:
      record existing.Id, mark Succeeded, stop     // it already happened

  send again with the SAME idempotency key and the SAME parameters
```

Three notes on this design:

- **Reconcile on every retry from Unknown, not only after the window.** Then the design does not depend on knowing anyone's retention period, and it keeps working when you change broker, cache or provider.
- **Reuse the same key and the same parameters.** Inside the window, the receiver deduplicates. Outside it, the `OperationId` lets the next reconciliation find the result.
- **Reconciliation is itself check-then-act.** Two workers can both see "not found" and both send. The answer is a single owner per operation: a worker takes a lease on the operation, and before sending it moves the record to Sent with a conditional update that checks its fencing token, a number that increases with every new lease. A worker whose lease has expired fails that update and sends nothing.

If the downstream system offers no way to look up past operations by your ID, that is worth knowing before you depend on it. Then the duplicate window is your only protection, and the retry policy has to stay inside it.

## 7. What the platform guarantees, and what is still yours

| Layer | Guarantees (according to the documentation) | Still your design |
| --- | --- | --- |
| Microsoft Agent Framework | An approval response authorizes a call only when it matches a pending request in the same session; changed arguments trigger a new approval or fail closed; pending requests survive checkpoint restore | Putting the business effect into the approved arguments |
| Broker, cache or provider | Duplicates with the same key are detected within a configured or documented window | Sending every effect field explicitly; correct unit conversion; an ID that links back to your operation |
| Your workflow | Nothing, unless you build it | Approval record, operation ledger with a unique index, reconciliation before retry, single owner per operation |

The framework protects the conversation. The downstream system protects one request for a while. Only your system can protect the logical operation for as long as it matters.

## Test the last mile

Approval tests usually stop at "approve leads to execution". For the last mile, I would add these:

- **Set the amount to null in the mapping layer.** Expect no outgoing request, the operation marked failed, and an alert. Never a full refund.
- **Serialize the command with the global "skip nulls" options.** Expect every effect field to be present in the payload.
- **Approve a refund in a currency with no minor unit.** Expect the sent amount, formatted back, to equal exactly what the reviewer saw.
- **Time out after the request is sent, then retry after the duplicate window.** Use a fake downstream that expires keys on demand. Expect reconciliation to find the refund by `OperationId` and send nothing.
- **Let two workers retry the same Unknown operation.** Expect one to reconcile and the other to be fenced out.

After each test, check three places: your operation record, the approval record, and the downstream system's records for that payment. The approved amount, the sent amount and the executed amount should be the same number, and every executed refund should carry the `OperationId` and `ApprovalId` that explain it.

## The question to ask

The usual approval question is: if the world changes between the approval and the action, does the approval still hold?

The last mile adds one more: **if the downstream system received only the bytes we sent, would it execute exactly what the human approved, today and 30 hours from now?**

If the answer depends on a default, an untested conversion, or a key someone else may have forgotten, the approval is still a click, not a control.

Where in your agentic workflows does an approved value cross a mapping layer or a default before it becomes a side effect?

## Further reading

- Microsoft Agent Framework: Overview — https://learn.microsoft.com/en-us/agent-framework/overview/?pivots=programming-language-csharp
- Microsoft Agent Framework: Tool approval (human in the loop) — https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval?pivots=programming-language-csharp
- Microsoft Learn: How to ignore properties with System.Text.Json — https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/ignore-properties
- Microsoft Learn: required modifier (C# reference) — https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/required
- Microsoft Learn: Azure Service Bus duplicate detection — https://learn.microsoft.com/en-us/azure/service-bus-messaging/duplicate-detection
- Microsoft Learn: Enable duplicate message detection for a Service Bus queue or topic — https://learn.microsoft.com/en-us/azure/service-bus-messaging/enable-duplicate-detection
- Microsoft Learn: EF Core indexes — https://learn.microsoft.com/en-us/ef/core/modeling/indexes
- Stripe API: Create a refund — https://docs.stripe.com/api/refunds/create
- Stripe API: Idempotent requests — https://docs.stripe.com/api/idempotent_requests
- Adyen: API idempotency — https://docs.adyen.com/development-resources/api-idempotency
- Related: Agents in Production, "The Refund Was Approved. Then the Amount Changed." — https://lnkd.in/p/d2YevUxe
