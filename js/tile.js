(function( _ ) {

	var tile = function( element , options ) {

		if (!element)
			throw 'Error: You must pass an element to the linoleum.tile constructor.';

		options = $.extend({
			dims: getDims( element ),
			perspective: 1000,
			thickness: 0.01,
			view: 'home',
			home: {}
		}, (options || {}));

		$.extend( this , options );

		return this._init( element );
	};

	tile.prototype = {

		_init: function( element ) {

			element.style.webkitPerspective = this.perspective + 'px';
			element.style.perspective = this.perspective + 'px';

			var front = $(element).find( '.face.front' ).get( 0 );
			var back = $(element).find( '.face.back' ).get( 0 );

			var tz = (this.thickness * this.perspective) / 2;

			setDepth( front , tz );
			setDepth( back , -tz );

			return $.extend( element , this );
		},

		setView: function ( view , options , callback ) {

			if (this.view === view)
				return;

			if (typeof views[view] !== 'function')
				throw 'Error: linoleum.tile has no view \'' + view + '\'.';

			callback = callback || function() {};

			var xform = setView.call( this , view , options );

			$(this)
			.hx( 'transform' , xform.booty );
			
			$(this).find( '.inner' )
			.hx( 'transform' , xform.inner )
			.done(function() {
				this.view = view;
				callback.call( this );
			}.bind( this ));
		},

		setHome: function( xform ) {
			this.home = xform;
		},

		_activate: function() {

			if ($(this).siblings( '.active' ).length > 0)
				$(this).siblings( '.active' ).get( 0 ).setView( 'home' );

			$(this).addClass( 'active' );
		},

		_deactivate: function() {
			$(this).removeClass( 'active' );
		},

	};


	function getDims( element ) {
		var r = element.getBoundingClientRect();
		var dims = {
			width: parseInt(getComputedStyle( element ).width , 10 ),
			height: parseInt(getComputedStyle( element ).height , 10 ),
			left: r.left,
			top: r.top
		};
		dims.right = dims.left + dims.width;
		dims.bottom = dims.top + dims.height;
		return dims;
	}


	function setDepth( element , z ) {

		var xform = {
			translate: {z: z},
			duration: 0,
			fallback: false,
			relative: false
		};

		$(element).hx( 'transform' , xform );
	}


	function setView( view , options ) {

		options = options || {};

		var xform = views[view].call( this );

		xform.booty = $.extend( xform.booty , options );
		xform.inner = $.extend( xform.inner , options );

		return xform;
	}


	function getContainerCenter( containerDims ) {

		var center = {x: 0, y: 0};

		if (!containerDims)
			return center;

		center.x = (containerDims.width / 2) - (this.dims.width / 2);
		center.y = ((window.innerHeight / 2) - containerDims.top) - (this.dims.height / 2);

		return center;
	}


	function getModalZ( parent ) {

		var containerDims = parent.getBoundingClientRect();
		var containerTop = parseInt(getComputedStyle( parent ).top , 10 );

		var d1 = (window.innerWidth - containerDims.width);
		var d2 = (window.innerHeight - (containerTop * 2));

		return (this.perspective - (d1 > d2 ? d1 : d2));
	}


	var views = {};

	views.home = function() {

		var booty = {
			translate: this.home,
			relative: false
		};

		var inner = {
			relative: false
		};

		this._deactivate();

		return {
			booty: booty,
			inner: inner
		};
	};

	views.modal = function() {

		var dims = this.parentNode.getBoundingClientRect();
		var t = getContainerCenter.call( this , dims );
		var z = getModalZ.call( this , this.parentNode );
		
		booty = {
			translate: t,
			relative: false
		};

		inner = {
			translate: {
				z: z
			},
			rotate: {y: 1, a: 180},
			relative: false
		};

		this._activate();

		return {
			booty: booty,
			inner: inner
		};
	};


	$.extend( _ , {tile: tile} );
	
}( linoleum ));




























