import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Container } from "@mui/system";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import DeleteIcon from "@mui/icons-material/Delete";
import { trpc } from "../../utils/trpc";
import {
  GuideSki,
  Manufacturer,
  Ski,
  SkiLength,
  SkiSpec,
} from "@prisma/client";
import { CenterLoader } from "../../components/CenterLoader";
import Link from "next/link";
import { SkiSpecCard } from "../../components/SkiSpecCard";
import { theme } from "../../legacy/Theme";
import { SkiTable } from "../../components/SkiTable";
import { Skis } from "../../components/SkiTable/SkiTable";
import { AddGuideSkisModal } from "../../components/AddGuideSkisModal";

export const CATEGORIES = [
  { value: "5050", display: "50/50" },
  { value: "BC", display: "Backcountry Touring" },
  { value: "WN", display: "Women's Narrower" },
  { value: "WW", display: "Women's Wider" },
  { value: "FS", display: "Frontside" },
  { value: "AMS", display: "All-Mountain Stable" },
  { value: "AMF", display: "All-Mountain Forgiving" },
  { value: "AMC", display: "All-Mountain Chargers" },
  { value: "AMFS", display: "All-Mountain Freestyle" },
  { value: "PARK", display: "Park" },
  { value: "PD", display: "Powder Directional" },
  { value: "PP", display: "Powder Playful" },
];

