window.linoleum = (function() {


  var linoleum = new Linoleum( '#container > .tile' /*, {
    margin: 0
  }*/)
  .$when( 'error' , function( e , err ) {
    console.error( err.stack );
  })
  .$when( 'distribute' , function( e , grid ) {
    console.log( e.type );
  })
  .$when( 'nudge' , function( e , grid ) {
    console.log( e.type );
  })
  .$when( 'resize' , function( e , grid ) {
    console.log( e.type );
    //$(document).trigger( 'linoleum.resize' , [ grid ]);
  })
  .$when( 'sort' , function( e , grid ) {
    console.log( e.type );
    linoleum.distribute({ delay: 0 });
  })
  .$when( 'filter' , function( e , grid ) {
    console.log(e.type);
    /*linoleum.subset({ included: true }).css( 'display' , '' );
    linoleum.subset({ included: false }).css( 'display' , 'none' );*/
    linoleum.distribute({ delay: 0 });
  })
  .$when( 'add' , function( e , elements ) {
    console.log( e.type );
    linoleum.distribute({ delay: 0 });
  })
  .$when( 'remove' , function( e , elements ) {
    console.log( e.type );
    linoleum.distribute({ delay: 0 });
  })
  .$when( 'tile.sticky' , function( e , elements , value ) {
    console.log( e.type );
  })
  .$when( 'tile.excluded' , function( e , elements , value ) {
    console.log( e.type );
  })
  .$when( 'tile.disabled' , function( e , elements , value ) {
    console.log( e.type );
  })
  .sizer();

  linoleum.distribute( '#container' ).then(function() {
    console.log('done');
  });

  console.log(linoleum);


  return linoleum;


}());



















