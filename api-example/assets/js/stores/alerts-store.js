const nextAlertId = 0

const alertsReducer = (alerts, { type, id, message, level }) => {
  switch (type) {
    case "ALERT_ADD":
      return alerts.concat({ id, message, level })
      break;
    case "ALERT_REMOVE":
      if (id === "*") {
        return []
      }
      alerts.forEach((alert, index) => {
        if (alert.id == id) alerts.splice(index, 1)
      })
      return alerts
      break;
    default:
      return alerts
  }
}

const alertAdd = (message, level) => {
  return {
    type: "ALERT_ADD",
    id: nextAlertId++,
    message,
    level
  }
}

const alertRemove = (id) => {
  return {
    type: "ALERT_REMOVE",
    id: id
  }
}