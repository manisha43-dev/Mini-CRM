const router=require('express').Router();
const {protect}=require('../middleware/auth');
const {getTasks,createTask,updateTaskStatus}=require('../controllers/taskController');

router.use(protect);
router.route('/').get(getTasks).post(createTask);
router.route('/:id/status').patch(updateTaskStatus);

module.exports=router;
