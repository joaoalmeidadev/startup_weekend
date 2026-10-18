module Management
  # What waits for the admin: journeys shared by collaborators (pending first) and AI lessons to review
  class ApprovalsMock
    STATUS_ORDER = %w[pending changes_requested approved].freeze

    def self.pending_count
      KnowledgeSubmissionCatalog.pending.size + ai_modules_in_review.size
    end

    def self.ai_modules_in_review = ModuleCatalog.all.select { |mod| mod[:status] == "in_review" }

    def props
      submissions = KnowledgeSubmissionCatalog.all.sort_by { |item| STATUS_ORDER.index(item[:status]) }
      {submissions: submissions.map { |item| with_author(item) }, ai_reviews: ai_reviews}
    end

    def detail(id)
      submission = KnowledgeSubmissionCatalog.find(id)
      raise ActiveRecord::RecordNotFound, "Submission #{id} not found" unless submission

      {submission: with_author(submission), reward_share: PointsRule::DEFAULTS[:reward_share]}
    end

    private

    # The author with the hour that prices the suggested points (their salary, or the sector value)
    def with_author(submission)
      person = PeopleMock::PEOPLE.find { |row| row[:name] == submission[:author] }
      overview = PersonOverview.new(person).props
      hourly = PointsRule.for_sector(person[:sector]).learner_hourly_for(person[:salary])
      submission.merge(author: overview.slice(:id, :name, :avatar_url, :sector).merge(hourly: hourly))
    end

    def ai_reviews
      self.class.ai_modules_in_review.map do |mod|
        {name: mod[:name], lessons: mod[:lessons],
         review_path: Rails.application.routes.url_helpers.management_lesson_review_path(LessonReviewMock::FIRST_PENDING)}
      end
    end
  end
end
