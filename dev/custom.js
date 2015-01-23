(function() {

  var tileCount = 12;
  var sortOrder = -1;
  var sticky = [ 2 , 6 ];
  var disabled = [ 1 , 4 ];


  function createTile( number ) {
    var tile = document.querySelector( '.templates .tile' ).cloneNode( true );
    $(tile).find( '.inner' ).html(
      $('#container > .tile').length
    );
    return tile;
  }


  for (var i = 0; i < tileCount; i++) {
    (function( tile ) {
      $('#container').append( tile );
    }( createTile( tileCount )));
  }

// ------------------------------------------------------- //

  var linoleum = new Linoleum( '#container > .tile' , {
    margin: 0
  })
  .$when( 'linoleum.distribute' , function( e , grid ) {
    console.log(e.type/*,grid*/);
  })
  .$when( 'linoleum.resize' , function( e , grid ) {
    console.log(e.type/*,grid*/);
    //$(document).trigger( 'linoleum.resize' , [ grid ]);
  })
  .$when( 'linoleum.sort' , function( e , grid ) {
    console.log(e.type/*,grid*/);
  })
  .$when( 'linoleum.filter' , function( e , grid ) {
    //console.log(e.type,grid);
    $(linoleum.included).css( 'display' , '' );
    $(linoleum.excluded).css( 'display' , 'none' );
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
    linoleum.distribute( null , { delay: 0 });
  });


  $('#add').on( 'click' , function() {
    var tile = createTile( tileCount );
    linoleum.add( tile );
    /*linoleum.destroy();
    tileCount++;
    var tile = createTile( tileCount );
    $('#container').append( tile );
    linoleum = createLinoleum();
    initLinoleum();*/
  });


  $('#distribute').on( 'click' , function() {
    linoleum.distribute( '#container' );
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



















