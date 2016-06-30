var dF = new Date(2015,1,1)
var context = cubism.context()
    .serverDelay(Date.now() - dF) //correct sign so axis is correct & not in future.
    .step(1280*60*60*24)
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

var Data = ["test2"].map(stock);
//var primary = Data[1];
//var secondary = primary.shift(-864e5*30);
//Data[2] = secondary;


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
  var format = d3.time.format("%Y-%m-%d");
  return context.metric(function(start, stop, step, callback) {
    d3.csv(name + ".csv", function(rows) {
        rows = rows.map(function(d) { return [format.parse(d.date), +d.a]; })
                   .filter(function(d) { return d[1]; }).reverse();

        var dates = []
        var values = [];

        rows.forEach(function(d) {
            dates.push(d[0])
          values.push(d[1])
      });
        callback(null, values)
    });
  }, name);
}
