module Collaborator
  # Example badges and ranking from the Stitch "Meu progresso" screen
  class ProgressMock
    def props
      {
        badges: badges,
        ranking: ranking,
        ranking_visibility: "name"
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

    def ranking
      [
        {position: 1, name: "Lucas Mendes", points: 420, anonymous: false, current: false},
        {position: 2, name: "Carla Silveira", points: 390, anonymous: false, current: false},
        {position: 3, name: "Colaborador anônimo", points: 360, anonymous: true, current: false},
        {position: 4, name: "Maria", points: 340, anonymous: false, current: true}
      ]
    end
  end
end
