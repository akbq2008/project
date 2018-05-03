/**
 * Created by A on 2018/1/19.
 */
var indurl = "http://ai.jd.com/fast" /*ajax地址*/
var imgtot = "http://m.360buyimg.com/babel/" /*京东图片前缀*/
var result; /*用户类型，0 是企业，1是京东*/

var flonum = 0; /*执行楼层元素的次数*/
var flocid = [128173, 128925, 128947, 128969, 128991, 129013, 129035, 129057, 129079, 129101]; /*ajax楼层元素的cid*/
var flolist = []; /*ajax楼层元素接口赋值*/

var fpronum = 0; /*执行楼层商品的次数*/
var fprocid = [128175, 128927, 128949, 128971, 128993, 129015, 129037, 129059, 129081, 129103]; /*ajax楼层商品的cid*/
var fprolist = []; /*ajax楼层商品接口赋值*/

var fsamelist = []; /*ajax看相似接口赋值*/
var fbrandlist = []; /*ajax楼层品牌接口赋值*/
var cnt = 0; /*判断楼层元素，商品，品牌接口是否全部执行完毕*/

var scolllist = [];

var shoparr = []; /*采购单各个场景的商品*/

function IndexInit() {
	/*首页*/
	BannerAjax();
	UserAjax();
	Scrollajax();
	FloorFun();
}

function UserAjax() {
	/*用户类型，0 是企业，1是非企业*/
	//	$.ajax({//判断是否是企业用户
	//		type: "get",
	//		url: "//qycg.jd.com/public/isEnterpriseUser",
	//		dataType: "jsonp",
	//		success: function(data) {
	//			//			console.log(data.result);
	//		},
	//		error: function() {
	//			console.log("error");
	//		}
	//
	//	}).done(function(data) {
	//		window.result = data.result;
	//	});
	result = 0;
}

function BannerAjax() {
	/*头图轮播banner ajax*/
	var banlist = [];
	var banpush = "";
	$.ajax({
		type: "get",
		url: indurl,
		jsonpCallback: 'jQuery5374148',
		data: "app=shangcai&action=getSucai&cid=128166",
		dataType: 'jsonp',
		success: function(data) {
			//							console.log(data);
			banlist = data.DATA[128166];
			var len = banlist.length;
			for(var i = 0; i < len; i++) {
				var banhref = banlist[i].url;
				var banimg = imgtot + banlist[i].image_path;
				var bantit = banlist[i].title;

				banpush += "<a href='" + banhref + "' class='swiper-slide'>"
				banpush += "<img src='" + banimg + "' title='" + bantit + "' width='100%' height='100%'></a>"
			}

			$(".swiper-wrapper").append(banpush);

			var mySwiper = new Swiper('.move-swiper-container-banner', {
				autoplay: 3000,
				autoplayDisableOnInteraction: false,
				speed: 500,
				pagination: '.swiper-pagination',
				loop: true
			});
		}

	});
}

function Scrollajax() {
	/*吸顶导航scroller ajax*/

	$.ajax({
		type: "get",
		url: indurl,
		data: "app=Shangcai&action=getSucai&cid=128170",
		dataType: 'jsonp',
		success: function(data) {
			//	    		console.log(data.DATA[128170]);
			scolllist = data.DATA[128170];
			ScrollfillFun();
			ShopinitFun();
		}
	});
}

function ScrollfillFun() {
	var len = scolllist.length;
	for(var i = 0; i < len; i++) {
		var scollpush = "";
		var scolltit = scolllist[i].title;
		scollpush += "<li data-idx='" + i + "'><a>" + scolltit + "</a></li>"
		$(".scroller ul").append(scollpush);
	}

}

