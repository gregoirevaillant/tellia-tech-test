1. How would you design the system to support many different types of voice notes (tasks, observations, reminders, etc.)?
LLM extraction layer (optional schema validation layer)

2. What are the advantages and disadvantages of predefined schemas versus AI generated schemas?
Predefined :
GOOD: predictable
easy to query

BAD: Rigid
if not taken into account you could miss on information

Dynamic :
GOOD: Flexible
Adapt to new use cases

BAD:
Inconsistant structure ? Could do something crazy if not boxed correctly
harder querying

3. How would you scale this system if thousands of users were sending voice notes every minute?
Load balancing ? More servers ? Better servers ?

Caching repeated request / patterns ?

4. What challenges would arise when capturing voice in noisy environments?
Less accurate
Information could be missing
ambiguity / miss guidance

We could add a user confirmation, noice reduction pre process