export default function Guide() {
  const {
    isLoading,
    isError,
    data: allSkis,
    error,
  } = trpc.ski.getAll.useQuery();

  //const currYear = new Date().getFullYear();
  const [year, setYear] = useState<string>("2023");

  const {
    isLoading: isLoadingGuide,
    isError: isErrorGuide,
    data: guideSkis,
    error: guideError,
  } = trpc.guideSki.getAllByYear.useQuery({ year: year });

  const [availableSkis, setAvailableSkis] = useState(allSkis ? allSkis : []);
  const [availableSkisExpanded, setAvailableSkisExpanded] =
    useState<boolean>(false);

  useEffect(() => {
    if (allSkis) {
      const availSkis = allSkis.filter(
        (ski) => ski.yearCurrent <= parseInt(year)
      );
      setAvailableSkis(availSkis);
    }
  }, [year, allSkis]);

  const [filter, setFilter] = useState<string>("");
  useEffect(() => {
    if (allSkis && allSkis.length > 0) {
      const searchTerms = filter.split(" ");
      const newSkis = allSkis.filter(
        (s) =>
          searchTerms.some(
            (t) => s.model.toLowerCase().indexOf(t.toLowerCase()) > -1
          ) ||
          searchTerms.some(
            (t) =>
              s.manufacturer.name.toLowerCase().indexOf(t.toLowerCase()) > -1
          )
      );
      setAvailableSkis(newSkis);
    }
  }, [filter, allSkis]);

  // const [errorAlert, setErrorAlert] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState<boolean>(false);
  // const [alertContent, setAlertContent] = useState<any>(undefined);
  const [lastUpdatedGuideSki, setLastUpdatedGuideSki] = useState<
    string | undefined
  >(undefined);

  const utils = trpc.useContext();

  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } =
    trpc.guideSki.update.useMutation({
      onSuccess: () => {
        setSuccessAlert(true);
      },
      onError: (error) => {
        console.error(error);
        alert(`there was an error: ${error.message}`);
      },
      onSettled: () => {
        utils.guideSki.getAllByYear.invalidate();
      },
    });

  const { mutate: mutateDelete, isLoading: isLoadingDelete } =
    trpc.guideSki.delete.useMutation({
      onSuccess: () => {
        setSuccessAlert(true);
      },
      onError: (error) => {
        console.error(error);
        alert(`there was an error: ${error.message}`);
      },
      onSettled: () => {
        utils.guideSki.getAllByYear.invalidate();
      },
    });

  interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string;
    categorySkis:
      | (GuideSki & {
          ski: Ski & {
            manufacturer: Manufacturer;
            lengths: SkiLength[];
            specs: SkiSpec[];
          };
        })[]
      | undefined;
  }

  function CategoryPanel(props: TabPanelProps) {
    const { value, index, categorySkis, ...other } = props;

    const [selectedSki, setSelectedSki] = useState(
      categorySkis &&
        lastUpdatedGuideSki &&
        categorySkis.find((gs) => gs.id === lastUpdatedGuideSki)
        ? categorySkis.find((gs) => gs.id === lastUpdatedGuideSki) ||
            categorySkis[0]
        : categorySkis
        ? categorySkis[0]
        : undefined
    );

    // blurb editing
    const [editing, setEditing] = useState<boolean>(false);
    const [blurb, setBlurb] = useState<string>("");
    useEffect(() => {
      if (selectedSki) setBlurb(selectedSki.summary || "");
    }, [selectedSki]);

    const saveBlurb = () => {
      setLastUpdatedGuideSki(selectedSki?.id);

      if (selectedSki)
        mutateUpdate({ guideSkiId: selectedSki.id, summary: blurb });
    };

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index &&
          categorySkis &&
          (categorySkis.length > 0 ? (
            <>
              {isLoadingDelete ? (
                <CenterLoader />
              ) : (
                <Grid
                  container
                  spacing={2}
                  rowSpacing={2}
                  paddingX={{ xs: 0, md: 3 }}
                >
                  <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
                      <Table
                        sx={{ minWidth: 650 }}
                        stickyHeader
                        size="small"
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Model</TableCell>
                            <TableCell>Manufacturer</TableCell>
                            <TableCell>Year Released</TableCell>
                            <TableCell>Available Lengths</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {categorySkis
                            .sort(
                              (a, b) =>
                                (a.ski.specs[0]?.dimWaist
                                  ? a.ski.specs[0].dimWaist
                                  : 100) -
                                (b.ski.specs[0]?.dimWaist
                                  ? b.ski.specs[0].dimWaist
                                  : 100)
                            )
                            .map((guideSki) => (
                              <TableRow
                                key={guideSki.ski.id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                                onClick={() => {
                                  setSelectedSki(guideSki);
                                }}
                                role="checkbox"
                                selected={guideSki.id === selectedSki?.id}
                              >
                                <TableCell component="th" scope="row">
                                  <Typography variant="body2" color="secondary">
                                    {guideSki.ski.model}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {guideSki.ski.manufacturer.name}
                                </TableCell>
                                <TableCell>
                                  {guideSki.ski.yearReleased}
                                </TableCell>
                                <TableCell>
                                  {`${guideSki.ski.lengths?.reduce(
                                    (allLengths: string, length) => {
                                      return allLengths
                                        ? `${allLengths}, ${length.length.toString()}`
                                        : length.length.toString();
                                    },
                                    ""
                                  )}`}
                                </TableCell>
                                <TableCell width={25}>
                                  <IconButton
                                    color="error"
                                    onClick={() => {
                                      mutateDelete({ guideSkiId: guideSki.id });
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item container spacing={2} rowSpacing={2} xs={12}>
                    <Grid item xs={12}>
                      {selectedSki && (
                        <Link
                          href={`/skis/${selectedSki.ski.id}`}
                          className="inline-block text-red-500 no-underline hover:text-red-800  hover:underline"
                        >
                          <Typography variant="h5" color="secondary">
                            {selectedSki.ski.model}
                          </Typography>
                        </Link>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {selectedSki?.ski.specs.find(
                        (spec) => spec.length === selectedSki.specLength
                      ) ? (
                        <SkiSpecCard
                          textVariant="body2"
                          spec={selectedSki.ski.specs.find(
                            (spec) => spec.length === selectedSki.specLength
                          )}
                        ></SkiSpecCard>
                      ) : (
                        <Typography>Spec Does Not Exist for Ski</Typography>
                      )}
                    </Grid>
                    <Grid
                      item
                      container
                      alignContent="flex-start"
                      justifyContent="flex-start"
                      xs={12}
                      md={6}
                    >
                      <Grid item xs={3} sm={2}>
                        <Typography variant="body1" align="left">
                          <b>Summary: </b>
                        </Typography>
                      </Grid>
                      {isLoadingUpdate ? (
                        <CenterLoader />
                      ) : editing ? (
                        <>
                          <Grid item xs={4}>
                            <Grid item>
                              <IconButton
                                color="primary"
                                onClick={() => setEditing(false)}
                                className="pt-0"
                              >
                                <CancelIcon />
                              </IconButton>
                              <IconButton
                                color="primary"
                                onClick={saveBlurb}
                                className="pt-0"
                              >
                                <SaveIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={10} lg={11}>
                            <TextField
                              fullWidth
                              multiline
                              label="Summary"
                              value={blurb}
                              onChange={(e) => setBlurb(e.target.value)}
                            />
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid item xs={2}>
                            <IconButton
                              onClick={() => {
                                setEditing(true);
                              }}
                              className="pt-0"
                            >
                              <EditIcon />
                            </IconButton>
                          </Grid>
                          <Grid item xs={12} sm={10} lg={11}>
                            <Typography
                              variant="body1"
                              fontStyle={
                                selectedSki?.summary ? "normal" : "italic"
                              }
                              align="left"
                              gutterBottom
                            >
                              {selectedSki?.summary
                                ? selectedSki.summary
                                : "Edit to add a summary"}
                            </Typography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Typography>No skis in this category</Typography>
              </Grid>
            </>
          ))}
      </div>
    );
  }

  const [skisToAdd, setSkisToAdd] = useState<Skis>([]);

  // Tab Control
  const [selectedTab, setSelectedTab] = React.useState("5050");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const onAddModalClose = (submission = false) => {
    setAddModalOpen(false);
    if (submission) {
      setSkisToAdd([]);
      setAvailableSkisExpanded(false);
    }
  };

  if (isError && error instanceof Error) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <Container>
        <Grid container item justifyContent="space-between" xs={12}>
          <Grid item xs={4} sm={2}>
            <FormControl fullWidth required>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select"
                id="year-select"
                value={year}
                label="Year"
                onChange={(e) => setYear(e.target.value)}
              >
                <MenuItem value="2021">2021</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h2">Guide</Typography>
          </Grid>
          <Grid item xs={2} />
        </Grid>
        {isLoading ? (
          <CenterLoader />
        ) : (
          <Grid
            container
            justifyContent="space-between"
            spacing={2}
            rowSpacing={2}
          >
            <Grid item xs={12}>
              <Accordion
                expanded={availableSkisExpanded}
                onChange={() =>
                  setAvailableSkisExpanded(!availableSkisExpanded)
                }
                disabled={availableSkis.length < 1}
                sx={{
                  boxShadow: "none",
                  backgroundColor: theme.palette.background.default,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{ flexDirection: "row-reverse" }}
                >
                  <Typography variant="h4">Ski Selection</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container rowSpacing={1}>
                    <Grid item xs={12} container justifyContent="flex-start">
                      <TextField
                        id="filter"
                        label="Quick Filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        type="search"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <SkiTable
                        skis={availableSkis}
                        skisLoading={isLoading}
                        selectedSkis={skisToAdd}
                        setSelectedSkis={setSkisToAdd}
                        height={window.innerHeight / 1.75}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        color="primary"
                        sx={{
                          "&:hover": {
                            backgroundColor: theme.palette.secondary.main,
                            color: "white",
                          },
                        }}
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setAddModalOpen(true);
                        }}
                        disabled={skisToAdd.length < 1}
                      >
                        Add Selected Skis
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={12} marginY={2}>
              <Grid item xs={12} paddingLeft={2}>
                <Typography variant="h4" textAlign="left">
                  Categories
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons
                  aria-label="category tabs"
                  indicatorColor="secondary"
                >
                  {CATEGORIES.map((cat, index) => {
                    return (
                      <Tab
                        key={index}
                        value={cat.value}
                        label={cat.display}
                        id={`tab-${cat.value}`}
                        aria-controls={`tabpanel-${cat.value}}`}
                      />
                    );
                  })}
                </Tabs>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {isLoadingGuide ? (
                <CenterLoader />
              ) : (
                CATEGORIES.map((cat, index) => {
                  return (
                    <CategoryPanel
                      key={index}
                      value={selectedTab}
                      index={cat.value}
                      categorySkis={
                        guideSkis
                          ? guideSkis.filter((gs) => gs.category === cat.value)
                          : []
                      }
                    >
                      {cat.display}
                    </CategoryPanel>
                  );
                })
              )}
            </Grid>
          </Grid>
        )}
      </Container>
      <AddGuideSkisModal
        currentGuideSkis={guideSkis ? guideSkis : []}
        skisToAdd={skisToAdd}
        year={year}
        open={addModalOpen}
        onClose={onAddModalClose}
      />
    </>
  );
}
