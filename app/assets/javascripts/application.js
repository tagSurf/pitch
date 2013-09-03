// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.serialize-object.js
//= require jquery.limiter.js
//= require bootstrap
//= require_tree .

window.addEventListener('load', function () {
    // Set a timeout...
    setTimeout(function () {
        // Hide the address bar!
        window.scrollTo(0, 1);
    }, 0);
});

Application = {
	ajaxGet : function(url) {
		Application.showProgress(true);

		var request = $.ajax({
			url : url,
			type : 'GET'
		});
		request.always(Application.defaultOnComplete);
		request.done(Application.defaultOnSuccess);
		request.fail(Application.defaultOnError);
		return request;
	},
	ajaxPost : function(url, data) {
		Application.showProgress(true);
		var request = $.ajax({
			data : data,
			url : url,
			type : 'POST'
		});

		request.always(Application.defaultOnComplete);
		request.done(Application.defaultOnSuccess);
		request.fail(Application.defaultOnError);
		return request;
	},
	ajaxFormSubmit : function(){
		var $form = $(this);

		$form.find('.form-group').removeClass('has-error');
		$form.find('ul.input-errors').remove();

		var formData =  $form.serializeObject();

		var request = Application.ajaxPost(
			$form.attr('action'),
			formData
		);

		request.done(function(data){
			if(typeof data !== 'undefined' && typeof data.status !== 'undefined'){
				var successful = data.status === 'success';

				if(!successful && typeof data.result.errors !== 'undefined'){
					$.each(data.result.errors, function(key, value){
						var $input = $("#" + key );
						if($input){
							$input.closest('.form-group').addClass('has-error');
							//an array of errors
							$input.before('<ul class="input-errors"><li>'+value.join('</li><li>')+'</li></p>')
						}
					});
				}
			}
		});
		return false;
	},
	showProgress : function(showProgress) {
		if(showProgress){
			$('.progress').show();
		} else {
			$('.progress').hide();
		}
	},
	defaultOnComplete : function() {
		Application.showProgress(false);
	},
	defaultOnSuccess : function(data, textStatus, jqXHR) {
		if(typeof data !== 'undefined' && typeof data.status != 'undefined'){
			var successful = data.status === 'success';

			if(typeof data.result !== 'undefined' && data.result.message){
				Application.postMessage(data.result.message, successful);
			} else if (data.result.redirect) {
				window.location.replace(data.result.redirect);
			}
		}
	},
	defaultOnError : function(jqXHR, textStatus, errorThrown) {
		Application.postMessage('An unknown error occurred while processing your request.', false);
	},
	postMessage : function(message, isSuccess) {
		$('.message').hide();
		if(isSuccess){
			$('#success-message').html(message).show();
			setTimeout(function(){
				$('#success-message').hide();
			}, 1000 * 5);
		} else {
			$('#error-message').html(message).show();

		}
	},
	init : function(){
		$.ajaxSetup({
	    	beforeSend: function( xhr ) {
	      		var token = $('meta[name="csrf-token"]').attr('content');
	      		if (token) xhr.setRequestHeader('X-CSRF-Token', token);
	   	 	}
	  	});
	}
};

$(document).ready(function(){
	Application.init();
});