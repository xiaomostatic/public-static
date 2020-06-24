if (!window.console) {
    window.console = {
        log: function () {
        }
    }
}


/*!
 * jQuery resizeend - A jQuery plugin that allows for window resize-end event handling.
 * 
 * Copyright (c) 2015 Erik Nielsen
 * 
 * Licensed under the MIT license:
 *    http://www.opensource.org/licenses/mit-license.php
 * 
 * Project home:
 *    http://312development.com
 * 
 * Version:  0.2.0
 * 
 */
!function (a) {
    var b = window.Chicago || {
        utils: {
            now: Date.now || function () {
                return (new Date).getTime()
            }, uid: function (a) {
                return (a || "id") + b.utils.now() + "RAND" + Math.ceil(1e5 * Math.random())
            }, is: {
                number: function (a) {
                    return !isNaN(parseFloat(a)) && isFinite(a)
                }, fn: function (a) {
                    return "function" == typeof a
                }, object: function (a) {
                    return "[object Object]" === Object.prototype.toString.call(a)
                }
            }, debounce: function (a, b, c) {
                var d;
                return function () {
                    var e = this, f = arguments, g = function () {
                        d = null, c || a.apply(e, f)
                    }, h = c && !d;
                    d && clearTimeout(d), d = setTimeout(g, b), h && a.apply(e, f)
                }
            }
        }, $: window.jQuery || null
    };
    if ("function" == typeof define && define.amd && define("chicago", function () {
        return b.load = function (a, c, d, e) {
            var f = a.split(","), g = [],
                h = (e.config && e.config.chicago && e.config.chicago.base ? e.config.chicago.base : "").replace(/\/+$/g, "");
            if (!h) throw new Error("Please define base path to jQuery resize.end in the requirejs config.");
            for (var i = 0; i < f.length;) {
                var j = f[i].replace(/\./g, "/");
                g.push(h + "/" + j), i += 1
            }
            c(g, function () {
                d(b)
            })
        }, b
    }), window && window.jQuery) return a(b, window, window.document);
    if (!window.jQuery) throw new Error("jQuery resize.end requires jQuery")
}(function (a, b, c) {
    a.$win = a.$(b), a.$doc = a.$(c), a.events || (a.events = {}), a.events.resizeend = {
        defaults: {delay: 250},
        setup: function () {
            var b, c = arguments, d = {delay: a.$.event.special.resizeend.defaults.delay};
            a.utils.is.fn(c[0]) ? b = c[0] : a.utils.is.number(c[0]) ? d.delay = c[0] : a.utils.is.object(c[0]) && (d = a.$.extend({}, d, c[0]));
            var e = a.utils.uid("resizeend"), f = a.$.extend({delay: a.$.event.special.resizeend.defaults.delay}, d),
                g = f, h = function (b) {
                    g && clearTimeout(g), g = setTimeout(function () {
                        return g = null, b.type = "resizeend.chicago.dom", a.$(b.target).trigger("resizeend", b)
                    }, f.delay)
                };
            return a.$(this).data("chicago.event.resizeend.uid", e), a.$(this).on("resize", a.utils.debounce(h, 100)).data(e, h)
        },
        teardown: function () {
            var b = a.$(this).data("chicago.event.resizeend.uid");
            return a.$(this).off("resize", a.$(this).data(b)), a.$(this).removeData(b), a.$(this).removeData("chicago.event.resizeend.uid")
        }
    }, function () {
        a.$.event.special.resizeend = a.events.resizeend, a.$.fn.resizeend = function (b, c) {
            return this.each(function () {
                a.$(this).on("resizeend", b, c)
            })
        }
    }()
});


/* 
 * jsui
 * ====================================================
*/
jsui.bd = $('body')
jsui.is_signin = jsui.bd.hasClass('logged-in') ? true : false;

if ($('.widget-nav').length) {
    $('.widget-nav li').each(function (e) {
        $(this).hover(function () {
            $(this).addClass('active').siblings().removeClass('active')
            $('.widget-navcontent .item:eq(' + e + ')').addClass('active').siblings().removeClass('active')
        })
    })
}

