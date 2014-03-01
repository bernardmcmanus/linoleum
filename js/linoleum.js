(function() {

	var config = {
		margin: {
			x: 20,
			y: 20
		},
		distroDelay: 200,
		duration: 300,
		easing: 'ease'
	};

	window.linoleum = function( selector , options ) {

		var els = document.querySelectorAll( selector );

		if (els.length < 1)
			throw 'Error: You must pass a valid selector to the linoleum constructor.';

		var tiles = [];

		Array.prototype.forEach.call( els , function( i ) {
			tiles.push(new linoleum.tile( i ));
		});

		this.options = $.extend( true , config , ( options || {} ));

		return $.extend( tiles , this );
	};

	linoleum.prototype = {

		distribute: function( selector , options , callback ) {

			if (!this._setView( 'distribute' ))
				return;

			if (this.length < 1)
				return;

			if (!selector || selector === '')
				throw 'Error: You must pass a valid selector to linoleum.distribute.';

			var parent = document.querySelector( selector );

			if (!parent || parent.length < 1)
				throw 'Error: You must pass a valid selector to linoleum.distribute.';

			options = $.extend({
				margin: this.options.margin,
				duration: this.options.duration,
				easing: this.options.easing
			}, (options || {}));

			this.Columns = _distribute.call( this , parent , options , callback );
		},

		stack: function( index , options , callback ) {

			if (!this._setView( 'stack' ))
				return;

			callback = callback || function() {};

			index = (index >= this.length ? (this.length - 1) : (index < 0 ? 0 : index)) || 0;

			options = options || {};

			options = $.extend({
				duration: this.options.duration,
				easing: this.options.easing
			}, (options || {}));

			_stack.call( this , index , options , callback );
		},

		_setView: function ( view ) {
			
			if (this.view === view)
				return false;

			this._stopListen( this.view );

			if (view === 'distribute') {
				this._activate();
			} else {
				this._deactivate();
			}

			this._startListen( view );
			this.view = view;
			
			return true;
		},

		_startListen: function( view ) {

			if (this.listener || typeof listeners[ view ] !== 'function')
				return;
			
			this.listener = listeners[ view ].bind( this );
			startListen[ view ].call( this , this.listener );
		},

		_stopListen: function( view ) {

			if (!view)
				return;
			
			if (!this.listener || typeof listeners[ view ] !== 'function')
				return;

			stopListen[ view ].call( this , this.listener );
			this.listener = null;
		},

		_activate: function() {
			$(this).css( 'pointer-events' , 'auto' );
		},

		_deactivate: function() {
			$(this).css( 'pointer-events' , 'none' );
		}

	};


	function _stack( index , options , callback ) {

		var xformTile = $.extend({
			translate: this[index].home,
			relative: false
		}, options );

		var xformInner = $.extend({
			rotate: {x: 1, a: 80},
			relative: false
		}, options );

		var completed = [];

		function position( tile ) {
			$(tile).hx( 'transform' , xformTile );
			$(tile).find( '.inner' )
			.hx( 'transform' , xformInner )
			.done(checkComplete.bind( this ));
		}

		function checkComplete() {
			completed.push( 1 );
			if (completed.length === this.length)
				callback.call( this );
		}

		function exec() {
			this.forEach(position.bind( this ));
		}

		exec.call( this );
	}


	function _distribute( parent , options , callback ) {

		callback = callback || function() {};
		var containerDims = parent.getBoundingClientRect();
		var Columns = 0;
		var Rows = 0;
		var completed = 0;

		function position( tile , row , col ) {

			var ox = getCenterOffsetX.call( this , tile , Columns , options );

			var t = {
				x: (col * tile.dims.width) + (options.margin.x * (col + 1)) + ox,
				y: (row * tile.dims.height) + (options.margin.y * (row + 1))
			};

			tile.setHome( t );
			
			$(tile).hx( 'transform' , {
				translate: t,
				easing: options.easing,
				duration: options.duration,
				relative: false
			});

			$(tile).find( '.inner' )
			.hx( 'transform' , {
				duration: options.duration,
				easing: options.easing,
				relative: false
			})
			.done(checkComplete.bind( this ));
		}

		function sizeSizer( rows ) {
			var totalY = getTotalY.call( this , rows , options );
			$(parent).children( '.sizer' ).css( 'height' , totalY + 'px' );
		}

		function checkComplete() {
			completed++;
			if (completed === this.length)
				callback.call( this );
		}

		function exec() {

			var totalX = getTotalX.call( this , options );
			Columns = getCols.call( this , totalX , containerDims );
			Rows = getRows.call( this , Columns );

			sizeSizer.call( this , Rows );

			var i = 0;

			for (var row = 0; row < Rows; row++) {
				for (var col = 0; col < Columns; col++) {
					if (i >= this.length)
						continue;
					position.call( this , this[i] , row , col );
					i++;
				}
			}
		}

		exec.call( this );
		return Columns;
	}

	function getCenterOffsetX( tile , cols , options ) {
		var parentDims = tile.parentNode.getBoundingClientRect();
		return (parentDims.width - (tile.dims.width * cols) - (options.margin.x * (cols + 1))) - (options.margin.x * Math.floor((cols) / 2));
	}

	function getTotalX( options ) {
		return (this[0].dims.width * this.length) + (options.margin.x * (this.length + 1));
	}

	function getTotalY( rows , options ) {
		return (this[0].dims.height * rows) + (options.margin.y * (rows + 1));
	}

	function getInstanceX( totalX ) {
		return totalX / this.length;
	}

	function getInstanceY( rows , totalY ) {
		return totalY / rows;
	}

	function getRows( cols ) {
		return Math.ceil( this.length / cols );
	}

	function getCols( totalX , containerDims ) {
		
		var instX = getInstanceX.call( this , totalX );
		var cols = 0;
		
		while ((cols * instX) < containerDims.width) {
			cols++;
		}

		if ((cols * instX) > containerDims.width)
			cols -= 1;

		return cols;
	}


	var listeners = {};

	listeners.distribute = function( e ) {

		var parent = this[0].parentNode;
		var dims = parent.getBoundingClientRect();
		
		var totalX = getTotalX.call( this , this.options );
		var cols = getCols.call( this , totalX , dims );
		
		if (this.Columns === cols) {
			var opt = $.extend( {} , this.options , {
				duration: 0,
				fallback: false
			});
			_distribute.call( this , parent , opt );
			return;
		}

		var timeout = setTimeout(function() {
			this.Columns = _distribute.call( this , parent , this.options );
		}.bind( this ) , this.options.distroDelay );

		$(window).on( 'resize orientationchange' , function timer() {
			$(window).off( 'resize orientationchange' , timer );
			clearTimeout( timeout );
		});

	};


	var startListen = {};

	startListen.distribute = function( listener ) {
		$(window).on( 'resize' , listener );
	};


	var stopListen = {};

	stopListen.distribute = function( listener ) {
		$(window).off( 'resize' , listener );
	};

	
}());




























