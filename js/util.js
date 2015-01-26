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

  return {
    is: is,
    notNull: notNull,
    ensureArray: ensureArray,
    arrayCast: arrayCast
  };

});