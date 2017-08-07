// PxLoader plugin to load video elements
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['PxLoader'], function (PxLoader) {
            return (root.PxLoaderVideo = factory(PxLoader));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('pxloader'));
    } else {
        // Browser globals
        root.PxLoaderVideo = factory(root.PxLoader);
    }
}(this, function (PxLoader) {
    function PxLoaderVideo(url, tags, priority, origin) {
        var self = this;
        var loader = null;

        this.readyEventName = 'canplaythrough';
        
        this.vid = document.createElement('video');

        if(origin !== undefined) {
            this.vid.crossOrigin = origin;
        }
        this.tags = tags;
        this.priority = priority;

        var onReadyStateChange = function() {
            if (self.vid.readyState !== 4) {
                return;
            }

            removeEventHandlers();
            loader.onLoad(self);
        };

        var onLoad = function() {
            removeEventHandlers();
            loader.onLoad(self);
        };

        var onError = function() {
            removeEventHandlers();
            loader.onError(self);
        };

        var removeEventHandlers = function() {
            self.unbind('load', onLoad);
            self.unbind(self.readyEventName, onReadyStateChange);
            self.unbind('error', onError);
        };

        this.start = function(pxLoader) {
            // we need the loader ref so we can notify upon completion
            loader = pxLoader;

            // NOTE: Must add event listeners before the src is set. We
            // also need to use the readystatechange because sometimes
            // load doesn't fire when an video is in the cache.
            self.bind('load', onLoad);
            self.bind(self.readyEventName, onReadyStateChange);
            self.bind('error', onError);

            // sometimes the browser will intentionally stop downloading
            // the video. In that case we'll consider the video loaded
            self.bind('suspend', onLoad);

            self.vid.src = url;
            self.vid.load();
        };

        // called by PxLoader to check status of video (fallback in case
        // the event listeners are not triggered).
        this.checkStatus = function() {
            if (self.vid.readyState !== 4) {
                return;
            }

            removeEventHandlers();
            loader.onLoad(self);
        };

        // called by PxLoader when it is no longer waiting
        this.onTimeout = function() {
            removeEventHandlers();
            if (self.vid.readyState !== 4) {
                loader.onLoad(self);
            } else {
                loader.onTimeout(self);
            }
        };

        // returns a name for the resource that can be used in logging
        this.getName = function() {
            return url;
        };

        // cross-browser event binding
        this.bind = function(eventName, eventHandler) {
            self.vid.addEventListener(eventName, eventHandler, false);
        };

        // cross-browser event un-binding
        this.unbind = function(eventName, eventHandler) {
            self.vid.removeEventListener(eventName, eventHandler, false);
        };

    }

    // add a convenience method to PxLoader for adding an image
    PxLoader.prototype.addVideo = function(url, tags, priority, origin) {
        var videoLoader = new PxLoaderVideo(url, tags, priority, origin);
        this.add(videoLoader);

        // return the vid element to the caller
        return videoLoader.vid;
    };

    return PxLoaderVideo;
}));
