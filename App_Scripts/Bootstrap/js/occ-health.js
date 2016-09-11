$(function(){

	// BOOTSTRAP POPOVER
	$('[data-toggle="modal"]').on("click", function(){
		$('[data-toggle="popover"]').popover('hide');
	});
	$('[data-toggle="popover"]').on("click", function(){
		$('[data-toggle="popover"]').popover('hide');
		$(this).popover('show');
	});


	//keep sidebar from dissapearing
	// $('#sidebar').affix({
	//       offset: {
	//         top: 150
	//       }
	// });
});

