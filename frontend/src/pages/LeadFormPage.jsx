import { useState,useEffect } from "react";
import {useNavigate,useParams} from "react-router-dom"
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query"
import api from '../api/axios'
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

const LeadFormPage = () => {

    const{id}=useParams();
    const navigate=useNavigate();
    const queryClient=useQueryClient();
    const isEdit=Boolean(id)


    const[form,setForm]=useState({
        name:'',email:'',phone:'',status:'New',assignedTo:'',company:''
    })

    //Editing lead data
    const {data:lead}=useQuery({
        queryKey:['lead',id],
        queryFn:()=>api.get(`/leads/${id}`).then(res=>res.data),
        enabled:isEdit,
        })

        //List users & compenies for dropdowns
        const{data:users}=useQuery({queryKey:['users'],queryFn:()=>api.get('/auth/users').then(res=>res.data)});
        const {data:companies}=useQuery({queryKey:['companies'], queryFn:()=>api.get('/companies').then(res=>res.data)})

        useEffect(()=>{
            if(lead){
                setForm({
                    name:lead.name,
                    email:lead.email,
                    phone:lead.phone || '',
                    status:lead.status,
                    assignedTo:lead.assignedTo?._id || '',
                    company:lead.company?._id || '',
                })
            }
        },[lead])

        const mutation=useMutation({
            mutationFn:(data)=>isEdit?(api.put(`/leads/${id}`,data))
            :(api.post('/leads',data)),
            onSuccess:()=>{
                queryClient.invalidateQueries(['leads'])
                navigate('/leads')
            }
        })

        const handleChange=(e)=>{
            setForm(prev=>(
                {...prev,[e.target.name]:e.target.value}
            ))
        }

    const handleSubmit=(e)=>{
        e.preventDefault();
        mutation.mutate(form)
    }

  return (
    <Box sx={{maxWidth:500}} >
        <Typography variant="h5" sx={{fontWeight:700, mb:3}} >{isEdit?'Edit lead':'Add Lead'}</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{display:"flex",flexDirection:"column",gap:2}}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} required fullWidth/>
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} required fullWidth type="email"/>
            <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} required fullWidth/>
            <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={form.status} label="Status" onChange={handleChange}>
                    {['New','Contacted','Lost','Qualified'].map((state)=>{
                        return(
                            <MenuItem key={state} value={state}>{state}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>

            <FormControl fullWidth>
          <InputLabel>Assigned To</InputLabel>
          <Select name="assignedTo" value={form.assignedTo} label="Assigned To" onChange={handleChange}>
            <MenuItem value="">None</MenuItem>
            {users?.map(u => <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>)}
          </Select>
        </FormControl>

            <FormControl fullWidth>
                <InputLabel>Company</InputLabel>
                <Select name="company" value={form.company} label="Company" onChange={handleChange}>
                    <MenuItem value="">None</MenuItem>
                    {companies?.map((c)=>{
                        return(
                            <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
            <Box  sx={{display:"flex",gap:2}} >
                <Button type="submit" variant="contained" disabled={mutation.isPending}>
                    {mutation.isPending?<CircularProgress sx={{color:"inherit"}} size={22}/>:isEdit?'Update':'Create'}
                </Button>
                <Button variant="outlined" onClick={()=>navigate('/leads')}>Cancel</Button>
            </Box>
        </Box>
    </Box>
  )
}

export default LeadFormPage