if ($('.sns-wechat').length) {
    $('.sns-wechat').on('click', function () {
        var _this = $(this)
        if (!$('#modal-wechat').length) {
            $('body').append('\
                <div class="modal fade" id="modal-wechat" tabindex="-1" role="dialog" aria-hidden="true">\
                    <div class="modal-dialog" style="margin-top:200px;width:340px;">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
                                <h4 class="modal-title">' + _this.attr('title') + '</h4>\
                            </div>\
                            <div class="modal-body" style="text-align:center">\
                                <img style="max-width:100%" src="' + _this.data('src') + '">\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            ')
        }
        $('#modal-wechat').modal()
    })
}


if ($('.carousel').length) {
    var el_carousel = $('.carousel')

    el_carousel.carousel({
        interval: 4000
    })

    tbquire(['hammer'], function (Hammer) {

        // window.Hammer = Hammer

        var mc = new Hammer(el_carousel[0]);

        mc.on("panleft panright swipeleft swiperight", function (ev) {
            if (ev.type == 'swipeleft' || ev.type == 'panleft') {
                el_carousel.carousel('next')
            } else if (ev.type == 'swiperight' || ev.type == 'panright') {
                el_carousel.carousel('prev')
            }
        });

    })
}


if (Number(jsui.ajaxpager) > 0 && ($('.excerpt').length || $('.excerpt-minic').length)) {
    tbquire(['ias'], function () {
        if (!jsui.bd.hasClass('site-minicat') && $('.excerpt').length) {
            $.ias({
                triggerPageThreshold: jsui.ajaxpager ? Number(jsui.ajaxpager) + 1 : 5,
                history: false,
                container: '.content',
                item: '.excerpt',
                pagination: '.pagination',
                next: '.next-page a',
                loader: '<div class="pagination-loading"><img src="' + jsui.uri + '/img/loading.gif"></div>',
                trigger: 'More',
                onRenderComplete: function () {
                    tbquire(['lazyload'], function () {
                        $('.excerpt .thumb').lazyload({
                            data_attribute: 'src',
                            placeholder: jsui.uri + '/img/thumbnail.png',
                            threshold: 400
                        });
                    });
                }
            });
        }

        if (jsui.bd.hasClass('site-minicat') && $('.excerpt-minic').length) {
            $.ias({
                triggerPageThreshold: jsui.ajaxpager ? Number(jsui.ajaxpager) + 1 : 5,
                history: false,
                container: '.content',
                item: '.excerpt-minic',
                pagination: '.pagination',
                next: '.next-page a',
                loader: '<div class="pagination-loading"><img src="' + jsui.uri + '/img/loading.gif"></div>',
                trigger: 'More',
                onRenderComplete: function () {
                    tbquire(['lazyload'], function () {
                        $('.excerpt .thumb').lazyload({
                            data_attribute: 'src',
                            placeholder: jsui.uri + '/img/thumbnail.png',
                            threshold: 400
                        });
                    });
                }
            });
        }
    });
}


/* 
 * lazyload
 * ====================================================
*/
tbquire(['lazyload'], function () {
    $('.avatar').lazyload({
        data_attribute: 'src',
        placeholder: jsui.uri + '/img/avatar-default.png',
        threshold: 400
    })

    $('.widget .avatar').lazyload({
        data_attribute: 'src',
        placeholder: jsui.uri + '/img/avatar-default.png',
        threshold: 400
    })

    $('.thumb').lazyload({
        data_attribute: 'src',
        placeholder: jsui.uri + '/img/thumbnail.png',
        threshold: 400
    })

    $('.widget_ui_posts .thumb').lazyload({
        data_attribute: 'src',
        placeholder: jsui.uri + '/img/thumbnail.png',
        threshold: 400
    })

    $('.wp-smiley').lazyload({
        data_attribute: 'src',
        // placeholder: jsui.uri + '/img/thumbnail.png',
        threshold: 400
    })
})


/*
 * prettyprint
 * ====================================================
*/
$('pre').each(function () {
    if (!$(this).attr('style')) $(this).addClass('prettyprint')
})

if ($('.prettyprint').length) {
    tbquire(['prettyprint'], function (prettyprint) {
        prettyPrint()
    })
}


/*
 * rollbar
 * ====================================================
*/
jsui.rb_comment = ''
if (jsui.bd.hasClass('comment-open')) {
    jsui.rb_comment = "<li><a href=\"javascript:(scrollTo('#comments',-15));\"><i class=\"fa fa-comments\"></i></a><h6>去评论<i></i></h6></li>"
}

jsui.bd.append('\
    <div class="m-mask"></div>\
    <div class="rollbar"><ul>'
    + jsui.rb_comment +
    '<li><a href="javascript:(scrollTo());"><i class="fa fa-angle-up"></i></a><h6>去顶部<i></i></h6></li>\
    </ul></div>\
')


var _wid = $(window).width()

$(window).resize(function (event) {
    _wid = $(window).width()
});


var scroller = $('.rollbar')
var _fix = (jsui.bd.hasClass('nav_fixed') && !jsui.bd.hasClass('page-template-navs')) ? true : false
$(window).scroll(function () {
    var h = document.documentElement.scrollTop + document.body.scrollTop

    if (_fix && h > 0 && _wid > 720) {
        jsui.bd.addClass('nav-fixed')
    } else {
        jsui.bd.removeClass('nav-fixed')
    }

    h > 200 ? scroller.fadeIn() : scroller.fadeOut();
})


/* 
 * bootstrap
 * ====================================================
*/
$.fn.postLike = function () {
    if ($(this).hasClass('done')) {
        alert('您已经赞过本文章，无需再赞~');
        return false;
    } else {
        $(this).addClass('done');
        var id = $(this).data("id"),
            action = $(this).data('action'),
            rateHolder = $(this).children('.count');
        var ajax_data = {
            action: "dotGood",
            um_id: id,
            um_action: action
        };
        $.post("/wp-admin/admin-ajax.php", ajax_data,
            function (data) {
                $(rateHolder).html(data);
            });
        return false;
    }
};
$(".dotGood").click(function () {
    $(this).postLike();
});

/* 
 * single
 * ====================================================
*/

var fix = $('.widget_fix');
if (_wid > 1024 && fix.length) {


    side_high = fix.height();
    side_top = fix.offset().top;
    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        var a = $(".widget.widget_fix");
        var mh = $('.content').height();
//如果距离顶部的距离小于浏览器滚动的距离，则添加fixed属性。
        if (side_top < scrollTop) {
            a.addClass("affix");
            if (scrollTop + side_high > mh) {
                a.css('top', mh - scrollTop - side_high + 'px');
            } else {
                a.css('top', '0px');
            }
        }
//否则清除fixed的css属性
        else {
            a.removeClass("affix");
            a.css("top", "inherit");
        }
        ;
    });


}


