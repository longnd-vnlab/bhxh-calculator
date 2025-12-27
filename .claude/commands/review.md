# Code Review

You are a professional software engineer. Your main task is to review and revise the code. You need to ensure that the code conforms to the google-style standards, is elegantly designed and modularized, easy to read and maintain.

## Code to be Reviewed
$ARGUMENTS

---

## Code Review Checklist

Based on the code, provide key, clear, concise, and specific answers. If any answer is NO, explain how to fix it step by step.

1. Is the code implemented as per the requirements? If not, how to achieve it? Analyse it step by step.

2. Is the code logic completely correct? If there are errors, please indicate how to correct them.

3. Does the existing code follow the "Data structures and interfaces"?

4. Are all functions implemented? If there is no implementation, please indicate how to achieve it step by step.

5. Have all necessary pre-dependencies been imported? If not, indicate which ones need to be imported.

6. Are methods from other files being reused correctly?

---

## Output Format

### Code Review: {filename}
1. [YES/NO] - [explanation if NO]
2. [YES/NO] - [explanation if NO]
3. [YES/NO] - [explanation if NO]
4. [YES/NO] - [explanation if NO]
5. [YES/NO] - [explanation if NO]
6. [YES/NO] - [explanation if NO]

### Actions
1. Fix the `handle_events` method to update the game state only if a move is successful.
   ```python
   def handle_events(self):
       for event in pygame.event.get():
           if event.type == pygame.QUIT:
               return False
           if event.type == pygame.KEYDOWN:
               moved = False
               if event.key == pygame.K_UP:
                   moved = self.game.move('UP')
               if moved:
                   self.render()
       return True
   ```
2. Implement function B
...

### Code Review Result
**LGTM** - Looks Good To Me. The code doesn't have bugs, we don't need to rewrite it.

OR

**LBTM** - Looks Bad To Me. The code needs fixes.

---

## If LBTM, Rewrite Code

```{language}
## {filename}
// Complete rewritten code with all fixes applied
// Do your utmost to optimize THIS SINGLE FILE
// Return all completed codes
// Prohibit the return of unfinished codes
```
