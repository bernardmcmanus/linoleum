(function() {

	var awesome = new linoleum( '.tile' , {
		margin: {
            left: 5,
            right: 20,
            top: 40,
            bottom: 40
        },
		duration: 500
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

}());























