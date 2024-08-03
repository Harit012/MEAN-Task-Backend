const nodemailer = require("nodemailer");
const settingModel = require("../../models/settings");

exports.sendMail = async(subject, mailId, name, role,ride) => {
    let welcomeMail;
    if (subject == "Welcome Mail") {
    welcomeMail = `
          <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to [Cab Service Name]</title>
          <style>
              body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
              .container {
                  width: 80%;
                  margin: 0 auto;
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  background-color: #f9f9f9;
              }
              .header {
                  background-color: #007bff;
                  color: white;
                  padding: 10px 0;
                  text-align: center;
              }
              .header h1 {
                  margin: 0;
              }
              .content {
                  margin-top: 20px;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin: 20px 0;
                  color: white;
                  background-color: #007bff;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .footer {
                  margin-top: 20px;
                  text-align: center;
                  font-size: 0.8em;
                  color: #777;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Welcome to EBER!</h1>
              </div>
              <div class="content">
                  <p>Dear ${name},</p>
                  <p>We are thrilled to have you on board as a ${role} at EBER!</p>
                  <p>We're here to support you every step of the way. If you have any questions or need assistance, feel free to contact our support team at <a href="support@gmail.com">support@gmail.com</a> or call us at 4539564385.</p>
                  <p>Thank you for choosing EBER. We look forward to a successful journey together!</p>
                  <p>Best regards,<br>The EBER Team</p>
                  <a href="https://bytenexis.com" class="button">Learn More</a>
              </div>
              <div class="footer">
                  <p>&copy; 2024 EBER. All rights reserved.</p>
                  <p></p>
              </div>
          </div>
      </body>
      </html>
          `;
    } else{
        welcomeMail = `
          <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice - EBER</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #f4f4f4;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  border-bottom: 1px solid #ddd;
                  padding-bottom: 10px;
              }
              .header h1 {
                  margin: 0;
                  font-size: 24px;
                  color: #007bff;
              }
              .content {
                  margin: 20px 0;
              }
              .trip-info, .fare-breakdown {
                  margin-bottom: 20px;
              }
              .trip-info p, .fare-breakdown p {
                  margin: 5px 0;
              }
              .fare-breakdown table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .fare-breakdown th, .fare-breakdown td {
                  text-align: left;
                  padding: 8px;
                  border-bottom: 1px solid #ddd;
              }
              .total {
                  font-weight: bold;
              }
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 0.9em;
                  color: #777;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Trip Invoice</h1>
              </div>
              <div class="content">
                  <div class="trip-info">
                      <p><strong>Passenger:</strong> ${ride.userName}</p>
                      <p><strong>Date:</strong> ${ride.rideTime}</p>
                      <p><strong>Pickup Location:</strong>  ${ride.source}</p>
                      <p><strong>Dropoff Location:</strong> ${ride.destination}</p>
                      <p><strong>Driver:</strong> ${ride.driverName}</p>
                      <p><strong>ServiceType:</strong> ${ride.serviceType}</p>
                  </div>
                  <div class="fare-breakdown">
                      <h2>Fare Breakdown</h2>
                      <table>
                          <tr>
                              <th>Description</th>
                              <th>Amount</th>
                          </tr>
                          <tr>
                              <td>Total Fare</td>
                              <td>${ride.price}</td>
                          </tr>
                          <tr>
                              <td>Distance</td>
                              <td>${ride.distance}</td>
                          </tr>
                          <tr>
                              <td>Time</td>
                              <td>${ride.time}</td>
                          </tr>
                      </table>
                  </div>
                  <p>Thank you for riding with EBER ! We hope you had a pleasant journey.</p>
                  <p>If you have any questions or concerns, please contact our support team at <a href="support@gmail.com">support@gmail.com</a> or 4539564385.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 EBER. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
          `;
    }
    let settings = await settingModel.findOne({});
    let mailUser = settings.mailerUser;
    let mailPassword = settings.mailerPassword;
    // let mailUser = process.env.NODE_MAILER_USER;
    // let mailPassword = process.env.NODE_MAILER_PASSWORD;

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: mailUser,
      pass: mailPassword,
    },
  });

  async function main() {
    await transporter.sendMail({
      from: `"Eber Admin" <admin.eber@gmail.com>`,
      to: [`${mailId}`],
      subject: subject === "Welcome Mail" ? "Welcome to EBER" : subject,
      html:  welcomeMail ,
    });
  }

  main()
  .then(
    () => {
      return true;
    },
    (err) => {
        console.log(err);
      return false;
    }
  );
};
