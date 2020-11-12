import { getChartData } from './ghg-emissions-selectors-data';
import { mockProps } from './ghg-emissions-selectors-data.mock';

test('It works', () => {
  it('returns correct Per Capita data', () => {
    expect(getChartData(mockProps)).toMatchSnapshot();
  });
});