function ScrollFun() {
	/*锚点导航*/
	$(".scroller_scenes").css("left", 0);
	$(".scroller_scenes li").each(function() {
		$(".scroller_scenes li").eq(0).addClass("cur").siblings().removeClass("cur");
	});
	var nav_w = $(".scroller_scenes li").first().width();

	var scenes_height = $('.wrapper_scenes').height();
	var scenes_lenth = $('.scroller_scenes').children('ul').children('li').length;

	var dv = $('.wrapper_scenes'),
		st;
	var brandArr = [];
	var len = scenes_lenth;
	for(var i = 0; i < len; i++) {
		var k = $('#maodian' + i);
		brandArr.push(parseInt(k.offset().top));
	}
	dv.attr('otop', dv.offset().top); //存储原来的距离顶部的距离

	$(".scroller_scenes li").on('click', function() {
		nav_w = $(this).width();
		var i = $(this).index();
		var fns_h = brandArr[i] - scenes_height;
		if(i == 0) {
			$("html,body").animate({
				"scrollTop": fns_h
			}, 0);
		} else {
			$("html,body").animate({
				"scrollTop": fns_h - scenes_height
			}, 0);
		}
		$(this).addClass("cur").siblings().removeClass("cur");
		var fn_w = ($(".wrapper_scenes").width() - nav_w) / 2;
		var fnl_l;
		var fnl_x = parseInt($(this).position().left);
		if(fnl_x <= fn_w) {
			fnl_l = 0;
		} else if(fn_w - fnl_x <= flb_w - fl_w) {
			fnl_l = flb_w - fl_w;
		} else {
			fnl_l = fn_w - fnl_x;
		}
		$(".scroller_scenes").animate({
			"left": fnl_l
		}, 300);
		//          console.log(scenes_height);
		//          console.log(brandArr[i]);
		//          console.log(fns_h);
	});

	var fl_w = $(".scroller_scenes").width();
	var flb_w = $(".wrapper_scenes").width();
	$(".scroller_scenes").on('touchstart', function(e) {
		var touch1 = e.originalEvent.targetTouches[0];
		x1 = touch1.pageX;
		y1 = touch1.pageY;
		ty_left = parseInt($(this).css("left"));
	});
	$(".scroller_scenes").on('touchmove', function(e) {
		var touch2 = e.originalEvent.targetTouches[0];
		var x2 = touch2.pageX;
		var y2 = touch2.pageY;
		if(ty_left + x2 - x1 >= 0) {
			$(this).css("left", 0);
		} else if(ty_left + x2 - x1 <= flb_w - fl_w) {
			$(this).css("left", flb_w - fl_w);
		} else {
			$(this).css("left", ty_left + x2 - x1);
		}
		if(Math.abs(y2 - y1) > 0) {
			e.preventDefault();
		}
	});

	$(window).scroll(function() {
		st = Math.max(document.body.scrollTop || document.documentElement.scrollTop);
		if(st > parseInt(dv.attr('otop'))) {
			if(false) {} else if(dv.css('position') != 'fixed') dv.css({
				'position': 'fixed',
				top: 0,
				'margin': "0 auto",
				'left': "0",
				'right': "0",
				'z-index': "100"
			});
		} else if(dv.css('position') != 'relative') dv.css({
			'position': 'relative'
		});
		var len = brandArr.length
		for(var j = 0; j < len; j++) {
			if(st - brandArr[j] > -50 && st - brandArr[j] < 30) {
				var scenes_li = $('.scroller_scenes ul li').eq(j);
				nav_w = scenes_li.width();
				scenes_li.addClass("cur").siblings().removeClass("cur");
				var fn_w = ($(".wrapper_scenes").width() - nav_w) / 2;
				var fnl_l;
				var fnl_x = parseInt(scenes_li.position().left);
				if(fnl_x <= fn_w) {
					fnl_l = 0;
				} else if(fn_w - fnl_x <= flb_w - fl_w) {
					fnl_l = flb_w - fl_w;
				} else {
					fnl_l = fn_w - fnl_x;
				}
				$(".scroller_scenes").animate({
					"left": fnl_l
				}, 0);
			}
		}
	});

}

function FloorFun() {
	/*楼层素材*/
	floAjax(flocid[flonum]);
}

function floAjax(cid) {
	/*楼层素材*/
	$.ajax({
		type: "get",
		url: indurl,
		data: "app=shangcai&action=getSucai&cid=" + cid,
		dataType: 'jsonp',
		success: function(data) {

			flolist.push(data.DATA[cid][0]);
			flonum++;

			if(flonum < flocid.length) {

				floAjax(flocid[flonum]);

			} else {
				console.log(flolist, "flolist楼层素材");
				callback();

				/*楼层品牌*/
				fbrandAjax();
			}
		}
	});

}

function fproAjax(cid) {
	/*楼层商品*/
	$.ajax({
		type: "get",
		url: indurl,
		data: "app=shangcai&action=getCommodity&cid=" + cid,
		dataType: 'jsonp',
		success: function(data) {
			var tdata = data.DATA[cid];
			fprolist.push(tdata);
			var skuarr = "",
				jskuarr = "",
				len = tdata.length;
			for(var i = 0; i < len; i++) {
				if(i == len - 1) {
					skuarr += tdata[i].skuId;
					jskuarr += "J_" + tdata[i].skuId;
				} else {
					skuarr += tdata[i].skuId + ",";
					jskuarr += "J_" + tdata[i].skuId + ",";
				}

			}
			//  		console.log(jskuarr)
			priceAjax(skuarr, jskuarr);

		}
	});

}

var cparr = new Array();
cparr[0] = new Array();

function priceAjax(skuarr, jskuarr) {
	/*产品价格*/
	var priceurl;
	var skudata;
	//		console.log(result);
	if(result == 0) {
		skudata = "skuids=" + skuarr;
		priceurl = "//ai.jd.com/index_new?app=Search&user=company&action=getCompanyPrice"
	} else {

		skudata = "skuids=" + jskuarr;
		priceurl = "//p.3.cn/prices/mgets?type=1"
	}
	$.ajax({
		type: "get",
		url: priceurl,
		data: skudata,
		dataType: 'jsonp',
		success: function(data) {

			cparr[fpronum] = data;
			FillFun(fpronum);
			fpronum++;
			if(fpronum < fprocid.length) {
				fproAjax(fprocid[fpronum]);
			} else {
				console.log(fprolist, "fprolist楼层商品");
				callback();
			}
		}
	});
}

function fbrandAjax() {
	/*楼层品牌*/
	$.ajax({
		type: "get",
		url: indurl,
		data: "app=shangcai&action=getSucai&cid=128194",
		dataType: 'jsonp',
		success: function(data) {
			fbrandlist = data.DATA[128194];
			console.log(fbrandlist, "fbrandlist楼层品牌");
			callback();

			/*楼层商品*/
			fproAjax(fprocid[fpronum]);
		}
	});

}

