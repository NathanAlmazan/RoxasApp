import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

export default function PublisherHistory (props) {
    const [publisherHistory, setPublisherHistory] = useState([]);
    const pubID = props.id;
    const year = props.year;

    useEffect(() => {
        async function getPublisherHistory () {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/report/pub-report/${pubID}/${year}`, config);
                const payload = res.data;
            
                const history_set = payload.map(d => ({
                    "key": d.id,
                    "publisher" : d.publisher_name,
                    "hours" : d.hours,
                    "placements" : d.placements,
                    "videos" : d.videos,
                    "return_visit" : d.return_visit,
                    "bible_study" : d.bible_study,
                    "month": d.month,
                    "remarks": d.remarks,
                    "auxiPr": d.auxiPr
                }));

                setPublisherHistory(publisherHistory => (history_set));
    
            } catch(err) {
                console.log(err);
            }
        }

        getPublisherHistory();

    }, [pubID, year]);


    return (
        <TableContainer>
            
            <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Hours</TableCell>
                    <TableCell align="right">Placements</TableCell>
                    <TableCell align="right">Videos</TableCell>
                    <TableCell align="right">Return Visit</TableCell>
                    <TableCell align="right">Bible Study</TableCell>
                </TableRow>
                </TableHead>
                
                <TableBody>
                    {publisherHistory.map((row) => (
                            <TableRow key={row.key}>
                            <TableCell component="th" scope="row">
                                <Typography variant="subtitle1" >{row.month}</Typography> 
                            </TableCell>
                            <TableCell align="right">{row.hours}</TableCell>
                            <TableCell align="right">{row.placements}</TableCell>
                            <TableCell align="right">{row.videos}</TableCell>
                            <TableCell align="right">{row.return_visit}</TableCell>
                            <TableCell align="right">{row.bible_study}</TableCell>
                            </TableRow>
                    ))}
                </TableBody>
            </Table>

        </TableContainer>
    )
}