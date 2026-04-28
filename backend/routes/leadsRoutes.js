const router=require('express').Router();
const {protect}=require('../middleware/auth');
const {getLeads,createLead,getlead,updateLead,deleteLead}=require('../controllers/leadController');

router.use(protect);
router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getlead).put(updateLead).delete(deleteLead);

module.exports=router;