function callback() {
	cnt++;
	if(3 == cnt) {
		console.log('楼层素材，楼层商品，价格，品牌ajax都已执行完毕');
		//			skuAjax();

		ScrollFun();

		selFun();
		fsamebtnFun();
	};
}

function FillFun(fl) {
	var i = fl;
	var filllist = "";
	var fillprolist = "";
	var fillbrandlist = "";
	/*楼层元素添加内容*/

	filllist += " <div class='scene_class selpar' id='maodian" + i + "' data-idx='" + i + "' data-sceneid='" + i + "'>";
	filllist += "<div class='scene_head_title business_head_title'><img src='" + imgtot + flolist[i].image_path_B + "'><span>" + flolist[i].title + "</span></div>";
	filllist += "<div class='scene_banner business_banner'><img src='" + imgtot + flolist[i].image_path + "'></div>";
	filllist += "<div class='sku_slide'><div class='sku_wrap'>";
	fillprolist = "";
	var len = fprolist[i].length;
	for(var j = 0; j < len; j++) {
		/*楼层商品添加内容*/
		var pro = fprolist[i][j];

		fillprolist += "<div class='sku_item_list' data-skuid='" + pro.skuId + "' data-term='" + pro.term + "'>";
		fillprolist += "<div class='sku_item_head'>" + pro.promoteText + "</div><a class='sku_item_li' href='" + pro.url + "'>"
		fillprolist += "<div class='sku_item_img'><img src='" + imgtot + pro.picUrl + "' alt=''></div>"
		fillprolist += "<div class='sku_item_title'><div class='sku_item_tit'>" + pro.title + "</div>"
		if(result == 0) {
			fillprolist += "<div class='sku_title_price'>¥ " + cparr[i].data[j].price + " </div><a href='javascript:void(0)' class='sku_item_button' data-dialog-skuid='" + pro.term + "'></a></div>"
		} else {
			fillprolist += "<div class='sku_title_price'>¥ " + cparr[i][j].p + " </div><a href='//plogin.m.jd.com/user/login.action' class='login_button'>查看企业专享价</a></div>"
		}
		fillprolist += ""
		fillprolist += "<div class='p_select' data-select='1'></div></a></div>"
	}
	filllist += fillprolist + "</div></div>";
	if(result == 0) {
		filllist += "<div class='add_list'><a class='add_list_button' href='javascript:void(0)'>一键加入采购清单（<span class='add_num'>" + fprolist[i].length + "</span>件）<em></em></a></div>"
	} else {
		filllist += "<div class='add_list'><a class='add_list_button' href='#'>登录查看企业采购单</a></div>"
	}
	filllist += "<div class='ad_container'>";
	filllist += "<div class='ad_left'><div class='ad_item ad_item_title'><div class='ad_title'><p>热门推荐</p><p>企业都在买</p></div><div class='ad_btn'><a href='#'>立即抢购</a></div></div><div class='ad_img_wrap ad_item'>";
	//广告区  左
	filllist += "<img src='images/feature_img1.jpg' alt='ad_left_pic' />";
	filllist += "</div></div>";
	filllist += "<div class='ad_right'><div class='ad_item'><div class='ad_title ad_item_title'><p>惠普电脑专场</p><p>企业价超低折扣</p></div><div class='ad_btn'><a href='#'>立即抢购</a></div></div><div class='ad_img_wrap ad_item'>";
	//广告区  右
	filllist += "<img src='images/feature_img2.jpg' alt='ad_left_pic' />";
	filllist += "</div></div></div>";
	filllist += "<div class='scene_logo'><ul>"
	var len = fbrandlist.length;
	for(var z = 0; z < len; z++) {
		/*楼层品牌添加内容*/
		var brand = fbrandlist[z];
		fillbrandlist += "<li><a href='" + brand.url + "'><img class='logo_img' src='" + imgtot + brand.image_path + "' alt=''>"
		fillbrandlist += "<span class='logo_line'></span><span class='logo_text'>" + brand.title + "</span></a></li>"
	}
	filllist += fillbrandlist + "</ul></div>"

	filllist += "</div></div>";
	filllist += "</div>"

	$(".floor").append(filllist);
}

function ShopinitFun() {
	/*清单页面初始化*/
	//  	console.log(scolllist);
	var len = scolllist.length;
	for(var i = 0; i < len; i++) {
		var shoptitpush = "";
		var scolltit = scolllist[i].title;
		shoptitpush += "<li data-idx='" + i + "'>" + scolltit + "</li>"
		$(".shopping_cart_scenes ul").append(shoptitpush);
	}
	$(".shopping_cart_scenes ul li:first").addClass("shopping_cart_curr");

}

function selFun() {
	/*商品打钩选择*/
	$(".p_select").on('click', function(e) {

		var curr = $(this).attr("data-select");
		var addnum = parseInt($(this).parents(".selpar").find(".add_num").html());

		if(curr == 1) {
			$(this).attr("data-select", "0");
			$(this).addClass("curr");
			addnum -= 1;
		} else {
			$(this).attr("data-select", "1");
			$(this).removeClass("curr");
			addnum += 1;
		}

		$(this).parents(".selpar").find(".add_num").html(addnum);

	})
	$(".aa").css("background", "#ffffff");
	$(".aa").css({
		"background": "#ffffff",
		"color": "#000"
	});
}

