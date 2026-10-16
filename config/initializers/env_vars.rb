require Rails.root.join("lib/app/boot/env_vars")

# Fail fast on boot when a variable without a safe default is missing.
# Skipped during `assets:precompile` in the Docker build.
App::Boot::EnvVars.new.validate! unless ENV["SECRET_KEY_BASE_DUMMY"]
