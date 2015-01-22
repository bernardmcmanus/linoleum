Linoleum.Tile = (function( Object , Array , Error , parseInt , $ , Linoleum ) {


  var Static = {
    views: {},
    hxViewKeys: [ 'tile' , 'inner' ]
  };


  function Config() {
    this.view = 'home';
    this.views = {};
  }


  function Tile( element , options ) {

    var that = $.extend( element , this , new Config() , options );

    Object.defineProperties( that , {

      index: descriptor(function() {
        return Linoleum._getAttr( that , Linoleum.INDEX );
      }),

      sticky: descriptor(function() {
        return $(that).hasClass( that.stickyClass );
      }),

      active: descriptor(function() {
        return $(that).hasClass( that.activeClass );
      }),

      included: descriptor(function() {
        return !$(that).hasClass( that.excludeClass );
      }),

      enabled: descriptor(function() {
        return !$(that).hasClass( that.disableClass );
      })
    });

    that.bcr = getAdjustedBCR( element );

    return that;
  }

  
  Tile.defineView = function( name , components ) {
    Static.views[name] = new View( components );
  };


  Tile.prototype = {

    defineView: function( name , components ) {
      this.views[name] = new View( components );
    },

    setView: function ( name , options , callback ) {

      if (this.view === name || !this.enabled) {
        return;
      }

      var compiledView = getCompiledView( this , name , options );

      if (!compiledView) {
        throw new Error( 'linoleum.tile has no view \'' + name + '\'.' );
      }

      applyView( this , name , compiledView , callback );
    },

    stick: function() {
      $(this).addClass( this.stickyClass );
    },

    unstick: function() {
      $(this).removeClass( this.stickyClass );
    },

    enable: function() {
      $(this).removeClass( this.disableClass );
    },

    disable: function() {
      $(this).addClass( this.disableClass );
    },

    include: function() {
      $(this).removeClass( this.excludeClass );
    },

    exclude: function() {
      $(this).addClass( this.excludeClass );
    },

    activate: function() {
      $(this).addClass( this.activeClass );
    },

    deactivate: function() {
      $(this).removeClass( this.activeClass );
    }
  };


  /*function init( instance , element ) {

    instance.bcr = getAdjustedBCR( element );

    $(element).css({
      '-webkit-perspective': instance.perspective + 'px',
      'perspective': instance.perspective + 'px'
    });

    var front = $(element).find( '.face.front' ).get( 0 );
    var back = $(element).find( '.face.back' ).get( 0 );

    var tz = (instance.thickness * instance.perspective);

    setDepth( front , tz );
    setDepth( back , -tz , 180 );

    return $.extend( element , instance );
  }*/


  function getAdjustedBCR( element ) {
    var bcr = element.getBoundingClientRect();
    var adjusted = {
      width: parseInt(getComputedStyle( element ).width , 10 ),
      height: parseInt(getComputedStyle( element ).height , 10 ),
      left: bcr.left,
      top: bcr.top
    };
    adjusted.right = adjusted.left + adjusted.width;
    adjusted.bottom = adjusted.top + adjusted.height;
    return adjusted;
  }


  function setDepth( element , z , r ) {
    $(element)
    .hx()
    .update({
      type: 'transform',
      translate: {z: z},
      rotateY: r
    })
    .paint();
  }


  function getCompiledView( instance , name , options ) {

    var viewDefinition = instance.views[name] || Static.views[name];

    if (!viewDefinition) {
      return false;
    }

    options = options || {};

    var compiledView = Object.create( viewDefinition );

    Static.hxViewKeys.forEach(function( key ) {

      var viewComponent = compiledView[key];

      if (typeof viewComponent === 'function') {
        viewComponent = viewComponent( instance );
      }

      if (!Array.isArray( viewComponent )) {
        viewComponent = [ viewComponent ];
      }

      viewComponent.forEach(function( bean ) {
        $.extend( bean , options );
      });

      compiledView[key] = viewComponent;
    });

    return compiledView;
  }


  function applyView( instance , name , compiledView , callback ) {

    var tile = instance;
    var inner = instance.querySelector( '.inner' );

    compiledView.before( instance );

    $(tile).hx()[ compiledView.method ]( compiledView.tile );
    $(inner).hx()[ compiledView.method ]( compiledView.inner );

    $([ tile , inner ])
    .hx()
    .then(function( resolve ) {
      instance.view = name;
      compiledView.after( instance );
      resolve();
    })
    .done( callback );
  }


  function View( components ) {

    var that = this;

    that.method = 'animate';

    that.tile = function() {
      return {type: 'transform'};
    };

    that.inner = function() {
      return {type: 'transform'};
    };

    that.before = function() {

    };

    that.after = function() {

    };

    $.extend( that , components );
  }


  function descriptor( get , set ) {
    return {
      get: get,
      set: set,
      configurable: true
    };
  }


  return Tile;

  
}( Object , Array , Error , parseInt , jQuery , Linoleum ));




























