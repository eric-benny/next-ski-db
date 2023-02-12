export {}
// import React, { useEffect, useState } from 'react';
// import Button from '@mui/material/Button';
// import { Autocomplete, Box, Dialog, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Tooltip, Typography } from '@mui/material';
// import { theme } from '../../Theme';
// import { Ski, SkiComp } from '../../Services/Skis';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { isServiceError } from '../../Services/Utils';
// import { postSkiComp, SkiSingle, updateSkiComp, useSkis } from '../../Services/Skis';
// import AddIcon from '@mui/icons-material/Add';
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import RemoveIcon from '@mui/icons-material/Remove';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { CenterLoader } from '../../Components/CenterLoader';

// interface CreateSkiCompModalProps {
//     currentComps: SkiComp[]
//     open: boolean
//     onClose: any
//     currentSki: Ski
//     editComp?: SkiComp
// }

// const attributes = ["Edge Hold", "Stablility", "Float"]

// export function CreateSkiCompModal({ currentComps, open, onClose, currentSki, editComp }: CreateSkiCompModalProps) {
//     const [comps, setComps] = useState<{ attribute: string, quantifier: number }[]>(editComp ? editComp.comps : [])
//     const [attribute, setAttribute] = useState<string>("")
//     const [quantifier, setQuantifier] = useState<number>(0)
//     const [comparisonSki, setComparisonSki] = useState<SkiSingle | null>(null)
//     const [comparisonSkiOptions, setComparisonSkiOptions] = useState<SkiSingle[]>([])
//     const [comparisonSkiInput, setComparisonSkiInput] = useState<string>("")
//     const [inputDisabled, setInputDisabled] = useState<boolean>(false)
//     const [notes, setNotes] = useState<string>("")

//     useEffect(() => {
//         if (editComp) {
//             setComps(editComp.comps)
//             setNotes(editComp.notes)
//         }
//     }, [editComp])

//     const [errorAlert, setErrorAlert] = useState<boolean>(false)
//     const [successAlert, setSuccessAlert] = useState<boolean>(false)
//     const [alertContent, setAlertContent] = useState<any>(undefined)
//     const queryClient = useQueryClient();
//     const { mutate: mutateCreate, isLoading: isLoadingCreate } = useMutation(postSkiComp, {
//         onSuccess: data => {
//             setAlertContent(data)
//             if (isServiceError(data)) {
//                 setErrorAlert(true)
//             } else {
//                 setSuccessAlert(true)
//                 handleClose()
//             }
//         },
//         onError: () => {
//             alert("there was an error")
//         },
//         onSettled: () => {
//             queryClient.invalidateQueries(['ski']);
//         }
//     });

//     const { mutate: mutateUpdate, isLoading: isLoadingUpdate } = useMutation(updateSkiComp, {
//         onSuccess: data => {
//             setAlertContent(data)
//             if (isServiceError(data)) {
//                 setErrorAlert(true)
//             } else {
//                 setSuccessAlert(true)
//                 handleClose()
//             }
//         },
//         onError: () => {
//             alert("there was an error")
//         },
//         onSettled: () => {
//             queryClient.invalidateQueries(['ski']);
//         }
//     });

//     // const { isLoading, isError, data: skis, error } = useQuery(['skis'], fetchSkis, { enabled: open })
//     const { isLoading, isError, data: skis, error } = useSkis(open)

//     useEffect(() => {
//         if (skis) {
//             setComparisonSkiOptions([...skis.filter(s => {
//                 return s.mongo_id !== currentSki._id && !currentSki.skiComps.find(c => c.primarySki._id === s.mongo_id || c.secondarySki._id === s.mongo_id)
//             })])
//         }
//     }, [skis, currentSki])

//     const handleClose = (event: any = undefined, reason: any = undefined) => {
//         if (reason && reason === "backdropClick")
//             return;
//         setComps([])
//         setAttribute("")
//         setQuantifier(0)
//         setComparisonSki(null)
//         setNotes("")
//         onClose()
//     }

    

//     const mutateComparison = () => {
//         if (editComp) {
//             console.log(comps);
            
