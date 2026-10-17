module Management
  # The Nivela base library (same catalog companies pick from), with sample lesson titles
  class LibraryMock
    def props
      {modules: ModuleCatalog.base_library.map { |mod| mod.merge(lesson_titles: lesson_titles(mod)) }}
    end

    private

    def lesson_titles(mod)
      (1..mod[:lessons]).map { |position| "#{mod[:competency]} — parte #{position}" }
    end
  end
end
