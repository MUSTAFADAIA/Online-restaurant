const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  //1)create transporter (service that will send email like"gmail","Mailgun","mialtrap",sendGrid)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2)Define email options (Like from , to , subject,email content)
  const mailOpts = {
    from: "E-shop App <mustafa120202802@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3)send email
  await transporter.sendMail(mailOpts);
};

module.exports=sendEmail
