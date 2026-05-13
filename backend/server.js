const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const connectDB=require('./config/db')
const authRoutes=require('./routes/authRoutes');
const leadsRoutes=require('./routes/leadsRoutes');
const companiesRoutes=require('./routes/companiesRoutes');
const taskRoutes=require('./routes/taskRoutes');
const dashboardRoutes=require('./routes/dashboardRoutes');
const path=require('path')

dotenv.config();
connectDB();

const app=express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend-app.onrender.com", 
  "http://localhost:5000",
  "https://mini-crm-utc7.vercel.app" 

];

app.use(cors({origin:function(origin,callback){
    if(!origin || allowedOrigins.includes(origin)){
        callback(null,true)
    }
    else{
        callback(new Error("Not allowed by CORS"))
    }
}, credentials:true}));

//Routes
app.use('/api/auth',authRoutes)
app.use('/api/leads',leadsRoutes)
app.use('/api/companies',companiesRoutes)
app.use('/api/tasks',taskRoutes)
app.use('/api/dashboard',dashboardRoutes)

//Serve React build
app.use(express.static(path.join(__dirname,'../frontend/dist')))

//Catch-all for React Router
app.get('/{*splat}',(req,res)=>{
    res.sendFile(path.join(__dirname,'../froentend/dist','index.html'))
})

//Global error handler
app.use((err,req,res,next)=>{  
    const status=err.statusCode || 500;
    res.status(status).json({msg:err.message || 'Server error'}); 
});



const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})
