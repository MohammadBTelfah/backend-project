const express = require('express');
const router = express.Router();
const { getAllUsers,createUser,getUserById,getUserByname,updateUser,deleteUser,login} = require('../controllers/AuthControllers');


router.get('/users', getAllUsers);
router.post('/createuser', createUser);
router.get('/getuser/:id', getUserById);
router.post('/getuserbyname', getUserByname);
router.put('/updateuser/:id', updateUser);
router.delete('/deleteuser/:id', deleteUser);
router.post('/login', login);






module.exports = router;