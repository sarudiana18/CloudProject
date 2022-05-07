const { response } = require('express');
const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const connection = require('../db');

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
        messageContent
    } = req.body;

    if(!senderName || !messageContent){
        return res.status(400).json({
            error: "All fields are required"
        })
    }

    connection.query(`INSERT INTO messages (senderName, messageContent) values (${mysql.escape(senderName)}, ${mysql.escape(messageContent)})`, (err, results) => {
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
        messageContent
    } = req.body;

    if(!senderName || !messageContent){
        return res.status(400).json({
            error: "All fields are required"
        })
    }
    connection.query(`UPDATE messages SET senderName = ${mysql.escape(senderName)}, messageContent = ${mysql.escape(messageContent)}  WHERE entryID = ${mysql.escape(id)}`, (err, results) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        return res.json({
            messages: results,
        })
    })
})

module.exports = router;