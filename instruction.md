# Tellia Intern Tech Test

Voice → Structured Knowledge Pipeline

## **Context**

Tellia is building a voice first AI system that converts spoken information into structured data.

Users capture short voice notes in real world situations. These notes may contain different types of information such as:

- tasks
- observations
- reminders
- scheduling information
- project notes
- field observations

The system must convert these voice notes into structured data that can be stored and queried.

Example voice note:

> "Tomorrow at 9am call the irrigation technician about the pump failure in field 12."
>

```jsx
Possible structured output:
{
	type: "task",
	title: "Call irrigation technician",
	context: "pump failure in field 12",
	scheduledTime: "tomorrow 9:00"
}
```

Another example:

> "Block A wheat looks healthy but I noticed aphids on the east side."
>

```jsx
Possible output:
{
	type: "observation",
	location: "Block A",
	crop: "wheat",
	issue: "aphids",
	severity: "low"
}
```

The goal of this test is to prototype a system that converts voice notes into structured information.

# **Objective**

Build a small prototype that:

1. receives an audio voice note
2. transcribes it
3. structures the information contained in the note
4. stores the result

Your system should be able to process **different types of information**, not only one predefined format.

# **Task 1 — Audio Transcription Endpoint**

Build a backend service exposing an endpoint:

> POST /voice-note
>

```jsx
Example input:
{
	deviceId: "device-001",
	timestamp: "2026-03-10T10:30:00Z",
	audioUrl: "https://example.com/audio.wav"
}
```

Your service should:

1. download the audio file
2. transcribe the audio
3. return the transcript

```jsx
Example response:
{
	transcript: "Tomorrow at 9am call the irrigation technician about the pump failure in field 12"
}
```

You may use any speech to text API or a mock transcription.

# **Task 2 — Structuring the Information**

Convert the transcript into structured data.

Your system should support **two possible approaches**.

### **Approach A — Predefined schemas**

Define a small set of schemas such as:

- tasks
- observations
- reminders
- notes

```jsx
Example:
{
	type: "task",
	title: "Call irrigation technician",
	scheduledTime: "2026-03-11T09:00:00"
}
```

### **Approach B — Dynamic structure**

Allow the AI to generate its own structured representation.

```jsx
Example:
{
	type: "observation",
	entities: {
		crop: "wheat",
		location: "Block A",
		issue: "aphids"
	}
}
```

You may implement both approaches.

# **Task 3 — Data Storage**

Store the structured information in a simple data store.

This could be:

- a database
- a JSON file
- an in memory store

The goal is to demonstrate how structured information could be saved and retrieved.

# **Task 4 — Reliability Improvement**

Implement one improvement to make the system more robust.

Examples:

- retry logic if transcription fails
- detecting low confidence transcripts
- deduplicating similar observations
- buffering events before processing
- logging events for replay

Explain the tradeoff in your README.

# **Task 5 — Short System Design Note**

Write a short document answering the following questions.

1. How would you design the system to support many different types of voice notes (tasks, observations, reminders, etc.)?
2. What are the advantages and disadvantages of predefined schemas versus AI generated schemas?
3. How would you scale this system if thousands of users were sending voice notes every minute?
4. What challenges would arise when capturing voice in noisy environments?

# **Deliverables**

Please submit a Git repository containing:

- source code
- README with setup instructions
- architecture explanation
- answers to the design questions
