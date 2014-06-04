(function() {


	var tileCount = 0;


	for (var i = 0; i < 10; i++) {
		tileCount++;
		var tile = createTile( tileCount );
		if (i === 0) {
			$(tile).addClass( 'sticky' );
		}
		$('#container').append( tile );
	}


	Linoleum.Tile.defineView( 'modal' , {

		tile: function( tile ) {

			return {
				type: 'transform',
				translate: {
					x: ($(window).width() / 2) - (tile.bcr.width / 2) - awesome.containerBCR.left,
					y: 200 + $(window).scrollTop()
				}
			};
		},
		
		inner: {
			type: 'transform',
			scale2d: {x: 2.5, y: 2.5},
			rotateY: 180
		},

		before: function( tile ) {
			tile.activate();
		}
	});


	var sortOrder = -1;
	
	var awesome = createLinoleum();

	initLinoleum();

	console.log(awesome);


	function createLinoleum() {
		return new Linoleum( '.tile.instance' , {
			margin: {
	            left: 5,
	            right: 20,
	            top: 40,
	            bottom: 0
	        }
		});
	}


	function initLinoleum() {

		awesome.lSort(function( a , b ) {
			if (sortOrder > 0) {
				return a.index - b.index;
			}
			else {
				return b.index - a.index;
			}
		});

		awesome.onTileExclude = function( tile ) {
			if (tile.view !== 'home') {
				tile.setView( 'home' , {
					duration: 0
				});
				awesome.enable();
			}
		};

		awesome.afterFilter = function() {
			awesome.distribute();
		};

		awesome.afterSort = function() {
			awesome.distribute();
		};

		awesome.distribute( '#container' );

		initTiles();
	}


	function createTile( number ) {
		var tile = document.querySelector( '.templates .tile' ).cloneNode( true );
		$(tile)
		.addClass( 'instance' )
		.find( '.inner' ).children().html( number );
		return tile;
	}


	function initTiles() {

		$('.tile.instance').off( 'click' ).on( 'click' , function() {
			
			if (this.view === 'home') {

				this.setView( 'modal' , null , function() {
					console.log('modal.');
					awesome.disable();
				});
			}
			else {

				this.setView( 'home' , null , function() {
					console.log('home.');
					awesome.enable();
				});
			}

		});
	}


	$('#add').on( 'click' , function() {
		awesome.destroy();
		tileCount++;
		var tile = createTile( tileCount );
		$('#container').append( tile );
		awesome = createLinoleum();
		initLinoleum();
	});


	$('#distribute').on( 'click' , function() {
		awesome.distribute( '#container' , {} , function() {
			console.log('distributed.');
		});
	});


	$('#filter').on( 'click' , function() {

		awesome.lFilter(function( tile ) {
			return ( tile.index / 2 ) === Math.round( tile.index / 2 );
		});
	});

	
	$('#sort').on( 'click' , function() {

		awesome.lSort(function( a , b ) {
			if (sortOrder > 0) {
				return a.index - b.index;
			}
			else {
				return b.index - a.index;
			}
		});

		sortOrder = (sortOrder < 0 ? 1 : -1);
	});

	
	$('#clear').on( 'click' , function() {
		awesome.lFilter();
	});

}());























