//用法 $(ele).JQBubble(options);
//BubbleTip 依赖JQ
//对外函数
(function($){
   $.fn.JQBubble = function(options, elem) {
		showTips(options, elem, this);
   }
})(jQuery)

function showTips(options, elem, target) {
	var config = {
		skin: "bTrips",											//样式 可自定义
		content: "错误提示！",  									//气泡提示内容
		width: "auto",  										//默认为auto，可以写具体宽度：200
		alignTo: "bottom",  									//BubbleTip方向 top/bottom/left/right
		color: ["rgb(247, 206, 57)","#FFFEF4"],  				//提示层风格，第一个参数为边框颜色，第二个参数为背景颜色
		trigger: "click",    									//默认为点击显示，show为初始化就显示，focus焦点显示，mouse跟随鼠标显示隐藏
		spacing: 10,  											//距离父ele距离
		customid: "",  											//自定义ID
		isclose: false   										//是否显示关闭按钮,click/show事件用true
	};
	var opts = $.extend(config, options);
//	console.log(opts);
	return target.each(function() {
			var tipBox,								//bubbleTip容器
				tipId,								//bubbleTip容器ID
				selfH,								//元素高
				selfW,								//元素宽
				conId,								//content容器
				docW,								//容器宽度
				skin = opts.skin,					//皮肤类名 自定义样式
				that = $(target),					//目标元素
				spa = opts.spacing,					//bubbleTip距离元素的距离
				sHover = opts.isSHover;				//二级hover
			
			var Mathrandom = Math.floor(Math.random() * 9999999);
			//没有定义ID的话 随机生成ID名
            var pmr = (opts.customid=="") ? Mathrandom : opts.customid.replace(/[#.]/, "");
            //BubbleTip方向
			var pointer = opts.alignTo;
			//当bubble已存在，elem控制显示隐藏,传入bubbleID
			if (typeof elem == 'string') {
				if (elem == "show") {
					$('#tip' + pmr).show();  
					$("#con" + pmr).html(opts.content);
					showPosition(pointer, $('#tip'+pmr));
				};
				if (elem == "hide") $('#tip'+pmr).hide();
			};
			if (typeof elem == '' || typeof elem == undefined) {
				return true;
			};
			if ($('#tip' + pmr).length == 1) {
				return false;
			}
			//bubble容器
			tipBox= $('<div class="'+skin+' '+skin+'-'+pointer+'" id="tip'+pmr+'"><div class="'+skin+'con" id="con'+pmr+'"></div></div>').appendTo(document.body);
			tipId = $("#tip"+pmr);	
			//内容容器
			conId = $("#con"+pmr);
			
			//设置容器样式	
			tipId.css({'position':'absolute',border:'1px solid','border-color':opts.color[0],'background-color':opts.color[1]});
		
			//插入bubbleTip内容
			conId.html(opts.content);
			//关闭bubbleTip
			if (opts.isclose) {
				$('<span class="'+skin+'close" id="close'+pmr+'">&times;</span>').appendTo(tipId);
				tipId.find("#close"+pmr+"").on("click",function(){tipId.hide();});
			}
			//设置容器宽度
			if (typeof opts.width === 'string') {
				docW = parseInt(document.body.clientWidth*(opts.width.replace('%','')/100));
				(typeof opts.width == 'auto' || typeof opts.width == '') ? tipBox.css({width:'auto'}) : tipBox.css({width:docW});
				tipBox.height();
			} else {
				tipBox.width(opts.width).height();
			}
			
			//根据pointer调整bubbleTip位置
            function showPosition(pointer, cell) {
            	//关闭其他层
            	if (opts.trigger == "click") {
					$('div[id^=tip]').each(function(i, ele) {
            			$(ele).hide();
            		});            		
            	}
            	
				var selfH = that.outerHeight(true), 
					selfW = that.outerWidth(true),
					post = that.offset().top, 
					posl = that.offset().left,
					tipCell = (cell == "" || cell == undefined) ? tipId : cell,
			    	tipH = tipCell.outerHeight(true),
			    	tipW = tipCell.outerWidth(true);
			    	
				switch (pointer) {
					case 'top': tipCell.css({top:post-tipH-spa,left:posl}); break;
					case 'bottom': tipCell.css({top:post+selfH+spa,left:posl}); break;
					case 'left': tipCell.css({top:post,left:posl-tipW-spa}); break;
					case 'right': tipCell.css({top:post,left:posl+selfW+spa}); break;	  
				};
			}
            //隐藏bubbleTip
			tipBox.hide();
			//根据事件类型进行调用
			switch (opts.trigger) {
				case 'show':
					showPosition(pointer);
					tipBox.show();
					break;
                case 'click':
                	that.click(function() {
                		showPosition(pointer);
                		tipBox.show();
                		//悬停在tipBox上不做操作，移除两秒消失
//              		tipBox.hover(function() {
//						}, function() {
//							setTimeout(function() {tipBox.hide();},2000);
//						});
                	});
                	break;
				case 'focus':
					that.focus(function() {
						showPosition(pointer);
						tipBox.show();
					});  
					that.blur(function() {
						tipBox.hide();
					});
					break;
				case 'mouse':
					that.hover(function() {
						showPosition(pointer);
						tipBox.show();
					}, function() {
						tipBox.hide();
					});
					break;
			};
			
			tipId.on('scroll',function() {
                var offsetTop = tipId.scrollTop() + "px";  
                $("#close"+pmr+"").animate({ top: offsetTop }, { duration: 600, queue: false });  
			});
			
	});
}

