Session = {
	onLogInFormSubmit : function(){
		var $form = $(this);
		var formData =  $form.serializeObject();

		var request = Application.ajaxPost(
			$form.attr('action'), 
			formData
		);

		return false;
	}
};