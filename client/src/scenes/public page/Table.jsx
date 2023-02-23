import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios'
import uuid from 'react-uuid'
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';



export default function DataTable({ handleSubmit }) {

   const navigate = useNavigate()
   // defining coloumns
   const columns = [
      { field: '_id', headerName: 'Id', width: 300, hideable: false, hide: true },
      { field: 'date', headerName: 'Date', width: 130 },
      { field: 'title', headerName: 'Title', width: 300 },
      {
         field: 'action',
         width: 190,
         headerName: 'Action',
         sortable: false,
         renderCell: (params) => {
            const onClick = (e) => {
               e.stopPropagation(); // don't select this row after clicking

               const api: GridApi = params.api;
               const thisRow: Record<string, GridCellValue> = {};

               api
                  .getAllColumns()
                  .filter((c) => c.field !== '_check_' && !!c)
                  .forEach(
                     (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
                  );
               alert(JSON.stringify(thisRow))

               // navigate(`${item._id}`)
            };

            return <Box
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '& > *': {
                     m: 1,
                  },
               }}
            >
               <ButtonGroup size="small" aria-label="small button group">
                  <Button color="error"><HighlightOffRoundedIcon /></Button>
                  <Button color="success"><CheckCircleOutlineRoundedIcon /></Button>
               </ButtonGroup>
            </Box>
         },
      },
   ];



   const [rows, setRows] = React.useState([])
   React.useEffect(() => {

      axios.get('http://localhost:5000/public/getScheduledClass')
         .then((res) => {
            setRows(res.data.ScheduledClass)
            console.log(res.data.ScheduledClass)
         })
         .catch((err) => {
            console.error(err)
         })
   }, [handleSubmit])

   return (
      <div style={{ height: 400, width: '100%' }}>
         <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row: any) => uuid()}
            disableSelectionOnClick
            disableColumnMenu
            disableColumnSelector
         />
      </div>
   );
}