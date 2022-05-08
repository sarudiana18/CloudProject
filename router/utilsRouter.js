const express = require('express');
const router = express.Router();
const { getDirection } = require("../utils/directionFunctions");

router.post("/directionInfo", async(req, res) => {
    const { from, to} = req.body;
    console.log(req.body);
    if (!from || !to ) {
        return res.status(400).send("Missing Parametres");
    }

    const directioninfo = await getDirection(from, to) 
    res.status(200).send(directioninfo);
});

module.exports = router;