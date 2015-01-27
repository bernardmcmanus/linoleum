define([ 'util' ], function( util ) {


  var PROPERTIES = [ 'index' , 'sort' , 'sticky' , 'included' , 'enabled' ];


  function Tile( element ) {

    var that = this;

    that.element = element;

    PROPERTIES.forEach(function( key ) {
      var cKey = key.toUpperCase();
      var val = Linoleum._getAttr( element , Linoleum[cKey] );
      that[key] = util.notNull( val ) ? val : Tile.defaults[key];
    });
  }


  Object.defineProperties( Tile , {
    defaults: {
      get: function() {
        return {
          sticky: false,
          included: true,
          enabled: true
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
      element.setAttribute( Linoleum.INCLUDED , that.included );
      element.setAttribute( Linoleum.ENABLED , that.enabled );
      return that;
    }
  };


  return Tile;

});



















