require 'rails_helper'

describe Api::V1::WbExtraCountryDataController, type: :controller do
  context do
    let(:location) {
      FactoryBot.create(:location, iso_code3: 'AFG', location_type: 'COUNTRY')
    }

    let!(:wb_extra_country_data_1960) {
      FactoryBot.create(
        :wb_extra_country_data,
        location: location,
        year: 1960
      )
    }

    let!(:wb_extra_country_data_1990) {
      FactoryBot.create(
        :wb_extra_country_data,
        location: location,
        year: 1990
      )
    }

    let!(:wb_extra_country_data_2000) {
      FactoryBot.create(
        :wb_extra_country_data,
        location: location,
        year: 2000
      )
    }

    let!(:wb_extra_country_data_2000) {
      FactoryBot.create(
        :wb_extra_country_data,
        location: location,
        year: 2004
      )
    }
    describe 'GET index' do
      it 'returns a successful 200 response' do
        get :index
        expect(response).to be_successful
      end

      it 'lists all wb_extra_country_data' do
        get :index
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(1)
      end
    end

    describe 'GET show' do
      it 'returns a successful 200 response' do
        get :show, params: {iso: 'AFG'}
        expect(response).to be_successful
      end

      it 'lists all wb_extra_country_data for a country' do
        get :show, params: {iso: 'AFG'}
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(3)
      end

      it 'finds only the wb_extra_country_data
      between the start and the end year' do
        get :show, params: {iso: 'AFG', startYear: '1980', endYear: '2001'}
        expect(response).to be_successful
        parsed_body = JSON.parse(response.body)
        expect(parsed_body.length).to eq(1)
      end
    end
  end
end
