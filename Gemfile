source "https://rubygems.org"

ruby file: ".ruby-version"

gem "rails", "~> 7.2.3"
gem "pg", "~> 1.1"
gem "puma", ">= 5.0"
gem "bootsnap", require: false
gem "tzinfo-data", platforms: %i[mswin mswin64 mingw x64_mingw jruby]

# Frontend
gem "vite_rails"
gem "inertia_rails"

# Auth
gem "devise"
gem "devise-i18n"
gem "rails-i18n", "~> 7.0"

# Background jobs & cache
gem "redis", ">= 4.0.1"
gem "hiredis-client"
gem "sidekiq", "~> 7.3"
gem "clockwork"

# Deploy
gem "kamal", require: false

group :development, :test do
  gem "debug", platforms: %i[mri mswin mswin64 mingw x64_mingw], require: "debug/prelude"
  gem "rspec-rails"
  gem "factory_bot_rails"
  gem "faker"
  gem "dotenv-rails"
  gem "brakeman", require: false
  gem "standard", require: false
  gem "standard-rails", require: false
end

group :development do
  gem "web-console"
  gem "foreman", require: false
  gem "annotaterb"
  gem "amazing_print"
  gem "niceql"
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
  gem "database_cleaner-active_record"
  gem "webmock"
  gem "shoulda-matchers"
end
