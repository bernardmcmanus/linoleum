define([], function() {

  function is( subject , test ) {
    return (typeof test == 'string') ? (typeof subject == test) : (subject instanceof test);
  }

  function notNull( subject ) {
    return subject !== null && !is( subject , 'undefined' );
  }

  function ensureArray( subject ) {
    return (subject.jquery ? subject.toArray() : (Array.isArray( subject ) ? subject : [ subject ]));
  }

  function arrayCast( subject ) {
    return Array.prototype.slice.call( subject , 0 );
  }

  function inverse( full , partial ) {
    return full.filter(function( element ) {
      return partial.indexOf( element ) < 0;
    });
  }

  function last( subject ) {
    return subject[( subject.length || 1 ) - 1 ];
  }

  function getIndexes( elements ) {
    return ensureArray( elements ).map(function( element ) {
      return is( element , 'number' ) ? element : Linoleum.getAttr( element , Linoleum.INDEX );
    });
  }

  function bcr( subject ) {
    return subject.getBoundingClientRect();
  }

  return {
    is: is,
    notNull: notNull,
    ensureArray: ensureArray,
    arrayCast: arrayCast,
    inverse: inverse,
    last: last,
    getIndexes: getIndexes,
    bcr: bcr
  };

});



















