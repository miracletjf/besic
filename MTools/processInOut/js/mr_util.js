/**
 * Created by MiracleTJF on 2018/1/22.
 */
/**  过程构造函数（2018-1-19： 汤井福）
 *      1.属性
 *          (1).元素对象
 *          (2).当前对象名称
 *          (3).过程对象数组（{名称,内容}）
 *      2.方法
 *          (1).getNowStatue() 生成当前过程html,并且添加到当前元素对象中
 *          (2).htmlConnect() 生成单个process的html
 * */
function Process(selector,name,num) {
    this.selector = selector;
    this.name = name;
    this.num = num;
    this.proList = [{name:'sign',text:'登记'},{name:'example',text:'扦样'},{name:'check',text:'检验'},{name:'weight1',text:'称重(毛)'},
        {name:'unload',text:'值仓'},{name:'weight2',text:'称重(皮)'},{name:'count',text:'结算'}];
}

Process.prototype = {
    //构造函数
    constructor: Process,

    getNowStatue: function () {
        var proHtml = '';
        var flag = !this.name;
        var list = this.proList;
        var number = this.num;

        for(var i=0;i<list.length;i++){
            var item = list[i];
            if(item.name == this.name){
                if(i==0){
                    proHtml += this.htmlConnect('now',item,false);
                }else{
                    proHtml += this.htmlConnect('now',item,true,number);
                }
                flag = true;
            }else{
                if(flag){
                    if(i==0){
                        proHtml += this.htmlConnect('', item, false);

                    }else{
                        proHtml += this.htmlConnect('', item, true);
                    }
                }else{
                    if(i==0){
                        proHtml += this.htmlConnect('active', item, false);

                    }else{
                        proHtml += this.htmlConnect('active', item, true);

                    }
                }
            }
        }

        this.selector.innerHTML =  proHtml;
    },

    htmlConnect: function (className,obj,line,num) {
        var itemHtml = '';
        var number = num || 0;
        if(!line){
            itemHtml +='<div class="process-item '+className+'">'
                +'<div class="process-item-box">'
                +'<span class="process-icon '+obj.name+'"></span>'
                +'<span class="process-text">'+obj.text+'</span>'
                +'</div></div>';
        }else {
            itemHtml +='<div class="process-item '+className+'">';
            if(number){
                itemHtml += '<div class="process-item-line"><span class="text">'+number+'</span></div>';
            }else{
                itemHtml += '<div class="process-item-line"></div>';
            }
            itemHtml += '<div class="process-item-box">'
                +'<span class="process-icon '+obj.name+'"></span>'
                +'<span class="process-text">'+obj.text+'</span>'
                +'</div></div>';
        }

        return itemHtml;
    }
};

/**  滚动构造函数（2018-1-22： 汤井福）
 *      1.属性
 *          (1).元素对象            ele
 *          (2).计数器              count
 *          (3).滚动速度            speed
 *          (4).停顿                delay
 *          (5).动画执行对象        scroll
 *      2.方法
 *          (1).init()              执行函数
 *          (2).scrollUp()          滚动函数
 *          (3).appendHtml()        添加html，用于循环滚动
 * */

function Slider(id,speed,delay){
    this.ele = document.getElementById(id);
    this.count = 0;
    this.speed = speed || 1;
    this.delay = delay || 3000;
    this.scroll = null;
}

Slider.prototype = {
    //构造函数
    constructor: Slider,
    //执行函数
    init: function (){
        var _this = this;
        var ele = _this.ele;
        var trs = ele.getElementsByTagName('tr');
        var eleHeight = ele.offsetHeight;
        var trsHeight = trs[0].offsetHeight * trs.length;

        _this.appendHtml(ele);

        if(trsHeight>eleHeight){
            setTimeout(function () {
                _this.scrollUp(ele,trsHeight,trs[0].offsetHeight);
            },_this.delay);
        }
    },
    //向上滚动
    scrollUp : function (ele,maxHeight,itemHeight) {
        var _this = this;
        if(ele.scrollTop >= maxHeight){
            ele.scrollTop = ele.scrollTop - maxHeight;
        }else {
            ele.scrollTop += _this.speed;
            _this.count += _this.speed;
        }

        if(_this.count > itemHeight){
            cancelAnimationFrame(_this.scroll);

            _this.count -= itemHeight;

            var timeStop = setTimeout(function () {
                _this.scroll = requestAnimationFrame(function(){
                    _this.scrollUp(ele,maxHeight,itemHeight);
                });
            },_this.delay);

            ele.onmouseover = function () {
                clearTimeout(timeStop);
            };

            ele.onmouseout = function () {
                timeStop = setTimeout(function () {
                    _this.scroll = requestAnimationFrame(function(){
                        _this.scrollUp(ele,maxHeight,itemHeight);
                    });
                },_this.delay);
            };

        }else {
            _this.scroll = requestAnimationFrame(function(){
                _this.scrollUp(ele,maxHeight,itemHeight);
            });

            ele.onmouseover = function () {
                cancelAnimationFrame(_this.scroll);
            };

            ele.onmouseout = function () {
                _this.scroll = requestAnimationFrame(function(){
                    _this.scrollUp(ele,maxHeight,itemHeight);
                });
            }
        }


    },
    //增加html，方便循环滚动
    appendHtml : function (element) {
        var addBox = element;
        var addNodes = addBox.childNodes,fragment = document.createDocumentFragment();

        for(var i = 0;i<addNodes.length;i++){
            fragment.appendChild(addNodes[i].cloneNode(true));
        }
        addBox.appendChild(fragment);

        //清理
        addNodes = null;
        fragment = null;
    }
};

/** 平滑动画 （张三金）
 *  1.window.requestAnimationFrame(callback);
 *  2.window.cancelAnimationFrame(id);
 * */
function defineAnimationFrame() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}