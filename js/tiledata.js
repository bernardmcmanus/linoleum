Linoleum.TileData = (function( Object , Array , Linoleum ) {


  function TileData( element ) {

    var that = this;

    that.element = element;

    that.index = Linoleum._getAttr( element , Linoleum.INDEX );
    that.sticky = Linoleum._getAttr( element , Linoleum.STICKY );
    that.excluded = Linoleum._getAttr( element , Linoleum.EXCLUDED );
    that.disabled = Linoleum._getAttr( element , Linoleum.DISABLED );
  }


  TileData.prototype = {
    defaults: function() {
      var that = this;
      that.sticky = false;
      that.excluded = false;
      that.disabled = false;
      return that;
    },
    write: function() {
      var that = this;
      var element = that.element;
      element.setAttribute( Linoleum.INDEX , that.index );
      element.setAttribute( Linoleum.STICKY , that.sticky );
      element.setAttribute( Linoleum.EXCLUDED , that.excluded );
      element.setAttribute( Linoleum.DISABLED , that.disabled );
      return element;
    }
  };


  return TileData;

  
}( Object , Array , Linoleum ));




























