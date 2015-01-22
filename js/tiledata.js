Linoleum.TileData = (function( Object , Array , Linoleum ) {


  function TileData( element ) {

    var that = this;

    that.element = element;

    that.index = Linoleum._getAttr( element , Linoleum.INDEX );
    that.sticky = Linoleum._getAttr( element , Linoleum.STICKY );
    that.included = Linoleum._getAttr( element , Linoleum.INCLUDED );
    that.enabled = Linoleum._getAttr( element , Linoleum.ENABLED );
  }


  Object.defineProperties( TileData , {
    defaults: {
      get: function() {
        /*var defaults = {};
        defaults[ Linoleum.STICKY ] = false;
        defaults[ Linoleum.INCLUDED ] = true;
        defaults[ Linoleum.ENABLED ] = true;
        return defaults;*/
        return {
          sticky: false,
          included: true,
          enabled: false
        };
      }
    }
  });


  /*TileData.defaults = {};
  TileData.defaults[ Linoleum.STICKY ] = false;
  TileData.defaults[ Linoleum.INCLUDED ] = true;
  TileData.defaults[ Linoleum.ENABLED ] = true;*/


  TileData.prototype = {
    defaults: function() {
      var that = this;
      that.sticky = TileData.defaults.sticky;
      that.included = TileData.defaults.included;
      that.enabled = TileData.defaults.enabled;
      return that;
    },
    write: function() {
      var that = this;
      var element = that.element;
      element.setAttribute( Linoleum.INDEX , that.index );
      element.setAttribute( Linoleum.STICKY , that.sticky );
      element.setAttribute( Linoleum.INCLUDED , that.included );
      element.setAttribute( Linoleum.ENABLED , that.enabled );
      return element;
    }
  };


  return TileData;

  
}( Object , Array , Linoleum ));




























