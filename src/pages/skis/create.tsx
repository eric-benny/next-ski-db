import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  InputLabel,
  InputAdornment,
  Stack,
  Tooltip,
  IconButton,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  AlertTitle,
  Dialog,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
// import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   fetchSki,
//   fetchSkisFull,
//   postSki,
//   SkiLegacy,
//   SkiSpec,
//   updateSki,
// } from "../../Services/Skis";
// import { fetchManufacturers } from "../../Services/Manufacturers";
// import { isServiceError } from "../../Services/Utils";
// import { fetchSkiFamilies } from "../../Services/SkiFamilies";
import AddIcon from "@mui/icons-material/Add";
// import { CreateManufacturerModal } from "./CreateManufacturerModal";
// import { postManufacturer } from "../../Services/Manufacturers/Manufacturers";
// import { postFamily } from "../../Services/SkiFamilies/SkiFamilies";
// import { CreateFamilyModal } from "./CreateFamilyModal";
// import { CenterLoader } from "../../Components/CenterLoader";
import { theme } from "../../legacy/Theme";
import { useRouter } from "next/router";
import { CenterLoader } from "../../components/CenterLoader";
import { CreateManufacturerModal } from "../../components/CreateManufacturerModal";
import { CreateFamilyModal } from "../../components/CreateFamilyModal";
import { trpc } from "../../utils/trpc";
import { SkiLegacy, SkiSpec } from "../../legacy/Services/Skis";
import { Ski } from "@prisma/client";

const validYears = Array.from(Array(10).keys()).map(
  (i) => new Date().getFullYear() + 1 - i
);

export default function CreateSki() {
  const router = useRouter();

  const { skiId = "" }  = router.query;

  const {
    isLoading: isLoadingMan,
    isError: isErrorMan,
    data: dataMan,
    error: errorMan,
  } = trpc.manufacturer.getAll.useQuery();
  const {
    isLoading: isLoadingFam,
    isError: isErrorFam,
    data: dataFam,
    error: errorFam,
  } = trpc.skiFamily.getAll.useQuery();
  const { data: dataEdit, isLoading: isLoadingEdit } = trpc.ski.getOne.useQuery(
    { skiId } as {
      skiId: string | undefined;
    },
    { enabled: !!skiId }
  );

  const { data: skis } = trpc.ski.getAll.useQuery();

  const [errorAlert, setErrorAlert] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState<boolean>(false);
  const [alertContent, setAlertContent] = useState<any>(undefined);

  const utils = trpc.useContext();

  const { mutate: mutateCreate, isLoading: isLoadingCreate } =
    trpc.ski.create.useMutation({
      onSuccess: (data) => {
        setAlertContent(data);
        setSuccessAlert(true);
        clear();
      },
      onError: (error) => {
        console.error(error)
        alert(`there was an error: ${error.message}`);
      },
      onSettled: () => {
        utils.ski.getAll.invalidate();
      },
    });

  //   const { mutate: mutateCreate, isLoading: isLoadingCreate } = useMutation(
  //     postSki,
  //     {
  //       onSuccess: (data) => {
  //         setAlertContent(data);
  //         if (isServiceError(data)) {
  //           setErrorAlert(true);
  //         } else {
  //           setSuccessAlert(true);
  //           clear();
  //         }
  //       },
  //       onError: () => {
  //         alert("there was an error");
  //       },
  //       onSettled: () => {
  //         queryClient.invalidateQueries(["skis"]);
  //       },
  //     }
  //   );

  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } =
    trpc.ski.update.useMutation({
      onSuccess: (data) => {
        setAlertContent(data);
        setSuccessAlert(true);
        clear();
        router.push(`/skis/${skiId}`)
      },
      onError: (error) => {
        console.error(error)
        alert(`there was an error: ${error.message}`);
      },
      onSettled: () => {
        utils.ski.getAll.invalidate();
      },
    });

//   const { mutate: mutateUpdate, isLoading: isLoadingUpdate } = useMutation(
//     updateSki,
//     {
//       onSuccess: (data) => {
//         setAlertContent(data);
//         if (isServiceError(data)) {
//           setErrorAlert(true);
//         } else {
//           setSuccessAlert(true);
//           clear();
//           navigate(`/skis/${skiId}`);
//         }
//       },
//       onError: () => {
//         alert("there was an error");
//       },
//       onSettled: () => {
//         queryClient.invalidateQueries([]);
//       },
//     }
//   );

//   const [manResponse, setManResponse] = useState<any>(undefined);
//   const { mutate: mutateMan, isLoading: isLoadingCreateMan } = useMutation(
//     postManufacturer,
//     {
//       onSuccess: (data) => {
//         if (isServiceError(data)) {
//           setManResponse(data);
//         } else {
//           setManModalOpen(false);
//           setManufacturer(data._id);
//           setManResponse(undefined);
//         }
//       },
//       onError: () => {
//         alert("there was an error");
//       },
//       onSettled: () => {
//         queryClient.invalidateQueries(["manufacturers"]);
//       },
//     }
//   );