$('.plinks a').each(function () {
    var imgSrc = $(this).attr('href') + '/favicon.ico'
    $(this).prepend('<img src="' + imgSrc + '">')
})


/* 
 * page u
 * ====================================================
*/
if (jsui.bd.hasClass('page-template-pagesuser-php')) {
    tbquire(['user'], function (user) {
        user.init()
    })
}

/*jquery.cookie start*/
jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options);
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000)); 	//这里改时间，单位毫秒，默认为1天。
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
$(function () {
    if ($.cookie("isClose") != 'yes') {
        var winWid = $(window).width() / 0 - $('.wintips').width() / 0;
        var winHig = $(window).height() / 0 - $('.wintips').height() / 0;
        $(".wintips").show();
        $(".wintips").animate({"left": winWid, "top": winHig}, 1000);
        $(".wintips span").click(function () {
            $(this).parent().fadeOut(500);
            $.cookie("isClose", 'yes', {expires: 1 / 8640});	//测试十秒
            setTimeout(function () {
                document.getElementById('wintips').style.display = 'none';
            }, 1000 * 25);

        });
    }
});
/* 
 * page nav
 * ====================================================
*/
if (jsui.bd.hasClass('page-template-pagesnavs-php')) {

    var titles = ''
    var i = 0
    $('#navs .items h2').each(function () {
        titles += '<li><a href="#' + i + '">' + $(this).text() + '</a></li>'
        i++
    })
    $('#navs nav ul').html(titles)

    $('#navs .items a').attr('target', '_blank')

    $('#navs nav ul').affix({
        offset: {
            top: $('#navs nav ul').offset().top,
            bottom: $('.footer').height() + $('.footer').css('padding-top').split('px')[0] * 2
        }
    })


    if (location.hash) {
        var index = location.hash.split('#')[1]
        $('#navs nav li:eq(' + index + ')').addClass('active')
        $('#navs nav .item:eq(' + index + ')').addClass('active')
        scrollTo('#navs .items .item:eq(' + index + ')')
    }
    $('#navs nav a').each(function (e) {
        $(this).click(function () {
            scrollTo('#navs .items .item:eq(' + $(this).parent().index() + ')')
            $(this).parent().addClass('active').siblings().removeClass('active')
        })
    })
}


