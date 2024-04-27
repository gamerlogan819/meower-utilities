# meower-utilities
### imagine learning python just so i could code a silly bot for a silly cat website, couldnt be me
A WIP turbowarp extension that interacts with the website app.meower.org. Made for people who dont know how to code, by someone who doesnt know how to code.

huge thanks to
-
mybearworld, for helping me with most of the debugging and coding

supernoodles99, for contributing versions and helping with some of the coding

realnotfenixio for helping me find a major bug with my code




Can be used for:
-
bots

clients in turbowarp

spamming (dont actually)



known bugs
-
bots can very easily post 2-3 messages outputted from a single command. to solve this, just out a "wait (0.1) seconds" block after each command script

the websocket can close if youre outside of the tab for a prolonged period of time. thats what the "connect to websocket" block is for

there is no queue for commands. if two commands are run before the code can respond, only the most recent command will be responded to. you'll have to code your own queue, or use a queue template (dropping soon)

if you find any more bugs or have suggestions, dm @Gamerlogan819 on meower

