module Management
  class PeopleController < BaseController
    def index
      respond_to do |format|
        format.html { redirect_to management_sectors_path }
        format.csv { send_data PeopleMock.new.to_csv, filename: "pessoas-nivela.csv", type: "text/csv" }
      end
    end

    def show
      render inertia: {person: PersonMock.new(params[:id]).props}
    end
  end
end
