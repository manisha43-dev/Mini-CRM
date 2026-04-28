import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Typography,Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";

const CompaniesPage = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", industry: "", location: "" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => api.get("/companies").then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/companies", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]);
      setOpen(false);
    },
  });

  return (
    <>
      <Box sx={{display:'flex', justifyContent:"space-between",alignItems:"center",mb:2}}
       
      >
        <Typography  variant="h5" sx={{fontWeight:700}} >
          Companies
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Company
        </Button>
      </Box>

{isLoading?<CircularProgress/>:(
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Location</TableCell>

            </TableRow>
        </TableHead>
        <TableBody>
            {companies?.map((com)=>{
                return(
                    <TableRow key={com._id} hover sx={{cursor:"pointer"}} onClick={()=>navigate(`/companies/${com._id}`)}>
                        <TableCell>{com.name}</TableCell>
                        <TableCell>{com.industry}</TableCell>
                        <TableCell>{com.location}</TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
    </Table>
)}

{/* Add Company*/}

<Dialog open={open} onClose={()=>setOpen(false)} disableRestoreFocus sx={{maxWidth:"sm"}}  fullWidth>
    <DialogTitle>Add Company</DialogTitle>
    <DialogContent>
        <Box sx={{display:"flex",flexDirection:"column",gap:2,pt:1}}>
            <TextField label="Company Name" name="name"  value={form.name} onChange={(e)=>setForm(pre=>({...pre,[e.target.name]:e.target.value}))} fullWidth/>
            <TextField label="Industry" name="industry"  value={form.industry} onChange={(e)=>setForm(pre=>({...pre,[e.target.name]:e.target.value}))} fullWidth/>
            <TextField label="Location" name="location" value={form.location} onChange={(e)=>setForm(pre=>({...pre,[e.target.name]:e.target.value}))} fullWidth/>
        </Box>
    </DialogContent>
    <DialogActions>
        <Button onClick={()=>setOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={()=>createMutation.mutate(form)}>Save</Button>
    </DialogActions>
</Dialog>

    </>
  );
};

export default CompaniesPage;
