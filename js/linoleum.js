(function() {

	var config = {
		margin: 20,
		delay: 200,
		duration: 300,
		easing: 'easeOutBack'
	};

	window.linoleum = function( selector ) {

		var els = document.querySelectorAll( selector );

		if (els.length < 1)
			throw 'Error: You must pass a valid selector to the linoleum constructor.';

		var tiles = [];

		Array.prototype.forEach.call( els , function( i ) {
			tiles.push(new linoleum.tile( i ));
		});

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
				margin: config.margin,
				duration: config.duration,
				easing: config.easing
			}, (options || {}));

			this.Columns = _distribute.call( this , parent , options , callback );
		},

		stack: function( index , options , callback ) {

			if (!this._setView( 'stack' ))
				return;

			callback = callback || function() {};

			index = (index >= this.length ? (this.length - 1) : (index < 0 ? 0 : index)) || 0;

			options = options || {};

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
		var completed = [];

		function position( tile , row , col ) {

			var t = {
				x: (col * tile.dims.width) + (options.margin * (col + 1)),
				y: (row * tile.dims.height) + (options.margin * (row + 1))
			};

			tile.setHome( t );
			
			$(tile).hx( 'transform' , {
				translate: t,
				relative: false
			});

			$(tile).find( '.inner' )
			.hx( 'transform' , {
				relative: false
			})
			.done(checkComplete.bind( this ));
		}

		function sizeSizer( rows ) {
			var totalY = getTotalY.call( this , rows , options );
			$(parent).children( '.sizer' ).css( 'height' , totalY + 'px' );
		}

		function checkComplete() {
			completed.push( 1 );
			if (completed.length === this.length)
				callback.call( this );
		}

		function exec() {

			var totalX = getTotalX.call( this , options );
			var Columns = getCols.call( this , totalX , containerDims );
			var Rows = getRows.call( this , Columns );

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

			return Columns;
		}

		return exec.call( this );
	}


	function getTotalX( options ) {
		return (this[0].dims.width * this.length) + (options.margin * (this.length + 1));
	}

	function getTotalY( rows , options ) {
		return (this[0].dims.height * rows) + (options.margin * (rows + 1));
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
		
		var totalX = getTotalX.call( this , config );
		var cols = getCols.call( this , totalX , dims );
		
		if (this.Columns === cols)
			return;

		var timeout = setTimeout(function() {
			this.Columns = _distribute.call( this , parent , config );
		}.bind( this ) , config.delay );

		$(window).on( 'resize' , function timer() {
			$(window).off( 'resize' , timer );
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




