function fsamebtnFun() {
	/*看相似按钮*/
	$('.sku_item_button').on("click", function() {
		var term = $(this).attr("data-dialog-skuid"); /*查询值*/
		var proclass = $(this).parents(".sku_item_list").find(".sku_item_head").html();
		var _proclass = encodeURI(encodeURI(proclass));
		//			console.log(term,_proclass)
		window.open("same.html?term=" + term + "&proclass=" + _proclass, "_blank")
	})
}

function fsameAjax() {
	/*看相似页面*/
	var same_t;
	var same_term //看相似 term 
	var same_class; //看相似品类
	same_term = getQueryString("term");
	same_t = getQueryString("proclass");
	same_class = decodeURI(same_t); //只需要转一次码  

	$(".search_tit").html(same_class);
	//    	console.log(same_term);

	$.ajax({
		type: "get",
		url: indurl,
		jsonpCallback: "jQuery1783060",
		data: "app=Shangcai&action=getCommodity&cid=" + same_term,
		dataType: 'jsonp',
		success: function(data) {
			//  		    console.log(data,'flike')
			fsamelist = data.DATA[same_term];
			console.log(fsamelist, "fsamelist楼层相似");

			var skuarr = "";
			var len = fsamelist.length;
			for(var i = 0; i < len; i++) {
				if(i == fsamelist.length - 1) {
					skuarr += fsamelist[i].skuId;
				} else {
					skuarr += fsamelist[i].skuId + ",";
				}

			}
			fsameproAjax(skuarr);
		}
	});

	$.ajax({
		type: "get",
		url: indurl,
		data: "app=Shangcai&action=getSucai&cid=128170",
		dataType: 'jsonp',
		success: function(data) {
			//	    		console.log(data.DATA[128170]);
			scolllist = data.DATA[128170];
			ShopinitFun();
		}
	});

}

