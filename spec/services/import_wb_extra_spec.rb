require 'rails_helper'

object_contents = {
  "#{CW_FILES_PREFIX}wb_extra/gdp.csv" => <<~END,
    ,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,Country Code,Country Name,Indicator Code
    0,537777811.0,548888896.0,546666678.0,751111191.0,800000044.0,1006666638.0,1399999967.0,1673333418.0,1373333367.0,1408888922.0,1748886596.0,1831108971.0,1595555476.0,1733333264.0,2155555498.0,2366666616.0,2555555567.0,2953333418.0,3300000109.0,3697940410.0,3641723322.0,3478787909.0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,2461665938.0,4128820723.0,4583644246.0,5285465686.0,6275073572.0,7057598407.0,9843842455.0,10190529882.0,12486943506.0,15936800636.0,17930239400.0,20536542737.0,20046334304.0,20050189882.0,19702986341.0,19469022208.0,AFG,Afghanistan,NY.GDP.MKTP.CD
  END
  "#{CW_FILES_PREFIX}wb_extra/population.csv" => <<~END,
    ,Country Name,Country Code,Indicator Code,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016
    0,Afghanistan,AFG,SP.POP.TOTL,8996351.0,9166764.0,9345868.0,9533954.0,9731361.0,9938414.0,10152331.0,10372630.0,10604346.0,10854428.0,11126123.0,11417825.0,11721940.0,12027822.0,12321541.0,12590286.0,12840299.0,13067538.0,13237734.0,13306695.0,13248370.0,13053954.0,12749645.0,12389269.0,12047115.0,11783050.0,11601041.0,11502761.0,11540888.0,11777609.0,12249114.0,12993657.0,13981231.0,15095099.0,16172719.0,17099541.0,17822884.0,18381605.0,18863999.0,19403676.0,20093756.0,20966463.0,21979923.0,23064851.0,24118979.0,25070798.0,25893450.0,26616792.0,27294031.0,28004331.0,28803167.0,29708599.0,30696958.0,31731688.0,32758020.0,33736494.0,34656032.0
  END
}

RSpec.describe ImportWbExtra do
  subject { ImportWbExtra.new.call }

  before :all do
    Aws.config[:s3] = {
      stub_responses: {
        get_object: lambda { |context|
          {body: object_contents[context.params[:key]]}
        }
      }
    }
  end

  before :each do
    FactoryBot.create(
      :location, iso_code3: 'AFG', wri_standard_name: 'Afghanistan'
    )
  end

  after :all do
    Aws.config[:s3] = {
      stub_responses: nil
    }
  end

  it 'Creates new wb_extra_country_data records' do
    expect { subject }.to change { WbExtra::CountryData.count }.by(62)
  end
end
