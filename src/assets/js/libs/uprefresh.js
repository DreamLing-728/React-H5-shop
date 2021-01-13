/*eslint-disable*/
var UpRefresh=function(opts,callback){
    if(opts instanceof Object) {
        this.opts = opts;
        this.iMaxPage=this.opts.maxPage;
        this.fnCallback=callback;
        this.iOffsetBottom=this.opts.offsetBottom;
        this.iCurPage=this.opts.curPage;
        this.init();
    }
};
UpRefresh.prototype={
    init:function(){
        var _this=this;
        _this.eventScroll();
    },
    eventScroll:function(){
        var _this=this;
        window.addEventListener("scroll",_this.scrollBottom());
    },
    scrollBottom:function(){
        var _this=this;
        var bScroll=true;
        return function(){
            if(!bScroll){
                return;
            }
            bScroll=false;
            setTimeout(function(){
                //网页可见区域高（内容撑起的高度，不定在可视区域）
                var iScrollHeight=document.documentElement.offsetHeight || document.body.offsetHeight;
                //网页被卷去的高
                var iScrollTop=document.documentElement.scrollTop || document.body.scrollTop;
                //网页可见区域高
                var iWinHeight=document.documentElement.clientHeight || document.body.clientHeight;
                console.log('网页可见区域高，网页被卷去的高，整个窗体的距离', iScrollHeight, iScrollTop, iWinHeight);
                if(iScrollHeight-(iWinHeight+iScrollTop)<=_this.iOffsetBottom){
                    if(_this.iCurPage<_this.iMaxPage) {
                        _this.iCurPage++;
                        _this.fnCallback(_this.iCurPage);
                    }
                }
                bScroll=true;
            },100);
        }
    }
};

//这个判断支持模块化比如react和vue
if ( typeof module != 'undefined' && module.exports ) {
    module.exports = UpRefresh;
} else if ( typeof define == 'function' && define.amd ) {
    define( function () { return UpRefresh; } );
} else if(typeof window != "undefined") {
    window.UpRefresh = UpRefresh;
}

