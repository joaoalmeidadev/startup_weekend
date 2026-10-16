module Users
  class SessionsController < Devise::SessionsController
    def new
      render inertia: {}
    end

    protected

    # Wipe the encrypted Inertia history so Back can't show the previous user's pages.
    # Set on the redirect because Warden resets the session during sign out.
    def respond_to_on_destroy(non_navigational_status: :no_content)
      redirect_to after_sign_out_path_for(resource_name),
        status: Devise.responder.redirect_status,
        inertia: {clear_history: true}
    end
  end
end
