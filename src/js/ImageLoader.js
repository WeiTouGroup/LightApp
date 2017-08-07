/**
 * Created by PuTi(编程即菩提) 1/13/17.
 */
nb.name('app.imageMap',{});
nb.define({
    name: 'app.ImageLoader',
    method: {
        init: function () {
            var loader = this._loader = new PxLoader();
        },
        load: function (inOpts) {
            var loader = this._loader;
            var images = app.imageMap;
            var opts = inOpts || opts;
            var imageList = opts.imageList;
            var scope = opts.scope;
            var fn = opts.fn;
            if (imageList && imageList.length > 0) {
                $.each(imageList, function (inIndex, inImage) {
                    var pxImage = new PxLoaderImage(inImage);
                    images[inImage] = pxImage;
                    pxImage.imageNumber = inIndex + 1;
                    loader.add(pxImage);
                });
                loader.addProgressListener(function (e) {
                    var value = e.completedCount / e.totalCount;
                    //var percent = Math.floor((value) * 100);
                    fn.call(scope,value);
                });
                loader.start();
            }
        }
    }
});

