const express = require("express");

const usersControllers = require("./../Controllers/usersControllers")

// ++++++++++ ROUTES FOR NFT ++++++++++++++
// ========== Routes For NFT ==============

const router = express.Router();

// ======= Routes for Users ============
router.route("")
   .get(usersControllers.getAllUsers)
   .post(usersControllers.createUser);

router.route("/:id")
    .get(usersControllers.getSingleUser)
    .patch(usersControllers.updateUser)
    .delete(usersControllers.deleteUser);

module.exports = router;
