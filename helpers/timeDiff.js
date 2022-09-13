// function diff_hours(dt2, dt1) {
//   var diff = (dt2.getTime() - dt1.getTime()) / 1000;
//   diff /= 60 * 60;
//   return Math.abs(Math.round(diff));
// }

// dt1 = new Date(2014, 10, 2);
// dt2 = new Date(2014, 10, 3);
// console.log(diff_hours(dt1, dt2));

// dt1 = new Date('October 13, 2014 08:11:00');
// dt2 = new Date('October 13, 2014 11:13:00');
// console.log(diff_hours(dt1, dt2));

// var date1 = new Date('06/30/2019');
// var date2 = new Date('07/30/2019');

// // To calculate the time difference of two dates
// var Difference_In_Time = date2.getTime() - date1.getTime();

// // To calculate the no. of days between two dates
// var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

module.exports = {
  timeDiff: (createdDate) => {
    const currentDate = new Date();
    const Difference_In_Time = currentDate - createdDate;
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if (Difference_In_Days < 1) {
      let diff = Difference_In_Time / 1000;
      diff /= 60 * 60;
      return `${Math.abs(Math.round(diff))} HOURS AGO`;
    } else {
      return `${Math.trunc(Difference_In_Days)} DAYS AGO`;
    }
  },
};
