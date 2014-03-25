linoleum
========

#### Tiles for the 99%.

========

### Dependencies

Linoleum requires <a target="blank" href="https://github.com/elnarddogg/jquery.hx">jQuery.hx</a> version 1.0.0 or higher.

========

### Instantiation

A new linoleum instance is created as follows:

```javascript
var awesome = new linoleum( 'selector' , options );
```

where `selector` is the selector string for the tile elements and `options` is an object setting the defaults for this instance.

========

### Options

Options can be passed to the linoleum constructor as well as method calls. Defaults are shown below.

```javascript
enabled: true,
margin: {
	left: 10,
	right: 10,
	top: 10,
	bottom: 10
},
stackPosition: {
	x: 0,
	y: 0
},
distroDelay: 200,
duration: 300,
easing: 'ease',
tile: {
	perspective: 10000,
	thickness: 0.001,
	modal: {
		x: null,
		y: null,
		z: 5000
	}
}
```

* __enabled:__ enables setting of tile views
* __margin:__ the tile margin for distributed view
* __stackPosition:__ the position of the stacked view
* __distroDelay:__ the amount of time to delay calling the distribute method on window resize or orientation change
* __duration:__ the duration of linoleum transitions (i.e. distribute or stack)
* __easing:__ the easing for linoleum transitions (i.e. distribute or stack)
* __tile:__ defaults for the linoleum.tile instances
* __tile.perspective:__ the perspective (in pixels) for a linoleum.tile instance
* __tile.thickness:__ the thickness (as a percentage of perspective) for a linoleum.tile instance
* __tile.modal:__ the translation distances (in pixels) for a linoleum.tile instance modal view (null = centered)

========

### Methods

#### linoleum.enable

```javascript
awesome.enable();
```

#### linoleum.disable

```javascript
awesome.disable( evenActive );
```

* __evenActive:__ Optional - a boolean denoting whether the active tile, if any, should be disabled.

#### linoleum.distribute

```javascript
awesome.distribute( 'selector' , options , callback );
```

* __selector:__ __Required__ - the selector string for the container to which the tiles should be distributed.
* __options:__ Optional - options for the linoleum.distribute method. Accepts _margin_, _duration_, and _easing_.
* __callback:__ Optional - a function to be executed upon completion.

#### linoleum.stack

```javascript
awesome.stack( stackPosition , options , callback );
```

* __stackPosition:__ Optional - an object containing the position of the stack relative to the top left corner of the tiles' parent.
* __options:__ Optional - options for the linoleum.stack method. Accepts _duration_ and _easing_.
* __callback:__ Optional - a function to be executed upon completion.

#### linoleum.tile.enable

```javascript
awesome[i].enable();
```

#### linoleum.tile.disable

```javascript
awesome[i].disable();
```

#### linoleum.tile.setView

```javascript
awesome[i].setView( view , options , callback );
```

* __view:__ __Required__ - a string denoting the desired view. Valid views are `home` and `modal`.
* __options:__ Optional - options for the linoleum.tile.setView method. Accepts _modal_, _duration_, and _easing_.
* __callback:__ Optional - a function to be executed upon completion.


