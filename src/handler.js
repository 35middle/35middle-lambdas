"use strict";
const nodemailer = require("nodemailer");
const aws = require("@aws-sdk/client-ses");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");

const ses = new aws.SES({
    apiVersion: "2010-12-01",
    region: "ap-southeast-2",
    defaultProvider,
})
//
let transporter = nodemailer.createTransport({
    SES: { ses, aws },
});

const sendMail = async (message) => {
    console.log('message', message)
    const body = JSON.parse(message.body)
    console.log('body', body)
    const data = JSON.parse(body.Message)
    console.log('data', data)

    const emailMessage = {
        from: '35middle@gmail.com', // sender address
        to: data.userEmail, // list of receivers
        subject: "35middle - Reset Password", // Subject line
        html: `<p>Hi ${data.userEmail}.</p. <p>Please click ${data.forgetPasswordLink} to reset password.</p>`, // html body
    }

    await new Promise((resolve, reject) => {
        transporter.sendMail(emailMessage, function (error, info) {
            if (error) {
                return reject(error)
            }
            resolve('Email sent');
        });
    });
}

module.exports.email = async (event) => {
    console.log('event', event)
    await sendMail(event.Records[0])
}