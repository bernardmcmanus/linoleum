(function( Linoleum ) {


    var Static = {
        views: {},
        hxViewKeys: [ 'tile' , 'inner' ]
    };


    function Config() {
        this.view = 'home';
        this.views = {};
    }


    function Tile( element , options ) {

        $.extend( this , new Config() , ( options || {} ));

        var that = init( this , element );

        Object.defineProperty( that , 'index' , {
            get: function() {
                var attribute = that.indexAttribute.replace( /data\-/ , '' );
                return parseInt( that.dataset[attribute] , 10 );
            },
            configurable: true
        });

        Object.defineProperty( that , 'sticky' , {
            get: function() {
                return $(that).hasClass( that.stickyClass );
            },
            configurable: true
        });

        Object.defineProperty( that , 'active' , {
            get: function() {
                return $(that).hasClass( that.activeClass );
            },
            configurable: true
        });

        Object.defineProperty( that , 'included' , {
            get: function() {
                return !$(that).hasClass( that.excludeClass );
            },
            configurable: true
        });

        Object.defineProperty( that , 'enabled' , {
            get: function() {
                return !$(that).hasClass( that.disableClass );
            },
            configurable: true
        });

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
                throw new TypeError( 'linoleum.tile has no view \'' + name + '\'.' );
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


    function init( instance , element ) {

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
    }


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
        $(element).hx({
            type: 'transform',
            translate: {z: z},
            rotateY: r,
            duration: 0,
            fallback: false
        });
    }


    function getCompiledView( instance , name , options ) {

        var viewDefinition = instance.views[name] || Static.views[name];

        if (!viewDefinition) {
            return false;
        }

        options = options || {};

        var compiledView = $.extend( {} , viewDefinition );

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

        callback = callback || function() {};

        var tile = instance;
        var inner = instance.querySelector( '.inner' );

        compiledView.before( instance );

        $(tile).hx( compiledView.tile );
        $(inner).hx( compiledView.inner );

        $([ tile , inner ]).hx( 'done' , function() {
            instance.view = name;
            compiledView.after( instance );
            callback();
        });
    }


    function View( components ) {

        this.tile = function() {
            return {type: 'transform'};
        };

        this.inner = function() {
            return {type: 'transform'};
        };

        this.before = function() {

        };

        this.after = function() {

        };

        $.extend( this , components );
    }


    $.extend( Linoleum , { Tile: Tile });

    
}( Linoleum ));




























