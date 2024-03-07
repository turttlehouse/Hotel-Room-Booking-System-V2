const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'peshal077@gmail.com', // Your Gmail email address
        pass: 'mxlxkqbpfgqprunh'  , // Your Gmail password
      },
      // Enable debugging
      debug: true,
    });
    
    // Send mail with defined transport object
    const mailOptions = {
      from:"PRASHANT<prashant@gmail.com>"  ,  //sender address
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

  } catch (error) {
    throw new Error('Error sending email: ' + error.message);
  }
};

module.exports = sendEmail;
