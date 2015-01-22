(function() {


  var tileCount = 10;
  var sortOrder = -1;
  var sticky = [ 2 , 6 ];
  var disabled = [ 1 , 4 ];


  for (var i = 0; i < tileCount; i++) {
    (function( tile ) {
      /*if (sticky.indexOf( i ) >= 0) {
        $(tile).addClass( 'sticky' );
      }*/
      /*if (disabled.indexOf( i ) >= 0) {
        $(tile).addClass( 'disabled' );
      }*/
      $('#container').append( tile );
    }( createTile( tileCount )));
  }

// ------------------------------------------------------- //

  var linoleum = new Linoleum( '#container > .tile' , {
    /*margin: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }*/
  });
  
  console.log(linoleum);

  linoleum.distribute( '#container' ).then(function() {
    console.log('done');
  });

  linoleum.$when( 'linoleum.resize' , function( e , grid ) {
    console.log(e);
    $('#container > .sizer').css( 'height' , grid.size.height );
    //$(document).trigger( 'linoleum.resize' , [ grid ]);
  });

  linoleum.$when( 'linoleum.sort' , function( e , grid ) {
    console.log(e);
  });

  linoleum.$when( 'linoleum.filter' , function( e , grid ) {
    console.log(e);
  });

  

  /*$('#add').on( 'click' , function() {
    linoleum.destroy();
    tileCount++;
    var tile = createTile( tileCount );
    $('#container').append( tile );
    linoleum = createLinoleum();
    initLinoleum();
  });*/


  $('#distribute').on( 'click' , function() {
    linoleum.distribute( '#container' );
    /*linoleum.distribute( '#container' , {} , function() {
      console.log('distributed.');
    });*/
  });


  $('#filter').on( 'click' , function() {
    /*linoleum.grid.forEach(function( element ) {
      var index = Linoleum._getAttr( element , Linoleum.INDEX );
      console.log(index % 2);
    });*/
    linoleum.filter(function( tile ) {
      //return ( tile.index / 2 ) === Math.round( tile.index / 2 );
      return !!(tile.index % 2);
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

  return;


// ------------------------------------------------------- //
  

  var awesome = createLinoleum();
  console.log(awesome);

  initLinoleum();

  $(window).on( 'linoleum.resize' , function( e , data ) {
    console.log(e);
  });


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

    /*$(awesome).hx().defer( 100 );

    awesome.distribute( '#container' );*/
  }


  function createTile( number ) {
    var tile = document.querySelector( '.templates .tile' ).cloneNode( true );
    $(tile).find( '.inner' ).html(
      $('#container > .tile').length
    );
    return tile;
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




















