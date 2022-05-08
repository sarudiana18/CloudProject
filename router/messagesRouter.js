const { response } = require('express');
const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const connection = require('../db');
const {getDirection} = require("../utils/directionFunctions");
const { sendMail } = require("../utils/mailFunctions");

router.get("/",  (req, res) => {
    connection.query("SELECT * FROM messages", (err, results) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        return res.json({
            messages: results,
        })
    })
});

router.get("/:id",  (req, res) => {
    const {id} = req.params;
    connection.query(`SELECT * FROM messages WHERE entryID = ${mysql.escape(id)}`, (err, results) => {
        if(err){
            console.log(err);
            return res.send(err);
        }

        if(!results.length){
            return res.status(400).json({
                error:"Message not found"
            })
        }
        return res.json({
            messages: results,
        })
    })
});

router.post("/", (req, res) => {
    console.log(req.body);
    const {
        senderName,
        messageContent,
        senderMail,
        receiverMail
    } = req.body;

    if(!senderName || !messageContent || !senderMail || !receiverMail){
        return res.status(400).json({
            error: "All fields are required"
        })
    }

    connection.query(`INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) values (${mysql.escape(senderName)}, ${mysql.escape(senderMail)}, ${mysql.escape(receiverMail)}, ${mysql.escape(messageContent)})`, (err, results) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        return res.json({
            messages: results,
        })
    })
});

router.delete("/:id", (req, res) => {
    const {id} = req.params;
    connection.query(`DELETE FROM messages WHERE entryID = ${mysql.escape(id)}`, (err, results) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        return res.json({
            messages: results,
        })
    })
})

router.put("/:id", (req, res) => {
    const {id} = req.params;
    const {
        senderName,
        messageContent,
        senderMail,
        receiverMail
    } = req.body;

    if(!senderName || !messageContent || !senderMail || !receiverMail){
        return res.status(400).json({
            error: "All fields are required"
        })
    }
    connection.query(`UPDATE messages SET 
    senderName = ${mysql.escape(senderName)}, senderMail = ${mysql.escape(senderMail)}, receiverMail = ${mysql.escape(receiverMail)}, messageContent = ${mysql.escape(messageContent)}  WHERE entryID = ${mysql.escape(id)}`, (err, results) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        return res.json({
            messages: results,
        })
    })
})

router.post("/direction", async (req, res) => {
    const { senderName, senderMail, receiverMail, from, to} =
        req.body;

    if (
        !senderName ||
        !senderMail ||
        !receiverMail || !from || !to
    ) {
        return res.status(400).json({
            error: "All fields are required",
        });
    }

    var directionInfo = {};
    try {
        directionInfo = await getDirection(from, to);
        const directionMessage = `De la ${from} pana la ${to}, distanta totala este de ${directionInfo.distance}, 
        iar timpul total estimat este de ${directionInfo.duration}`;

        sendMail(
            receiverMail,
            senderMail,
            directionMessage,
            `${senderName} has sent you a message`
        );

        connection.query(
            `INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) values (${mysql.escape(senderName)}, ${mysql.escape(senderMail)}, ${mysql.escape(receiverMail)}, ${mysql.escape(directionMessage)})`,
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }

                return res.json({
                    directionInfo,
                });
            }
        );
    } catch (err) {
        console.log(err);
        return res.send(err);
    }
});

module.exports = router;