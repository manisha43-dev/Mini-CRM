const router=require('express').Router();
const {protect}=require('../middleware/auth');
const {getCompanies,createCompany,getCompany}=require('../controllers/companiesController');


router.use(protect);
router.route('/').get(getCompanies).post(createCompany);
router.route('/:id').get(getCompany);

module.exports=router;
