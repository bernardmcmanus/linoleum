(function() {

	var awesome = new linoleum( '.tile' , {
		margin: {
			left: 20,
			right: 20,
			top: 10,
			bottom: 120
		},
		duration: 500,
		easing: 'easeOutBack',
		tile: {
			modal: {
				y: 150,
				z: 6500
			}
		}
	});

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

	$('.tile').on( 'click' , function() {
		
		var options = {
			duration: 300,
			modal: {
				z: 6500
			},
			easing: 'easeOutBack'
		};
		
		if (this.view === 'home') {

			this.setView( 'modal' , options , function() {
				console.log('modal.');
			});
		}
		else {

			this.setView( 'home' , options , function() {
				console.log('home.');
			});
		}

	});

}());























