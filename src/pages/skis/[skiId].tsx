import {
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  IconButton,
  Dialog,
  Alert,
  AlertTitle,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { theme } from "../../legacy/Theme";
//import { NoteComponent } from './NoteComponent';
//import { ComparisonTable } from './ComparisonTable';
//import { Guide } from './Guide';
//import { isServiceError } from '../../Services/Utils';
//import { updateSki } from '../../Services/Skis';
// import { CreateSkiCompModal } from './CreateSkiCompModal';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { useRouter } from "next/router";
import { api, RouterOutputs } from "../../utils/api";
import { CenterLoader } from "../../components/CenterLoader";
import { SkiSpecCard } from "../../components/SkiSpecCard";
import Link from "next/link";
import { EllipsisHorizontalIcon, StarIcon } from "@heroicons/react/20/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import "bootstrap/dist/css/bootstrap.min.css";
import { NoteComponent } from "../../components/NoteComponent";
import { useSession } from "next-auth/react";
import { Guide } from "../../components/Guide";

type Skis = RouterOutputs["ski"]["getAll"];
type Ski = Skis[0];
type SkiLength = Ski["lengths"][0];
type Note = NonNullable<RouterOutputs["ski"]["getOne"]>['notes'][0]

const StyledControl = styled(CarouselControl)({});

export default function SkiDetail() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const { skiId } = router.query;

  const { data: ski, ...res } = api.ski.getOne.useQuery({ skiId } as {
    skiId: string | undefined;
  });

  // console.log("ski", ski);

  const utils = api.useContext();

  const { mutate: mutateDelete } = api.ski.delete.useMutation({
    onSuccess: () => {
      router.push(`/skis`);
    },
    onError: (error) => {
      console.error(error);
      alert(`there was an error: ${error.message}`);
    },
    onSettled: () => {
      utils.ski.getAll.invalidate();
    },
  });

  const {
    data: data,
    isLoading: isLoadingFav,
    isRefetching,
  } = api.user.getFavorites.useQuery();
  const favorites = data;

  const { mutate: addFav, isLoading: isLoadingAddFav } =
    api.user.addFavorite.useMutation({
      onError: (err) => {
        alert(`there was an error updating the favorite: ${err}`);
      },
      onSettled: () => {
        utils.user.getFavorites.invalidate();
      },
    });

  const { mutate: deleteFav, isLoading: isLoadingDelFav } =
    api.user.deleteFavorite.useMutation({
      onError: (err) => {
        alert(`there was an error updating the favorite: ${err}`);
      },
      onSettled: () => {
        utils.user.getFavorites.invalidate();
      },
    });

  const [deleteAlert, setDeleteAlert] = useState<boolean>(false);
  const deleteSkiConfirm = () => {
    setDeleteAlert(false);
    if (skiId) {
      mutateDelete({ skiId: skiId as string });
    }
  };

  const { mutate: addNote, isLoading: isLoadingAddNote } =
    api.note.create.useMutation({
      onError: (err) => {
        alert(`there was an error adding the note: ${err}`);
      },
      onSettled: () => {
        utils.ski.getOne.invalidate();
      },
    });

  const { mutate: updateNote, isLoading: isLoadingUpdateNote } =
    api.note.update.useMutation({
      onError: (err) => {
        alert(`there was an error updating the note: ${err}`);
      },
      onSettled: () => {
        utils.ski.getOne.invalidate();
      },
    });

  const saveNote = (note: Note, noteText: string, skiDays: number) => {
    if (ski) {
      const newNote = {
        user: note.userId,
        note: noteText,
        lastUpdated: new Date(Date.now()),
        skiDays: skiDays,
        skiId: note.skiId,
      }
      updateNote({noteId: note.id, note: newNote})
    }
  };

  const newNote = () => {
    if (sessionData?.user && ski) {
      const newNote = {
        user: sessionData.user.id,
        note: "",
        lastUpdated: new Date(Date.now()),
        skiDays: 0,
        skiId: ski.id,
      };
      addNote(newNote);
    }
  };

  const formatSkiName = (
    ski:
      | Ski
      | Omit<
          Ski,
          | "manufacturer"
          | "predecessor"
          | "family"
          | "specs"
          | "lengths"
          | "guideInfo"
          | "notes"
        >
  ) => {
    const prevYear = ski.yearCurrent - 1;
    return `${prevYear - 2000}/${ski.yearCurrent - 2000} ${ski.model}`;
  };

  // const [template, setTemplate] = useState<string>("")

  // const [compModalOpen, setCompModalOpen] = useState<boolean>(false)
  // const onCompModalClose = () => {
  //     setCompModalOpen(false)
  // }

  // console.log(fullUser);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    if (ski?.specs) {
      const nextIndex =
        activeIndex === ski?.specs.length - 1 ? 0 : activeIndex + 1;
      setActiveIndex(nextIndex);
    }
  };

  const previous = () => {
    if (animating) return;
    if (ski?.specs) {
      const nextIndex =
        activeIndex === 0 ? ski?.specs.length - 1 : activeIndex - 1;
      setActiveIndex(nextIndex);
    }
  };

  const goToIndex = (newIndex: React.SetStateAction<number>) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

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

  //   return (
  //     <>
  //       <Container>

  //       </Container>
  //     </>
  //   );

  if (res.isError && res.error instanceof Error) {
    return <span>Error: {res.error.message}</span>;
  }

  return (
    <>
      <Container>
        <Dialog open={deleteAlert} onClose={() => setDeleteAlert(false)}>
          <Alert severity="warning" onClose={() => setDeleteAlert(false)}>
            <AlertTitle>Confirm Delete</AlertTitle>
            Are you sure you wish to delete this ski?
            <Button
              color="error"
              variant="contained"
              size="small"
              sx={{ marginLeft: 2 }}
              onClick={deleteSkiConfirm}
            >
              CONFIRM
            </Button>
          </Alert>
        </Dialog>
        {res.isLoading || !ski ? (
          <CenterLoader />
        ) : (
          <Grid
            container
            justifyContent="space-around"
            spacing={2}
            rowSpacing={2}
          >
            <Grid container item justifyContent="center" xs={12}>
              <Stack direction="row" alignItems="center">
                {isLoadingAddFav ||
                isLoadingDelFav ||
                isLoadingFav ||
                isRefetching ? (
                  <EllipsisHorizontalIcon className="m-2 h-7 w-7 animate-pulse text-gray-500 " />
                ) : !favorites?.find((f) => f.id === ski.id) ? (
                  <StarIconOutline
                    onClick={() => {
                      addFav({
                        skiId: ski.id ? ski.id : "",
                      });
                    }}
                    className="m-2 h-7 w-7 text-gray-500 hover:cursor-pointer"
                  />
                ) : (
                  <StarIcon
                    onClick={() => {
                      deleteFav({
                        skiId: ski.id ? ski.id : "",
                      });
                    }}
                    className="m-2 h-7 w-7 text-yellow-500 hover:cursor-pointer"
                  />
                )}
                <Typography variant="h2" textAlign="center">
                  {ski ? formatSkiName(ski) : "Model Name Not Found"}
                </Typography>
                <Stack direction="column">
                  <Tooltip title="Edit" placement="right">
                    <IconButton
                      color="primary"
                      component={Link}
                      href={`/skis/create/${skiId}`}
                      sx={{
                        "&:hover": {
                          backgroundColor: theme.palette.secondary.light,
                          color: "white",
                        },
                      }}
                    >
                      <EditIcon color="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" placement="right">
                    <IconButton
                      color="error"
                      onClick={() => setDeleteAlert(true)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={{ xs: 1, md: 2 }}
                alignItems={{ xs: "flex-start", md: "center" }}
                justifyContent={{ xs: "flex-start", md: "center" }}
              >
                <Typography variant="h6" align="left">
                  <em>Manufaturer:</em> {`${ski.manufacturer.name}`}
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography variant="h6" align="left">
                  <em>Year Released:</em> {`${ski.yearReleased}`}
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography variant="h6" align="left">
                  <em>Available Lengths:</em>{" "}
                  {`${ski.lengths.reduce(
                    (allLengths: string, length: SkiLength) => {
                      return allLengths
                        ? `${allLengths}, ${length.length.toString()}`
                        : length.length.toString();
                    },
                    ""
                  )} cm`}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack
                direction="row"
                spacing={{ xs: 1, md: 2 }}
                justifyContent="center"
              >
                {ski.fullReview ? (
                  <>
                    <Link
                      href={ski.fullReview}
                      target="_blank"
                      className="text-red-500 no-underline hover:text-red-800  hover:underline "
                    >
                      <Typography variant="h6">Full Review</Typography>
                    </Link>
                  </>
                ) : (
                  <></>
                )}
                {ski.firstLook ? (
                  <>
                    {ski.fullReview ? (
                      <Divider orientation="vertical" flexItem />
                    ) : (
                      <></>
                    )}
                    <Link
                      href={ski.firstLook}
                      target="_blank"
                      className="text-red-500 no-underline hover:text-red-800  hover:underline "
                    >
                      <Typography variant="h6">First Look</Typography>
                    </Link>
                  </>
                ) : (
                  <></>
                )}
                {ski.flashReview ? (
                  <>
                    {ski.fullReview || ski.firstLook ? (
                      <Divider orientation="vertical" flexItem />
                    ) : (
                      <></>
                    )}
                    <Link
                      href={ski.flashReview}
                      target="_blank"
                      className="text-red-500 no-underline hover:text-red-800  hover:underline "
                    >
                      <Typography variant="h6">Flash Review</Typography>
                    </Link>
                  </>
                ) : (
                  <></>
                )}
                {ski.deepDive ? (
                  <>
                    {ski.fullReview || ski.firstLook || ski.flashReview ? (
                      <Divider orientation="vertical" flexItem />
                    ) : (
                      <></>
                    )}
                    <Link
                      href={ski.deepDive}
                      target="_blank"
                      className="text-red-500 no-underline hover:text-red-800  hover:underline "
                    >
                      <Typography variant="h6">Deep Dive</Typography>
                    </Link>
                  </>
                ) : (
                  <></>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} md={8}>
              <Carousel
                activeIndex={activeIndex}
                next={next}
                previous={previous}
                dark
                interval={0}
              >
                <CarouselIndicators
                  items={ski.specs ? ski.specs : []}
                  activeIndex={activeIndex}
                  onClickHandler={goToIndex}
                />
                {ski?.specs
                  .sort((a, b) => b.length - a.length)
                  .map((spec, i) => {
                    return (
                      <CarouselItem
                        onExiting={() => setAnimating(true)}
                        onExited={() => setAnimating(false)}
                        key={i}
                      >
                        <SkiSpecCard textVariant="body1" key={i} spec={spec} />
                      </CarouselItem>
                    );
                  })}
                {ski.specs.length > 1 && (
                  <>
                    <StyledControl
                      sx={{
                        display: {
                          xs: "none",
                          sm: ski.specs.length > 1 ? "flex" : "none",
                        },
                      }}
                      direction="prev"
                      directionText="Previous"
                      onClickHandler={previous}
                    />
                    <StyledControl
                      sx={{
                        display: {
                          xs: "none",
                          sm: ski.specs.length > 1 ? "flex" : "none",
                        },
                      }}
                      direction="next"
                      directionText="Next"
                      onClickHandler={next}
                    />
                  </>
                )}
              </Carousel>
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack spacing={2} direction={{ xs: "row", md: "column" }}>
                <Grid item xs={4}>
                  <Typography variant="h5" align="left">
                    Family
                  </Typography>
                  {ski.family ? (
                    <Link
                      href="#"
                      className="text-red-500 no-underline hover:text-red-800  hover:underline "
                    >
                      <Typography variant="h6" align="left">
                        {ski.family.name}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography variant="h6" align="left">
                      {"N/A"}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs>
                  <Typography variant="h5" align="left">
                    Predecessor
                  </Typography>
                  {ski.predecessor ? (
                    <Link
                      color="secondary"
                      href={`/skis/${ski.predecessor.id}`}
                    >
                      <Typography variant="h6" align="left">
                        {formatSkiName(ski.predecessor)}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography variant="h6" align="left">
                      {"N/A"}
                    </Typography>
                  )}
                </Grid>
                {/* <Grid item xs>
                                  <Typography variant='h5' align='left'>
                                      Successor
                                  </Typography>
                                  {false ?
                                      <Link color="secondary" underline="hover" variant="inherit" target="_blank">
                                          <Typography variant="h6" align='left'>
                                              {"xxx"}
                                          </Typography>
                                      </Link> :
                                      <Typography variant="h6" align='left'>
                                          {"N/A"}
                                      </Typography>
                                  }
                              </Grid> */}
              </Stack>
              <Divider orientation="horizontal" flexItem />
              {/* <Stack spacing={2} direction={{ xs: 'row', md: 'column' }} marginTop={2}>
                              <Grid item xs={4} md={12}>
                                  <Typography variant='h5' align='left'>
                                      Review Templates
                                  </Typography>
                              </Grid>
                              <Grid item xs md>
                                  <FormControl fullWidth required>
                                      <InputLabel id="template-select-label">Review Type</InputLabel>
                                      <Select
                                          labelId="template-select"
                                          id="template-select"
                                          value={template}
                                          label="Review Type"
                                          onChange={(e) => setTemplate(e.target.value)}
                                      >
                                          <MenuItem value="full">Full Review</MenuItem>
                                          <MenuItem value="first">First Look</MenuItem>
                                          <MenuItem value="flash">Flash Review</MenuItem>
                                          <MenuItem value="deep">Deep Dive</MenuItem>
                                      </Select>
                                  </FormControl>
                              </Grid>
                              <Grid item xs md>
                                  <Button onClick={() => { }}
                                      color='primary'
                                      sx={
                                          {
                                              "&:hover": {
                                                  backgroundColor: theme.palette.secondary.main
                                              }
                                          }}
                                      variant="contained"
                                      disabled={!template}
                                  >
                                      Generate
                                  </Button>
                              </Grid>
                          </Stack> */}
            </Grid>
            <Grid item xs={12} marginTop={4}>
              <Grid
                container
                justifyContent="flex-start"
                spacing={2}
                rowSpacing={2}
              >
                <Grid>
                  <Typography variant="h3">Review Notes</Typography>
                </Grid>
                <Grid item>
                  <Button
                    onClick={newNote}
                    color="primary"
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.main,
                      },
                    }}
                    disabled={
                      !!ski.notes.find(
                        (note) => note.user.id === sessionData?.user?.id
                      )
                    }
                    variant="contained"
                    startIcon={<AddIcon />}
                  >
                    New
                  </Button>
                </Grid>
                {ski.notes.length > 0 ? (
                  ski.notes.map((note, index) => {
                    return (
                      <Grid key={index} item xs={12}>
                        <NoteComponent
                          index={index}
                          currentUserId={sessionData?.user?.id}
                          saveNote={saveNote}
                          note={note}
                        />
                      </Grid>
                    );
                  })
                ) : (
                  <Grid item xs={12}>
                    <Typography textAlign="left" fontStyle="italic">
                      No current notes
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
            {/* <Grid item xs={12} marginTop={4}>
              <Grid
                container
                justifyContent="flex-start"
                spacing={2}
                rowSpacing={2}
              >
                <Grid>
                  <Typography variant="h3">Comparisons</Typography>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => setCompModalOpen(true)}
                    color="primary"
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.main,
                      },
                    }}
                    variant="contained"
                    startIcon={<AddIcon />}
                  >
                    New
                  </Button>
                </Grid>
                <Grid item sx={{ display: { xs: "none", sm: "flex" } }}>
                  <CustomWidthTooltip title={<CompExample />} placement="top">
                    <InfoIcon color="info" />
                  </CustomWidthTooltip>
                </Grid>
                {ski && (
                  <Grid item xs={12}>
                    <ComparisonTable
                      comparisons={ski.skiComps}
                      currSki={ski}
                      modalOpen={compModalOpen}
                      setModalOpen={setCompModalOpen}
                      modalOnClose={onCompModalClose}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid> */}
            <Grid item xs={12} marginTop={4}>
              <Grid
                container
                justifyContent="flex-start"
                spacing={2}
                rowSpacing={2}
              >
                <Typography variant="h3">{"Buyer's Guide"}</Typography>
                <Grid item xs={12}>
                  <Guide skiId={skiId as string} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        <div className="m-4"></div>
        {/* {ski && (
          <CreateSkiCompModal
            currentComps={ski.skiComps}
            open={compModalOpen}
            onClose={onCompModalClose}
            currentSki={ski}
          />
        )} */}
      </Container>
    </>
  );
}
