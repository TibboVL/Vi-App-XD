export function minutesToHoursMinutes(minutes: number): {
  hours: number;
  minutes: number;
} {
  return {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  };
}
export function timeDifference(date: Date) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = new Date().getTime() - date.getTime();

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + "s ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + "m ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + "h ago";
  } else if (elapsed < msPerMonth) {
    return "~" + Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return "~" + Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return "~" + Math.round(elapsed / msPerYear) + " years ago";
  }
}
