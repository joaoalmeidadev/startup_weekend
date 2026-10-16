require "clockwork"
require_relative "boot"
require_relative "environment"

# Scheduled jobs. Enqueue work with perform_later so Sidekiq does the heavy lifting.
module Clockwork
  error_handler do |error|
    Rails.logger.error("[clockwork] #{error.class}: #{error.message}")
  end

  # every(1.hour, "hourly.job") { HourlyJob.perform_later }
  # every(1.day, "daily.cleanup", at: "02:00") { DailyCleanupJob.perform_later }
end
