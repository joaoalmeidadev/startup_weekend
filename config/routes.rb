require "sidekiq/web"

Rails.application.routes.draw do
  if Rails.env.development?
    # Redirect 127.0.0.1 to localhost so the browser and the Vite dev server share the same origin
    constraints(host: "127.0.0.1") do
      get "(*path)", to: redirect { |_params, req| "#{req.protocol}localhost:#{req.port}#{req.fullpath}" }
    end
  end

  # Only routes with Inertia pages are exposed (see spec/requests/users/devise_routes_spec.rb)
  devise_for :users, skip: :registrations, controllers: {sessions: "users/sessions"}
  devise_scope :user do
    get "users/sign_up", to: "users/registrations#new", as: :new_user_registration
    post "users", to: "users/registrations#create", as: :user_registration
  end

  authenticate :user, ->(user) { user.admin? } do
    mount Sidekiq::Web => "/sidekiq"
  end

  # Health check for load balancers and Kamal proxy
  get "up" => "rails/health#show", :as => :rails_health_check

  root "home#index"
end
