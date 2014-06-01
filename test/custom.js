(function() {


	Linoleum.Tile.defineView( 'modal' , {

		tile: function( tile ) {

			//var containerBCR = document.querySelector( '#container' ).getBoundingClientRect();

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

	
	addNumbers();

	
	var awesome = new Linoleum( '.tile' , {
		margin: {
            left: 5,
            right: 20,
            top: 40,
            bottom: 0
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
		this.distribute();
	};

	awesome.afterSort = function() {
		this.distribute();
	};

	awesome.distribute( '#container' );

	console.log(awesome);


	$('#distribute').on( 'click' , function() {
		awesome.distribute( '#container' , {} , function() {
			console.log('distributed.');
		});
	});

	$('#filter').on( 'click' , function() {
		/*var exclude = $('#filter-input').val().split( ',' ).map(function( a ) {
			return parseInt( a , 10 );
		});
		awesome.lFilter( exclude );*/

		/*awesome.forEach(function( tile ) {
			console.log(( tile.index / 2 ) === Math.round( tile.index / 2 ));
		});*/

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

	$('.tile').on( 'click' , function() {
		
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

	function addNumbers() {
		$('.tile').each(function( i ) {
			var n = i + 1;
			$(this).find( '.inner' ).children().html( n );
		});
	}

}());























