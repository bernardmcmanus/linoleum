define([ 'util' ], function( util ) {


  var PROPERTIES = [ 'index' , 'sort' , 'sticky' , 'excluded' , 'disabled' ];


  function Tile( element ) {

    var that = this;

    that.element = element;

    PROPERTIES.forEach(function( key ) {
      var cKey = key.toUpperCase();
      var val = Linoleum.getAttr( element , Linoleum[cKey] );
      that[key] = util.notNull( val ) ? val : Tile.defaults[key];
    });
  }


  Object.defineProperties( Tile , {
    defaults: {
      get: function() {
        return {
          sticky: false,
          excluded: false,
          disabled: false
        };
      }
    }
  });


  Tile.prototype = {

    init: function( index ) {
      var that = this;
      that.index = index;
      that.sort = index;
      return that;
    },

    write: function( options ) {
      var that = this;
      var element = that.element;
      $.extend( that , options );
      element.setAttribute( Linoleum.INDEX , that.index );
      element.setAttribute( Linoleum.SORT_INDEX , that.sort );
      element.setAttribute( Linoleum.STICKY , that.sticky );
      element.setAttribute( Linoleum.EXCLUDED , that.excluded );
      element.setAttribute( Linoleum.DISABLED , that.disabled );
      return that;
    }
  };


  return Tile;

});



















