const express = require("express");
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync");

const { tags, search } = require("../controllers/search");

router.post("/search", wrapAsync(search))
router.post("/tags/:id", wrapAsync(tags))

module.exports = router;