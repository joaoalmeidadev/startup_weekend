module Management
  # Example module detail: lessons with their review status and the final assessment
  class LearningModuleMock
    REVIEWED_MODULE = "rotinas-de-atendimento"
    REVIEWED_LESSONS = [
      "Boas-vindas ao atendimento", "Como acolher uma reclamação de atraso", "Cancelamentos sem atrito",
      "Trocas e devoluções", "Prazos de perecíveis", "Registro de chamados", "Comunicação da nova previsão",
      "Encerramento do chamado"
    ].freeze

    # Friendlier titles for the Nivela customer service product, opened by the Sebrae video
    SERVICE_MODULE = "atendimento-ao-cliente"
    SERVICE_LESSONS = [
      "O básico do bom atendimento", "Ouvir antes de responder", "O tom de voz que acalma",
      "Quando o cliente está irritado", "Fechar o atendimento bem"
    ].freeze

    # % of the team that gets each published lesson right at the first try
    TEAM_ACCURACY = [92, 78, 85, 64, 88, 71, 90, 81].freeze

    def initialize(id)
      @module = ModuleCatalog.find(id)
    end

    def props
      @module.slice(:id, :name, :competency, :status, :source, :material).merge(
        stretch: JourneyCatalog::STRETCHES.fetch(@module[:stretch]),
        used_in: JourneyCatalog.using_module(@module[:id]).map { |journey| journey.slice(:id, :name) },
        lessons: lessons,
        assessment: {questions: 10, team_average: team_average},
        review_from: review_from,
        training: training
      )
    end

    private

    # The in-person training this content replaces and the hour of who would give it (the default when not told)
    def training
      {hours: @module[:teaching_hours], teacher_hourly: PointsRule.new.teacher_hourly_for(@module[:teacher_salary]),
       default_teacher: @module[:teacher_salary].nil?}
    end

    def lessons
      bank = LessonBank.new(@module)
      (1..@module[:lessons]).map do |position|
        status = lesson_status(position)
        {position: position, title: lesson_title(position), status: status, **bank.media(position), text: bank.text(position),
         question: bank.question(position), team_accuracy: (TEAM_ACCURACY[(position - 1) % TEAM_ACCURACY.size] if status == "approved")}
      end
    end

    def lesson_title(position)
      return REVIEWED_LESSONS[position - 1] if @module[:id] == REVIEWED_MODULE
      return SERVICE_LESSONS[position - 1] if @module[:id] == SERVICE_MODULE

      "Lição #{position}"
    end

    def lesson_status(position)
      case @module[:status]
      when "published" then "approved"
      when "draft" then "draft"
      else (position < LessonReviewMock::FIRST_PENDING) ? "approved" : "pending"
      end
    end

    def team_average
      accuracies = lessons.filter_map { |lesson| lesson[:team_accuracy] }
      return nil unless @module[:status] == "published" && accuracies.any?

      (accuracies.sum.to_f / accuracies.size).round
    end

    def review_from
      LessonReviewMock::FIRST_PENDING if @module[:status] == "in_review"
    end
  end
end
