secret_key = "xEXWrG3PZoCturXJkQxi3XZFrQDHqF";
host_url = "http://center.7demo.org.ua/";
url_app = 'url_google';
var ns, allSlides, lang_word, ageSame = 0;
//---------------------------------------
function getData(){
    var idLanguage = localStorage.getItem('lang');
    $.ajax({
    type       : "POST",
    data:{'secret_key':secret_key,'id_lang':idLanguage,'url':url_app},
    url        : host_url+"index.php?c=api&m=getData",
    crossDomain: true,
    dataType   : 'json',
    beforeSend : function(){},
    complete   : function(){
        sliderInit();
        closePre();
        videoloading();
    },
    success    : function(response) {
        $(".info").append(response.data[0].words[1]);

        $(".select_box").append("<option>"+response.data[0].words[2]+"</option>");
        lang_word = response.data[0].words[2];
        $(".select_box2").append("<option>"+response.data[0].words[3]+"</option>");

        $(".left_side h2").append(response.data[0].words[5]);

        $(".nema-fav span").append(response.data[0].words[31]);

            // записуєм в селект Мова
        var arrlang = response.data[1].lang_list;
        for (key in arrlang) {
            $(".select_box").append("<option data-lang="+key+">"+arrlang[key]+"</option>");
        }

        // записуєм в селект Вік
        $.each(response.data[2].age_list, function(){
            $(".select_box2").append("<option>"+this.val+"</option>");
        });  

        // записуємо контент слайдера
        allSlides  = response.data[4].slider;
        if(allSlides == '') $('.favorite').hide();
       $('.slider-main').append(allSlides);
       ns = $('.out-swipper > div > div').length;


       //info

      var tabs = response.data[3].infotabs[0].tabs,
      slides = response.data[3].infotabs[0].slides;
      $('.tabs').append(tabs);
      $('.swiper-tabs .swiper-wrapper').append(slides);
       //end info

        selectinit();
    },
    error      : function(response) {
        console.log('error');
     }
  });
}
//---------------------------------------------

function closePre() {
    setTimeout(function() {
        $('.loader').hide();
    }, 500);
};

//---------------------------------------------

function showPre() {
    $('.loader').show();
};

//------------------------------

function selectinit() {
	$(".select_box").selectbox();
    $(".select_box2").selectbox();
    changeVal();
    changeLang();
};

//------------------------------

function sliderInit() {  
    var mySwiper = new Swiper('.out-swipper',{
        slidesPerView: 'auto',
        eventTarget: 'container',
        onImagesReady:  function(mySwiper){ 
            // check fav count
            heart();           
            closePre();
        }
    });

    // slidejs
    $('.slides').slidesjs({
        navigation: false
    }); 

    // 3 dot
    $('.slider_i_description').dotdotdot();   
};

//---------------------------------------------

// add to fav
var foos; // local store
var mas2 = new Array(); //array id

//---------------------------------------------

function addFav() {
    // add active class to favorite block
    $('.add_fav_block').live('click', function (event){
        event.preventDefault();
        if ($(this).children('span').hasClass("add_fav_act")) {
            $(this).children('span').removeClass("add_fav_act");
            // remove from local storage
            for(var i=0;i<mas2.length;i++){
                    if(mas2[i]!=$(this).parent().parent(".swiper-slide").attr("id")){
                        var itemtoRemove = $(this).parent().parent(".swiper-slide").attr("id");
                    }   
                }
            mas2.splice($.inArray(itemtoRemove, mas2),1);
            localStorage.setItem('foo', JSON.stringify(mas2));
            foos = JSON.parse(localStorage.getItem('foo'));
        }
        else {
            $(this).children('span').addClass( "add_fav_act" );
            mas2.push($(this).parent().parent(".swiper-slide").attr("id"));
            localStorage.setItem('foo', JSON.stringify(mas2));
            foos = JSON.parse(localStorage.getItem('foo'));
        }
    });     
}

//---------------------------------------------

function heart(){
    var foo = localStorage.getItem('foo');
    if(foo != null)
    {
        foos = JSON.parse(foo);
        mas2 = [];

        for(var i=0;i<foos.length;i++){
            $(".add_fav_block").each(function(){
                if($(this).parent().parent(".swiper-slide").attr("id")==foos[i]){
                    mas2.push($(this).parent().parent(".swiper-slide").attr("id"));
                    $(this).children('span').addClass("add_fav_act")
                    return false;
                }
            })  
        }
    }
}

//------------------------------------------------------

