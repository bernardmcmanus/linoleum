(function() {

  var tileCount = 12;
  var sortOrder = -1;
  var sticky = [ 2 , 6 ];
  var disabled = [ 1 , 4 ];


  function createTile( append ) {
    var tile = document.querySelector( '.templates .tile' ).cloneNode( true );
    observeTile( tile );
    if (append) {
      $('#container').append( tile );
    }
    return tile;
  }

  function observeTile( element ) {
    var observer = new MutationObserver(function( mutations ) {
      mutations.filter(function( m ) {
        return m.attributeName == Linoleum.INDEX;
      })
      .forEach(function( m ) {
        $(element).find( '.inner' ).html( element.dataset.linoleumIndex );
      });
    });
    observer.observe( element , { attributes: true });
    return observer;
  }

  for (var i = 0; i < tileCount; i++) {
    createTile( true );
  }

// ------------------------------------------------------- //

  var linoleum = new Linoleum( '#container > .tile' , {
    margin: 0
  })
  .$when( 'linoleum.error' , function( e , err ) {
    console.error( err.stack );
  })
  /*.$when([ 'linoleum.sort' , 'linoleum.filter' ] , function( e , grid ) {
    e.preventDefault();
  })*/
  .$when( 'linoleum.distribute' , function( e , grid ) {
    console.log(e.type/*,grid*/);
  })
  .$when( 'linoleum.resize' , function( e , grid ) {
    console.log(e.type/*,grid*/);
    //$(document).trigger( 'linoleum.resize' , [ grid ]);
  })
  .$when( 'linoleum.sort' , function( e , grid ) {
    console.log(e.type/*,grid*/);
    linoleum.distribute({ delay: 0 });
  })
  .$when( 'linoleum.filter' , function( e , grid ) {
    console.log(e.type/*,grid*/);
    $(linoleum.included).css( 'display' , '' );
    $(linoleum.excluded).css( 'display' , 'none' );
    linoleum.distribute({ delay: 0 });
  })
  .$when( 'linoleum.add' , function( e , elements ) {
    console.log( e.type );
    linoleum.distribute({ delay: 0 });
  })
  .$when( 'linoleum.remove' , function( e , elements ) {
    console.log( e.type );
    linoleum.distribute({ delay: 0 });
  })
  .sizer();

  linoleum.distribute( '#container' ).then(function() {
    console.log('done');
  });

  console.log(linoleum);

// ------------------------------------------------------- //

  $('#size-width').val(Math.round( linoleum.grid.iSize.width / 2 ));
  $('#size-height').val(Math.round( linoleum.grid.iSize.height / 2 ));


  $('#size').on( 'click' , function( e ) {
    $('#container > .tile').css({
      width: $('#size-width').val() + 'px',
      height: $('#size-height').val() + 'px',
      'line-height': $('#size-height').val() + 'px'
    });
    linoleum.distribute({ delay: 0 });
  });


  $('#add').on( 'click' , function() {
    linoleum.add(createTile( true ));
  });

  $('#remove').on( 'click' , function() {
    var elements = $('#remove-input').val().split( ',' ).map(function( i ) {
      var index = parseInt( i , 10 );
      return $('#container > .tile').eq( index ).remove().get( 0 );
    });
    console.log(elements);
    linoleum.remove( elements );
  });

  $('#distribute').on( 'click' , function() {
    linoleum.distribute({ delay: 0 });
  });


  $('#filter').on( 'click' , function() {
    var exclude = $('#filter-input').val().split( ',' ).map(function( i ) {
      return parseInt( i , 10 );
    });
    linoleum.filter(function( tile ) {
      return exclude.indexOf( tile.index ) < 0;
    });
  });


  $('#sort').on( 'click' , function() {
    linoleum.sort(function( a , b ) {
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
    linoleum.filter();
  });


}());



















