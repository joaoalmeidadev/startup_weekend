class InertiaController < ApplicationController
  inertia_share do
    {
      current_user: current_user&.as_json(only: %i[id email]),
      flash: flash.to_hash.slice("notice", "alert")
    }
  end
end
