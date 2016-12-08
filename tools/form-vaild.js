/*
 * 表单验证函数用法说明
 * 引入此JS
 * 在对应的js文件中 初始化配置 (options) 数组对象
 * 
 * eg:
 * var options = [
 *	{
 *		"id": string,				//控件id字符串
 *		"type": string,				//正则模式对应对象字符串
 * 		"msgTip" string,			//错误信息提示    可以直接在html配span 也可以在 js配错误信息提示字符串
 * 		"require": boolean,			//是否必须 布尔值
 * 		"pattern": string,			//自定义正则模式字符串 不需要带//字面量
 * 		"min": num,					//数值最小值
 * 		"max": num,					//数值最大值
 * 		"lMin": num,				//字符串最小长度
 * 		"lMax": num					//字符串最大长度
 *	},
 *  ……
 * ]
 * 配置完 调用初始化函数 $(formId).vaildator(Options);
 * 可参考 js/market/message/b-sugget.js文件
 * 
 * 也支持html 属性配置 以键值对管道符的格式  
 * eg: data-vaild-rule="require:true|type:en|lMin:3"
 * 配置完 调用初始化函数 $(formId).vaildator();
 * 
 * 暂不支持混用 如果js已经传入options配置则忽略html属性配置 
 *
 * submitVaildator 方法提供提交的时候验证必填字段是否为空
 * 调用方法
 * $(formId).submitVaildator();
 */


//正则模式对象
var regArray = {
		"mobile": "^1[34578]\\d{9}$", 												//11位手机号码
		"phone": "\d{3}-\d{8}|\d{4}-\d{7}", 										//座机 3位或4位前缀
		"chs": "[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*", 					//中文字符
		"en": "^[A-Za-z]+$", 														//26个字母
		"enNum": "^[0-9a-zA-Z]*$",													//字母和整数
		"idCard": "\d{15}|\d{18}", 													//身份证号码
		"integer": "^[0-9]*[1-9][0-9]*$", 											//正整数
		"intDecimal": "^\d*(\.\d{1,2})?$", 											//整数 可带小数点 最多2位小数
		"email": "^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$", 							//邮件
		"url": "[a-zA-z]+:\/\/[^\s]*", 												//url 含协议
		"picture": "(.*)(\.jpg|\.bmp|\.png|\.gif)$", 								//图片格式
		"date": "^\d{4}\-[0-12]{1,2}-\d{1,2}$", 									//日期 2016-01-01
		"time": "\d{2}:\d{2}", 														//时间 19:20
		"datetime": "\d{4}-[0-12]{2}-\d{2}\s+\d{2}:\d{2}", 							//日期时间 2016-01-01 19:20	
		"nonempty": "\\S+$",														//非空值
		"vaildCode": "\d{6}"   														//验证码
		
}

/**
 * Fn msgTipFn 拼接错误信息
 * @param {string} ele 		元素Dom
 * @param {string} msg 		错误信息
 */
function msgTipFn(ele, msg=null) {
	var html,
		msgTip = "输入格式错误";
		
	if (msg) msgTip = msg;
	html = '<span class="col-md-7 fMsgDefault">' + msgTip + '</span>';
    if (!ele.siblings("span").hasClass("fMsgDefault")) ele.after(html);    
}

/**
 * Fn toggleMsgClass		切换错误信息类
 * @param {string} ele 		元素Dom
 * @param {string} type 	1为显示/0为隐藏
 * 
 */
function toggleMsgClass(ele, type) {
	if (type) {
		ele.focus();
		ele.addClass("fVaildError");
		ele.siblings("span").addClass("fErrMsg");
	} else {
		ele.removeClass("fVaildError");
		ele.siblings("span").removeClass("fErrMsg");
	}
}

/**
 * Fn checkMinMax 检查最小最大值限定
 * @param {Object} ele 	DOM元素
 * @param {Object} v	提示span
 * @param {Object} min	最小值
 * @param {Object} max	最大值
 */
function checkMinMax(ele, v, min, max) {
	if (min) {
		if (v < Number(min)) {
			ele.siblings("span").html("值不能小于" + min);
			toggleMsgClass(ele, 1);
			return 1;
		}
		if (max) {
			if (v > Number(max)) {
				ele.siblings("span").html("值不能大于" + max);
				toggleMsgClass(ele, 1);
				return 1;
			}
		}
	} else {
		if (v > Number(max)) {
			ele.siblings("span").html("值不能大于" + max);
			toggleMsgClass(ele, 1);
			return 1;
		}
	}
}

/**
 * Fn checkLminLmax 检查字符串长度限定
 * @param {Object} ele	DOM元素
 * @param {Object} vL	字符串长度
 * @param {Object} lMin	最小值
 * @param {Object} lMax	最大值
 */
