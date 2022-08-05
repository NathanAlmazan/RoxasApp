import React, { useState, lazy, Suspense } from 'react';
import IconButton from '@material-ui/core/IconButton';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import EmailIcon from '@material-ui/icons/Email';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core/styles';

const rowStyle = makeStyles((theme) => ({
    row: {
      backgroundColor: '#ffb3af'
    },
    rowIrr: {
        backgroundColor: '#fdfd96'
    },
    rowLate: {
        backgroundColor: '#cedde2'
    }
  }));

const ReportEdit = lazy(() => import('./ReportEdit'));
const ContactDialogue = lazy(() => import('./ContactDialogue'));


function ReportTable(props) {
    const classes = rowStyle();
    const { data, no_data, superuser, refresh_comp } = props;
    const [edit, setEdit] = useState(false);
    const [selectedPub, setSelected] = useState('');
    const [contactPub, setContactPub] = useState(false);
    const [report_info, setReportInfo] = useState(null);
    const admin_user = superuser;
    const report_data = data;
    const noreport_data = no_data;
    //get table data

    //edit report
    const edit_report = (row) => {
        setReportInfo(row);
        setEdit(true);
    }

    const refresh_table = () => {
        refresh_comp();
    }

    const handleContact = (name) => {
        setContactPub(true);
        setSelected(name);
    }

    return (
        <TableContainer>
            <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Publisher</TableCell>
                    <TableCell align="right">Hours</TableCell>
                    <TableCell align="right">Placements</TableCell>
                    <TableCell align="right">Videos</TableCell>
                    <TableCell align="right">Return Visit</TableCell>
                    <TableCell align="right">Bible Study</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {report_data.map((row) => (row.pending === null ? (
                         <TableRow key={row.key} className={classes.rowLate}>
                            <TableCell component="th" scope="row">
                                {row.publisher}
                            </TableCell>
                            <TableCell align="right">{row.hours}</TableCell>
                            <TableCell align="right">{row.placements}</TableCell>
                            <TableCell align="right">{row.videos}</TableCell>
                            <TableCell align="right">{row.return_visit}</TableCell>
                            <TableCell align="right">{row.bible_study}</TableCell>
                            <TableCell align="right"><IconButton onClick={e => edit_report(row)} ><EditIcon /></IconButton></TableCell>
                         </TableRow>
                    ) : (
                        <TableRow key={row.key}>
                            <TableCell component="th" scope="row">
                                {row.publisher}
                            </TableCell>
                            <TableCell align="right">{row.hours}</TableCell>
                            <TableCell align="right">{row.placements}</TableCell>
                            <TableCell align="right">{row.videos}</TableCell>
                            <TableCell align="right">{row.return_visit}</TableCell>
                            <TableCell align="right">{row.bible_study}</TableCell>
                            <TableCell align="right"><IconButton onClick={e => edit_report(row)} ><EditIcon /></IconButton></TableCell>
                        </TableRow>
                    )      
                    ))}
                    {!noreport_data.no_report ? (<TableRow></TableRow>) : (noreport_data.no_report.map((name) => (
                            <TableRow key={name}>
                            <TableCell component="th" scope="row" className={classes.row}>
                                {name}
                            </TableCell>
                            <TableCell align="right">—</TableCell>
                            <TableCell align="right">—</TableCell>
                            <TableCell align="right">—</TableCell>
                            <TableCell align="right">—</TableCell>
                            <TableCell align="right">—</TableCell>
                            <TableCell align="right"><IconButton onClick={e => handleContact(name)} ><EmailIcon /></IconButton></TableCell>
                            </TableRow>
                        )))
                    }
                </TableBody>
            </Table>
            {report_info !== null && (
                 <Suspense fallback={<div>Loading, Please wait...</div>}>
                    <ReportEdit openDialogue={edit} handleClose={edit => setEdit(edit)} record={report_info} admin={admin_user} refresh={refresh_table} />
                </Suspense>
            )}
            {contactPub && (
                <Suspense fallback={<div>Loading, Please wait...</div>}>
                    <ContactDialogue openDialogue={contactPub} handleClose={contactPub => setContactPub(contactPub)} record={null} report={selectedPub} />
                </Suspense>
            )}

        </TableContainer>
    )
}

export default ReportTable
