const router=require('express').Router();
const {protect}=require('../middleware/auth');
const getStatus = require('../controllers/DashboardController');


router.get('/status',protect,getStatus);

module.exports=router;