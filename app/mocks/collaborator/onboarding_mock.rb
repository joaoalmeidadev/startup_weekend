module Collaborator
  # Demo-only onboarding: the newcomer account sees welcome → diagnostic → result once per session
  class OnboardingMock
    NEWCOMER_EMAIL = "novo@nivela.com"

    def pending?(user, session)
      user.email == NEWCOMER_EMAIL && !session[:onboarded]
    end
  end
end