function changeVal(){   
    $('.select_box2+.sbHolder .sbOptions li a').click(function(event) {
        event.preventDefault();
        var opt1 = $(".select_box2 option").first().text();
        var opt = this.text; 
        if(opt!=opt1 && opt!=ageSame)
        { 
            $('.slider-main').html('');
            $('.favorite').removeClass('favorite2');
            $('.gohome').hide();
            $('.nema-fav').hide();
            ageSame = opt;
            showPre();
            getDataAge(opt);
        }
    });
}

//---------------------------------------------------------

function getDataAge(ageMin){
    var idLanguage = localStorage.getItem('lang');
    $.ajax({
    type       : "POST",
    data       :{'secret_key':secret_key,'id_lang':idLanguage,'age_min': ageMin,'url':url_app},
    url        : host_url+"index.php?c=api&m=getAgeData",
    crossDomain: true,
    dataType   : 'json',
    beforeSend : function(){
    },
    complete   : function(){
        closePre();
    },
    success    : function(response) {
        allSlides = response.slider;
        $('.slider-main').append(allSlides); 
        sliderInit(); 
    },
    error      : function(response) {
        console.log('error')
     }
  });
}

//------------------------------------------------------

function changeLang(){   
    $('.select_box+.sbHolder .sbOptions li a').click(function(event) {
        event.preventDefault();
        var pickLang = this.text;
        if(pickLang == lang_word){ 
            sendLang = 1;
        }
        else{
            $('.select_box option').each( function() {
                var lang = this.text;
                if ( lang == pickLang) {
                    var langSame = localStorage.getItem('lang');
                    if($(this).index()!=langSame){
                        var sendLang  = $(this).attr('data-lang');
                        localStorage.setItem('lang', sendLang);
                        location.reload();
                    }
                }
            });
        }
        
    });
}

//-----------------------------------------------------

function calc() {
    winhei = $(window).height();
    winhei2 = winhei - 40;
    $('.wrap').height(winhei2);
    $('.content-slide').css('height',winhei2-60+'px');
    winwid = $(window).width();
    winwid2 = winwid - 40;
    $('.wrap').width(winwid2); 
    $('.right_side').width(winwid2-265);
};

//--------------------------------------------------

//---------------------------------------------

function sliderInfo() {
    var w = $(window).width()-305;
    $('.swiper-tabs').css('width',w+'px'); 
  var tabsSwiper = new Swiper('.swiper-tabs',{
    speed:500,
    onSlideChangeStart: function(){
      $(".tabs .active").removeClass('active');
      $(".tabs a").eq(tabsSwiper.activeIndex).addClass('active');
    }
  });

  $(".tabs a").on('touchstart mousedown',function(e){
    e.preventDefault()
    $(".tabs .active").removeClass('active');
    $(this).addClass('active');
    tabsSwiper.swipeTo($(this).index());
  });

  $(".tabs a").click(function(e){
    e.preventDefault();
  });
};

//----------------------

function goinfo() {
    $('.info').click( function() {
        calc();
        sliderInfo();
    });
};

//------------------------


function getDataFavorites(){
    var values = mas2;
    var arr_id = JSON.stringify(values);
    if(arr_id.length != 2) {
        var idLanguage = localStorage.getItem('lang');
        $.ajax({
        type       : "POST",
        data       :{'secret_key':secret_key,'id_lang':idLanguage,'arr_id': arr_id,'url':url_app},
        url        : host_url+"index.php?c=api&m=getFavoritesData",
        crossDomain: true,
        dataType   : 'json',
        beforeSend : function(){
            showPre();
        },
        complete   : function(){
            sliderInit();
            $('.gohome').show();
            closePre();
        },
        success    : function(response) {
            $('.slider-main').html('');
            $('.slider-main').append(response.slider); 
            ns = $('.out-swipper > div > div').length; 
        },
        error      : function(response) {
            console.log('error')
         }
      });
    }

    else {
        $('.slider-main').html('');
        $('.gohome').show();
        $('.nema-fav').show();
        closePre();
    }
}

//---------------------------------

function getFavorites(){
    $('.favorite').click(function(){
        getDataFavorites();
        showPre();
        $('.favorite').addClass('favorite2');
    });
};

//---------------------------------

function gohome() {
    $('.gohome').click(function(){
        showPre();
        $('.favorite').removeClass('favorite2');
        $(this).hide();
        $('.nema-fav').hide();
        $('.slider-main').html('');
        $('.slider-main').append(allSlides);
        ns = $('.out-swipper > div > div').length;
        sliderInit();         
    });
};
//--------------------------------

function videoloading() {
    var i = 0; 
    var interval = setInterval(function() {
        if(i > $('.letter').length)
        {
            clearInterval(interval);
            $('.loader_video').fadeOut(10);
        }
        $('.letter').eq(i).animate({
            opacity: 1,
        }, 100 );
        ++i;
    }, 300);    
}

