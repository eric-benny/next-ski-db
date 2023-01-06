import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Manufacturer } from '../../Services/Manufacturers';
import { Box, Dialog, DialogTitle, FormControl, Grid, TextField, Typography } from '@mui/material';
import { theme } from '../../Theme';
import { CenterLoader } from '../../Components/CenterLoader';

interface CreateManufacturerModalProps {
    currentManufacturers: Manufacturer[]
    onCreate: any
    open: boolean
    createLoading: boolean
    responseContent: string
    onClose: any
}

export function CreateManufacturerModal({ currentManufacturers, onCreate, open, onClose, createLoading, responseContent }: CreateManufacturerModalProps) {

    const [manInput, setManInput] = useState<string>("")
    const [inputDisabled, setInputDisabled] = useState<boolean>(false)

    useEffect(() => {
        if (!!currentManufacturers.find(m => m.name.toLowerCase() === manInput.toLowerCase())) {
            setInputDisabled(true)
        } else {
            setInputDisabled(false)
        }
    }, [manInput, currentManufacturers])

    const handleClose = () => {
        setManInput("")
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <Box padding={2}>
                <DialogTitle>Add New Manufacturer</DialogTitle>
                {createLoading ?
                    <CenterLoader /> :
                    <>
                        <Grid item marginBottom={1}>
                            <FormControl fullWidth>
                                <TextField
                                    required
                                    id="manufacturer"
                                    label="Manufacturer Name"
                                    value={manInput}
                                    onChange={(e) => setManInput(e.target.value)}
                                    error={inputDisabled}
                                    helperText={inputDisabled ? "Manufacturer already exists" : ""}
                                    margin="normal"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item margin={1}>
                            <Button onClick={() => onCreate({ name: manInput })}
                                color='primary'
                                sx={
                                    {
                                        "&:hover": {
                                            backgroundColor: theme.palette.secondary.main
                                        }
                                    }}
                                variant="contained"
                                disabled={!manInput || inputDisabled}
                            >
                                Submit
                            </Button>
                        </Grid>
                        <Grid item margin={1}>
                            <Typography>
                                {responseContent ? `${responseContent}` : ""}
                            </Typography>
                        </Grid>
                    </>
                }
                {/* <Grid container spacing={1} rowSpacing={2} margin={2}>
                    <Grid item xs={12}>
                        <Typography>
                            This is the manufacturer modal
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>
                            This is the manufacturer modal
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>
                            This is the manufacturer modal
                        </Typography>
                    </Grid>
                </Grid> */}
            </Box>
        </Dialog>
    );
}
