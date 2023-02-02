import React, { useState } from 'react';
import { Box, FormControl, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import { theme } from '../legacy/Theme';
// import { Note } from '../../Services/Skis';
import dynamic from "next/dynamic";
const ReactQuill = dynamic(import('react-quill'), { ssr: false })
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { RouterOutputs } from '../utils/api';

type Ski = NonNullable<RouterOutputs["ski"]["getOne"]>;
type Note = Ski['notes'][0]

interface NoteProps {
    currentUserId: string | undefined
    saveNote: any
    note: Note
    index: number
}

export function NoteComponent({ index, currentUserId, saveNote, note }: NoteProps) {


    const [noteText, setNoteText] = useState<string>(note.note || "")
    const [skiDays, setSkiDays] = useState<string>(note.skiDays.toString())
    const [editing, setEditing] = useState<boolean>(false)

    const handleEdit = () => {
        setEditing(!editing)
    }

    const cancel = () => {
        setEditing(false)
        setNoteText(note.note || "")
        setSkiDays(note.skiDays.toString())
    }

    const save = () => {
        setEditing(false)
        saveNote(note, noteText, parseFloat(skiDays))
    }

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }]
        ],
    }

    return (
        <Grid container >
            <Grid item xs={12} sm={12} md={3} lg={2}>
                <Stack direction={{ xs: 'row', md: 'column' }}>
                    <Grid item xs={4} sm={12}>
                        <Typography width="100%" component="div" variant='overline' color="secondary" noWrap align='left' paddingRight={2}>{note.user.email ? note.user.email.length > 150 ? `${note.user.email.substring(0, 16)}...` : note.user.email : note.user.id}</Typography>
                    </Grid>
                    {editing ?
                        <Grid item xs={8} sm={10}>
                            <FormControl>
                                <TextField
                                    id="skiDays"
                                    label="Ski Days"
                                    type="number"
                                    value={skiDays}
                                    onChange={(e) => setSkiDays(e.target.value)}
                                    size="small"
                                    margin='dense' />
                            </FormControl>
                            <Grid item>
                                <IconButton color="primary" onClick={cancel}>
                                    <CancelIcon />
                                </IconButton>
                                <IconButton color="primary" onClick={save}>
                                    <SaveIcon />
                                </IconButton>
                            </Grid>
                        </Grid> :
                        <Grid item xs={8} sm={10}>
                            <Typography variant='overline' align='left' paddingRight={2}>Ski Days: {skiDays}</Typography>
                            {note.user.id === currentUserId &&
                                <IconButton color="primary" onClick={handleEdit}>
                                    <EditIcon />
                                </IconButton>
                            }
                        </Grid>
                    }
                </Stack>
            </Grid>
            <Grid item xs={12} sm={12} md={9} lg={10}>
                <Grid container justifyContent='flex-start'>
                    {editing ?
                        <Grid item xs={12}>
                            <ReactQuill style={{maxHeight: "300px", overflow: "scroll"}} theme={"snow"} value={noteText} onChange={setNoteText} readOnly={!editing} modules={modules} />
                        </Grid> :
                        <Grid item xs={12}>
                            <Box width="100%" maxHeight="300px" sx={{ border: `1px solid ${theme.palette.primary.light}`, borderRadius: "5px", overflowY: 'scroll', backgroundColor: theme.palette.background.paper }} >
                                <ReactQuill theme="bubble" value={noteText} readOnly={true} />
                            </Box>
                        </Grid>
                    }
                </Grid>
            </Grid>
        </Grid >
    );
}
