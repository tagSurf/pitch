class RegistrationsController < Devise::RegistrationsController
  #Doesn't call the base methods here because they were difficult to factor out the
  #response code. Pretty much a copy of the devise controller's methods with exception of how the response is constructed.

  def create
    build_resource(sign_up_params)

    if resource.save
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
        render :json => {:status => 'success',
          :result =>  { :resource => resource, :redirect => after_sign_up_path_for(resource)}
        }
      else
        expire_session_data_after_sign_in!
        render :json => {:status => 'success',
          :result =>  { :resource => resource, :redirect => after_inactive_sign_up_path_for(resource)}
        }
      end
    else
      clean_up_passwords resource
      render :json => {:status => 'error',
          :result =>  { :resource => resource, :errors => resource.errors }
      }
    end
  end
end