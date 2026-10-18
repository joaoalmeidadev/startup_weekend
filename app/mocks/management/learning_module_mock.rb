module Management
  # Example module detail: lessons with their review status and the final assessment
  class LearningModuleMock
    REVIEWED_MODULE = "rotinas-de-atendimento"
    REVIEWED_LESSONS = [
      "Boas-vindas ao atendimento", "Como acolher uma reclamação de atraso", "Cancelamentos sem atrito",
      "Trocas e devoluções", "Prazos de perecíveis", "Registro de chamados", "Comunicação da nova previsão",
      "Encerramento do chamado"
    ].freeze

    def initialize(id)
      @module = ModuleCatalog.find(id)
    end

    def props
      @module.slice(:id, :name, :competency, :status, :source, :material).merge(
        stretch: JourneyCatalog::STRETCHES.fetch(@module[:stretch]),
        used_in: JourneyCatalog.using_module(@module[:id]).map { |journey| journey.slice(:id, :name) },
        lessons: lessons,
        assessment: {questions: 10},
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
      (1..@module[:lessons]).map { |position| {position: position, title: lesson_title(position), status: lesson_status(position)} }
    end

    def lesson_title(position)
      return REVIEWED_LESSONS[position - 1] if @module[:id] == REVIEWED_MODULE

      "Lição #{position}"
    end

    def lesson_status(position)
      case @module[:status]
      when "published" then "approved"
      when "draft" then "draft"
      else (position < LessonReviewMock::FIRST_PENDING) ? "approved" : "pending"
      end
    end

    def review_from
      LessonReviewMock::FIRST_PENDING if @module[:status] == "in_review"
    end
  end
end
