module App
  # Return value for service objects: either a success with a value
  # or a failure with an error code (and optional details).
  class Result
    attr_reader :value, :error, :details

    def self.success(value = nil)
      new(value: value)
    end

    def self.failure(error, details = nil)
      new(error: error, details: details)
    end

    def initialize(value: nil, error: nil, details: nil)
      @value = value
      @error = error
      @details = details
      freeze
    end

    def success?
      error.nil?
    end

    def failure?
      !success?
    end
  end
end
