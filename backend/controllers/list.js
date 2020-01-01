//Dependencies
const express = require('express');
const router = express.Router();
const List = require('../models/list.js');

//Routes
//returns all lists associated with client username (index page)
router.get('/user/:username', (req, res) => {
    List.find({users: {$in: [req.params.username]}})
    .then(lists => res.json({
            username: req.params.username,
            lists: lists
        }));
})

//returns specific list based on id (show page)
router.get('/id/:id', (req, res) => {
    List.findById(req.params.id)
    .then(list => res.json({
        title: list.title,
        users: list.users,
        items: list.items
    }));
})

router.post('/', (req,res) =>{
    List.create(req.body)
    .then(list => res.json({list: list}))
})

router.put('/id/:id', (req,res) =>{
 
})

router.delete('/id/:id', (req,res) =>{
   
})

module.exports = router;
