import { Button, CircularProgress, Container, Divider, Grid, Stack, Typography, Link, IconButton, Dialog, Alert, AlertTitle, styled, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
//import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
//import { deleteSki, fetchSki, NoteUpload, Ski } from '../../Services/Skis';
//import { SkiSpecCard } from './SkiSpecCard';
import { theme } from '../../legacy/Theme';
//import { NoteComponent } from './NoteComponent';
import AddIcon from '@mui/icons-material/Add';
//import { ComparisonTable } from './ComparisonTable';
//import { Guide } from './Guide';
//import { useAuth } from '../../Hooks/Auth';
//import { isServiceError } from '../../Services/Utils';
//import { updateSki } from '../../Services/Skis';
// import { CreateSkiCompModal } from './CreateSkiCompModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/StarTwoTone';
//import { updateUserFavorite } from '../../Services/Users';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
} from 'reactstrap';
// import { CenterLoader } from '../../Components/CenterLoader';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useRouter } from 'next/router'


const StyledControl = styled(CarouselControl)({
});


export default function SkiDetail() {
    //const navigate = useNavigate();
    //const { fullUser } = useAuth();
    const router = useRouter()
    const { skiId } = router.query

    // const { data: ski, isLoading } = useQuery(['ski', skiId], () => fetchSki(skiId), { enabled: skiId ? true : false });

    // const queryClient = useQueryClient();
    // const { mutate, isLoading: isLoadingUpdate } = useMutation(updateSki, {
    //     onSuccess: data => {
    //         if (isServiceError(data)) {
    //             // setErrorAlert(true)
    //         } else {
    //             // setSuccessAlert(true)
    //             // clear()
    //         }
    //     },
    //     onError: () => {
    //         alert("there was an error")
    //     },
    //     onSettled: () => {
    //         queryClient.invalidateQueries(['ski']);
    //     }
    // });

    // const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation(deleteSki, {
    //     onSuccess: data => {
    //         if (isServiceError(data)) {
    //             alert("ski could not be deleted")
    //         } else {
    //             navigate(`/skis`)
    //         }
    //     },
    //     onError: () => {
    //         alert("there was an error deleting the ski")
    //     },
    //     onSettled: () => {
    //     }
    // });

    // const { mutate: mutateFav, isLoading: isLoadingFav } = useMutation(updateUserFavorite, {
    //     onSuccess: data => {
    //         if (isServiceError(data)) {
    //             alert("favorite could not be added")
    //         } else {

    //         }
    //     },
    //     onError: () => {
    //         alert("there was an error updating the favorite")
    //     },
    //     onSettled: () => {
    //         queryClient.invalidateQueries(['user']);
    //     }
    // });

    // const [deleteAlert, setDeleteAlert] = useState<boolean>(false)
    // const deleteSkiConfirm = () => {
    //     setDeleteAlert(false)
    //     if (skiId) {
    //         mutateDelete(skiId)
    //     }
    // }

    // const saveNote = (index: number, note: string, skiDays: number) => {
    //     if (ski) {
    //         const newNote = ski.notes[index]
    //         newNote.note = note
    //         newNote.skiDays = skiDays
    //         newNote.lastUpdated = new Date(Date.now())
    //         const notes = ski.notes
    //         notes[index] = newNote
    //         const newNotes = [...notes.map(note => ({ ...note, user: note.user._id }))]
    //         mutate({ skiId: skiId, skiData: { notes: newNotes } })
    //     }
    // }

    // const newNote = () => {
    //     if (fullUser && ski) {
    //         const newNote: NoteUpload = {
    //             user: fullUser._id,
    //             note: "",
    //             lastUpdated: new Date(Date.now()),
    //             skiDays: 0
    //         }
    //         const newSki = ski
    //         const notes = [...newSki.notes.map(note => ({ ...note, user: note.user._id })), newNote]

    //         mutate({ skiId: skiId, skiData: { notes: notes } })
    //     }
    // }

    // const formatSkiName = (ski: Ski) => {
    //     const prevYear = ski.yearCurrent - 1
    //     return `${prevYear - 2000}/${ski.yearCurrent - 2000} ${ski.model}`
    // }

    // const [template, setTemplate] = useState<string>("")

    // const [compModalOpen, setCompModalOpen] = useState<boolean>(false)
    // const onCompModalClose = () => {
    //     setCompModalOpen(false)
    // }

    // // console.log(fullUser);
    // const [activeIndex, setActiveIndex] = useState(0);
    // const [animating, setAnimating] = useState(false);

    // const next = () => {
    //     if (animating) return;
    //     if (ski?.specs) {
    //         const nextIndex = activeIndex === ski?.specs.length - 1 ? 0 : activeIndex + 1;
    //         setActiveIndex(nextIndex);
    //     }
    // };

    // const previous = () => {
    //     if (animating) return;
    //     if (ski?.specs) {
    //         const nextIndex = activeIndex === 0 ? ski?.specs.length - 1 : activeIndex - 1;
    //         setActiveIndex(nextIndex);
    //     }
    // };

    // const goToIndex = (newIndex: React.SetStateAction<number>) => {
    //     if (animating) return;
    //     setActiveIndex(newIndex);
    // };

    // const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    //     <Tooltip {...props} classes={{ popper: className }} />
    // ))({
    //     [`& .${tooltipClasses.tooltip}`]: {
    //         maxWidth: 500,
    //     },
    // });

    // const CompExample = () => {
    //     return (
    //         <Paper sx={{ minWidth: 400, padding: 1 }}>
    //             <Typography variant='h6'>Comparison Example</Typography>
    //             <Typography variant='body2' component="p">If viewing the detail page for the Bent Chetler 100, the comparison below is showing that the Sick Day is less stable, has silimar edge hold, and better float compared to the Bent Chetler</Typography>
    //             <TableContainer>
    //                 <Table sx={{ maxWidth: 400 }} size='small'>
    //                     <TableHead>
    //                         <TableRow>
    //                             <TableCell>Model</TableCell>
    //                             <TableCell>Stability</TableCell>
    //                             <TableCell>Edge Hold</TableCell>
    //                             <TableCell>Float</TableCell>
    //                         </TableRow>
    //                     </TableHead>
    //                     <TableBody>
    //                         <TableRow >
    //                             <>
    //                                 <TableCell component="th" scope="row">
    //                                     <Typography variant='body2' color='secondary'>Sick Day 104</Typography>
    //                                 </TableCell>
    //                                 <TableCell align="center"><ArrowDropDownIcon color='error' fontSize='small' /></TableCell>
    //                                 <TableCell align="center"><RemoveIcon fontSize='small' /></TableCell>
    //                                 <TableCell align="center"><ArrowDropUpIcon color='success' fontSize='small' /></TableCell>

    //                             </>
    //                         </TableRow>
    //                     </TableBody>
    //                 </Table>
    //             </TableContainer>
    //             <Typography marginTop={2} variant='body2' component="p">Comparisons are bi-directional, so when viewing the detail page for the Sick Day, the below comparison would be shown</Typography>
    //             <TableContainer >
    //                 <Table sx={{ maxWidth: 400 }} size='small'>
    //                     <TableHead>
    //                         <TableRow>
    //                             <TableCell>Model</TableCell>
    //                             <TableCell>Stability</TableCell>
    //                             <TableCell>Edge Hold</TableCell>
    //                             <TableCell>Float</TableCell>
    //                         </TableRow>
    //                     </TableHead>
    //                     <TableBody>
    //                         <TableRow >
    //                             <>
    //                                 <TableCell component="th" scope="row">
    //                                     <Typography variant='body2' color='secondary'>Bent Chetler 100</Typography>
    //                                 </TableCell>
    //                                 <TableCell align="center"><ArrowDropUpIcon color='success' fontSize='small' /></TableCell>
    //                                 <TableCell align="center"><RemoveIcon fontSize='small' /></TableCell>
    //                                 <TableCell align="center"><ArrowDropDownIcon color='error' fontSize='small' /></TableCell>

    //                             </>
    //                         </TableRow>
    //                     </TableBody>
    //                 </Table>
    //             </TableContainer>
    //         </Paper >
    //     )
    // }

    return (
        <>
            <p>this is the ski: {skiId}</p>
        </>
    )

    // return (
    //     <>
    //         <Container>
    //             <Dialog open={deleteAlert} onClose={() => setDeleteAlert(false)}>
    //                 <Alert severity="warning" onClose={() => setDeleteAlert(false)}>
    //                     <AlertTitle>Confirm Delete</AlertTitle>
    //                     Are you sure you wish to delete this ski?
    //                     <Button color="error" variant='contained' size="small" sx={{ marginLeft: 2 }} onClick={deleteSkiConfirm}>
    //                         CONFIRM
    //                     </Button>
    //                 </Alert>
    //             </Dialog>
    //             {isLoading || !ski ?
    //                 <CenterLoader /> :
    //                 <Grid container justifyContent="space-around" spacing={2} rowSpacing={2}>
    //                     <Grid container item justifyContent="center" xs={12}>
    //                         <Stack direction='row' alignItems='center' >
    //                             {isLoadingFav ? <CircularProgress /> :
    //                                 !fullUser?.favorites.find(f => f === ski._id) ? <IconButton onClick={() => { mutateFav({ userId: fullUser?._id ? fullUser._id : "", skiId: ski._id ? ski._id : "", action: 'POST' }) }}><StarIcon fontSize='medium' color='primary' /></IconButton> : <IconButton onClick={() => { mutateFav({ userId: fullUser?._id ? fullUser._id : "", skiId: ski._id ? ski._id : "", action: 'DELETE' }) }}><StarIcon fontSize='medium' color='secondary' /></IconButton>
    //                             }
    //                             <Typography variant="h2">
    //                                 {ski ? formatSkiName(ski) : "Model Name Not Found"}
    //                             </Typography>
    //                             <Stack direction='column'>
    //                                 <Tooltip title="Edit" placement="right">
    //                                     <IconButton color="primary" component={RouterLink} to={`/skis/${skiId}/edit`}
    //                                         sx={
    //                                             {
    //                                                 "&:hover": {
    //                                                     backgroundColor: theme.palette.secondary.light,
    //                                                     color: "white"
    //                                                 }
    //                                             }}>
    //                                         <EditIcon color="inherit" />
    //                                     </IconButton>
    //                                 </Tooltip>
    //                                 <Tooltip title="Delete" placement="right">
    //                                     <IconButton color="error" onClick={() => setDeleteAlert(true)}>
    //                                         <DeleteIcon />
    //                                     </IconButton>
    //                                 </Tooltip>
    //                             </Stack>
    //                         </Stack>
    //                     </Grid>
    //                     <Grid item xs={12}>
    //                         <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 2 }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent={{ xs: 'flex-start', md: 'center' }}>
    //                             <Typography variant="h6" align='left'>
    //                                 <em>Manufaturer:</em> {`${ski.manufacturer.name}`}
    //                             </Typography>
    //                             <Divider orientation="vertical" flexItem />
    //                             <Typography variant="h6" align='left'>
    //                                 <em>Year Released:</em> {`${ski.yearReleased}`}
    //                             </Typography>
    //                             <Divider orientation="vertical" flexItem />
    //                             <Typography variant="h6" align='left'>
    //                                 <em>Available Lengths:</em> {`${ski.lengths.reduce((allLengths: string, length: number) => {
    //                                     return allLengths ? `${allLengths}, ${length.toString()}` : length.toString()
    //                                 }, "")} cm`}
    //                             </Typography>
    //                         </Stack>
    //                     </Grid>
    //                     <Grid item xs={12}>
    //                         <Stack direction='row' spacing={{ xs: 1, md: 2 }} justifyContent='center'>
    //                             {ski.url ?
    //                                 <>
    //                                     <Link color="secondary" underline="hover" variant="inherit" href={ski.url} target="_blank">
    //                                         <Typography variant="h6">
    //                                             Full Review
    //                                         </Typography>
    //                                     </Link>
    //                                 </> : <></>
    //                             }
    //                             {ski.firstLook ?
    //                                 <>
    //                                     {ski.url ? <Divider orientation="vertical" flexItem /> : <></>}
    //                                     <Link color="secondary" underline="hover" variant="inherit" href={ski.firstLook} target="_blank">
    //                                         <Typography variant="h6">
    //                                             First Look
    //                                         </Typography>
    //                                     </Link>
    //                                 </> : <></>
    //                             }
    //                             {ski.flashReview ?
    //                                 <>
    //                                     {ski.url || ski.firstLook ? <Divider orientation="vertical" flexItem /> : <></>}
    //                                     <Link color="secondary" underline="hover" variant="inherit" href={ski.flashReview} target="_blank">
    //                                         <Typography variant="h6">
    //                                             Flash Review
    //                                         </Typography>
    //                                     </Link>
    //                                 </> : <></>
    //                             }
    //                             {ski.deepDive ?
    //                                 <>
    //                                     {ski.url || ski.firstLook || ski.flashReview ? <Divider orientation="vertical" flexItem /> : <></>}
    //                                     <Link color="secondary" underline="hover" variant="inherit" href={ski.deepDive} target="_blank">
    //                                         <Typography variant="h6">
    //                                             Deep Dive
    //                                         </Typography>
    //                                     </Link>
    //                                 </> : <></>
    //                             }
    //                         </Stack>
    //                     </Grid>

    //                     <Grid item xs={12} md={8}>
    //                         {/* <Carousel animation='fade' cycleNavigation autoPlay={false} navButtonsAlwaysInvisible={ski?.specs && ski.specs.length < 2}>
    //                             {
    //                                 ski?.specs.map((spec, i) => <SkiSpecCard key={i} spec={spec} />)
    //                             }
    //                         </Carousel> */}
    //                         <Carousel
    //                             activeIndex={activeIndex}
    //                             next={next}
    //                             previous={previous}
    //                             dark
    //                             interval={0}
    //                         >
    //                             <CarouselIndicators
    //                                 items={ski.specs ? ski.specs : []}
    //                                 activeIndex={activeIndex}
    //                                 onClickHandler={goToIndex}
    //                             />
    //                             {ski?.specs.map((spec, i) => {
    //                                 return (
    //                                     <CarouselItem
    //                                         onExiting={() => setAnimating(true)}
    //                                         onExited={() => setAnimating(false)}
    //                                         key={i}
    //                                     >
    //                                         <SkiSpecCard textVariant='body1' key={i} spec={spec} />
    //                                     </CarouselItem>

    //                                 )
    //                             }
    //                             )}
    //                             <StyledControl
    //                                 sx={{ display: { xs: 'none', sm: ski.specs.length > 1 ? 'flex' : 'none' } }}
    //                                 direction="prev"
    //                                 directionText="Previous"
    //                                 onClickHandler={previous}
    //                             />
    //                             <StyledControl
    //                                 sx={{ display: { xs: 'none', sm: ski.specs.length > 1 ? 'flex' : 'none' } }}
    //                                 direction="next"
    //                                 directionText="Next"
    //                                 onClickHandler={next}
    //                             />
    //                         </Carousel>
    //                     </Grid>
    //                     <Grid item xs={12} md={3}>
    //                         <Stack spacing={2} direction={{ xs: 'row', md: 'column' }}>
    //                             <Grid item xs={4}>
    //                                 <Typography variant='h5' align='left'>
    //                                     Family
    //                                 </Typography>
    //                                 {ski.family ?
    //                                     <Link color="secondary" underline="hover" variant="inherit" target="_blank">
    //                                         <Typography variant="h6" align='left'>
    //                                             {ski.family.name}
    //                                         </Typography>
    //                                     </Link> :
    //                                     <Typography variant="h6" align='left'>
    //                                         {"N/A"}
    //                                     </Typography>
    //                                 }
    //                             </Grid>
    //                             <Grid item xs>
    //                                 <Typography variant='h5' align='left'>
    //                                     Predecessor
    //                                 </Typography>
    //                                 {ski.parent ?
    //                                     <Link color="secondary" underline="hover" variant="inherit" component={RouterLink} to={`/skis/${ski.parent._id}`}>
    //                                         <Typography variant="h6" align='left'>
    //                                             {formatSkiName(ski.parent)}
    //                                         </Typography>
    //                                     </Link> :
    //                                     <Typography variant="h6" align='left'>
    //                                         {"N/A"}
    //                                     </Typography>
    //                                 }
    //                             </Grid>
    //                             {/* <Grid item xs>
    //                                 <Typography variant='h5' align='left'>
    //                                     Successor
    //                                 </Typography>
    //                                 {false ?
    //                                     <Link color="secondary" underline="hover" variant="inherit" target="_blank">
    //                                         <Typography variant="h6" align='left'>
    //                                             {"xxx"}
    //                                         </Typography>
    //                                     </Link> :
    //                                     <Typography variant="h6" align='left'>
    //                                         {"N/A"}
    //                                     </Typography>
    //                                 }
    //                             </Grid> */}
    //                         </Stack>
    //                         <Divider orientation='horizontal' flexItem />
    //                         {/* <Stack spacing={2} direction={{ xs: 'row', md: 'column' }} marginTop={2}>
    //                             <Grid item xs={4} md={12}>
    //                                 <Typography variant='h5' align='left'>
    //                                     Review Templates
    //                                 </Typography>
    //                             </Grid>
    //                             <Grid item xs md>
    //                                 <FormControl fullWidth required>
    //                                     <InputLabel id="template-select-label">Review Type</InputLabel>
    //                                     <Select
    //                                         labelId="template-select"
    //                                         id="template-select"
    //                                         value={template}
    //                                         label="Review Type"
    //                                         onChange={(e) => setTemplate(e.target.value)}
    //                                     >
    //                                         <MenuItem value="full">Full Review</MenuItem>
    //                                         <MenuItem value="first">First Look</MenuItem>
    //                                         <MenuItem value="flash">Flash Review</MenuItem>
    //                                         <MenuItem value="deep">Deep Dive</MenuItem>
    //                                     </Select>
    //                                 </FormControl>
    //                             </Grid>
    //                             <Grid item xs md>
    //                                 <Button onClick={() => { }}
    //                                     color='primary'
    //                                     sx={
    //                                         {
    //                                             "&:hover": {
    //                                                 backgroundColor: theme.palette.secondary.main
    //                                             }
    //                                         }}
    //                                     variant="contained"
    //                                     disabled={!template}
    //                                 >
    //                                     Generate
    //                                 </Button>
    //                             </Grid>
    //                         </Stack> */}
    //                     </Grid>
    //                     <Grid item xs={12} marginTop={4}>
    //                         <Grid container justifyContent="flex-start" spacing={2} rowSpacing={2}>
    //                             <Grid>
    //                                 <Typography variant='h3'>Review Notes</Typography>
    //                             </Grid>
    //                             <Grid item>
    //                                 <Button onClick={newNote}
    //                                     color='primary'
    //                                     sx={
    //                                         {
    //                                             "&:hover": {
    //                                                 backgroundColor: theme.palette.secondary.main
    //                                             }
    //                                         }}
    //                                     disabled={!!ski.notes.find(note => note.user._id === fullUser?._id)}
    //                                     variant="contained"
    //                                     startIcon={<AddIcon />}
    //                                 >
    //                                     New
    //                                 </Button>
    //                             </Grid>
    //                             {ski.notes.length > 0 ?
    //                                 ski.notes.map((note, index) => {
    //                                     return (
    //                                         <Grid key={index} item xs={12}>
    //                                             <NoteComponent index={index} currentUserId={fullUser?._id} saveNote={saveNote} note={note} />
    //                                         </Grid>
    //                                     )
    //                                 }) :
    //                                 <Grid item xs={12}>
    //                                     <Typography textAlign="left" fontStyle="italic">No current notes</Typography>
    //                                 </Grid>
    //                             }
    //                         </Grid>
    //                     </Grid>
    //                     <Grid item xs={12} marginTop={4}>
    //                         <Grid container justifyContent="flex-start" spacing={2} rowSpacing={2}>
    //                             <Grid>
    //                                 <Typography variant='h3'>Comparisons</Typography>
    //                             </Grid>
    //                             <Grid item>
    //                                 <Button onClick={() => setCompModalOpen(true)}
    //                                     color='primary'
    //                                     sx={
    //                                         {
    //                                             "&:hover": {
    //                                                 backgroundColor: theme.palette.secondary.main
    //                                             }
    //                                         }}
    //                                     variant="contained"
    //                                     startIcon={<AddIcon />}
    //                                 >
    //                                     New
    //                                 </Button>
    //                             </Grid>
    //                             <Grid item sx={{ display: { xs: 'none', sm: 'flex'} }}>
    //                                 <CustomWidthTooltip title={<CompExample />} placement="top" >
    //                                     <InfoIcon color="info" />
    //                                 </CustomWidthTooltip>
    //                             </Grid>
    //                             {ski &&
    //                                 <Grid item xs={12}>
    //                                     <ComparisonTable comparisons={ski.skiComps} currSki={ski} modalOpen={compModalOpen} setModalOpen={setCompModalOpen} modalOnClose={onCompModalClose} />
    //                                 </Grid>
    //                             }
    //                         </Grid>
    //                     </Grid>
    //                     <Grid item xs={12} marginTop={4}>
    //                         <Grid container justifyContent="flex-start" spacing={2} rowSpacing={2}>
    //                             <Typography variant='h3'>Buyer's Guide</Typography>
    //                             <Grid item xs={12}>
    //                                 <Guide skiId={skiId} />
    //                             </Grid>
    //                         </Grid>
    //                     </Grid>
    //                 </Grid>
    //             }
    //             {ski &&
    //                 <CreateSkiCompModal currentComps={ski.skiComps} open={compModalOpen} onClose={onCompModalClose} currentSki={ski} />
    //             }
    //         </Container>
    //     </>
    // )
}