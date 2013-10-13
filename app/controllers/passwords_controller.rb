class PasswordsController < Devise::PasswordsController
  #Doesn't call the base methods here because they were difficult to factor out the
  #response code. Pretty much a copy of the devise controller's methods with exception of how the response is constructed.

  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)
    if successfully_sent?(resource)
      render :json => {:status => 'success',
        :result =>  { :resource => resource, :message => "We've sent you instructions on how to reset password."}
      }
    else
      if resource.id.nil?
        render :json => { :status => 'error',
          :result => {:resource => resource, :errors => {:email => ["Oops! This email address doesn't appear to exist in our system. Please verify this is the correct address."]}}
        }
      else
        render :json => { :status => 'error',
          :result => {:resource => resource, :message => ["Couldn't send you password reset instructions. Please try again later."]}
        }
      end
    end
  end
end