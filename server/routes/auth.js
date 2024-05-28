const express = require('express');

const router = express.Router();

const { signup, signin, updatePassword } = require('../controller/auth');

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});
router.post("/signup", signup);
router.post("/signin", signin);
router.post('/update-password', updatePassword);

module.exports = router