function getQueryString(name) {
	/*获取地址参数*/
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

var fsameprice = [];

function fsameproAjax(skuarr) {
	/*看相似页面：商品价格ajax*/
	$.ajax({
		type: "get",
		url: "http://ai.jd.com/index_new?app=Search&user=company&action=getCompanyPrice",
		data: "skuids=" + skuarr,
		dataType: 'jsonp',
		success: function(data) {
			fsameprice = data.data;
			console.log(fsameprice);
			fsamefillFun();
		}
	});
}

function fsamefillFun() {
	/*看相似页面填充内容*/
	var len = fsamelist.length;
	for(var i = 0; i < len; i++) {
		var fillfsame = "";
		fillfsame += "<li class='same_sku_li' data-skuid='" + fsamelist[i].skuId + "'><a targer='_blank'  href='" + fsamelist[i].url + "'>"
		fillfsame += "<div class='same_sku_img'><img src='" + imgtot + fsamelist[i].picUrl + "' alt=''></div>"
		fillfsame += "<div class='same_sku_title'><div class='same_sku_tit'>" + fsamelist[i].title + "</div>"
		fillfsame += "<div class='same_sku_price'>¥" + fsameprice[i].price + "</div></div></a>"
		fillfsame += "<div class='p_select curr' data-select='0'></div></li>"
		$(".same_sku_list ul").append(fillfsame);
	}
	//		$(".add_num").html(fsamelist.length);
	$(".add_num").html(0)
	selFun();
}

var seneid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
var seneidnum = 0; /*场景商品ajax执行次数*/

function shopAjax(index) {
	var ind = index;
	/*当前采购单查询ajax*/
	$.ajax({
		type: "get",
		//http://qycg.jd.com/currentOrder/list?currentPage=1&pageSize=10
		url: "//127.0.0.1:8020/project/a.json",
		//			data:"sceneId=1",
		dataType: 'json',
		cache: true,
		success: function(data) {
			//			console.log(data, "采购");
			shoparr = data.result.orderInfoList;
			var len = seneid.length;
			if(seneidnum < len) {
				shopproFun(seneidnum);
				seneidnum++;
				shopAjax(index);
			} else {
				delscroll();
			}
			defaultCheck();
		},
		error: function(data) {
			console.log("error")
		}
	});
}

function shopproFun(ind) {
	/*采购清单页面*/
	var dind = ind;
	var shopcartpush = "";
	shopcartpush = "<div class='shop-group-item' data-ind='" + dind + "'><ul></ul></div>"
	$(".shopping_cart_main").append(shopcartpush);
	var len = shoparr.length;
	if(len > 0) {
		for(var i = 0; i < len; i++) {
			var sceneprofill = "";
			sceneprofill += "<li data-sceneid='" + shoparr[i].scene + "'data-sku='" + shoparr[i].skuId + "'><div class='shop-info'><input type='checkbox' class='check goods-check goodsCheck'>"
			sceneprofill += "<div class='shop-info-img'><a href='" + shoparr[i].url + "'><img src='" + imgtot + shoparr[i].picUrl + "'/></a></div>"
			sceneprofill += "<div class='shop-info-text'><a href='" + shoparr[i].url + "'><div class='shop-tit'>" + shoparr[i].name + "</div>"
			sceneprofill += "<div class='shop-brief'>" + shoparr[i].wserve + " 商品编号:" + shoparr[i].skuId + "</div></a>"
			sceneprofill += "<div class='shop-price'><div class='shop-pices'>￥<span class='price'>" + shoparr[i].unitPrice + "</span></div>"
			sceneprofill += "<div class='shop-arithmetic'><a href='javascript:;' class='minus'>-</a>"
			sceneprofill += "<span class='num' contenteditable min='1'>" + shoparr[i].num + "</span><a href='javascript:;' class='plus'>+</a></div>"
			sceneprofill += "</div></div><div class='del'>删除</div></div></li>"
			$(".shopping_cart_main .shop-group-item").eq(dind).find("ul").append(sceneprofill);
			//			console.log(shoparr[i].scene)
			if($(".num").text() == 1) {
				$(".num").prev().css("color", "#ddd");
			}
		}

	} else {
		$(".shopping_cart_main .shop-group-item").eq(dind).find("ul").append("<div class='no_pro'>无</div>");
	}
	var shopcartbotm = ""
	shopcartbotm += "<div class='item-payment-bar'><div class='all-checkbox'><input type='checkbox' class='check goods-check allCheck'>"
	shopcartbotm += "<span>全选</span><span class='all-delete'>删除选中商品</span></div>"
	shopcartbotm += "<div class='shopPrice'>场景总价：<span>￥</span><span class='shop-total-amount ShopTotal'>0.00</span></div>"
	shopcartbotm += "<div class='item-payment-prompt'>以上价格为京东前台实时价，不作为结算依据。仅供参考。</div></div>"
	$(".shopping_cart_main .shop-group-item").eq(dind).append(shopcartbotm);

	$(".shopping_cart_main .shop-group-item:first").show();
}
//采购清单中编辑数量时的符号的颜色判断
$(".shopping_cart_main").on("keyup",".num",function(){
	if($(this).text()<1&&$(this).text()!=""){
		alert("单件商品数量不能少于一件");
		$(this).text(1)
		$(this).prev().css("color", "#ddd");
	}else{
		$(this).prev().css("color", "#666");
	}
});
/*清单tab切换*/
$(".shopping_cart").on("click", ".shopping_cart_scenes ul li", function() {
	var i = $(this).index();
	$(".shopping_cart_curr").removeClass("shopping_cart_curr");
	$(this).addClass("shopping_cart_curr");
	$('.shop-group-item').eq(i).show().siblings().hide();
});

var shopcomarr = [];

function shopcomAjax() {
	/*采购清单综合ajax*/
	$.ajax({
		type: "get",
		//			url:"http://juan.jd.com/b.json",
		url: "http://127.0.0.1:8020/project/b.json",
		dataType: 'json',
		cache: true,
		success: function(data) {
			//  			console.log(data);
			shoparr = data.result.orderInfoList;
			$(".shop-group-item").remove();

			shopproFun(0);
			$(".shopPrice").hide();
			delscroll();
		},
		error: function(data) {
			console.log("error")
		}
	});
}

function upAjax(sceneids, delarrs, nums) {
	/*更新产品数量接口*/
	var datacon = "sceneId=" + sceneids + "&skuIds=" + delarrs + "&num=" + nums;
	$.ajax({
		type: "post",
		//		url: "//127.0.0.1:8020/project/a.json",
		url: "http://qycg.jd.com/currentOrder/update",
		dataType: 'jsonp',
		data: datacon,
		cache: true,
		success: function(data) {
			console.log(data, "更新成功");
		},
		error: function(data) {
			console.log("更新失败");
		}
	});
}

function addAjax(sceneids, skuNumJsons) {
	/*新增产品接口*/
	var datacon = "sceneId=" + sceneids + "&skuNumJson=" + skuNumJsons;
	$.ajax({
		type: "post",
		url: "http://qycg.jd.com/currentOrder/add",
		dataType: 'json',
		data: datacon,
		cache: true,
		success: function(data) {
			console.log("添加成功");
		},
		error: function(data) {
			console.log("添加失败");
		}
	});
}

$(".floor").on("click", ".add_list_button", function() {
	//一键加入采购清单
	var skuNumJson = {}; //得到商品的sku
	var sceneid = $(this).parents(".scene_class").attr("data-sceneid"); //得到商品的场景
	$(this).parents(".scene_class").find(".p_select").each(function() { //循环场景里面的商品

		var curr = $(this).attr("data-select");

		if(curr == 1) {
			var skuid = $(this).parents(".sku_item_list").attr("data-skuid");
			var skunum = 1;

			skuNumJson[skuid] = skunum;

		}
	});

	console.log(sceneid, skuNumJson);

	//      delAjax(sceneid,skuNumJson);

});

$(".shopping_cart_main").on("click", ".minus", function() {
	// 数量减
	var t = $(this).parent().find('.num');

	if(t.text() > 1) {
		t.text(parseInt(t.text()) - 1);
		var delarr = $(this).parents("li").attr("data-sku"); //得到商品的sku
		var sceneid = $(this).parents("li").attr("data-sceneid"); //得到商品的场景
		var num = $(this).parents("li").find(".num").html(); //得到商品的sku
		console.log(delarr, sceneid, num);
		upAjax(sceneid, delarr, num);
	}
	//清空数量时，赋初值
	if(isNaN(num)) {
		num = 1;
		$(this).parents("li").find(".num").html(1)
	}
	if(t.text() == 1) {
		$(this).css("color", "#ddd");
	}

	TotalPrice();
});

$(".shopping_cart_main").on("click", ".plus", function() {
	// 数量加
	var t = $(this).parent().find('.num');
	t.text(parseInt(t.text()) + 1);

	var delarr = $(this).parents("li").attr("data-sku"); //得到商品的sku
	var sceneid = $(this).parents("li").attr("data-sceneid"); //得到商品的场景
	var num = $(this).parents("li").find(".num").html(); //得到商品的sku
	//清空数量时，赋初值
	if(isNaN(num)) {
		num = 1;
		$(this).parents("li").find(".num").html(1)
	}
	console.log(delarr, sceneid, num);
	upAjax(sceneid, delarr, num);
	if(t.text() > 1) {
		$(this).prevAll(".minus").css("color", "#666");
	}
	TotalPrice();
});

$(".shopping_cart_main").on("click", ".goodsCheck", function() {
	// 点击商品按钮

	var goods = $(this).closest(".shopping_cart_main").find(".goodsCheck"); //获取所有商品
	var goodsC = $(this).closest(".shopping_cart_main").find(".goodsCheck:checked"); //获取所有被选中的商品
	if(goods.length == goodsC.length) { //如果选中的商品等于所有商品
		$(".allCheck").prop('checked', true); //全选按钮被选中
		// 计算
		TotalPrice();
	} else { //如果选中的商品不等于所有商品
		$(".allCheck").prop('checked', false); //全选按钮也不被选中
		// 计算
		TotalPrice();
	}
});

//采购清单中默认选中
function defaultCheck() {
	var doc = document.querySelectorAll(".shop-group-item .goods-check");
	$(doc).prop('checked', true);
	$(".shopping_cart_main ").find("goods-check").prop('checked', true); //场景内的所有商品按钮也被选中
	$("#AllCheck").prop('checked', true); //全选按钮被选中
	TotalPrice();
}

$(".shopping_cart_main").on("click", ".allCheck", function() {
	if($(this).prop("checked")) { //如果全选按钮被选中
		$(this).parents(".shop-group-item").find(".goods-check").prop('checked', true); //场景内的所有商品按钮也被选中
		if($(".shopCheck").length == $(".shopCheck:checked").length) { //如果场景被选中的数量等于所有店铺的数量
			$("#AllCheck").prop('checked', true); //全选按钮被选中
			TotalPrice();
		} else {
			$("#AllCheck").prop('checked', false); //else全选按钮不被选中
			TotalPrice();
		}
	} else { //如果全选按钮不被选中
		$(this).parents(".shop-group-item").find(".goods-check").prop('checked', false); //场景内的所有商品也不被全选
		$(this).prop('checked', false); //全选按钮也不被选中
		TotalPrice();
	}
});

$(".shopping_cart_main").on("click", ".del", function() {
	//		右滑删除按钮

	var delarr = $(this).parents("li").attr("data-sku"); //得到商品的sku
	var sceneid = $(this).parents("li").attr("data-sceneid"); //得到商品的场景
	//		console.log(delarr,sceneid);

	delAjax(sceneid, delarr);

	$(this).parents("li").remove();

	TotalPrice();
});

function TotalPrice() {
	//计算数量，价格
	var allnum = 0; //总数量
	var allprice = 0; //总价
	$(".shop-group-item").each(function() { //循环每个场景
		var onum = 0; //场景商品数量
		var oprice = 0; //场景总价
		$(this).find(".goodsCheck").each(function() { //循环场景里面的商品
			if($(this).is(":checked")) { //如果该商品被选中
				var num = parseInt($(this).parents(".shop-info").find(".num").text()); //得到商品的数量
				var price = parseFloat($(this).parents(".shop-info").find(".price").text()); //得到商品的单价
				var total = price * num; //计算单个商品的总价
				oprice += total; //计算该场景的总价
				onum += num; //计算该场景的商品数量
			}
		});
		$(this).closest(".shop-group-item").find(".ShopTotal").text(oprice.toFixed(2)); //显示被选中商品的场景总价
		var oneprice = parseFloat($(this).find(".ShopTotal").text()); //得到每个场景的总价
		allprice += oneprice; //计算所有场景的总价
		allnum += onum; //计算所有场景的商品数量
	});
	$("#AllTotal").text(allprice.toFixed(2)); //输出全部总价
	$(".shop-allnum").text(allnum); //输出全部数量
}

function delAjax(sceneids, delarrs) {
	/*删除产品接口*/
	var datacon = "sceneId=" + sceneids + "&skuIds=" + delarrs;
	$.ajax({
		type: "post",
		url: "http://qycg.jd.com/currentOrder/del",
		dataType: 'jsonp',
		data: datacon,
		cache: true,
		success: function(data) {
			console.log("删除成功");
		},
		error: function(data) {
			console.log("error")
		}
	});
}

$(".shopping_cart_main").on("click", ".all-delete", function() {
	//		删除选中按钮
	var delarr = "";
	var sceneid = "";
	$(this).parents(".shop-group-item").find(".goodsCheck").each(function() { //循环场景里面的商品
		if($(this).is(":checked")) { //如果该商品被选中
			delarr += $(this).parents("li").attr("data-sku") + ","; //得到商品的sku
			sceneid = $(this).parents("li").attr("data-sceneid"); //得到商品的场景
			$(this).parents("li").remove();
		}

	});
	console.log(sceneid, delarr);
	delAjax(sceneid, delarr);
	TotalPrice();

});

//侧滑显示删除按钮
function delscroll() {

	var expansion = null; //是否存在展开的list
	var container = document.querySelectorAll('.shop-group-item ul li');
	var delclick = false;
	container
	for(var i = 0; i < container.length; i++) {
		var x, y, X, Y, swipeX, swipeY;
		container[i].addEventListener('touchstart', function(event) {
			x = event.changedTouches[0].pageX;
			y = event.changedTouches[0].pageY;
			swipeX = true;
			swipeY = true;
			if(expansion) { //判断是否展开，如果展开则收起
				expansion.className = "";
			}
		});
		container[i].addEventListener('touchmove', function(event) {

			X = event.changedTouches[0].pageX;
			Y = event.changedTouches[0].pageY;
			// 左右滑动
			if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
				// 阻止事件冒泡
				event.stopPropagation();
				if(X - x > 10) { //右滑
					event.preventDefault();
					this.className = ""; //右滑收起
				}
				if(x - X > 10) { //左滑
					event.preventDefault();
					this.className = "swipeleft"; //左滑展开
					expansion = this;
				}
				swipeY = false;
			}
			// 上下滑动
			if(swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
				swipeX = false;
			}
		});
	}

}

