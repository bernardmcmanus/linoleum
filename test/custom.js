(function() {

	/*$(window).on( 'scroll' , function() {
		console.log($(this).scrollTop());
	});*/

	var cool = new linoleum( '.tile' , {
		margin: {x: 40},
		duration: 500,
		//easing: 'easeOutBack'
	});

	cool.distribute( '#container' );

	$('#distribute').on( 'click' , function() {
		cool.distribute( '#container' , {} , function() {
			console.log('distributed.');
		});
	});

	$('#stack').on( 'click' , function() {
		cool.stack( 0 , {} , function() {
			console.log('stacked.');
		});
	});

	$('.tile').on( 'click' , function() {
		
		var options = {
			duration: 300,
			modalZ: 0.6,
			easing: 'easeOutBack'
		};
		
		if (this.view === 'home') {
			this.setView( 'modal' , options , function() {
				console.log('modal.');
			});
		} else {
			this.setView( 'home' , options , function() {
				console.log('home.');
			});
		}

	});

}());























