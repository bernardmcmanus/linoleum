(function() {

    var config = {
        enabled: true,
        margin: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        },
        stackPosition: {
            x: 0,
            y: 0
        },
        distroDelay: 200,
        duration: 300,
        easing: 'ease',
        tile: {
            perspective: 10000,
            thickness: 0.001,
            modal: {
                x: null,
                y: null,
                z: 5000
            }
        }
    };


    window.linoleum = function( selector , options ) {

        var els = document.querySelectorAll( selector );

        if (els.length < 1) {
            throw 'Error: You must pass a valid selector to the linoleum constructor.';
        }

        this.options = $.extend( true , config , ( options || {} ));

        var tiles = [];

        Array.prototype.forEach.call( els , function( i ) {
            tiles.push(new linoleum.tile( i , this.options.tile ));
        }.bind( this ));

        var that = $.extend( tiles , this );

        if (!that.options.enabled) {
            that.disable();
        }
        else {
            that.enable();
        }

        return that;
    };

    linoleum.prototype = {

        distribute: function( selector , options , callback ) {

            if (!this._setView( 'distribute' )) {
                return;
            }

            if (this.length < 1) {
                return;
            }

            if (!selector || selector === '') {
                throw 'Error: You must pass a valid selector to linoleum.distribute.';
            }

            var parent = document.querySelector( selector );

            if (!parent || parent.length < 1) {
                throw 'Error: You must pass a valid selector to linoleum.distribute.';
            }

            options = $.extend({
                margin: this.options.margin,
                duration: this.options.duration,
                easing: this.options.easing
            }, (options || {}));

            this.Columns = _distribute.call( this , parent , options , function() {
                this.enable();
                callback.call( this );
            });

            return this;
        },

        stack: function( position , options , callback ) {

            if (!this._setView( 'stack' )) {
                return;
            }

            position = $.extend( config.stackPosition , (position || {}));

            options = $.extend({
                duration: this.options.duration,
                easing: this.options.easing
            }, (options || {}));

            callback = callback || function() {};

            var t = null;

            for (var i = 0; i < this.length; i++) {
                if (this[i].view !== 'home') {
                    t = i;
                    break;
                }
            }

            if (t !== null) {
                this[t].setView( 'home' , options , function() {
                    _stack.call( this , position , options , callback );
                }.bind( this ));
            }
            else {
                _stack.call( this , position , options , callback );
            }

            return this;
        },

        _setView: function ( view ) {
            
            if (this.view === view) {
                return false;
            }

            this._stopListen( this.view );

            if (view === 'distribute') {
                this._activate();
            }
            else {
                this._deactivate();
            }

            this._startListen( view );
            this.view = view;
            
            return true;
        },

        _startListen: function( view ) {

            if (this.listener || typeof listeners[ view ] !== 'function') {
                return;
            }
            
            this.listener = listeners[ view ].bind( this );
            startListen[ view ].call( this , this.listener );
        },

        _stopListen: function( view ) {

            if (!view) {
                return;
            }
            
            if (!this.listener || typeof listeners[ view ] !== 'function') {
                return;
            }

            stopListen[ view ].call( this , this.listener );
            this.listener = null;
        },

        isEnabled: function() {
            return this.enabled === true;
        },

        enable: function() {
            
            this.forEach(function( tile ) {
                tile.enable();
            });
            
            this.enabled = true;
        },

        disable: function( evenActive ) {
            
            this.forEach(function( tile ) {
                if (!evenActive && $(tile).hasClass( 'active' )) {
                    return;
                }
                tile.disable();
            });
            
            this.enabled = false;
        },

        _activate: function() {
            $(this).css( 'pointer-events' , 'auto' );
        },

        _deactivate: function() {
            $(this).css( 'pointer-events' , 'none' );
        }

    };


    function _stack( translate , options , callback ) {

        var xformTile = $.extend({
            type: 'transform',
            translate: translate,
        }, options );

        var xformInner = $.extend({
            type: 'transform',
            rotate: {x: 1, a: 80}
        }, options );

        var completed = 0;

        function position( tile ) {
            $(tile).hx( xformTile );
            $(tile).find( '.inner' )
            .hx( xformInner )
            .done(checkComplete.bind( this ));
        }

        function checkComplete() {
            completed++;
            if (completed === this.length) {
                callback.call( this );
            }
        }

        function exec() {
            this.forEach(position.bind( this ));
        }

        exec.call( this );
    }


    function _distribute( parent , options , callback ) {

        callback = callback || function() {};
        var containerDims = parent.getBoundingClientRect();
        var Columns = 0;
        var Rows = 0;
        var completed = 0;

        function position( tile , row , col ) {

            var ox = getCenterOffsetX( tile , Columns , options );

            var t = {
                x: (col * tile.dims.width) + (options.margin.left * (col + 1)) + (options.margin.right * (col + 1)) + ox,
                y: (row * tile.dims.height) + (options.margin.bottom * row) + (options.margin.top * (row + 1))
            };

            tile.setHome( t );

            $(tile).hx({
                type: 'transform',
                translate: t,
                easing: options.easing,
                duration: options.duration
            });

            $(tile).find( '.inner' )
            .hx({
                type: 'transform',
                rotate: null,
                duration: options.duration,
                easing: options.easing
            })
            .done(checkComplete.bind( this ));
        }

        function sizeSizer( rows ) {
            var totalY = getTotalY.call( this , rows , options );
            $(parent).children( '.sizer' ).css( 'height' , totalY + 'px' );
        }

        function checkComplete() {
            completed++;
            if (completed === this.length) {
                callback.call( this );
            }
        }

        function exec() {

            var totalX = getTotalX.call( this , options );
            Columns = getCols.call( this , totalX , containerDims );
            Rows = getRows.call( this , Columns );

            sizeSizer.call( this , Rows );

            var i = 0;

            for (var row = 0; row < Rows; row++) {

                for (var col = 0; col < Columns; col++) {

                    if (i >= this.length) {
                        continue;
                    }

                    position.call( this , this[i] , row , col );

                    i++;
                }
            }
        }

        exec.call( this );
        return Columns;
    }

    function getCenterOffsetX( tile , cols , options ) {
        var parentDims = tile.parentNode.getBoundingClientRect();
        var marginX = options.margin.left + options.margin.right;
        return (parentDims.width - (tile.dims.width * cols) - (marginX * (cols + 1))) / 2;
    }

    function getTotalX( options ) {
        var marginX = options.margin.left + options.margin.right;
        return (this[0].dims.width * this.length) + (marginX * (this.length + 1));
    }

    function getTotalY( rows , options ) {
        var marginY = options.margin.top + options.margin.bottom;
        return (this[0].dims.height * rows) + (marginY * (rows + 1));
    }

    function getInstanceX( totalX ) {
        return totalX / this.length;
    }

    function getInstanceY( rows , totalY ) {
        return totalY / rows;
    }

    function getRows( cols ) {
        return Math.ceil( this.length / cols );
    }

    function getCols( totalX , containerDims ) {
        
        var instX = getInstanceX.call( this , totalX );
        var cols = 0;
        
        while ((cols * instX) < containerDims.width) {
            cols++;
        }

        if ((cols * instX) > containerDims.width) {
            cols -= 1;
        }

        return cols;
    }


    var listeners = {};

    listeners.distribute = function( e ) {

        var parent = this[0].parentNode;
        var dims = parent.getBoundingClientRect();
        
        var totalX = getTotalX.call( this , this.options );
        var cols = getCols.call( this , totalX , dims );
        
        if (this.Columns === cols) {
            var opt = $.extend( {} , this.options , {
                duration: 0,
                fallback: false
            });
            _distribute.call( this , parent , opt );
            return;
        }

        var timeout = setTimeout(function() {
            this.Columns = _distribute.call( this , parent , this.options );
        }.bind( this ) , this.options.distroDelay );

        $(window).on( 'resize orientationchange' , function timer() {
            $(window).off( 'resize orientationchange' , timer );
            clearTimeout( timeout );
        });

    };


    var startListen = {};

    startListen.distribute = function( listener ) {
        $(window).on( 'resize orientationchange' , listener );
    };


    var stopListen = {};

    stopListen.distribute = function( listener ) {
        $(window).off( 'resize orientationchange' , listener );
    };

    
}());




























