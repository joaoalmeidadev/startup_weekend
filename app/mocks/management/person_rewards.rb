module Management
  # The badge, milestones and rewards of one person; the rewards catalog itself is still empty (Recompensas tab)
  class PersonRewards
    REDEEMED = {
      "leveled" => [{name: "Folga de meio período", date: "12/09", points: 300},
        {name: "Vale-lanche R$ 30", date: "28/08", points: 150}],
      "on_track" => [{name: "Vale-lanche R$ 30", date: "02/10", points: 150}],
      "late" => []
    }.freeze
    BADGE_DATE = "14/08"
    STREAK_MILESTONE = 3

    def initialize(person, journey, study)
      @person = person
      @journey = journey
      @study = study
    end

    def badge
      {label: badge_label, earned: leveled?, date: leveled? ? BADGE_DATE : nil, forecast: PersonOverview.new(@person).forecast}
    end

    def milestones
      finished = @journey[:stretches].select { |stretch| stretch[:modules].all? { |mod| mod[:status] == "done" } }
      finished.map { |stretch| "Concluiu o trecho #{stretch[:title]}" } + streak + earned_badge
    end

    def rewards
      redeemed = REDEEMED.fetch(@person[:status])
      {points: @study.points, balance: @study.points - redeemed.sum { |reward| reward[:points] }, redeemed: redeemed}
    end

    private

    def leveled? = @person[:status] == "leveled"

    def badge_label = JourneyCatalog.find(@person[:journey_id])[:badge]

    def streak
      days = @study.streak_days
      (days >= STREAK_MILESTONE) ? ["#{days} dias seguidos de estudo"] : []
    end

    def earned_badge = leveled? ? ["Ganhou o selo #{badge_label}"] : []
  end
end
