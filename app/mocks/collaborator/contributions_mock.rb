module Collaborator
  # Journeys the collaborator proposed to share what she knows, and the form to propose a new one
  class ContributionsMock
    def props
      {contributions: Management::KnowledgeSubmissionCatalog.by_author(Learner::NAME),
       earned: Management::KnowledgeSubmissionCatalog.points_for(Learner::NAME)}
    end

    # What one hour of her knowledge is worth in points, so she sees what a proposal could earn once approved
    def form_props
      person = Management::PeopleMock::PEOPLE.find { |row| row[:name] == Learner::NAME }
      rule = Management::PointsRule.for_sector(person[:sector])
      {sectors: Management::SectorCatalog.all.select { |sector| sector[:kind] == "sector" }.pluck(:name),
       points_per_hour: rule.points_per_hour(salary: person[:salary])}
    end
  end
end
