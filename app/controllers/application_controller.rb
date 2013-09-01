class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  protected
  def render_404
    render :json => { :text => "Can't seem to find what you're looking for. Are you sure this exists?", :status => 404 }
  end

  def render_403
    render :json => { :text => "You don't have permission to do this.", :status => 403 }
  end
end