//             const newComp = {
//                 "primarySki": currentSki._id ? currentSki._id : "",
//                 "secondarySki": editComp.secondarySki._id,
//                 "comps": comps.map(m => ({attribute: m.attribute, quantifier: m.quantifier})),
//                 "notes": notes
//             }
//             console.log('new', newComp);
            
//             mutateUpdate({skiCompId: editComp._id, skiCompData: newComp})
//         } else {
//             if (currentSki._id) {
//                 const newComp = {
//                     "primarySki": currentSki._id,
//                     "secondarySki": comparisonSki ? comparisonSki.mongo_id : "",
//                     "comps": comps,
//                     "notes": notes
//                 }
//                 mutateCreate(newComp)
//             }
//         }
//     }

//     const formatSkiName = (ski: SkiSingle) => {
//         const prevYear = ski.yearCurrent - 1
//         return `${ski.model} ${prevYear - 2000}/${ski.yearCurrent - 2000}`
//     }

//     const attrIcon = (value: number) => {
//         if (value === -1) {
//             return <ArrowDropDownIcon color='error' />
//         }
//         if (value === 0) {
//             return <RemoveIcon />
//         }
//         if (value === 1) {
//             return <ArrowDropUpIcon color='success' />
//         }
//         return "N/A"
//     }