$(function() {
	//VRscenes
	$("html").css("height", "100%");
	$("body").css("height", "100%");
	var bh = $("body").height();
	var vrscenes_curr;
	var VRsceneswrap;
	var showVRscenes;

	//  console.log(VRh);
	$(".scenes_list_rel").click(function() {
		if(vrscenes_curr == 1) {
			$('.scenes_xl').hide();
			$(".scenes_xljt").find('img').removeClass('jt_xz');
			$(this).attr("data-select", "0");
			vrscenes_curr = $(".scenes_list_rel").attr("data-select")
		} else {
			$('.scenes_xl').show();
			$(".scenes_xljt").find('img').addClass('jt_xz');
			$(this).attr("data-select", "1");
			vrscenes_curr = $(".scenes_list_rel").attr("data-select")
		}
	});
	$(".hotscenes-list-ico").bind('click', function() {
		var controlimg = $(this).find('img').attr('src');
		var controltxt = $(this).find('span').html();
		$('#chose_input').find('img').attr('src', controlimg);
		$('#chose_input').find('span').html(controltxt);
		$('.scenes_xl').hide();
		$(".scenes_xljt").find('img').removeClass('jt_xz');
		$(".scenes_list_rel").attr("data-select", "0");
		vrscenes_curr = $(".scenes_list_rel").attr("data-select")
	});

	$(".VRscenes_sku_slide_up").click(function() {
		VRsceneswrap = $(".VRscenes_sku_slide");
		showVRscenes = VRsceneswrap.attr("data-id");
		if(showVRscenes == 0) {
			VRsceneswrap.animate({
				"top": '+=' + VRh
			}, 800);
			VRsceneswrap.attr("data-id", "1");
			$(".VRscenes_sku_slide_up").css({
				'background': 'url("../../images/VRscenes_sku_slide_up.png")no-repeat center',
				'background-size': '100% 100%'
			});
		} else {
			VRsceneswrap.animate({
				"top": '-=' + VRh
			}, 800);
			VRsceneswrap.attr("data-id", "0");
			$(".VRscenes_sku_slide_up").css({
				'background': 'url("../../images/VRscenes_sku_slide_down.png")no-repeat center',
				'background-size': '100% 100%'
			});
		}
	});

	$(".shopping_cart").css("height", bh);

	//采购清单

	$(".shopping_cart_tab_active").css("width", "55.33%");
	$(".check").css("padding-bottom", "5.76%");
	$(".allCheck").css("top", "26.24%");

	$(".shopping_cart_tab span").click(function() {
		/*场景和综合切换*/
		jsclear();
		var shopping_data = $(this).attr("data-select");
		$(".shopping_cart_tab_active").removeClass("shopping_cart_tab_active");
		$(this).addClass("shopping_cart_tab_active");
		$(this).css("width", "55.33%").siblings().css("width", "44.67%");
		if(shopping_data == 0) {
			$(".shopping_cart_scenes").show();
			$(".shopPrice").show();
			$(".shop-group-item").remove();
			seneidnum = 0;
			shopAjax(0);

		} else {

			$(".shopping_cart_scenes").hide();
			$(".shopPrice").hide();
			shopcomAjax();

		}
	});

	function jsclear() {
		/*清空总数*/
		$("#AllTotal").html(0.00);
		$(".shop-allnum").html(0);
	}

	/*展开购物清单*/
	$(".shop_menu").click(function() {
		$(".shopping_cart").animate({
			left: "-=100%"
		}, 800);
		shopAjax(0);
	});

	$(".shop_menu_hide").click(function() {

		$(".shopping_cart").animate({
			left: "+=100%"
		}, 800);
	});

});

