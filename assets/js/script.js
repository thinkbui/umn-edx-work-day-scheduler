// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
  loadCurrentDate();

  deleteAllRows();
  buildAllRows();

  fetchCalData();
  loadCalData();

  $(".saveBtn").click(saveClick);
});

calData = {};

start_hour = 9;
end_hour = 17;

loadCurrentDate = function() {
  today = dayjs();
  $("#currentDay").html(today.format("dddd, MMMM D, YYYY"));
}

buildAllRows = function() {
  for(i=start_hour;i<=end_hour;i++){
    $(".container-lg").append(buildRow(i));
  }
}

buildRow = function(row_hour) {
  row = $("<div>");
  row.attr("id", "hour-" + row_hour);
  row.addClass("row time-block");
  // if (row_hour < dayjs().format("H")) {
  if (row_hour < "11") {
    row.addClass("past");
  // } else if (row_hour == dayjs().format("H")) {
  } else if (row_hour == "11") {
    row.addClass("present");
  } else {
    row.addClass("future");
  }
  // row.append("<div class=\"col-2 col-md-1 hour text-center py-3\">"+dayjs().hour(row_hour).format("hA")+"</div>");
  row.append(buildHourCell(row_hour));
  // row.append("<textarea class=\"col-8 col-md-10 description\" rows=\"3\"></textarea>");
  row.append(buildDescriptionCell());
  row.append("<button class=\"btn saveBtn col-2 col-md-1\" aria-label=\"save\"><i class=\"fas fa-save\" aria-hidden=\"true\"></i></button>");
  return row;
}

buildHourCell = function(row_hour) {
  cell_hour_text = dayjs().hour(row_hour).format("hA");
  hour_cell = $("<div>");
  hour_cell.addClass("col-2 col-md-1 hour text-center py-3");
  hour_cell.html(cell_hour_text);
  return hour_cell;
}

buildDescriptionCell = function() {
  desc_cell = $("<textarea>");
  desc_cell.addClass("col-8 col-md-10 description");
  desc_cell.attr("rows","3");
  return desc_cell;
}

deleteAllRows = function() {
  $(".container-lg").empty();
}

saveClick = function() {
  if (!calData[currentDateKey()]) {
    calData[currentDateKey()] = {};
  }
  hour = $(this).parent().attr("id");
  description = $(this).siblings(".description").val();
  calData[currentDateKey()][hour] = description;
  storeCalData();
}

storeCalData = function() {
  cal_data_json = JSON.stringify(calData);
  localStorage.setItem("umn-edx-work-day-scheduler-data", cal_data_json);
}

fetchCalData = function() {
  cal_data_json = localStorage.getItem("umn-edx-work-day-scheduler-data");
  if (cal_data_json) {
    calData = JSON.parse(cal_data_json);
  }
}

loadCalData = function() {
  calDataToday = calData[currentDateKey()];
  if (calDataToday) {
    $.each(calDataToday, function(hour, description) {
      $("#"+hour).children(".description").val(description);
    });
  }
}

currentDateKey = function() {
  return dayjs().format("YYYY-MM-DD");
}
