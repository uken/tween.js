# tween.js user guide

_**NOTE** this is a work in progress, please excuse the gaps. Wherever you see something marked as TODO, it's not done yet._

## What is a tween? How do they work? Why do you want to use them?

A tween (from [_in-between_](http://en.wikipedia.org/wiki/Inbetweening)) is a concept that allows you to change the values of the properties of an object in a smooth way. You just tell it which properties you want to change, which final values should they have when the tween finishes running, and how long should this take, and the tweening engine will take care of finding the intermediate values from the starting to the ending point. For example, suppose you have a `position` object with `x` and `y` coordinates:

````javascript
var position = { x: 100, y: 0 }
````

If you wanted to change the `x` value from `100` to `200`, you'd do this:

````javascript
// Create a tween for position first
var tween = new TWEEN.Tween(position);

// Then tell the tween we want to animate the x property over 1000 milliseconds
tween.to({ x: 200 }, 1000);
````

Actually this won't do anything yet. The tween has been created but it's not active. You need to start it:

````javascript
// And set it to start
tween.start();
````

Finally in order to run as smoothly as possible you should call the `TWEEN.update` function in the same main loop you're using for animating. This generally looks like this:

````javascript
animate();

function animate() {
	requestAnimationFrame(animate);
	// [...]
	TWEEN.update();
	// [...]
}
````

This will take care of updating all active tweens; after 1 second (i.e. 1000 milliseconds) `position.x` will be `200`.

But unless you print the value of `x` to the console, you can't see its value changing. You might want to use the `onUpdate` callback:

````javascript
tween.onUpdate(function() {
	console.log(this.x);
});
````

This function will be called each time the tween is updated; how often this happens depends on many factors--how fast (and how busy!) your computer or device is, for example.

So far we've only used tweens to print values to the console, but you could use it for things such as animating positions of three.js objects:

````javascript
var tween = new TWEEN.Tween(cube.position);
		.to({ x: 100, y: 100, z: 100 }, 10000)
		.start();

animate();

function animate() {
	requestAnimationFrame(animate);
	TWEEN.update();

	threeRenderer.render(scene, camera);
}
````

In this case, because the three.js renderer will look at the object's position before rendering, you don't need to use an explicit `onUpdate` callback.

You might have noticed something different here too: we're chaining the tween function calls! Each tween function returns the tween instance, so you can rewrite the following code:

````javascript
var tween = new TWEEN.Tween(position);
tween.to({ x: 200 }, 1000);
tween.start();
````

into this

````javascript
var tween = new TWEEN.Tween(position)
	.to({ x: 200 }, 1000)
	.start();
````

You'll see this a lot in the examples, so it's good to be familiar with it! Check [04-simplest](./examples/04_simplest.html) for a working example.

## Animating with tween.js

Tween.js doesn't run by itself. You need to tell it when to run, by explicitly calling the `update` method. The recommended method is to do this inside your main animation loop, which should be called with `requestAnimationFrame` for getting the best graphics performance:

We've seen this example before:

````javascript
animate();

function animate() {
	requestAnimationFrame(animate);
	// [...]
	TWEEN.update();
	// [...]
}
````

If called without parameters, `update` will determine the current time in order to find out how long has it been since the last time it ran.

However you can also pass an explicit time parameter to `update`. Thus,

````javascript
TWEEN.update(100);
````

means "update with time = 100 milliseconds". You can use this to make sure that all the time-dependent functions in your code are using the very same time value. For example suppose you've got a player and want to run tweens in sync. Your `animate` code could look like this:

````javascript
var currentTime = player.currentTime;
TWEEN.update(currentTime);
````

We use explicit time values for the unit tests. You can have a look at [TestTweens](../test/unit/TestTweens.js) to see how we call TWEEN.update() with different values in order to simulate time passing.

## Controlling a tween

### `start` and `stop`
So far we've learnt about the `Tween.start` method, but there are more methods that control individual tweens. Probably the most important one is the `start` counterpart: `stop`. If you want to cancel a tween, just call this method over an individual tween:

````
tween.stop();
````

Stopping a tween that was never started or that has already been stopped has no effect. No errors are thrown either.

The `start` method also accepts a `time` parameter. If you use it, the tween won't start until that particular moment in time; otherwise it will start as soon as possible (i.e. on the next call to `TWEEN.update`).

### `update`

Individual tweens also have an `update` method---this is in fact called by `TWEEN.update`. You generally don't need to call this directly, but might be useful if you're doing _crazy hacks_.

### `chain`

Things get more interesting when you sequence different tweens in order, i.e. setup one tween to start once a previous one has finished. We call this _chaining tweens_, and it's done with the `chain` method. Thus, to make `tweenB` start after `tweenA` finishes:

````javascript
tweenA.chain(tweenB);
````

Or, for an infinite chain, set `tweenA` to start once `tweenB` finishes:

````javascript
tweenA.chain(tweenB);
tweenB.chain(tweenA);
````

Check [Hello world](../examples/00_hello_world.html) to see an example of these infinite chains.
### `repeat`

If you wanted a tween to repeat forever you could chain it to itself, but a better way is to use the `repeat` method. It accepts a parameter that describes how many repetitions you want:

````javascript
tween.repeat(10); // repeats 10 times and stops
tween.repeat(Infinity); // repeats forever
````

Check the [Repeat](../examples/08_repeat.html) example.

### `yoyo`

This function only has effect if used along with `repeat`. When active, the behaviour of the tween will be _like a yoyo_, i.e. it will bounce to and from the start and end values, instead of just repeating the same sequence from the beginning.

### `delay`

More complex arrangements might require delaying a tween before it actually starts running. You can do that using the `delay` method:

````javascript
tween.delay(1000);
tween.start();
````

will start executing 1 second after the `start` method has been called.

## Controlling _all_ the tweens

The following methods are found in the TWEEN global object, and you generally won't need to use most of them, except for `update`.

### `TWEEN.update(time)`

We've already talked about this method. It is used to update all the active tweens.

If `time` is not specified, it will use the current time.

### `TWEEN.getAll` and `TWEEN.removeAll`

Used to get a reference to the active `tweens` array and to remove all of them from the array with just one call, respectively.

### `TWEEN.add(tween)` and `TWEEN.remove(tween)`

Used to add a tween to the list of active tweens, or to remove an specific one from the list, respectively.

These methods are usually used internally only, but are exposed just in case you want to do something _funny_.

## Changing the easing function (AKA make it bouncy)

Tween.js will perform the interpolation between values (i.e. the easing) in a linear manner, so the change will be directly proportional to the elapsed time. This is predictable but also quite uninteresting visually wise. Worry not--this behaviour can be easily changed using the `easing` method. For example:

````javascript
tween.easing(TWEEN.Easing.Quadratic.In);
````

This will result in the tween slowly starting to change towards the final value, accelerating towards the middle, and then quickly reaching its final value. In contrast, `TWEEN.Easing.Quadratic.Out` would start changing quickly towards the value, but then slow down as it approaches the final value.

### Available easing functions: `TWEEN.Easing`

There are a few existing easing functions provided with tween.js. They are grouped by the type of equation they represent: Linear, Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Circular, Elastic, Back and Bounce, and then by the easing type: In, Out and InOut.

Probably the names won't be saying anything to you unless you're familiar with these concepts already, so it is probably the time to check the [Graphs](../examples/03_graphs.html) example, which graphs all the curves in one page so you can compare how they look at a glance.

_Credit where credit is due:_ these functions are derived from the original set of equations that Robert Penner graciously made available as free software a few years ago, but have been optimised to play nicely with JavaScript.

### Using a custom easing function

Not only can you use any of the existing functions, but you can also provide your own, as long as it follows a couple of conventions:

- it must accept one parameter:
	- `k`: the easing progress, or how far along the duration of the tween we are. Allowed values are in the range [0, 1].
- it must return a value based on the input parameters.

The easing function is only called _once per tween_ on each update, no matter how many properties are to be changed. The result is then used with the initial value and the difference (the _deltas_) between this and the final values, as in this pseudocode:

````
easedElapsed = easing(k);
for each property:
	newPropertyValue = initialPropertyValue + propertyDelta * easedElapsed;
````

For the performance obsessed people out there: the deltas are calculated only when `start()` is called on a tween.

So let's suppose you wanted to use a custom easing function that eased the values but appplied a Math.floor to the output, so only the integer part would be returned, resulting in a sort of step-ladder output:

````javascript
function tenStepEasing(k) {
	return Math.floor(k * 10) / 10;
}
````

And you could use it in a tween by simply calling its easing method, as we've seen before:

````javascript
tween.easing(tenStepEasing);
````

Check the [graphs for custom easing functions](../examples/12_graphs_custom_functions.html) example to see this in action (and also some _metaprogramming_ for generating step functions).

## Callbacks

Another powerful feature is to be able to run your own functions at specific times in each tween's life cycle. This is usually required when changing properties is not enough.

For example, suppose you're trying to animate some object whose properties can't be accessed directly but require you to call a setter instead. You can use an `update` callback to read the new updated values and then manually call the setters:

````javascript
var trickyObjTween = new TWEEN.Tween({
	propertyA: trickyObj.getPropertyA(),
	propertyB: trickyObj.getPropertyB()
})
	.to({ propertyA: 100, propertyB: 200 })
	.onUpdate(function() {
		this.setA( this.propertyA );
		this.setB( this.propertyB );
	});
````

Or imagine you want to ensure the values of an object are in an specific state each time the tween is started. You'll assign a `start` callback:

````javascript
var tween = new TWEEN.Tween(obj)
	.to({ x: 100 })
	.onStart(function() {
		this.x = 0;
	});
````

The scope for each callback is the tweened object.

### onStart

Executed right before the tween starts-i.e. before the deltas are calculated. This is the place to reset values in order to have the tween always start from the same point, for example.

### onStop

Executed when a tween is explicitly stopped (not when it is completed normally), and before stopping any possible chained tween.

### onUpdate

Executed each time the tween is updated, after the values have been actually updated.

### onComplete

Executed when a tween is finished normally (i.e. not stopped).

## Advanced tweening

### Relative values

You can also use relative values when using the `to` method. When the tween is started, Tween.js will read the current property values and apply the relative values to find out the new final values. But **you need to use quotes** or the values will be taken as absolute. Let's see this with an example:

```javascript
// This will make the `x` property be 100, always
var absoluteTween = new TWEEN.Tween(absoluteObj).to({ x: 100 });

// Suppose absoluteObj.x is 0 now
absoluteTween.start(); // Makes x go to 100

// Suppose absoluteObj.x is -100 now
absoluteTween.start(); // Makes x go to 100

// In contrast...

// This will make the `x` property be 100 units more,
// relative to the actual value when it starts
var relativeTween = new TWEEN.Tween(relativeObj).to({ x: "+100" });

// Suppose relativeObj.x is 0 now
relativeTween.start(); // Makes x go to 0 +100 = 100

// Suppose relativeObj.x is -100 now
relativeTween.start(); // Makes x go to -100 +100 = 0
```

Check [09_relative_values](../examples/09_relative_values.html) for an example.

### Tweening to arrays of values

- arrays - and which interpolation function? (linear, bezier, catmull-rom)

## Getting the best performance

TODO

- CSS properties which shouldn't be used (e.g. marginLeft? use transform instead?)
	- or use animations/transitions instead
	- When to use tween -> for more complex arrangements
- Be good to the GC
- Reusing tweens

## Crazy tweening

TODO

- Using the tweening functions outside of tween.js
