Linoleum
========

#### Tiles for the 99%.

========

### Dependencies

Linoleum requires <a target="blank" href="https://github.com/elnarddogg/jquery.hx">jquery.hx</a> version 1.0.2 or higher.

========

### Instantiation

A new Linoleum instance is created as follows:

```javascript
var awesome = new Linoleum( 'selector' , options );
```

where `selector` is the selector string for the tile elements and `options` is an object setting the defaults for this instance.

========

### Options

The Linoleum constructor accepts the following options (shown with default values):

```javascript
margin: {
	left: 10,
	right: 10,
	top: 10,
	bottom: 10
},
indexAttribute: 'data-index',
stickyClass: 'sticky',
excludeClass: 'exclude',
disableClass: 'disable',
activeClass: 'active',
distroDelay: 200,
duration: 400,
easing: 'ease',
tile: {
	perspective: 10000,
	thickness: 0.0001,
}
```

| Parameter | Description | Type |
| --------- | ----------- | ---- |
| __margin__ | the tile margin for distributed view | `Object` |
| __indexAttribute__ | the name of the DOM attribute where the tile's index should be stored | `String` |
| __stickyClass__ | the name of the class designating sticky tiles | `String` |
| __excludeClass__ | the name of the class designating excluded tiles | `String` |
| __disableClass__ | the name of the class designating disabled tiles | `String` |
| __activeClass__ | the name of the class designating active tiles | `String` |
| __distroDelay__ | the amount of time to delay calling the distribute method on window resize or orientation change | `Integer` |
| __duration__ | the duration of linoleum transitions (i.e. distribute) | `Integer` |
| __easing__ | the easing for linoleum transitions (i.e. distribute) | `String` |
| __tile.perspective__ | the perspective (in pixels) for a linoleum.tile instance | `Integer` |
| __tile.thickness__ | the thickness (as a percentage of perspective) for a linoleum.tile instance | `Float` |

========

### Callbacks

#### linoleum.onTileInclude
```javascript
awesome.onTileInclude = function( tile ) { ... };
```

#### linoleum.onTileExclude
```javascript
awesome.onTileExclude = function( tile ) { ... };
```

#### linoleum.beforeFilter
```javascript
awesome.beforeFilter = function() { ... };
```

#### linoleum.afterFilter
```javascript
awesome.afterFilter = function() { ... };
```

#### linoleum.beforeSort
```javascript
awesome.beforeSort = function() { ... };
```

#### linoleum.afterSort
```javascript
awesome.afterSort = function() { ... };
```

========

### Events

#### linoleum.distribute
```javascript
$(document).on( 'linoleum.distribute' , function( e , data ) {
	...
});
```

========

### Linoleum Methods

Linoleum extends the Array object, so any methods available to an array are available to Linoleum.

#### linoleum.distribute

```javascript
awesome.distribute( 'selector' , options , callback );
```

| Parameter | Description | Required | Type |
| --------- | ----------- | -------- | ---- |
| __selector__ | the selector for the container to which the tiles should be distributed. Once distribute has been called, selector is no longer required. | _Once_ | `String` |
| __options__ | accepts `duration` and `easing` | No | `Object` |
| __callback__ | a function to be executed upon completion | No | `Function` |

#### linoleum.lSort

```javascript
awesome.lSort( sortFunction );
```

| Parameter | Description | Required | Type |
| --------- | ----------- | -------- | ---- |
| __sortFunction__ | the sort function | __Yes__ | `Function` |

#### linoleum.lFilter

```javascript
awesome.lFilter( filterFunction );
```

| Parameter | Description | Required | Type |
| --------- | ----------- | -------- | ---- |
| __filterFunction__ | the filter function | No | `Function` |

#### linoleum.enable

```javascript
awesome.enable();
```

#### linoleum.disable

```javascript
awesome.disable( evenActive );
```

| Parameter | Description | Required | Type |
| --------- | ----------- | -------- | ---- |
| __evenActive__ | denotes whether the active tile, if any, should be disabled | No | `Boolean` |

========

### Tile Methods


#### Linoleum.Tile.defineView

* defines a view for __ALL__ tiles in __ALL__ Linoleum instances.

```javascript
Linoleum.Tile.defineView( 'modal' , {

	tile: function( tile ) {
		return {
			type: 'transform',
			translate: {
				x: ($(window).width() / 2) - ($(tile).width() / 2),
				y: 100 + $(window).scrollTop()
			}
		}
	},

	inner: {
		type: 'transform',
		rotateY: 180
	},

	before: function() {
		...
	},

	after: function() {
		...
	}
});
```

| Parameter | Description | Required | Type |
| --------- | ----------- | -------- | ---- |
| __name__ | the name of the view to be created | __Yes__ | `String` |
| __viewDef__ | an object defining the new view | __Yes__ | `Object` |
| __viewDef.tile__ | <a target="blank" href="https://github.com/elnarddogg/jquery.hx#beans--pods">jquery.hx transform object</a> or a function that returns one defining the transformation for the tile element | no | `Object`<br>`Array`<br>`Function` |
| __viewDef.inner__ | <a target="blank" href="https://github.com/elnarddogg/jquery.hx#beans--pods">jquery.hx transform object</a> or a function that returns one defining the transformation for the inner element | no | `Object`<br>`Array`<br>`Function` |
| __viewDef.before__ | a function to be executed before the view is applied | no | `Function` |
| __viewDef.after__ | a function to be executed after the view is applied | no | `Function` |

#### tile.defineView

* same as above, but for a single tile instance.

```javascript
Linoleum.Tile.defineView( 'name' , viewDef );
```

#### tile.setView

```javascript
awesome[i].setView( view , options , callback );
```

| Parameter | Description | Required | Type |
| --------- | ----------- | -------- | ---- |
| __view__ | the desired view - by default, the only valid view is `home` | __Yes__ | `String` |
| __options__ | accepts `duration` and `easing` | No | `Object` |
| __callback__ | a function to be executed upon completion | No | `Function` |

#### tile.stick

```javascript
awesome[i].stick();
```

#### tile.unstick

```javascript
awesome[i].unstick();
```

#### tile.enable

```javascript
awesome[i].enable();
```

#### tile.disable

```javascript
awesome[i].disable();
```

#### tile.include

```javascript
awesome[i].include();
```

#### tile.exclude

```javascript
awesome[i].exclude();
```

#### tile.activate

```javascript
awesome[i].activate();
```

#### tile.deactivate

```javascript
awesome[i].deactivate();
```
