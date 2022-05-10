const express = require('express');
const router = express.Router();
const { getDirection } = require("../utils/directionFunctions");
const {detectLabels, detectImageProperties} = require("../utils/imageRecognitionFunctions");
const { sendMail } = require("../utils/mailFunctions");

router.post("/directionInfo", async(req, res) => {
    const { from, to} = req.body;
    console.log(req.body);
    if (!from || !to ) {
        return res.status(400).send("Missing Parametres");
    }

    const directioninfo = await getDirection(from, to) 
    res.status(200).send(directioninfo);
});

router.post("/send", (req, res) => {
    const { senderName, senderMail, receiverMail, messageContent} = req.body;
    if (!senderName || !senderMail || !receiverMail || !messageContent) {
        return res.status(400).send("Missing Parametres");
    }

    sendMail(receiverMail, senderMail, messageContent, `${senderName} has sent you a message`);
    res.send(200);
})

router.get("/labels", async (req, res) => {
    const { link } = req.body;
    if (!link) {
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const labels = await detectLabels(link);

    const dominantColors = await detectImageProperties(link);
    console.log(labels);
    return res.json({
        labels,
        dominantColors
    });
}
);

module.exports = router;