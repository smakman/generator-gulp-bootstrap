'use strict';

var FUSE = FUSE || {};

(function($) {

	var console = window.console || {
    log: function () { }
  };

  FUSE.Events = {};

  FUSE.EventManager = (function() {
    return {
      subscribe: function (event, fn) {
        $(this).unbind(event, fn).bind(event, fn);
      },
      resign: function (event, fn) {
        $(this).unbind(event, fn);
      },
      publish: function (event) {
        $(this).trigger(event);
      }
    };
  } ());

  FUSE.PageManager = (function() {
    var Page;

    Page = (function(ref) {
      var self = {};

      self.init = function() {

      };

      return self;
    }) ();

    var initialised = false;

    return {
      init: function() {
        if (initialised) {
          return;
        }
        initialised = true;
        Page.init();
      },
      Page: Page
    }

  }) ();

}) (jQuery);

$(document).on('ready', FUSE.PageManager.init);