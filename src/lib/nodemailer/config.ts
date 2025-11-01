import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NEXT_PUBLIC_GMAIL,
        pass: process.env.NEXT_PUBLIC_GOOGLE_APP_PASSWORD,
    },
});

export const mailOptions = {
    from: `"Agbara Badagry Property Center" <${process.env.NEXT_PUBLIC_GMAIL}>`,
};

