module Users
  class RegistrationsController < Devise::RegistrationsController
    def new
      render inertia: {}
    end

    def create
      build_resource(sign_up_params)

      if resource.save
        sign_up(resource_name, resource)
        redirect_to after_sign_up_path_for(resource), status: :see_other
      else
        clean_up_passwords(resource)
        render_sign_up_errors
      end
    end

    private

    def render_sign_up_errors
      render inertia: "users/registrations/new",
        props: {errors: resource.errors.to_hash},
        status: :unprocessable_content
    end
  end
end
