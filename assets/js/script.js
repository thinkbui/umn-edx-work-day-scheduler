// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  loadCurrentDate();

  deleteAllRows();
  buildAllRows();

  fetchCalData();
  loadCalData();

  $(".saveBtn").click(saveClick);
});

datetime_now = dayjs();
calData = {};
start_hour = 9;
end_hour = 17;

// Function whose sole responsibility is to display today's date in the proper format at the top of the scheduler
loadCurrentDate = function() {
  $("#currentDay").html(datetime_now.format("dddd, MMMM D, YYYY"));
}

// Iterates through the working hours to load HTML for all the rows of the scheduler
buildAllRows = function() {
  for(i=start_hour;i<=end_hour;i++){
    $(".container-lg").append(buildRow(i));
  }
}

// Helper to build the HTML for a row with all the appropriate classes and attributes
buildRow = function(row_hour) {
  row = $("<div>");
  row.attr("id", "hour-" + row_hour);
  row.addClass("row time-block " + rowType(row_hour));
  row.append(buildHourCell(row_hour));
  row.append(buildDescriptionCell());
  row.append(buildSaveCell());
  return row;
}

// Helper to build the HTML for a row's hour label with all the appropriate classes and content
buildHourCell = function(row_hour) {
  cell_hour_text = dayjs().hour(row_hour).format("hA");
  hour_cell = $("<div>");
  hour_cell.addClass("col-2 col-md-1 hour text-center py-3");
  hour_cell.html(cell_hour_text);
  return hour_cell;
}

// Helper to build the HTML for a row's description field with all the appropriate classes and attributes
buildDescriptionCell = function() {
  desc_cell = $("<textarea>");
  desc_cell.addClass("col-8 col-md-10 description");
  desc_cell.attr("rows", "3");
  return desc_cell;
}

// Helper to build the HTML for a row's save button with all the appropriate classes, attributes, and content
buildSaveCell = function() {
  btn_cell = $("<button>");
  btn_cell.addClass("btn saveBtn col-2 col-md-1");
  btn_cell.attr("aria-label", "save");

  icon_elem = $("<i>");
  icon_elem.addClass("fas fa-save");
  icon_elem.attr("aria-hidden", "true");

  btn_cell.append(icon_elem);
  return btn_cell;
}

// Helper to add the appropriate coloring for each row based on whether its hour has passed
// Defaults to green for the future
rowType = function(row_hour) {
  current_hour = datetime_now.format("H");
  if (row_hour < current_hour) {
    return "past";
  } else if (row_hour == current_hour) {
    return "present";
  }
  return "future";
}

// Clears the example content from the given scheduler page so the proper content can be loaded
deleteAllRows = function() {
  $(".container-lg").empty();
}

// Handler when the save button is clicked on an hour's row
// Loads the hour and its description into memory for the current day, then updates storage with the new data
saveClick = function() {
  if (!calData[currentDateKey()]) {
    calData[currentDateKey()] = {};
  }
  hour = $(this).parent().attr("id");
  description = $(this).siblings(".description").val();
  calData[currentDateKey()][hour] = description;
  storeCalData();
}

// Helper to add all scheduler data to storage
storeCalData = function() {
  cal_data_json = JSON.stringify(calData);
  localStorage.setItem("umn-edx-work-day-scheduler-data", cal_data_json);
}

// Helper to fetch all scheduler data from storage
fetchCalData = function() {
  cal_data_json = localStorage.getItem("umn-edx-work-day-scheduler-data");
  if (cal_data_json) {
    calData = JSON.parse(cal_data_json);
  }
}

// Helper to populate the scheduler page with calendar data from storage
loadCalData = function() {
  calDataToday = calData[currentDateKey()];
  if (calDataToday) {
    $.each(calDataToday, function(hour, description) {
      $("#"+hour).children(".description").val(description);
    });
  }
}

// Helper to generate the key for the current day for storage purposes
currentDateKey = function() {
  return datetime_now.format("YYYY-MM-DD");
}
