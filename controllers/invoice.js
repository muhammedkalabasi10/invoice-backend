import InvoiceModel from "../models/InvoiceModel.js";
import nodemailer from "nodemailer";

export const getInvoicesByUser = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const invoices = await InvoiceModel.find({ creatorId: searchQuery });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const allInvoices = await InvoiceModel.find();
    res.status(200).json(allInvoices);
  } catch (error) {
    res.status(409).json(error.message);
  }
};

export const addInvoice = async (req, res) => {
  const invoice = req.body;
  const newInvoice = await new InvoiceModel(invoice);
  try {
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(409).json(err.message);
  }
};

export const getInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await InvoiceModel.findById(id);
    res.status(200).json(invoice);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  const { id: _id } = await req.params;
  const invoice = await req.body;
  try {
    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      _id,
      { ...invoice },
      { new: true }
    );
    res.json(updatedInvoice);
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    await InvoiceModel.findByIdAndRemove(id);
    res.json({ message: "Invoice successfully deleted" });
  } catch (err) {
    res.json({ message: err.message });
  }
};

export const sendEmail = async (req, res) => {
    const {senderEmail, receiverEmail}=await req.body
  const transporter = await nodemailer.createTransport({
    service:process.env.EMAIL_SERVICE,
    secure:false,
    auth : {
        user : process.env.EMAIL_USERNAME,
        pass : process.env.EMAIL_PASSWORD
    }
    /*tls:{
            rejectUnauthorized:false
        }*/
  });
  transporter.sendMail({
    from:process.env.EMAIL_USERNAME,
        to:`${receiverEmail}`,
        subject:"Invoice",
        text:"Invoice Text",
        html: '<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>',
        amp:`<!doctype html>
        <html ⚡4email>
          <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}</style>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
          </head>
          <body>
            <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
            <p>GIF (requires "amp-anim" script in header):<br/>
              <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
          </body>
        </html>`
  },(error,info)=>{
    if(error) console.log(error)
    else console.log(info)
  })
  /*try{
    await transporter.sendMail({
        from:process.env.SMTP_HOST,
        to:`${receiverEmail}`,
        subject:"Invoice",
        text:"Invoice Text",
        //html: '<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>',
        /*amp: `<!doctype html>
        <html ⚡4email>
          <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}</style>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
          </head>
          <body>
            <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
            <p>GIF (requires "amp-anim" script in header):<br/>
              <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
          </body>
        </html>`*/
      /*})
      res.json({ message: "Invoice successfully sent" })
  }catch(err){
    console.log(err)
    res.json({message:err.message})
  }*/
  

};
