# Bin Chicken

## About

Bin Chicken is a fully automated Screeps AI.

There are two underlying resources in Screeps, that is time 
and space. While time (CPU) is renewable, space is not. 
This means that space becomes the most valuable resource.

Bin Chicken is written to optimise space efficiency. This is 
done by running a schedule that is tick independent. That 
means while not every creep and structure may be processed 
in a single tick, they will be processed eventually as there 
is no chance of getting stuck in a unresolvable loop.

## Design

There are three main components to Bin Chicken:

- Scheduler
- Managers
- Controllers

### Scheduler
The scheduler is the power house of Bin Chicken. It provides 
a priority queue for tasks and the ability to execute these 
tasks in a tick independent manner.

Managers can schedule entities onto the scheduler by
creating a SchedulerTask which includes the references of 
the entity and the controller for that entity. A
SchedulerTask will not run the same tick as it is scheduled,
this decreases the chance of an entity being run twice in
one tick.

### Controllers
Controllers send requests to the game to manipulate 
entities. They also make requests and updates to managers.

Controllers have access to all of the managers so they can
send requests and updates to any of them. This is extremely
useful when updates effect multiple managers at once, e.g.
When a container is built next to a source then the Truck
and Miner managers will need to assign a miner and a truck
to that site. The Tradie manager will also have to reassign
all of the tradies that were building that container to
other jobs. This can be done by simply updating all the
managers involved when the first tradie that is working on
the site notices that the site is finished by calling:

```javascript
let event = new EventTradie(container, tradie);

this.managers.tradie.update(BUILD_COMPLETE, event);
this.managers.truck.update(BUILD_COMPLETE, event);
this.managers.miner.update(BUILD_COMPLETE, event);
```

Now the tradie, truck and miner managers can decide what to
do with this update.

### Managers
Managers manipulate the memory of the game. The do not
directly call entity methods and do not have visibility of
controllers or any other manager.