function checkLminLmax(ele, vL, lMin, lMax) {
	console.log(22);
	if (lMin) {
		if (vL < Number(lMin)) {
			ele.siblings("span").html("字符长度不能小于" + lMin);
			toggleMsgClass(ele, 1);
			return 1;
		}
		if (lMax) {
			if (vL > Number(lMax)) {
				ele.siblings("span").html("字符长度不能大于" + lMax);
				toggleMsgClass(ele, 1);
				return 1;
			}
		}
	} else {
		if (vL > Number(lMax)) {
			ele.siblings("span").html("字符长度不能大于" + lMax);
			toggleMsgClass(ele, 1);
			return 1;
		}
	}
}


/**
 * Fn regPattern			数据过滤函数
 * @param {Object} option   配置对象
 */
function regPattern(option) {
//	console.log(option);
	var id,
		type,
		msgTip = null,
		require = null,
		pattern = null,
		min = null,
		max = null,
		lMin = null,
		lMax = null; 
	for (var k in option) {
		switch (k) {
			case "id":
				id = option[k];
				break;
			case "type":
				type = option[k];
				break;
			case "msgTip":
				msgTip = option[k];
				break;
			case "require":
				require = option[k];
				break;
			case "pattern":
				pattern = option[k];
				break;
			case "min":
				min = option[k];
				break;
			case "max":
				max = option[k];
				break;
			case "lMin":
				lMin = option[k];
				break;
			case "lMax":
				lMax = option[k];
				break;
			default:
				break;
		}
	}
	
	var ele = $("#"+id),
	 	v = ele.val(),
	 	v = v.replace(/(^\s*)|(\s*$)/g, '');	//去除左右空格 
		reg = new RegExp(regArray[type], "i");	//生成对应正则模式
	
	//自定义正则，如果传入则用传入的正则模式
	if (pattern) {
		reg = new RegExp(pattern, "i");
	}
	
	//生成数据错误提示span
	msgTipFn(ele, msgTip);
	//错误信息定位，父元素高宽
	var selfH = ele.outerHeight(true);
		selfW = ele.outerWidth(true),
//		post = ele.offset().top, 
//		posl = ele.offset().left,
		tipCell = $(".fMsgDefault"), //span元素
    	tipH = tipCell.outerHeight(true),
    	tipW = tipCell.outerWidth(true);
    	//父元素位置
    	var X = ele.position().top;
    	var Y = ele.position().left;
    	tipCell.css({top:X+selfH, left:Y}); 
	
	
	//判断是否必须字段
	//if (!ele.attr("required") && !v) return;
	if (require && !v) {
		toggleMsgClass(ele, 1);
		return;
	}
	
	//判断是否非必须并且为空值
	if (!require && !v) {
		toggleMsgClass(ele, 0);
		return;
	}
	
	//正则验证
	if (!reg.test(v)) {
		toggleMsgClass(ele, 1);
	} else {
		toggleMsgClass(ele, 0);
	}
	
	//数值的最大最小值过滤
	if (min || max) {
		if (checkMinMax(ele, v, min, max)) return;
	}
	
	//字符串的长度过滤
	if (lMin || lMax) {
		vL = v.length;
		if (checkLminLmax(ele, vL, lMin, lMax)) return;
	}
	
}

//表单控件必填项id数组
var idArray=[];
/**
 * fn vaildForm 对内函数
 * @param {Arrary} options 配置
 */
function vaildForm(options) {
	var len = options.length;
	for (var i = 0; i < len; i++) {
		//存起必填字段供表单提交检查
		if (options[i].require) idArray.push(options[i]['id']);
		//闭包 加一层闭包保持i不变
		(function(i) {
			$("#"+options[i]["id"]).blur(function(){
			regPattern(options[i]);
		});
		}(i))
	}
}


/**
 * fn vaildator 对外函数
 * @param {Array} options 配置
 */
(function($){
   $.fn.vaildator = function(options){
   		//js配置
   		if (options) {
   			vaildForm(options);
   		} else {
	   		var vaildRule = $("[data-vaild-rule]");
	   		if (!vaildRule) return false;
			var options = [];
			$.each(vaildRule,function(index,element){
				var eleId = $(element).attr("id");
				var validRule = $(element).data("vaild-rule");
				var ruleArray = validRule.split("|");
				options.push({"id":eleId});
				$.each(ruleArray, function(i,val) {
					val = val.split(":");
					options[index][val[0]] = val[1];
				});
			});
//			console.log(options);
	   		vaildForm(options);
   		}
   }
   $.fn.submitVaildator = function() {
   		if (idArray) {
   			var len = idArray.length;
   			for (var i=0; i<len; i++) {
   				var ele = $("#"+idArray[i]);
   				if (!ele.val()) {
   					ele.blur();
					ele.focus();   					
   					return 1;
   				}
   			}
   		}
   }
})(jQuery)

