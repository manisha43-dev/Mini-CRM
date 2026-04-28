
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, Chip, CircularProgress, FormControl, IconButton,
  InputLabel, MenuItem, Pagination, Select, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography,
  Card, CardContent, CardActions, Stack, useMediaQuery, useTheme,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import api from "../api/axios";

const STATUS_COLORS = {
  New: "default",
  Contacted: "info",
  Lost: "error",
  Qualified: "success",
};

const LeadsPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { data, isLoading } = useQuery({
    queryKey: ["leads", page, search, status],
    queryFn: () =>
      api.get("/leads", { params: { page, limit: 10, search, status } })
         .then((res) => res.data),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/leads/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["leads"])
  })

  const handleDelete = (id) => {
    window.confirm("Delete this lead?") && deleteMutation.mutate(id);
  }

  return (
    <>
      {/* Head*/}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Leads</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size={isMobile ? "small" : "medium"}
          onClick={() => navigate("/leads/new")}
        >
          {isMobile ? "Add" : "Add Lead"}
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          sx={{ flex: 1, minWidth: 180 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <MenuItem value="">All</MenuItem>
            {["New", "Contacted", "Lost", "Qualified"].map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Content */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        /*Mobile: Card list  */
        <Stack spacing={1.5}>
          {data?.leads?.map((lead) => (
            <Card key={lead._id} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography sx={{fontWeight:600,fontSize:14}}>{lead.name}</Typography>
                    <Typography sx={{fontSize:12,color:"text.secondary"}}>{lead.email}</Typography>
                  </Box>
                  <Chip
                    label={lead.status}
                    color={STATUS_COLORS[lead.status]}
                    size="small"
                  />
                </Box>
                <Typography sx={{fontSize:12,color:"text.secondary",mt:1}}>
                  Assigned: {lead.assignedTo?.name || "—"}
                </Typography>
              </CardContent>
              <CardActions sx={{ pt: 0, px: 2, pb: 1.5, gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<Edit fontSize="small" />}
                  onClick={() => navigate(`/leads/${lead._id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete fontSize="small" />}
                  onClick={() => handleDelete(lead._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      ) : (
        /* Desktop: Table*/
        <Box sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "grey" }}>
              <TableRow>
                {["Name", "Email", "Status", "Assigned To", "Actions"].map((head) => (
                  <TableCell key={head} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary" }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.leads?.map((lead) => (
                <TableRow key={lead._id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{lead.name}</TableCell>
                  <TableCell sx={{ color: "text.secondary", fontSize: 13 }}>{lead.email}</TableCell>
                  <TableCell>
                    <Chip label={lead.status} color={STATUS_COLORS[lead.status]} size="small" />
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary", fontSize: 13 }}>
                    {lead.assignedTo?.name || "—"}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => navigate(`/leads/${lead._id}/edit`)}>
                      <Edit sx={{fontSize:"small"}}  />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(lead._id)}>
                      <Delete sx={{fontSize:"small"}}  />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {/* Pagination */}
      {!isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={data?.pages || 1}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      )}
    </>
  );
};

export default LeadsPage;
