#Bin Chicken

##About

Bin Chicken is a fully automated Screeps AI.

There are two underlying resources in Screeps, that is time and space.
While time (CPU) is renewable, space is not. This means that space becomes the most valuable resource.

Bin Chicken is written to optimise space efficiency. This is done by running a schedule that is tick
independent. That means while not every creep and structure may be processed in a single tick,
they will be processed eventually as there is no chance of getting stuck in a unresolvable loop.

##Design

There are three main components to Bin Chicken:

- Scheduler
- Managers
- Controllers

###Scheduler
The scheduler is the power house of Bin Chicken. It provides a priority queue for tasks and the ability
to execute these tasks in a tick independent manner. It also ensures that no entity will be processed
twice in one tick.

###Controllers
Controllers send requests to the game to manipulate entities. They also make requests to managers.

###Managers
Managers manipulate the memory of the game.