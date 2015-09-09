$( function() {
	idLang = localStorage.getItem('lang');
	if (idLang == null){
		localStorage.setItem('lang',1);
		getData();
	}

	else {
		getData(idLang);
	}

	//---------------------------------
	addFav();
	//---------------------------------
	goinfo();
	//---------------------------------
	getFavorites();
	//---------------------------------
	gohome();
});