const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "ATwcBorI0ahgvPvtIUvv60k8nBrkyWo1GTFSDd-hvQFOhGo-GDlytB5YdOzuHqFdsFNwLwSCrCJkaGHN",
  client_secret: "EBhNQmG4f4J6ZAbTMZ5bUyNYdSo_5aa-OISyUPTDHSWl3ghfEpFD8zjGWBcVJVNGkLvEealEq0OyImqp",
});

module.exports = paypal;