//   const [famResponse, setFamResponse] = useState<any>(undefined);
//   const { mutate: mutateFam, isLoading: isLoadingCreateFam } = useMutation(
//     postFamily,
//     {
//       onSuccess: (data) => {
//         if (isServiceError(data)) {
//           setFamResponse(data);
//         } else {
//           setFamModalOpen(false);
//           if (data.manufacturer._id === manufacturer) {
//             setSkiFamily(data._id);
//           }
//           setFamResponse(undefined);
//         }
//       },
//       onError: () => {
//         alert("there was an error");
//       },
//       onSettled: () => {
//         queryClient.invalidateQueries(["skiFamilies"]);
//       },
//     }
//   );

  const createSki = () => {
    const newSpecs: SkiSpec[] = specs
      .filter((spec) => spec.active)
      .map((spec) => {
        return {
          length: spec.length,
          measuredLength: spec.measuredLength
            ? parseInt(spec.measuredLength)
            : 0,
          weightStated: spec.weightStated
            ? parseInt(spec.weightStated)
            : undefined,
          weightMeas: spec.weightMeas.map((w) => {
            if (w) {
              return parseInt(w);
            } else {
              return 0;
            }
          }),
          dimTip: spec.dimTip ? parseFloat(spec.dimTip) : 0,
          dimWaist: spec.dimWaist ? parseFloat(spec.dimWaist) : 0,
          dimTail: spec.dimTail ? parseFloat(spec.dimTail) : 0,
          dimTipMeas: spec.dimTipMeas ? parseFloat(spec.dimTipMeas) : 0,
          dimWaistMeas: spec.dimWaistMeas ? parseFloat(spec.dimWaistMeas) : 0,
          dimTailMeas: spec.dimTailMeas ? parseFloat(spec.dimTailMeas) : 0,
          sidcutStated: spec.sidcutStated
            ? parseFloat(spec.sidcutStated)
            : undefined,
          splayTip: spec.splayTip ? parseInt(spec.splayTip) : undefined,
          splayTail: spec.splayTail ? parseInt(spec.splayTail) : undefined,
          camberStated: spec.camberStated,
          camberMeas: spec.camberMeas,
          core: spec.core,
          base: spec.base,
          mountPointFac: spec.mountPointFac,
          mountPointBlist: spec.mountPointBlist,
          flexTip: spec.flexTip,
          flexShovel: spec.flexShovel,
          flexFront: spec.flexFront,
          flexFoot: spec.flexFoot,
          flexBack: spec.flexBack,
          flexTail: spec.flexTail,
        };
      });
    const newSki = {
      yearCurrent: yearCurrent ? yearCurrent : new Date().getFullYear(),
      yearReleased: yearReleased ? yearReleased : new Date().getFullYear(),
      yearsActive:
        yearCurrent && yearReleased
          ? validYears.filter(
              (year) => year >= yearReleased && year <= yearCurrent
            )
          : [],
      retired: false,
      parent: parent?.id,
      family: skiFamily ? skiFamily : undefined,
      manufacturer: manufacturer,
      model: model,
      lengths: availableLengths,
      specs: newSpecs,
      url: fullReviewUrl,
      flashReview: flashReviewUrl,
      firstLook: firstLookUrl,
      deepDive: deepDiveUrl,
    };
    if (skiId) {
      mutateUpdate({ skiId: skiId as string, ski: newSki });
    } else {
      mutateCreate(newSki);
    }
  };

  // Top level parameters
  const [model, setModel] = useState<string>("");
  const [manufacturer, setManufacturer] = useState<string>("");
  const [skiFamily, setSkiFamily] = useState<string | undefined>("");
  const [parent, setParent] = useState<Ski | null>(null);
  const [parentOptions, setParentOptions] = useState<Ski[]>([]);
  const [yearCurrent, setYearCurrent] = useState<number | undefined>(
    Math.max(...validYears)
  );
  const [validYearsCurrent, setValidYearsCurrent] =
    useState<number[]>(validYears);
  const [yearReleased, setYearReleased] = useState<number | undefined>();
  const [validYearsRelease, setValidYearsRelease] =
    useState<number[]>(validYears);
  useEffect(() => {
    setValidYearsCurrent(
      validYears.filter((year) => (yearReleased ? year >= yearReleased : true))
    );
    setValidYearsRelease(
      validYears.filter((year) => (yearCurrent ? year <= yearCurrent : true))
    );
  }, [yearCurrent, yearReleased]);
  const [fullReviewUrl, setFullReviewUrl] = useState<string>("");
  const [flashReviewUrl, setFlashReviewUrl] = useState<string>("");
  const [firstLookUrl, setFirstLookUrl] = useState<string>("");
  const [deepDiveUrl, setDeepDiveUrl] = useState<string>("");
  const [availableLengthInput, setAvailableLengthInput] = useState<string>("");
  const [availableLengths, setAvailableLengths] = useState<number[]>([]);
  const addAvailableLength = () => {
    if (availableLengthInput) {
      setAvailableLengths([
        ...availableLengths,
        parseFloat(availableLengthInput),
      ]);
      setAvailableLengthInput("");
      addSpec(parseFloat(availableLengthInput));
    }
  };

  useEffect(() => {
    if (
      !isLoadingMan &&
      dataMan &&
      !isLoadingFam &&
      dataFam &&
      skiFamily &&
      manufacturer
    ) {
      if (
        !dataFam.find(
          (f) => f.id === skiFamily && f.manufacturer.id === manufacturer
        )
      ) {
        setSkiFamily("");
      }
    }
  }, [dataFam, dataMan, isLoadingFam, isLoadingMan, manufacturer, skiFamily]);

  useEffect(() => {
    if (skis) {
      setParentOptions([
        ...skis.filter((s) => {
          return (
            (skiId ? s.id !== skiId : true) &&
            (manufacturer && s.manufacturer
              ? manufacturer === s.manufacturer.id
              : true)
          );
        }),
      ]);
    }
  }, [skis, manufacturer, skiId]);

  // Specs
  const [specs, setSpecs] = useState<SkiSpecEdit[]>([]);

  const addSpec = (length: number) => {
    setSpecs([
      ...specs,
      {
        active: false,
        length: length,
        measuredLength: undefined,
        weightStated: undefined,
        weightMeas: ["", ""],
        dimTip: undefined,
        dimWaist: undefined,
        dimTail: undefined,
        dimTipMeas: undefined,
        dimWaistMeas: undefined,
        dimTailMeas: undefined,
        sidcutStated: undefined,
        splayTip: undefined,
        splayTail: undefined,
        camberStated: undefined,
        camberMeas: undefined,
        core: undefined,
        base: undefined,
        mountPointFac: [],
        mountPointBlist: [],
        flexTip: undefined,
        flexShovel: undefined,
        flexFront: undefined,
        flexFoot: undefined,
        flexBack: undefined,
        flexTail: undefined,
      },
    ]);
  };

  const onSpecChange = (index: number, key: string, value: any) => {
    const specsCopy = [...specs];
    specsCopy[index] = { ...specsCopy[index], [key]: value } as SkiSpecEdit;
    setSpecs(specsCopy);
  };

  // validate inputs
  const [validInputs, setValidInputs] = useState<boolean>(false);
  useEffect(() => {
    const validateSpecs = (s: SkiSpecEdit[]) => {
      if (s.length > 0) {
        for (let i = 0; i < s.length; i++) {
          if (
            s[i]?.active &&
            (!s[i]?.length ||
              !s[i]?.measuredLength ||
              !s[i]?.weightMeas ||
              !s[i]?.dimTip ||
              !s[i]?.dimWaist ||
              !s[i]?.dimTail ||
              !s[i]?.dimTipMeas ||
              !s[i]?.dimWaistMeas ||
              !s[i]?.dimTailMeas)
          ) {
            return false;
          }
        }
      }
      return true;
    };

    if (
      !model ||
      !manufacturer ||
      !yearCurrent ||
      !yearReleased ||
      availableLengths.length < 1 ||
      specs.length < 1 ||
      !validateSpecs(specs)
    ) {
      setValidInputs(false);
    } else {
      setValidInputs(true);
    }
  }, [model, manufacturer, yearCurrent, yearReleased, availableLengths, specs]);

  // clear form
  const clear = () => {
    setModel("");
    setManufacturer("");
    setSkiFamily(undefined);
    setYearCurrent(undefined);
    setYearReleased(undefined);
    setFullReviewUrl("");
    setFirstLookUrl("");
    setFlashReviewUrl("");
    setDeepDiveUrl("");
    setAvailableLengthInput("");
    setAvailableLengths([]);
    setSpecs([]);
  };

  useEffect(() => {
    if (skiId && dataEdit && !isLoadingEdit) {
      setModel(dataEdit.model);
      setManufacturer(dataEdit.manufacturer ? dataEdit.manufacturer.id : "");
      setSkiFamily(dataEdit.family ? dataEdit.family.id : "");
      setYearCurrent(dataEdit.yearCurrent);
      setYearReleased(dataEdit.yearReleased);
      setFullReviewUrl(dataEdit.fullReview || "");
      setFirstLookUrl(dataEdit.firstLook || "");
      setFlashReviewUrl(dataEdit.flashReview || "");
      setDeepDiveUrl(dataEdit.deepDive || "");
      setAvailableLengths(dataEdit.lengths.map(l => l.length));
      const editSpecs = dataEdit.specs.map((spec) => ({
        active: true,
        length: spec.length,
        measuredLength: spec.measuredLength?.toString(),
        weightStated: spec.weightStated?.toString(),
        weightMeas: spec.weightMeas1 && spec.weightMeas2 ? [spec.weightMeas1?.toString(), spec.weightMeas2?.toString()] : ["", ""],
        dimTip: spec.dimTip?.toString(),
        dimWaist: spec.dimWaist?.toString(),
        dimTail: spec.dimTail?.toString(),
        dimTipMeas: spec.dimTipMeas?.toString(),
        dimWaistMeas: spec.dimWaistMeas?.toString(),
        dimTailMeas: spec.dimTailMeas?.toString(),
        sidcutStated: spec.sidcutStated?.toString(),
        splayTip: spec.splayTip?.toString(),
        splayTail: spec.splayTail?.toString(),
        camberStated: spec.camberStated?.toString(),
        camberMeas: spec.camberMeas?.toString(),
        core: spec.core || undefined,
        base: spec.base || undefined,
        mountPointFac: spec.mountPointFac.map(m => m.description),
        mountPointBlist: spec.mountPointBlist.map(m => m.description),
        flexTip: spec.flexTip || undefined,
        flexShovel: spec.flexShovel || undefined,
        flexFront: spec.flexFront || undefined,
        flexFoot: spec.flexFoot || undefined,
        flexBack: spec.flexBack || undefined,
        flexTail: spec.flexTail || undefined,
      }));

      setSpecs([
        ...editSpecs,
        ...dataEdit.lengths
          .filter((l) => !dataEdit.specs.find((spec) => spec.length === l.length))
          .map((l) => {
            return {
              active: false,
              length: l.length,
              measuredLength: undefined,
              weightStated: undefined,
              weightMeas: ["", ""],
              dimTip: undefined,
              dimWaist: undefined,
              dimTail: undefined,
              dimTipMeas: undefined,
              dimWaistMeas: undefined,
              dimTailMeas: undefined,
              sidcutStated: undefined,
              splayTip: undefined,
              splayTail: undefined,
              camberStated: undefined,
              camberMeas: undefined,
              core: undefined,
              base: undefined,
              mountPointFac: [],
              mountPointBlist: [],
              flexTip: undefined,
              flexShovel: undefined,
              flexFront: undefined,
              flexFoot: undefined,
              flexBack: undefined,
              flexTail: undefined,
            };
          }),
      ]);
    }
  }, [skiId, dataEdit, isLoadingEdit]);

  interface SkiSpecEdit {
    active: boolean
    length: number
    measuredLength: string | undefined
    weightStated: string | undefined
    weightMeas: Array<string>
    dimTip: string | undefined
    dimWaist: string | undefined
    dimTail: string | undefined
    dimTipMeas: string | undefined
    dimWaistMeas: string | undefined
    dimTailMeas: string | undefined
    sidcutStated: string | undefined
    splayTip: string | undefined
    splayTail: string | undefined
    camberStated: string | undefined
    camberMeas: string | undefined
    core: string | undefined
    base: string | undefined
    mountPointFac: Array<string>
    mountPointBlist: Array<string>
    flexTip: string | undefined
    flexShovel: string | undefined
    flexFront: string | undefined
    flexFoot: string | undefined
    flexBack: string | undefined
    flexTail: string | undefined
  }

  // Error Checks
  const validSkiDimension = (dim: string) => {
    if (dim) {
      const dimNum = parseFloat(dim);
      return dimNum > 40 && dimNum < 300;
    }
    return true;
  };

  const [manModalOpen, setManModalOpen] = useState<boolean>(false);

  const onManModalClose = () => {
    setManModalOpen(false);
  };

  const [famModalOpen, setFamModalOpen] = useState<boolean>(false);

  const onFamModalClose = () => {
    setFamModalOpen(false);
  };

  const formatSkiName = (ski: SkiLegacy | Ski) => {
    const prevYear = ski.yearCurrent - 1;
    return `${ski.model} ${prevYear - 2000}/${ski.yearCurrent - 2000}`;
  };

  const lengthInvalid = (length: string) => {
    return (
      !length ||
      !(length.match(/[0-9]{3}/g) || length.match(/[0-9]{3}\.{1}[0-9]{2}/g)) ||
      (length.length !== 3 && length.length !== 5 && length.length !== 6) ||
      parseFloat(length) > 300 ||
      availableLengths.includes(parseFloat(length))
    );
  };

  return (
    <>
      <Container>
        <Dialog open={errorAlert} onClose={() => setErrorAlert(false)}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {JSON.stringify(alertContent)}
          </Alert>
        </Dialog>
        <Dialog open={successAlert} onClose={() => setSuccessAlert(false)}>
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            View New Ski
            {alertContent && alertContent._id && (
              <Button
                onClick={() => router.push(`/skis/${alertContent._id}`)}
                color="primary"
              >
                Go!
              </Button>
            )}
          </Alert>
        </Dialog>
        <Grid
          container
          justifyContent="space-between"
          spacing={2}
          rowSpacing={2}
        >
          <Grid item xs={12}>
            <Typography variant="h2">
              {skiId ? "Edit Ski" : "Create New Ski"}
            </Typography>
          </Grid>
          {isLoadingCreate || isLoadingUpdate ? (
            <CenterLoader />
          ) : (
            <>
              <Grid item xs={12}>
                <Typography variant="h4" align="left">
                  Ski Info:
                </Typography>
              </Grid>
              {/* Model */}
              <Grid item xs={12} sm={6} lg={3}>
                <FormControl fullWidth>
                  <TextField
                    required
                    id="model"
                    label="Model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </FormControl>
              </Grid>
              {/* Manufacturer */}
              <Grid item xs={12} sm={6} lg={3}>
                <Grid container justifyContent="center" spacing={1}>
                  <Grid item xs={8}>
                    <FormControl fullWidth required>
                      <InputLabel id="manufacturer-select-label">
                        Manufacturer
                      </InputLabel>
                      <Select
                        labelId="manufacturer-select-label"
                        id="manufacturer-select"
                        value={
                          dataMan &&
                          !!dataMan.find((m) => m.id === manufacturer)
                            ? manufacturer
                            : ""
                        }
                        label="Manufacturer"
                        onChange={(e) => setManufacturer(e.target.value)}
                      >
                        {!isLoadingMan &&
                          dataMan?.map((manufacturer) => {
                            return (
                              <MenuItem
                                key={manufacturer.id}
                                value={manufacturer.id}
                              >
                                {manufacturer.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} alignSelf="center">
                    <Button
                      onClick={() => setManModalOpen(true)}
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
                </Grid>
              </Grid>
              {/* Family */}
              <Grid item xs={12} sm={6} lg={3}>
                <Grid container justifyContent="center" spacing={1}>
                  <Grid item xs={8}>
                    <FormControl fullWidth>
                      <InputLabel id="family-select-label">Family</InputLabel>
                      <Select
                        labelId="family-select-label"
                        id="family-select"
                        value={
                          dataFam &&
                          !!dataFam.find(
                            (f) =>
                              f.id === skiFamily &&
                              (manufacturer
                                ? f.manufacturer.id === manufacturer
                                : true)
                          )
                            ? skiFamily
                            : ""
                        }
                        label="Ski Family"
                        onChange={(e) => setSkiFamily(e.target.value)}
                      >
                        <MenuItem value={""}>
                          <em>None</em>
                        </MenuItem>
                        {!isLoadingFam &&
                          dataFam
                            ?.filter((fam) =>
                              manufacturer
                                ? manufacturer === fam.manufacturer.id
                                : true
                            )
                            .map((family) => {
                              return (
                                <MenuItem key={family.id} value={family.id}>
                                  {family.name}
                                </MenuItem>
                              );
                            })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} alignSelf="center">
                    <Button
                      onClick={() => setFamModalOpen(true)}
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
                </Grid>
              </Grid>
              {/* Parent */}
              <Grid item xs={12} sm={6} lg={3}>
                <FormControl fullWidth>
                  <Autocomplete
                    value={parent}
                    onChange={(event: any, newValue: Ski | null) => {
                      setParent(newValue);
                    }}
                    id="controllable-states-demo"
                    getOptionLabel={(option) => formatSkiName(option)}
                    options={parentOptions}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Parent" />
                    )}
                  />
                </FormControl>
              </Grid>
              {/* Year Current */}
              <Grid item xs={12} sm={6} lg={3}>
                <FormControl fullWidth required>
                  <InputLabel id="year-current-select-label">
                    Current Year
                  </InputLabel>
                  <Select
                    labelId="year-current-select-label"
                    id="year-current-select"
                    value={yearCurrent ? yearCurrent : ""}
                    label="Current Year"
                    onChange={(e) => setYearCurrent(e.target.value as number)}
                  >
                    {validYearsCurrent.map((year) => {
                      return (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {/* Year Released */}
              <Grid item xs={12} sm={6} lg={3}>
                <FormControl fullWidth required>
                  <InputLabel id="year-released-select-label">
                    Released Year
                  </InputLabel>
                  <Select
                    labelId="year-released-select-label"
                    id="year-released-select"
                    value={yearReleased ? yearReleased : ""}
                    label="Released Year"
                    onChange={(e) => setYearReleased(e.target.value as number)}
                  >
                    {validYearsRelease.map((year) => {
                      return (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {/* Available Lengths */}
              <Grid item xs={12} sm={6} lg={6}>
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <FormControl fullWidth required>
                      <TextField
                        id="availableLength"
                        label="Length"
                        value={availableLengthInput}
                        type="number"
                        onChange={(e) =>
                          setAvailableLengthInput(e.target.value)
                        }
                        onKeyPress={(ev) => {
                          if (ev.key === "Enter") {
                            if (!lengthInvalid(availableLengthInput)) {
                              addAvailableLength();
                            }
                            ev.preventDefault();
                          }
                        }}
                        helperText={
                          <Typography component={"span"}>
                            {`Available Lengths: ${availableLengths.reduce(
                              (allLengths: string, length: number) => {
                                return allLengths
                                  ? `${allLengths}, ${length.toString()}`
                                  : length.toString();
                              },
                              ""
                            )}`}
                          </Typography>
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">cm</InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <Stack alignItems="center">
                      <Tooltip title="Add Length" placement="top">
                        <span>
                          <IconButton
                            color="primary"
                            onClick={addAvailableLength}
                            disabled={lengthInvalid(availableLengthInput)}
                          >
                            <AddIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Button
                        onClick={() => {
                          setAvailableLengths([]);
                          setSpecs([]);
                        }}
                        color="primary"
                        disabled={availableLengths.length < 1}
                      >
                        Clear
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              {/* Reviews */}
              <Grid item xs={12}>
                <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
                  <InputLabel>Reviews</InputLabel>
                  <Tooltip
                    title={fullReviewUrl}
                    disableHoverListener={!fullReviewUrl}
                  >
                    <FormControl>
                      <TextField
                        id="fullReview"
                        label="Full Review"
                        type="url"
                        value={fullReviewUrl}
                        onChange={(e) => setFullReviewUrl(e.target.value)}
                      />
                    </FormControl>
                  </Tooltip>
                  <Tooltip
                    title={firstLookUrl}
                    disableHoverListener={!firstLookUrl}
                  >
                    <FormControl>
                      <TextField
                        id="firstLook"
                        label="First Look"
                        type="url"
                        value={firstLookUrl}
                        onChange={(e) => setFirstLookUrl(e.target.value)}
                      />
                    </FormControl>
                  </Tooltip>
                  <Tooltip
                    title={flashReviewUrl}
                    disableHoverListener={!flashReviewUrl}
                  >
                    <FormControl>
                      <TextField
                        id="flash"
                        label="Flash Review"
                        type="url"
                        value={flashReviewUrl}
                        onChange={(e) => setFlashReviewUrl(e.target.value)}
                      />
                    </FormControl>
                  </Tooltip>
                  <Tooltip
                    title={deepDiveUrl}
                    disableHoverListener={!deepDiveUrl}
                  >
                    <FormControl>
                      <TextField
                        id="deep"
                        label="Deep Dive"
                        type="url"
                        value={deepDiveUrl}
                        onChange={(e) => setDeepDiveUrl(e.target.value)}
                      />
                    </FormControl>
                  </Tooltip>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" align="left">
                  Ski Specs:
                </Typography>
                <Grid item xs={12}>
                  {availableLengths.length < 1 ? (
                    <Typography align="center">
                      <em>
                        Add an available length to create a spec (*required)
                      </em>
                    </Typography>
                  ) : (
                    <Typography align="center">
                      <em>Select available lengths to define specs</em>
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {specs
                    .sort((a, b) => a.length - b.length)
                    .map((spec, index) => {
                      return (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              checked={spec.active}
                              onChange={() =>
                                onSpecChange(index, "active", !spec.active)
                              }
                            />
                          }
                          label={`${spec.length} CM`}
                        />
                      );
                    })}
                </Grid>
              </Grid>
              {/* <Container> */}
              <Grid
                container
                justifyContent="flex-start"
                spacing={2}
                rowSpacing={2}
                margin={2}
              >
                {/* <Grid item xs={12}> */}
                {specs.map((spec, index) => {
                  if (spec.active) {
                    return (
                      <div key={index}>
                        <Grid
                          container
                          justifyContent="flex-start"
                          spacing={2}
                          margin={2}
                          paddingRight={2}
                        >
                          <Divider style={{ width: "100%" }} />
                          <Grid item xs={12}>
                            <Typography
                              variant="h4"
                              color="secondary"
                              align="left"
                            >{`${spec.length} CM`}</Typography>
                          </Grid>
                          {/* Measured Length */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <FormControl fullWidth>
                              <TextField
                                required
                                id="measuredLength"
                                label="Measured Length"
                                type="number"
                                value={
                                  spec.measuredLength ? spec.measuredLength : ""
                                }
                                onChange={(e) =>
                                  onSpecChange(
                                    index,
                                    "measuredLength",
                                    e.target.value
                                  )
                                }
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      cm
                                    </InputAdornment>
                                  ),
                                }}
                                margin="dense"
                              />
                            </FormControl>
                          </Grid>
                          {/* Stated Sidecut */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <FormControl fullWidth>
                              <TextField
                                id="sidcutStated"
                                label="Stated Sidecut"
                                type="number"
                                value={
                                  spec.sidcutStated ? spec.sidcutStated : ""
                                }
                                onChange={(e) =>
                                  onSpecChange(
                                    index,
                                    "sidcutStated",
                                    e.target.value
                                  )
                                }
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      m
                                    </InputAdornment>
                                  ),
                                }}
                                margin="dense"
                              />
                            </FormControl>
                          </Grid>
                          {/* Core */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <FormControl fullWidth>
                              <TextField
                                id="core"
                                label="Core"
                                value={spec.core ? spec.core : ""}
                                onChange={(e) =>
                                  onSpecChange(index, "core", e.target.value)
                                }
                                margin="dense"
                              />
                            </FormControl>
                          </Grid>
                          {/* Base */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <FormControl fullWidth>
                              <TextField
                                id="base"
                                label="Base"
                                value={spec.base ? spec.base : ""}
                                onChange={(e) =>
                                  onSpecChange(index, "base", e.target.value)
                                }
                                margin="dense"
                              />
                            </FormControl>
                          </Grid>
                          {/* Weight */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <Stack>
                              <InputLabel>Weight</InputLabel>
                              <FormControl>
                                <TextField
                                  id="weightStated"
                                  label="Stated Weight"
                                  type="number"
                                  value={
                                    spec.weightStated ? spec.weightStated : ""
                                  }
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "weightStated",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        g
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                              <FormControl>
                                <TextField
                                  required
                                  id="weightMeas1"
                                  label="Measured 1"
                                  type="number"
                                  value={
                                    spec.weightMeas &&
                                    spec.weightMeas.length > 0
                                      ? spec.weightMeas[0]
                                      : ""
                                  }
                                  onChange={(e) =>
                                    onSpecChange(index, "weightMeas", [
                                      e.target.value,
                                      spec.weightMeas &&
                                      spec.weightMeas.length > 1
                                        ? spec.weightMeas[1]
                                        : "",
                                    ])
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        g
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                              <FormControl>
                                <TextField
                                  required
                                  id="weightMeas2"
                                  label="Measured 2"
                                  type="number"
                                  value={
                                    spec.weightMeas &&
                                    spec.weightMeas.length > 1
                                      ? spec.weightMeas[1]
                                      : ""
                                  }
                                  onChange={(e) =>
                                    onSpecChange(index, "weightMeas", [
                                      spec.weightMeas &&
                                      spec.weightMeas.length > 0
                                        ? spec.weightMeas[0]
                                        : "",
                                      e.target.value,
                                    ])
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        g
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          {/* Stated Dim */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <Stack>
                              <InputLabel>Dimensions</InputLabel>
                              <FormControl>
                                <TextField
                                  required
                                  id="dimTip"
                                  label="Tip"
                                  type="number"
                                  value={spec.dimTip ? spec.dimTip : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "dimTip",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        mm
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                              <FormControl>
                                <TextField
                                  required
                                  id="dimWaist"
                                  label="Waist"
                                  type="number"
                                  value={spec.dimWaist ? spec.dimWaist : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "dimWaist",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        mm
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                              <FormControl>
                                <TextField
                                  required
                                  id="dimTail"
                                  label="Tail"
                                  type="number"
                                  value={spec.dimTail ? spec.dimTail : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "dimTail",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        mm
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          {/* Measured Dim */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <Stack>
                              <InputLabel>Dimensions (Measured)</InputLabel>
                              <FormControl>
                                <TextField
                                  required
                                  id="dimTipMeas"
                                  label="Tip"
                                  type="number"
                                  value={spec.dimTipMeas ? spec.dimTipMeas : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "dimTipMeas",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        mm
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                              <FormControl>
                                <TextField
                                  required
                                  id="dimWaistMeas"
                                  label="Waist"
                                  type="number"
                                  value={
                                    spec.dimWaistMeas ? spec.dimWaistMeas : ""
                                  }
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "dimWaistMeas",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        mm
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                              <FormControl>
                                <TextField
                                  required
                                  id="dimTailMeas"
                                  label="Tail"
                                  type="number"
                                  value={
                                    spec.dimTailMeas ? spec.dimTailMeas : ""
                                  }
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "dimTailMeas",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        mm
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          {/* Camber */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <Stack>
                              <InputLabel>Camber</InputLabel>
                              <FormControl>
                                <TextField
                                  id="camberStated"
                                  label="Stated"
                                  value={
                                    spec.camberStated ? spec.camberStated : ""
                                  }
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "camberStated",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        mm
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                              <FormControl>
                                <TextField
                                  id="camberMeas"
                                  label="Measured"
                                  value={spec.camberMeas ? spec.camberMeas : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "camberMeas",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        mm
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                          {/* Splay */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <Stack>
                              <InputLabel>Splay</InputLabel>
                              <FormControl>
                                <TextField
                                  id="splayTip"
                                  label="Tip"
                                  type="number"
                                  value={spec.splayTip ? spec.splayTip : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "splayTip",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        mm
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                              <FormControl>
                                <TextField
                                  id="splayTail"
                                  label="Tail"
                                  type="number"
                                  value={spec.splayTail ? spec.splayTail : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "splayTail",
                                      e.target.value
                                    )
                                  }
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        mm
                                      </InputAdornment>
                                    ),
                                  }}
                                  size="small"
                                  variant="standard"
                                />
                              </FormControl>
                            </Stack>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          justifyContent="flex-start"
                          spacing={2}
                          marginTop={2}
                        >
                          {/* Flex */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <Grid container spacing={1}>
                              <Grid item xs={12}>
                                <InputLabel>Flex</InputLabel>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id="flexTip"
                                  label="Tip"
                                  value={spec.flexTip ? spec.flexTip : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "flexTip",
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id="flexShovel"
                                  label="Shovel"
                                  value={spec.flexShovel ? spec.flexShovel : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "flexShovel",
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id="flexFront"
                                  label="Front of Binding"
                                  value={spec.flexFront ? spec.flexFront : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "flexFront",
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id="flexFoot"
                                  label="Underfoot"
                                  value={spec.flexFoot ? spec.flexFoot : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "flexFoot",
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id="flexBack"
                                  label="Behind Binding"
                                  value={spec.flexBack ? spec.flexBack : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "flexBack",
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id="flexTail"
                                  label="Tail"
                                  value={spec.flexTail ? spec.flexTail : ""}
                                  onChange={(e) =>
                                    onSpecChange(
                                      index,
                                      "flexTail",
                                      e.target.value
                                    )
                                  }
                                  size="small"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          {/* Mount Point Factory */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <FormControl fullWidth>
                              <TextField
                                id="mountPointFac"
                                label="Factory Mount Points"
                                multiline
                                rows={4}
                                placeholder="List Mount Points"
                                value={
                                  spec.mountPointFac
                                    ? spec.mountPointFac.reduce(
                                        (text, mp, currentIndex) => {
                                          if (
                                            spec.mountPointFac &&
                                            currentIndex ===
                                              spec.mountPointFac.length - 1
                                          ) {
                                            return text.concat(`${mp}`);
                                          } else {
                                            return text.concat(`${mp}\n`);
                                          }
                                        },
                                        ""
                                      )
                                    : ""
                                }
                                onChange={(e) =>
                                  onSpecChange(
                                    index,
                                    "mountPointFac",
                                    e.target.value
                                      ? e.target.value.split("\n")
                                      : ""
                                  )
                                }
                                margin="dense"
                                helperText="Enter each mount point on a new line"
                              />
                            </FormControl>
                          </Grid>
                          {/* Mount Point Blister */}
                          <Grid item xs={12} sm={6} lg={4}>
                            <FormControl fullWidth>
                              <TextField
                                id="mountPointFac"
                                label="Blister Mount Points"
                                multiline
                                rows={4}
                                placeholder="List Mount Points"
                                value={
                                  spec.mountPointBlist
                                    ? spec.mountPointBlist.reduce(
                                        (text, mp, currentIndex) => {
                                          if (
                                            spec.mountPointBlist &&
                                            currentIndex ===
                                              spec.mountPointBlist.length - 1
                                          ) {
                                            return text.concat(`${mp}`);
                                          } else {
                                            return text.concat(`${mp}\n`);
                                          }
                                        },
                                        ""
                                      )
                                    : ""
                                }
                                onChange={(e) =>
                                  onSpecChange(
                                    index,
                                    "mountPointBlist",
                                    e.target.value
                                      ? e.target.value.split("\n")
                                      : ""
                                  )
                                }
                                margin="dense"
                                helperText="Enter each mount point on a new line"
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </div>
                    );
                  } else {
                    return <div key={index}></div>;
                  }
                })}
              </Grid>
              {/* </Container> */}
              {/* Submission Buttons */}
              <Grid item xs={12} justifyContent="center">
                <Grid
                  container
                  justifyContent="center"
                  spacing={2}
                  marginBottom={2}
                >
                  <Grid item>
                    <Button
                      onClick={createSki}
                      color="primary"
                      sx={{
                        "&:hover": {
                          backgroundColor: theme.palette.secondary.main,
                        },
                      }}
                      variant="contained"
                      disabled={!validInputs}
                    >
                      {skiId ? "Update" : "Create"}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => router.push(skiId ? `/skis/${skiId}` : "/skis")}
                    >
                      Cancel
                    </Button>
                  </Grid>
                  {!skiId && (
                    <Grid item>
                      <Button
                        onClick={clear}
                        color="warning"
                        variant="contained"
                      >
                        Reset
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography align="center">
                  <em>* = required</em>
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
        {/* <CreateManufacturerModal
          currentManufacturers={dataMan ? dataMan : []}
          onCreate={mutateMan}
          open={manModalOpen}
          createLoading={isLoadingCreateMan}
          responseContent={manResponse}
          onClose={onManModalClose}
        /> */}
        {/* <CreateFamilyModal
          currentFamilies={dataFam ? dataFam : []}
          onCreate={mutateFam}
          open={famModalOpen}
          createLoading={isLoadingCreateFam}
          responseContent={famResponse}
          onClose={onFamModalClose}
          manufacturers={dataMan ? dataMan : []}
          currentManufacturer={manufacturer}
        /> */}
      </Container>
    </>
  );
}
