const addZero = param => {
  return param < 10 ? "0" + param : "" + param
}

const formatDate = param => {
  if (param) {
    let d = new Date(param);
    let year = d.getFullYear();
    let month = addZero(d.getMonth() + 1);
    let day = addZero(d.getDate());
    let hour = addZero(d.getHours());
    let minutes = addZero(d.getMinutes());
    let seconds = addZero(d.getSeconds());
    return (year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds);
  } else {
    return "";
  }

}

export default {
  formatDate: formatDate
}
