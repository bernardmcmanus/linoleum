(function() {


	var sortOrder = -1;

	
	addNumbers();

	
	var awesome = new linoleum( '.tile' , {
		margin: {
            left: 5,
            right: 20,
            top: 40,
            bottom: 40
        },
		duration: 400
	});

	awesome.onTileExclude = function( tile ) {
		$(tile).addClass( 'exclude' );
	};

	awesome.onTileInclude = function( tile ) {
		$(tile).removeClass( 'exclude' );
	};

	awesome.afterFilter = function() {
		this.distribute();
	};

	awesome.afterSort = function() {
		this.distribute();
	};

	awesome.distribute( '#container' );


	$('#distribute').on( 'click' , function() {
		awesome.distribute( '#container' , {} , function() {
			console.log('distributed.');
		});
	});

	$('#stack').on( 'click' , function() {

		var position = {
			x: 20,
			y: 0
		};

		var options = {
			easing: 'easeOutExpo'
		};

		awesome.stack( position , options , function() {
			console.log('stacked.');
		});
	});

	$('#filter').on( 'click' , function() {
		var exclude = $('#filter-input').val().split( ',' ).map(function( a ) {
			return parseInt( a , 10 );
		});
		awesome.filter( exclude );
	});

	$('#sort').on( 'click' , function() {

		awesome.sort(function( a , b ) {
			if (sortOrder > 0) {
				return a.getIndex() - b.getIndex();
			}
			else {
				return b.getIndex() - a.getIndex();
			}
		});

		sortOrder = (sortOrder < 0 ? 1 : -1);
	});

	$('#clear').on( 'click' , function() {
		awesome.filter( [] );
	});

	$('.tile').on( 'click' , function() {

		var top = $('#container').position().top;
		var y = top * 2;
		
		var options = {
			duration: 300,
			modal: {
				y: $(window).scrollTop() < top ? ($(window).scrollTop() + y) : ($(window).scrollTop() + y - top),
				z: 6500
			}
		};
		
		if (this.view === 'home') {

			this.setView( 'modal' , options , function() {
				console.log('modal.');
				awesome.disable();
				console.log(this.getBoundingClientRect().top);
			});
		}
		else {

			this.setView( 'home' , options , function() {
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