var vrclalist = [];

var vrprolist = [];
var vrpropri = [];

function vrclaAjax(cid) {

	/*vr商品类目*/
	$.ajax({
		type: "get",
		url: indurl,
		data: "app=shangcai&action=getCommodity&cid=" + cid,
		dataType: 'jsonp',
		success: function(data) {
			var tdata = data.DATA[cid];
			vrclalist = tdata;
			console.log(vrclalist, "vrclalist 类目");
		}
	});

}

var cpind = 0;

function vrproAjax(cid) {
	//获取相识产品
	var same_term = cid;
	$.ajax({
		type: "get",
		url: indurl,
		jsonpCallback: "jQuery1783060",
		data: "app=Shangcai&action=getCommodity&cid=" + same_term,
		dataType: 'jsonp',
		success: function(data) {
			//  		    console.log(data,'flike')
			vrprolist = data.DATA[same_term];
			console.log(vrprolist, "vrprolist 相似商品");

			vrpriceAjax(cpind);
			//  			vrpriceAjax(skuarr,jskuarr);

		}
	});
}

function vrpriceAjax(cpind) {
	//		产品价格
	var priceurl;
	var skudata;
	var skuid = "";
	//		console.log(result);
	if(result == 0) {
		skuid = vrprolist[cpind].skuId;
		priceurl = "//ai.jd.com/index_new?app=Search&user=company&action=getCompanyPrice";
	} else if(result == 1) {
		skuid = "J_" + vrprolist[cpind].skuId;
		priceurl = "//p.3.cn/prices/mgets?type=1";
	} else {
		return;
	}

	skudata = "skuids=" + skuid;
	//			console.log(skudata);

	$.ajax({
		type: "get",
		url: priceurl,
		data: skudata,
		dataType: 'jsonp',
		success: function(data) {
			vrpropri = data; //价格赋值
			vrprofill(cpind);
			cpind++;
			var len = vrprolist.length;
			if(cpind < len) {
				vrpriceAjax(cpind);
			}
		}
	});
}

