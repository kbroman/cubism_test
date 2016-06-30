d3.csv("test2.csv", function(rows) {

    // parse the rows and pull out
    // ... the dates (column must be "date")
    dates = rows.map(function(d) { return(d.date) })
    // ... the labels on the other columns
    labels = Object.keys(rows[0]).filter(function(d) { if(d != "date") return(d) })
    // ... the data for the other columns
    data_by_row = rows.map(function(d) {
        return(labels.map(function(e) { return(+d[e]) }))
    })

    // transpose the data
    data_by_col = labels.map(function(d) { return([]) })
    for(i=0; i<labels.length; i++) {
        data_by_col[i] = data_by_row.map(function(d) { return(d[i]) })
    }

    // so now we have
    // - dates as a bunch of strings
    // - labels for the columns (I think alphabetical order)
    // - the data, as a doubly-indexed array, stored by column

    cubism_plot(dates, labels, data_by_col)

})



// function to make the plot
cubism_plot = function(dates, labels, data_by_col)
{
    // dates from strings to proper dates
    var format = d3.time.format("%Y-%m-%d");
    dates = dates.map(function(d) { return(format.parse(d)) })
    console.log(dates)

    var dF = new Date(2015,1,1)
    var context = cubism.context()
        .serverDelay(Date.now() - dF)
        .step(1280*60*60*24)
        .size(1280)
        .stop();

    div = d3.select("div#chart")
    div.selectAll(".axis")
        .data(["top", "bottom"])
        .enter().append("div")
        .attr("class", function(d) { return d + " axis"; })
        .each(function(d) { d3.select(this).call(context.axis().ticks(12).orient(d)); });

    div.append("div")
        .attr("class", "rule")
        .call(context.rule());

    var Data = []
    for(i=0; i<labels.length; i++) {
        Data.push(make_metric(data_by_col[i], labels[i]))
    }

    div.selectAll(".horizon")
        .data(Data)
        .enter().insert("div", ".bottom")
        .attr("class", "horizon")
        .call(context.horizon()
              .format(d3.format(".3f")));

    context.on("focus", function(i) {
        d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
    });

    function make_metric(vector, label) {
        return context.metric(function(start, stop, step, callback) {
                callback(null, vector)
        }, label);
    }
}
