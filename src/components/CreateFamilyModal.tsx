import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Box, Dialog, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { theme } from '../../Theme';
import { SkiFamily } from '../../Services/SkiFamilies';
import { Manufacturer } from '../../Services/Manufacturers';
import { CenterLoader } from '../../Components/CenterLoader';

interface CreateFamilyModalProps {
    currentFamilies: SkiFamily[]
    onCreate: any
    open: boolean
    createLoading: boolean
    responseContent: string
    onClose: any
    manufacturers: Manufacturer[]
    currentManufacturer: string
}

export function CreateFamilyModal({ currentFamilies, onCreate, open, onClose, createLoading, responseContent, manufacturers, currentManufacturer }: CreateFamilyModalProps) {
    const [famInput, setFamInput] = useState<string>("")
    const [manufacturer, setManufacturer] = useState<string>(currentManufacturer ? currentManufacturer : "")
    const [inputDisabled, setInputDisabled] = useState<boolean>(false)

    useEffect(() => {
        setManufacturer(currentManufacturer)
    }, [currentManufacturer])

    useEffect(() => {
        if (!!currentFamilies.find(f => f.name.toLowerCase() === famInput.toLowerCase() && f.manufacturer._id === manufacturer)) {
            setInputDisabled(true)
        } else {
            setInputDisabled(false)
        }
    }, [famInput, currentFamilies, manufacturer])

    const handleClose = () => {
        setFamInput("")
        onClose()
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <Box padding={2}>
                <DialogTitle>Add New Family</DialogTitle>
                {createLoading ?
                    <CenterLoader /> :
                    <>
                        <Grid item marginBottom={1}>
                            <FormControl fullWidth>
                                <TextField
                                    required
                                    id="Family"
                                    label="Family Name"
                                    value={famInput}
                                    onChange={(e) => setFamInput(e.target.value)}
                                    error={inputDisabled}
                                    helperText={inputDisabled ? "Family already exists" : ""}
                                    margin="normal"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item marginBottom={2}>
                            <FormControl fullWidth required>
                                <InputLabel id="manufacturer-select-label">Manufacturer</InputLabel>
                                <Select
                                    labelId="manufacturer-select-label"
                                    id="manufacturer-select"
                                    value={manufacturer}
                                    label="Manufacturer"
                                    onChange={(e) => setManufacturer(e.target.value)}
                                >
                                    {manufacturers.map((manufacturer) => {
                                        return <MenuItem key={manufacturer._id} value={manufacturer._id}>{manufacturer.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item margin={1}>
                            <Button onClick={() => onCreate({ name: famInput, manufacturer: manufacturer })}
                                color='primary'
                                sx={
                                    {
                                        "&:hover": {
                                            backgroundColor: theme.palette.secondary.main
                                        }
                                    }}
                                variant="contained"
                                disabled={!famInput || !manufacturer || inputDisabled}
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
