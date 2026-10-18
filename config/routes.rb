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

  namespace :collaborator do
    resource :journey, only: :show
    resource :progress, only: :show
    resource :profile, only: :show
    resource :welcome, only: :show
    resource :diagnostic, only: :show do
      get :result
    end
    resources :lessons, only: :show
    resources :learning_modules, only: :show, path: "modules"
  end

  namespace :management do
    root "homes#show"
    resources :people, only: %i[index show]
    resources :sectors, only: %i[index show new], param: :slug
    get "sector_goal", to: redirect("/management/sectors")
    resource :rewards, only: :show
    resource :library, only: :show
    resources :journeys, only: %i[index show]
    resources :learning_modules, only: %i[show new], path: "modules" do
      member { get :publish }
    end
    resources :lesson_reviews, only: %i[index show]
  end

  authenticate :user, ->(user) { user.admin? } do
    mount Sidekiq::Web => "/sidekiq"
  end

  # Health check for load balancers and Kamal proxy
  get "up" => "rails/health#show", :as => :rails_health_check

  root "home#index"
end