var VRh = 0;

function vrprofill(cpind) {
	//vr点击时具体的商品明细
	var i = cpind;
	var vrprofill = "";
	vrprofill += "<div class='VRscenes_sku_item_list' data-sku='" + vrprolist[i].skuId + "'>"
	vrprofill += "<div class='VRscenes_sku_item_li'><div class='VRscenes_sku_item_img'>"
	vrprofill += "<a href='" + vrprolist[i].url + "'><img src='" + imgtot + vrprolist[i].picUrl + "' alt=''></a></div>"
	vrprofill += "<div class='VRscenes_sku_item_title'><a href='" + vrprolist[i].url + "'><div class='VRscenes_sku_item_tit'>" + vrprolist[i].title + "</div>"

	if(result == 0) {
		vrprofill += "<div class='VRscenes_sku_title_price'>¥" + vrpropri.data[0].price + "</div></a><a href='javascript:void(0)' class='VRscenes_sku_item_button'>加入采购清单</a>"
	} else {
		//vrpropri[0].p 企业价格
		vrprofill += "<div class='VRscenes_sku_title_price'>¥" + 1.2 + "</div></a><a href='https://plogin.m.jd.com/user/login.action' class='VRscenes_sku_item_button'>查看企业专享价</a>" //坑
	}

	vrprofill += "</div></div></div>"

	$(".VRscenes_sku_wrap").append(vrprofill);

}

function vrclick(classcli) {
	//vr中点击时，显示相识产品
	var vrtermid,
		len = vrclalist.length;

	for(var i = 0; i < len; i++) {
		if(vrclalist[i].promoteText == classcli) {

			vrtermid = vrclalist[i].term;
		}
	}
	$(".VRscenes_sku_wrap .VRscenes_sku_item_list").remove(); //清空原来的vr清单

	vrproAjax(vrtermid);
	protop();

}

function protop() {
	//vr上拉，下拉菜单
	var bh = $("body").height();
	var pdh = bh * 0.015;
	var VRscenesheight = $(".VRscenes_sku_slide").height();
	VRh = VRscenesheight - pdh;
	//	console.log($(".VRscenes_sku_wrap").length)

	VRsceneswrap = $(".VRscenes_sku_slide");
	showVRscenes = VRsceneswrap.attr("data-id");
	if(showVRscenes == 0) {
		//      VRsceneswrap.animate({"top" : '+='+VRh}, 400);
		//      VRsceneswrap.animate({"top" : '-='+VRh}, 400);
		VRsceneswrap.attr("data-id", "0");
	} else {
		VRsceneswrap.animate({
			"top": '-=' + VRh
		}, 800);
		VRsceneswrap.attr("data-id", "0");
		$(".VRscenes_sku_slide_up").css({
			'background': 'url("../../images/VRscenes_sku_slide_down.png")no-repeat center',
			'background-size': '100% 100%'
		});
	}

}