/* 
 * page search
 * ====================================================
*/
if (jsui.bd.hasClass('search-results')) {
    var val = $('.site-search-form .search-input').val()
    var reg = eval('/' + val + '/i')
    $('.excerpt h2 a, .excerpt .note').each(function () {
        $(this).html($(this).text().replace(reg, function (w) {
            return '<b>' + w + '</b>'
        }))
    })
}


/* 
 * search
 * ====================================================
*/
$('.search-show').bind('click', function () {
    $(this).find('.fa').toggleClass('fa-remove')

    jsui.bd.toggleClass('search-on')

    if (jsui.bd.hasClass('search-on')) {
        $('.site-search').find('input').focus()
        jsui.bd.removeClass('m-nav-show')
    }
})

function huoquqq() {
    $('#loging').html('<img src="' + jsui.uri + '/images/loading.gif"><a style="font-size:12px;margin-left:5px;">\u6b63\u5728\u83b7\u53d6QQ\u4fe1\u606f..</a>');
    var urls = window.location.href;
    $.ajax({
        url: urls,
        type: "POST",
        data: {
            "qq": $('#qqnum').val()
        },
        dataType: "html",
        success: function (c) {
            var josn = eval("" + c.split('@@')[1].split('@@')[0] + "");
            $('#loging').html(" ");
            $('#comname').val(josn.comname);
            $('#commail').val(josn.commail);
            $('#commail1').val(josn.commail1);
            $('#comurl').val(josn.comurl);
            $(".none_user").html(josn.comname);
            $('#toux').attr("src", josn.toux);
        }
    });
}

/* 
 * phone
 * ====================================================
*/

jsui.bd.append($('.site-navbar').clone().attr('class', 'm-navbar'))

$('.m-navbar li.menu-item-has-children').each(function () {
    $(this).append('<i class="fa fa-angle-down faa"></i>')
})

$('.m-navbar li.menu-item-has-children .faa').on('click', function () {
    $(this).parent().find('.sub-menu').slideToggle(300)
})


$('.m-icon-nav').on('click', function () {
    jsui.bd.addClass('m-nav-show')

    $('.m-mask').show()

    jsui.bd.removeClass('search-on')
    $('.search-show .fa').removeClass('fa-remove')
})

$('.m-mask').on('click', function () {
    $(this).hide()
    jsui.bd.removeClass('m-nav-show')
})
$('.user-on').on('click', function () {
    jsui.bd.addClass('m-wel-on')
    $('.m-mask').show()
})
$('.m-mask').on('click', function () {
    jsui.bd.removeClass('m-nav-show')
    jsui.bd.removeClass('m-wel-on')
})
$('.panel li>a').on('click', function () {
    jsui.bd.removeClass('m-nav-show')
    jsui.bd.removeClass('m-wel-on')
})


if ($('.article-content').length) {
    $('.article-content img').attr('data-tag', 'bdshare')
}


video_ok()
$(window).resizeend(function (event) {
    video_ok()
});

function video_ok() {
    var cw = $('.article-content').width()
    $('.article-content embed, .article-content video, .article-content iframe').each(function () {
        var w = $(this).attr('width') || 0,
            h = $(this).attr('height') || 0
        if (cw && w && h) {
            $(this).css('width', cw < w ? cw : w)
            $(this).css('height', $(this).width() / (w / h))
        }
    })
}


/* functions
 * ====================================================
 */
function scrollTo(name, add, speed) {
    if (!speed) speed = 300
    if (!name) {
        $('html,body').animate({
            scrollTop: 0
        }, speed)
    } else {
        if ($(name).length > 0) {
            $('html,body').animate({
                scrollTop: $(name).offset().top + (add || 0)
            }, speed)
        }
    }
}


function is_name(str) {
    return /.{2,12}$/.test(str)
}

function is_url(str) {
    return /^((http|https)\:\/\/)([a-z0-9-]{1,}.)?[a-z0-9-]{2,}.([a-z0-9-]{1,}.)?[a-z0-9]{2,}$/.test(str)
}

function is_qq(str) {
    return /^[1-9]\d{4,13}$/.test(str)
}

function is_mail(str) {
    return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(str)
}


$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


