define([], function() {

  var UNDEFINED;
  var UNDEFINED_STR = '' + UNDEFINED;

  var len = 0;
  var toString = {}.toString;

  function asap( callback , arg ) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len == 2) {
      scheduleFlush();
    }
  }

  var browserWindow = (typeof window != UNDEFINED_STR) ? window : UNDEFINED;
  var browserGlobal = browserWindow || {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isNode = typeof process != UNDEFINED_STR && {}.toString.call(process) == '[object process]';

  var isWorker = typeof Uint8ClampedArray != UNDEFINED_STR &&
    typeof importScripts != UNDEFINED_STR &&
    typeof MessageChannel != UNDEFINED_STR;


  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });

    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }

  // web worker
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function () {
      channel.port2.postMessage(0);
    };
  }

  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }

  var queue = new Array(1000);

  function flush() {
    for (var i = 0; i < len; i+=2) {
      var callback = queue[i];
      var arg = queue[i+1];

      callback(arg);

      queue[i] = UNDEFINED;
      queue[i+1] = UNDEFINED;
    }

    len = 0;
  }

  var scheduleFlush;

  if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else {
    scheduleFlush = useSetTimeout();
  }

  return asap;

});



















