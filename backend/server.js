const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const connectDB=require('./config/db')
const authRoutes=require('./routes/authRoutes');
const leadsRoutes=require('./routes/leadsRoutes');
const companiesRoutes=require('./routes/companiesRoutes');
const taskRoutes=require('./routes/taskRoutes');
const dashboardRoutes=require('./routes/dashboardRoutes');

dotenv.config();
connectDB();

const app=express();

app.use(cors({origin:"http://localhost:5173", credentials:true}));
app.use(express.json());

//Routes
app.use('/api/auth',authRoutes)
app.use('/api/leads',leadsRoutes)
app.use('/api/companies',companiesRoutes)
app.use('/api/tasks',taskRoutes)
app.use('/api/dashboard',dashboardRoutes)



//Global error handler
app.use((err,req,res,next)=>{  
    const status=err.statusCode || 500;
    res.status(status).json({msg:err.message || 'Server error'}); 
});

const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})