//     return (
//         <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
//             <Box padding={2}>
//                 <DialogTitle>{`${editComp ? "Edit" : "Add New"} Comparison`}</DialogTitle>
//                 {isLoadingCreate || isLoadingUpdate ?
//                     <CenterLoader /> :
//                     <>
//                         <DialogContent>
//                             <DialogContentText>
//                                 Primary Ski
//                             </DialogContentText>
//                             <Typography>{editComp ? editComp.primarySki.model : currentSki.model}</Typography>
//                         </DialogContent>
//                         <DialogContent sx={{ paddingTop: 1 }}>
//                             {editComp ?
//                                 <>
//                                     <DialogContentText>
//                                         Secondary Ski
//                                     </DialogContentText>
//                                     <Typography>{editComp.secondarySki.model}</Typography>
//                                 </>
//                                 :
//                                 <Grid container direction='row'>
//                                     <Autocomplete
//                                         value={comparisonSki}
//                                         onChange={(event: any, newValue: SkiSingle | null) => {
//                                             setComparisonSki(newValue);
//                                         }}
//                                         inputValue={comparisonSkiInput}
//                                         onInputChange={(event, newInputValue) => {
//                                             setComparisonSkiInput(newInputValue);
//                                         }}
//                                         id="controllable-states-demo"
//                                         getOptionLabel={(option) => formatSkiName(option)}
//                                         options={comparisonSkiOptions}
//                                         sx={{ width: 300 }}
//                                         renderInput={(params) => <TextField {...params} label="Secondary Ski" />}
//                                     />
//                                 </Grid>
//                             }
//                         </DialogContent>
//                         <DialogContent sx={{ paddingTop: 0 }}>
//                             <DialogContentText>
//                                 Comparisons
//                             </DialogContentText>
//                             {comps.length < 1 ? 
//                             <Typography fontStyle="italic">Use the dropdown and + button to add an attribute comparison</Typography> :
//                             comps.map((comp, index) => {
//                                 return (
//                                     <Grid key={index} container direction='row' spacing={1} rowSpacing={2} alignContent="center">
//                                         <Grid item>
//                                             <IconButton color="error" sx={{ paddingTop: 0 }}
//                                                 onClick={() => { setComps([...comps.filter(c => c.attribute !== comp.attribute)]) }}>
//                                                 <DeleteIcon />
//                                             </IconButton>
//                                         </Grid>
//                                         <Grid item>
//                                             <Typography>{comp.attribute}</Typography>
//                                         </Grid>
//                                         <Grid item>
//                                             {attrIcon(comp.quantifier)}
//                                         </Grid>
//                                     </Grid>
//                                 )
//                             })}
//                         </DialogContent>
//                         <DialogContent>
//                             <Grid container direction='row' alignContent="center" spacing={2} rowSpacing={2}>
//                                 <Grid item xs={12}>
//                                     <FormControl fullWidth required>
//                                         <InputLabel id="manufacturer-select-label">Attribute</InputLabel>
//                                         <Select
//                                             labelId="attribute-select-label"
//                                             id="attribute-select"
//                                             value={attribute}
//                                             label="Attribute"
//                                             onChange={(e) => setAttribute(e.target.value)}
//                                         >
//                                             {attributes.filter(a => !comps.find(c => c.attribute === a)).map((attr) => {
//                                                 return <MenuItem key={attr} value={attr}>{attr}</MenuItem>
//                                             })}
//                                         </Select>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item xs={12} sm={8} md={6}>
//                                     <FormControl fullWidth>
//                                         <FormLabel id="quantifier-selection-group">Quantifier</FormLabel>
//                                         <RadioGroup
//                                             row
//                                             aria-labelledby="quantifier-selection"
//                                             name="quantifier"
//                                             value={quantifier}
//                                             onChange={(e) => { setQuantifier(parseInt(e.target.value)) }}
//                                         >
//                                             <FormControlLabel
//                                                 value="-1"
//                                                 control={<Radio />}
//                                                 label={<ArrowDropDownIcon color='error' fontSize='large' />}
//                                                 labelPlacement="top"
//                                             />
//                                             <FormControlLabel
//                                                 value="0"
//                                                 control={<Radio />}
//                                                 label={<RemoveIcon fontSize='large' />}
//                                                 labelPlacement="top"
//                                             />
//                                             <FormControlLabel
//                                                 value="1"
//                                                 control={<Radio />}
//                                                 label={<ArrowDropUpIcon color='success' fontSize='large' />}
//                                                 labelPlacement="top"
//                                             />
//                                         </RadioGroup>
//                                         <FormHelperText>Ex: Primary is better/same/worse than Secondary</FormHelperText>
//                                     </FormControl>
//                                 </Grid>
//                                 <Grid item container xs={12} sm={2} alignItems='center' justifyContent={{ xs: 'center', sm: 'flex-start' }}>
//                                     <Tooltip title={!attribute ? "Select an attribute to add" : "Add Comparison"}>
//                                         <div>
//                                             <IconButton color="primary"
//                                                 disabled={!attribute}
//                                                 onClick={() => {
//                                                     setComps([...comps, { attribute: attribute, quantifier: quantifier }])
//                                                     setAttribute("")
//                                                     setQuantifier(0)
//                                                 }}>
//                                                 <AddIcon />
//                                             </IconButton>
//                                         </div>
//                                     </Tooltip>
//                                 </Grid>
//                             </Grid>
//                         </DialogContent>
//                         <DialogContent>
//                             <Grid container direction='row' alignContent="center" spacing={2} rowSpacing={2}>
//                                 <Grid item xs={12}>
//                                     <TextField fullWidth multiline
//                                         value={notes}
//                                         onChange={(e) => setNotes(e.target.value)}
//                                         label="Notes" />
//                                 </Grid>
//                             </Grid>
//                         </DialogContent>
//                         <DialogContent>
//                             <Grid container direction='row' justifyContent="center" spacing={2} rowSpacing={2}>
//                                 <Grid item>
//                                     <Button onClick={mutateComparison}
//                                         color='primary'
//                                         sx={
//                                             {
//                                                 "&:hover": {
//                                                     backgroundColor: theme.palette.secondary.main
//                                                 }
//                                             }}
//                                         variant="contained"
//                                         disabled={editComp ? comps.length === 0 : (!comparisonSki || comps.length === 0)}
//                                     >
//                                         {editComp ? "Update" : "Submit"}
//                                     </Button>
//                                 </Grid>
//                                 <Grid item>
//                                     <Button onClick={handleClose}
//                                         color='error'
//                                         variant="contained"
//                                     >
//                                         Cancel
//                                     </Button>
//                                 </Grid>
//                             </Grid>
//                         </DialogContent>
//                         {errorAlert ?
//                             <DialogContent>
//                                 <Grid item margin={1}>
//                                     <Typography color="error">
//                                         {errorAlert}
//                                     </Typography>
//                                 </Grid>
//                             </DialogContent> :
//                             <></>
//                         }
//                     </>
//                 }
//             </Box>
//         </Dialog >
//     );
// }
