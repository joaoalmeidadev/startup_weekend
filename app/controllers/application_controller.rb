class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  protected

  def after_sign_in_path_for(user)
    stored_location_for(user) || home_path_for(user)
  end

  def after_sign_out_path_for(_scope)
    new_user_session_path
  end

  def home_path_for(user)
    Users::HomePathResolver.new(user).path
  end

  def redirect_to_home
    redirect_to home_path_for(current_user)
  end
end
