# add dates to test.csv

test <- read.csv("test.csv", stringsAsFactors=FALSE)

library(lubridate)
dates <- seq(ymd("2015-01-01"), ymd("2016-06-30"), length.out=nrow(test))
dates <- as.character(dates)
test[,1] <- dates
names(test)[1] <- "date"

write.table(test, "test2.csv", sep=",",
            row.names=FALSE, col.names=TRUE, quote=FALSE)