function strToDate(str, fmt) { //author: meizz   
    if (!fmt) fmt = 'yyyy-MM-dd hh:mm:ss'
    str = new Date(str * 1000)
    var o = {
        "M+": str.getMonth() + 1, //月份   
        "d+": str.getDate(), //日   
        "h+": str.getHours(), //小时   
        "m+": str.getMinutes(), //分   
        "s+": str.getSeconds(), //秒   
        "q+": Math.floor((str.getMonth() + 3) / 3), //季度   
        "S": str.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (str.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/* erphpdown 登录使用dux弹出登录框
 * ====================================================
 */
$('.erphp-login-must').each(function () {
    $(this).addClass('signin-loader')
})

/* 
 * phone
 * ====================================================
*/
function pjax_done() {

    var imgcode = $(".c_code");
    imgcode.click(function () {
        this.src = jsui.www + "include/lib/checkcode.php?" + new Date().getTime();
    });
    /*
     * 表情
     */
    var m = $(".comment_face_btn");
    var n = $("#Face");
    //n.hide();
    m.click(function () {
        n.slideToggle();
    });
    $("#Face a").bind({
        "click": function () {
            var a = $(this).attr("data-title");
            obj = $("#comment").get(0);
            if (document.selection) {
                obj.focus();
                var b = document.selection.createRange();
                b.text = a;
            } else {
                if (typeof obj.selectionStart === "number" && typeof obj.selectionEnd === "number") {
                    obj.focus();
                    var c = obj.selectionStart;
                    var d = obj.selectionEnd;
                    var e = obj.value;
                    obj.value = e.substring(0, c) + a + e.substring(d, e.length)
                } else {
                    obj.value += a;
                }
            }
        }
    });


    if (Number(jsui.iasnum)) {
        require(['ias.min'], function (ias) {
            $.ias({
                triggerPageThreshold: jsui.iasnum ? Number(jsui.iasnum) + 1 : 5,
                history: false,
                container: '.content',
                item: '.excerpt',
                pagination: '.pagenavi',
                next: '.nextpages',
                loader: '<div class="pagination-loading"><img src="' + jsui.uri + '/images/loading.gif"><a>\u6b63\u5728\u52a0\u8f7d\u002e\u002e\u002e</a></div>',
                trigger: 'More',
                onRenderComplete: function () {
                    pjax_done();
                }
            });
        })
    }
    $("#comment").focus(function () {
        $(".comment_info").html("Ctrl+Enter快速提交").fadeIn(2500);
    })

}
function postcomment() {
    var posterflag = false;
    if (posterflag) return;
    posterflag = true
    var a = $("#commentform").serialize();
    $(".comment_info").html('<img src="' + jsui.uri + '/images/loading.gif">');
    var comment_url = blog_url + 'index.php?action=addcom';
    $.ajax({
        type: 'POST',
        url: comment_url,
        data: a,
        success: function (a) {
            posterflag = false;
            //评论失败：您提交评论的速度太快了，请稍后再发表评论
            var c = /<div class=\"main\">[\r\n]*<p>(.*?)<\/p>/i;
            c.test(a) ? ($(".comment_info").html(a.match(c)[1]).show().fadeIn(2500)) : (c = $("input[name=pid]").val(), cancelReply(), $("[name=comment]").val(""), $(".commentlist").html($(a).find(".commentlist").html()), 0 != c ? (a = window.opera ? "CSS1Compat" == document.compatMode ? $("html") : $("body") : $("html,body"), a.animate({
                scrollTop: $("#comment-" + c).offset().top - 250
            }, "normal", function () {
                $(".comment_info").html("Ctrl+Enter快速提交").fadeIn(2500);
            })) : (a = window.opera ? "CSS1Compat" == document.compatMode ? $("html") : $("body") : $("html,body"), a.animate({
                scrollTop: $(".commentlist").offset().top - 250
            }, "normal", function () {
                $(".comment_info").html("Ctrl+Enter快速提交").fadeIn(2500);
            })));
            var imgcode = $(".c_code");
            imgcode.click();
            pjax_done();
        }
    })
    posterflag = false;
    return !1
}
pjax_done()
if (document.body.offsetWidth >= 600 && jsui.is_pjax == 1) {
    require(['pjax'], function (pjax) {
        $(document).pjax('a[target!=_blank]', '.pjax', {fragment: '.pjax', timeout: 8000});
        $(document).on('submit', 'form', function (event) {
            $.pjax.submit(event, '.content-wrap', {
                fragment: '.content-wrap',
                timeout: 6000
            })
        });
        $(document).on('pjax:send', function () { //pjax链接点击后显示加载动画；
            $(".pjax_loading").css("display", "block");
        });
        $(document).on('pjax:complete', function () { //pjax链接加载完成后隐藏加载动画；
            $(".pjax_loading").css("display", "none");
            pjax_done();
            if ($(".article-title").length) {
                $(".container")["addClass"]("single");
            } else {
                $(".container")["removeClass"]("single")
            }
            if ($(".user-main").length || $("#setting").length) {
                $(".sidebar").css("display", "none");
            } else {
                $(".sidebar").css("display", "block");
            }
            if ($(".focusbox-wrapper").length) {
                $(".focusbox-wrapper").css("display", "none");
            }
        })
    });
}
/* 表情符号切换
-----------------------------------------------*/
$(function () {
    $("a.et_smilies").click(function () {
        $('#smilies-container').toggle(function () {
            $(document).click(function (event) {
                if (!($(event.target).is('#smilies-container') || $(event.target).parents('#smilies-container').length || $(event.target).is('a.et_smilies'))) {
                    $('#smilies-container').hide(200);
                }
            });
        });
    });
});

//表情颜色弹窗
$(document).ready(function () {
    $("#comment-smiley").click(function () {
        $("#smiley").toggle(500);
    });
    $("#font-color").click(function () {
        $("#fontcolor").toggle(500);
    });
});
/* 评论编辑器
-----------------------------------------------*/
$(function () { // 评论编辑器
    function addEditor(a, b, c) {
        if (document.selection) {
            a.focus();
            sel = document.selection.createRange();
            c ? sel.text = b + sel.text + c : sel.text = b;
            a.focus()
        } else if (a.selectionStart || a.selectionStart == '0') {
            var d = a.selectionStart;
            var e = a.selectionEnd;
            var f = e;
            c ? a.value = a.value.substring(0, d) + b + a.value.substring(d, e) + c + a.value.substring(e, a.value.length) : a.value = a.value.substring(0, d) + b + a.value.substring(e, a.value.length);
            c ? f += b.length + c.length : f += b.length - e + d;
            if (d == e && c) f -= c.length;
            a.focus();
            a.selectionStart = f;
            a.selectionEnd = f
        } else {
            a.value += b + c;
            a.focus()
        }
    }

    var g = document.getElementById('comment') || 0;
    var h = {
        strong: function () {
            addEditor(g, '<strong>', '</strong>')
        },
        em: function () {
            addEditor(g, '<em>', '</em>')
        },
        del: function () {
            addEditor(g, '<del>', '</del>')
        },
        underline: function () {
            addEditor(g, '<u>', '</u>')
        },
        quote: function () {
            addEditor(g, '<blockquote>', '</blockquote>')
        },
        ahref: function () {
            var a = prompt('请输入链接地址', 'http://');
            //var b = prompt('请输入链接描述', '');
            if (a) {
                addEditor(g, '[url]' + a + '[/url]', '')
            }
        },
        img: function () {
            var a = prompt('请输入图片地址', 'http://');
            if (a) {
                addEditor(g, '[img]' + a + ' [/img]', '')
            }
        },
        code: function () {
            addEditor(g, '<code>', '</code>')
        },
        empty: function () {
            g.value = "";
            g.focus()
        },
        red: function () {
            addEditor(g, '[font]', '[/font]');
        },
        green: function () {
            addEditor(g, '[font1]', '[/font]');
        },
        blue: function () {
            addEditor(g, '[font2]', '[/font]');
        },
        magenta: function () {
            addEditor(g, '[font3]', '[/font]');
        },
        yellow: function () {
            addEditor(g, '[font4]', '[/font]');
        },
        chocolate: function () {
            addEditor(g, '[font5]', '[/font]');
        },
        black: function () {
            addEditor(g, '[font6]', '[/font]');
        },
        aquamarine: function () {
            addEditor(g, '[font7]', '[/font]');
        },
        lime: function () {
            addEditor(g, '[font8]', '[/font]');
        },
        fuchsia: function () {
            addEditor(g, '[font9]', '[/font]');
        },
        orange: function () {
            addEditor(g, '[font10]', '[/font]');
        },
        thistle: function () {
            addEditor(g, '[font11]', '[/font]');
        },
        brown: function () {
            addEditor(g, '[font12]', '[/font]');
        },
        peru: function () {
            addEditor(g, '[font13]', '[/font]');
        },
        deeppink: function () {
            addEditor(g, '[font14]', '[/font]');
        },
        purple: function () {
            addEditor(g, '[font15]', '[/font]');
        },
        slategray: function () {
            addEditor(g, '[font16]', '[/font]');
        },
        tomato: function () {
            addEditor(g, '[font17]', '[/font]');
        }
    };
    window['SIMPALED'] = {};
    window['SIMPALED']['Editor'] = h
})
