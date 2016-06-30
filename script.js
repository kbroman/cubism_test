var dF = new Date(2012,4,2)
var context = cubism.context()
    .serverDelay(Date.now() - dF) //correct sign so axis is correct & not in future.
    .step(864e5)
    .size(1280)
    .stop();

d3.select("#demo").selectAll(".axis")
    .data(["top", "bottom"])
  .enter().append("div")
    .attr("class", function(d) { return d + " axis"; })
    .each(function(d) { d3.select(this).call(context.axis().ticks(12).orient(d)); });

d3.select("body").append("div")
    .attr("class", "rule")
    .call(context.rule());

var Data = ["AAPL", "BIDU"].map(stock);
var primary = Data[1];
var secondary = primary.shift(-864e5*30);
Data[2] = secondary;


d3.select("body").selectAll(".horizon")
    .data(Data)
  .enter().insert("div", ".bottom")
    .attr("class", "horizon")
  .call(context.horizon()
    .format(d3.format("+,.2p")));

context.on("focus", function(i) {
  d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
});

// Replace this with context.graphite and graphite.metric!
function stock(name) {
  var format = d3.time.format("%d-%b-%y");
  return context.metric(function(start, stop, step, callback) {
    d3.csv(name + ".csv", function(rows) {
      rows = rows.map(function(d) { return [format.parse(d.Date), +d.Open]; }).filter(function(d) { return d[1]; }).reverse();
      var date = rows[0][0], compare = rows[400][1], value = rows[0][1], values = [value];
      rows.forEach(function(d) {
        while ((date = d3.time.day.offset(date, 1)) < d[0]) values.push(value);
        values.push(value = (d[1] - compare) / compare);
      });
      callback(null, values.slice(-context.size()));
    });
  }, name);
}
