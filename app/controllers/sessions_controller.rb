class SessionsController < Devise::SessionsController
  
  def create
    resource = warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    sign_in_and_redirect(resource_name, resource)
  end
  
  def sign_in_and_redirect(resource_or_scope, resource = nil)
    scope = Devise::Mapping.find_scope!(resource_or_scope)
    resource ||= resource_or_scope
    sign_in(scope, resource) unless warden.user(scope) == resource
    
    render :json => {:status => 'success', 
      :result => { :redirect => stored_location_for(scope) || after_sign_in_path_for(resource) }
    }
  end
 
  def failure
    return render :json => {:status => 'error', :result => { :message => "Invalid credentials."} }
  end

  private
  def resource_name
    :user
  end
 
  def resource
    @resource ||= User.new
  end
 
  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end
end