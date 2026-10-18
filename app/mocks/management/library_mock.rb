module Management
  # Example data for the "Biblioteca": every module with its origin and how many journeys use it
  class LibraryMock
    def props
      ModuleCatalog.all.map { |mod| mod.merge(journeys_count: JourneyCatalog.using_module(mod[:id]).size) }
    end
  end
end
