// Chart palette validated with the dataviz skill's validate_palette.js (light, surface #fff):
// CVD ΔE 16.3, normal ΔE 23.3. Amber sits below 3:1 contrast, so every value is
// also labelled and every chart has a table view.
export const CHART = {
  team: '#00939f',
  goal: '#c98a0a',
  grid: '#e3e8e9',
  axis: '#6f797a',
  // Part-to-whole slices (DonutChart), validated in this order on #fff: adjacent CVD ΔE 14.1,
  // normal ΔE 28.4; the first three also pass all-pairs. Yellow is below 3:1, so slices are
  // labelled. "Outros" is a light neutral, ΔE ≥ 17.6 (CVD) from its neighbours teal and yellow.
  slices: ['#00939f', '#eb6834', '#6250d6', '#eda100'],
  others: '#c9cdce',
}
