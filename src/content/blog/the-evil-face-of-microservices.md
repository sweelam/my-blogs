---
title: "The Evil Face of Microservices"
date: 2026-04-17
description: "It is almost 12 years since the word “Microservices” reached the earth, an architecture that everyone loves, and decided to build it claiming it is the..."
cover: "/images/blog/ffc36bb6-9b1e-4754-b23e-f88867cf3270.png"
---

It is almost 12 years since the word “[Microservices](https://en.wikipedia.org/wiki/Microservices)” reached the earth, an architecture that everyone loves, and decided to build it claiming it is the magician that will solve all the issues.

I will not go and mention even what is microservices. zillions of tutorials, blogs, and articles are available on the internet, and if you don’t know them, it is time to read about them, today I come to save your life! kidding.

Assuming you want to build an e-commerce system, and you decided to follow Microservices architecture, you looked around and found most of the e-commerce systems have common actors, customer, order, and payment which you decided to handle them using three microservices.

## **Start Small, Start Simple**

Back to system design-101 class, you remind yourself to start with High-Level Design “HLD”, and this is what you started with; a couple of simple components to go with.

*   Application Load Balancer **ALB.**
    
*   Kubernetes **k8s** service and multi-pods**.**
    
*   Databases that can support your traffic.
    

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/3560c651-4b10-4d06-b8cb-d51d91928c93.png)

Very easy, right? not that much, you have to follow the recommended pattern “Every microservice has its own DB”, but, let's deploy to production and see! a few months later you started to notice something, we don’t have a good mechanism that allows us to communicate with our customers and provide them with an accurate report if needed “Reporting”

You again looked around and found there is a known tech stack used for a such use case, it is called Elastic-Logstash-Kibana or **ELK,** you started immediately to acquire it to be part of your system, and voila; you are happy again.

A few months later, traffic increased and you found your database layer become a bottleneck, and can’t handle (even with scaling) huge traffic, so you decided to build a **caching layer** to massage your database layer, and this is the first upgrade.

## **Introducing Caching**

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/3d632deb-924d-49a5-9e51-9804129a77c5.png)

*Although you introduced a new component “Redis Cache” that added operation load to manage*, The system becomes much better and can survive for some time, as usual, happy life will not last, you noticed your system still facing performance issues, spent some days troubleshooting and discovered the issue is the API request received, processed, and the response sent back in a **blocking fashion**.

## **Introducing Messaging**

You decided to enhance the flow by making part of it be processed asynchronously, that way system doesn’t need to wait until the whole process is complete in a blocking fashion.

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/a43d83cb-c18d-4759-89bf-872da85cc79d.png)

*Again, Although you introduced a new component “RabbitMQ or Kafka” that added operation load to manage,* the system becomes faster and more scalable, new desired advantages, right? but with a cost!

Such a design can handle huge loads using reasonable infrastructure sizing, and by utilizing K8s, the system is fault-tolerant and resilient.

## **What happened?**

Like any software, the system will grow from time to time, and this will require building new microservices to handle new and different use cases, this growth will push you to a new issue, **traceability!**

**At any point in time, you will need to know, what happened exactly in your system? which system start the request or send the event? and what causes the system to fail in the middle. in other words; you want to watch the history of any journey.**

## **Introducing Traceability and Observability**

Microservices represent distributed systems, so you will need to build a “[**Distributed Tracing**](https://microservices.io/patterns/observability/distributed-tracing.html)” mechanism in order to answer previous questions, you studied the pattern and decided to “again” introduce a new component that will handle such tracing for you, and you decided to use [**Jaeger**](https://www.jaegertracing.io/)

Is it the only thing you need to have to answer? No, maybe the failure was from an Infra component, maybe your system Memory size limit was reached, maybe CPUs issue, maybe others, so you did your search and found that you also need two other components that can track, and allow you to troubleshoot the system; [Grafana](https://grafana.com/) and [Prometheus](https://prometheus.io/), or **Observability**.

![](https://raw.githubusercontent.com/sweelam/my-blogs/main/images/blog/64405139-11f3-4c10-b0b5-e60d24065969.png)

Your system is much more robust now, you become happy, but with a cost, right? this is a quick snapshot of microservices and what you really need to know before going with this architecture.

## **Conclusion**

Although microservices are a great architecture and have lots of added value, they don’t come for free! operation cost can be a big problem in your business, a couple of different expertise are also required, It is worth mentioning also that the mentioned technologies and tools are not the only available in the market, however, just examples to demonstrate the idea, and the pain you might face.