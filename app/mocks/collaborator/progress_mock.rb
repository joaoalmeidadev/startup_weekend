module Collaborator
  # Example badges and evolution from the Stitch "Meu progresso" screen (same numbers as JourneyMock)
  class ProgressMock
    def props
      {
        badges: badges,
        evolution: evolution
      }
    end

    private

    def badges
      [
        {title: "5 Dias Seguidos", icon: "local_fire_department", earned: true},
        {title: "Comunicação Clara", icon: "chat_bubble", earned: true},
        {title: "Cultura da Empresa", icon: "diversity_3", earned: true},
        {title: "Nivelado no Setor", icon: "lock", earned: false}
      ]
    end

    def evolution
      stretches = [stretch("Base", 2, 2), stretch("Empresa", 1, 2), stretch("Setor", 0, 2)]
      {completed: stretches.sum { _1[:completed] }, total: stretches.sum { _1[:total] }, stretches: stretches}
    end

    def stretch(name, completed, total) = {name: name, completed: completed, total: total}
  end
end
