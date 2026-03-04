## 🏗️ System Design Learning Plan

### Phase 1: The Foundations (The "Building Blocks")

* **Lesson 1: Vertical vs. Horizontal Scaling.** * *What it is:* Adding more power to one server vs. adding more servers.
* *Focus:* Load balancers and the "Shared Nothing" architecture.

* **Lesson 2: Proxies and Reverse Proxies.**
* *What it is:* How to protect your servers and manage traffic.
* *Focus:* Nginx, HAProxy, and basic security.

* **Lesson 3: Load Balancing Algorithms.**
* *What it is:* How the system decides which server gets the next request.
* *Focus:* Round Robin, Least Connections, and IP Hash.

### Phase 2: Data Management

* **Lesson 4: SQL vs. NoSQL.**
* *What it is:* Choosing the right database for the job.
* *Focus:* Relational data (PostgreSQL) vs. Document/Key-Value data (MongoDB, Redis).

* **Lesson 5: Database Scaling (Sharding & Replication).**
* *What it is:* How to handle massive amounts of data.
* *Focus:* Leader-follower replication and horizontal partitioning.

* **Lesson 6: Caching Strategies.**
* *What it is:* Making things fast by not asking the database every time.
* *Focus:* Redis, Memcached, and "Cache Aside" patterns.

### Phase 3: Communication & Reliability

* **Lesson 7: REST vs. GraphQL vs. gRPC.**
* *What it is:* Different ways for services to talk to each other.
* *Focus:* When to use which protocol in a JS ecosystem (Node.js).

* **Lesson 8: Message Queues & Event-Driven Design.**
* *What it is:* Asynchronous communication.
* *Focus:* RabbitMQ, Kafka, and why we use them to "decouple" services.

* **Lesson 9: The CAP Theorem.**
* *What it is:* The "impossible" choice in distributed systems.
* *Focus:* Understanding Consistency, Availability, and Partition Tolerance.

---

## 📖 How to Study (30-Minute Routine)

To make progress without getting tired, follow this simple routine for each lesson:

1. **Read (10 mins):** Find a high-level article or documentation about the topic.
2. **Visualize (5 mins):** Draw a simple diagram on paper or a digital tool (like Excalidraw).
3. **JS Context (10 mins):** Research how this is implemented in JavaScript. (For example, for Lesson 8, look at the `amqplib` library for Node.js).
4. **Summary (5 mins):** Write 3 sentences in English explaining the concept to practice your vocabulary.

---

### What to learn first?

Each of these topics is a "piece of the puzzle." Once you understand them individually, we can start putting them together to design systems like YouTube, Twitter, or a Board Game platform.

Would you like me to start with **Lesson 1** and explain **Vertical vs. Horizontal Scaling** in detail?