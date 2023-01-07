import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import {
  GuideSki,
  Manufacturer,
  Ski,
  SkiLength,
  SkiSpec,
} from "@prisma/client";
import { trpc } from "../utils/trpc";
import { CenterLoader } from "./CenterLoader";
import { CATEGORIES } from "../pages/guide";
import { FullSKi, Skis } from "./SkiTable/SkiTable";
import { theme } from "../legacy/Theme";

interface AddGuideSkisModalProps {
  currentGuideSkis: (GuideSki & {
    ski: Ski & {
      manufacturer: Manufacturer;
      lengths: SkiLength[];
      specs: SkiSpec[];
    };
  })[];
  skisToAdd: Skis;
  year: string;
  open: boolean;
  onClose: any;
}

export function AddGuideSkisModal({
  currentGuideSkis,
  skisToAdd,
  open,
  onClose,
  year,
}: AddGuideSkisModalProps) {
  const [guideSkis, setGuideSkis] = useState<GuideSki[]>([]);
  const [specMap, setSpecMap] = useState<any>();

  useEffect(() => {
    setSpecMap(
      new Map(
        skisToAdd.map((ski) => {
          return [ski.id, 0];
        })
      )
    );
  }, [skisToAdd]);

  const [errorAlert, setErrorAlert] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState<boolean>(false);
  const [alertContent, setAlertContent] = useState<string>("");

  const utils = trpc.useContext();

  const { mutate: mutateCreate, isLoading: isLoadingCreate } =
    trpc.guideSki.create.useMutation({
      onSuccess: () => {
        setSuccessAlert(true);
        handleClose(undefined, undefined, true);
      },
      onError: (error) => {
        console.error(error);
        alert(`there was an error: ${error.message}`);
      },
      onSettled: () => {
        utils.guideSki.getAll.invalidate();
        utils.guideSki.getAllByYear.invalidate();
      },
    });

  //   const queryClient = useQueryClient();
  //   const { mutate: mutateCreate, isLoading: isLoadingCreate } = useMutation(
  //     postGuideSki,
  //     {
  //       onSuccess: (data) => {
  //         if (isServiceError(data)) {
  //           setErrorAlert(true);
  //           setAlertContent(data.description);
  //         } else {
  //           setSuccessAlert(true);
  //           handleClose(undefined, undefined, true);
  //         }
  //       },
  //       onError: () => {
  //         // alert("there was an error")
  //       },
  //       onSettled: () => {
  //         queryClient.invalidateQueries(["guideSkis"]);
  //       },
  //     }
  //   );

  const submitGuideSkis = () => {
    if (guideSkis && guideSkis.length > 0) {
      for (const guideSki of guideSkis) {
        mutateCreate({
          year: guideSki.year,
          ski: guideSki.skiId,
          category: guideSki.category,
          specLength: guideSki.specLength,
        });
      }
    }
  };

  const handleClose = (
    event: any = undefined,
    reason: any = undefined,
    onSubmission: any = false
  ) => {
    if (reason && reason === "backdropClick") return;
    setGuideSkis([]);
    onClose(onSubmission);
  };

  const formatSkiName = (ski: Ski) => {
    const prevYear = ski.yearCurrent - 1;
    return `${ski.model} ${prevYear - 2000}/${ski.yearCurrent - 2000}`;
  };

  const addGuideSki = (
    specLength: string | undefined,
    category: string,
    ski: Ski
  ) => {
    if (specLength) {
      setGuideSkis([
        ...guideSkis,
        {
          id: "",
          skiId: ski.id,
          specLength: parseInt(specLength),
          category: category,
          year: parseInt(year),
          summary: "",
        },
      ]);
    }
  };

  const removeGuideSki = (
    specLength: string | undefined,
    category: string,
    ski: Ski
  ) => {
    if (specLength) {
      setGuideSkis(
        guideSkis.filter(
          (gs) =>
            gs.skiId !== ski.id ||
            (gs.category !== category &&
              gs.specLength !== parseInt(specLength)) ||
            gs.category !== category
        )
      );
    }
  };

  const catDisabled = (
    cat: string,
    ski: Ski,
    specLength: number | undefined
  ) => {
    return currentGuideSkis.some(
      (gs) =>
        gs.skiId === ski.id &&
        gs.category === cat &&
        gs.specLength === specLength
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Box padding={2}>
        <DialogTitle>{`Add Skis to Guide`}</DialogTitle>
        {isLoadingCreate ? (
          <CenterLoader />
        ) : (
          <>
            <DialogContent>
              <Grid container>
                {skisToAdd.map((ski: FullSKi, index: number) => {
                  return (
                    <Grid key={index} item container xs={12}>
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          {formatSkiName(ski)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="overline">Spec Length</Typography>
                        <RadioGroup
                          row
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                          defaultValue={0}
                          onChange={(e) => {
                            setSpecMap(
                              new Map(
                                specMap.set(ski.id, parseInt(e.target.value))
                              )
                            );
                          }}
                        >
                          {ski.specs.map((spec, index) => {
                            return (
                              <FormControlLabel
                                key={index}
                                value={index}
                                control={
                                  <Radio
                                    disabled={guideSkis.some(
                                      (gs) => gs.skiId === ski.id
                                    )}
                                    size="small"
                                  />
                                }
                                label={spec.length}
                              />
                            );
                          })}
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="overline">Categories</Typography>
                        <FormGroup aria-label="position" row>
                          {CATEGORIES.map((cat, index) => {
                            return (
                              <FormControlLabel
                                sx={{ margin: 1 }}
                                key={index}
                                control={<Checkbox size="small" />}
                                label={cat.value}
                                labelPlacement="top"
                                disabled={catDisabled(
                                  cat.value,
                                  ski,
                                  ski.specs[specMap.get(ski.id)]?.length
                                )}
                                onChange={(event, checked) => {
                                  if (checked) {
                                    addGuideSki(
                                      ski.specs[
                                        specMap.get(ski.id)
                                      ]?.length.toString(),
                                      cat.value,
                                      ski
                                    );
                                  } else {
                                    removeGuideSki(
                                      ski.specs[
                                        specMap.get(ski.id)
                                      ]?.length.toString(),
                                      cat.value,
                                      ski
                                    );
                                  }
                                }}
                              />
                            );
                          })}
                        </FormGroup>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </DialogContent>
            <DialogContent>
              <Grid
                container
                direction="row"
                justifyContent="center"
                spacing={2}
                rowSpacing={2}
              >
                <Grid item>
                  <Button
                    onClick={submitGuideSkis}
                    color="primary"
                    sx={{
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.main,
                      },
                    }}
                    variant="contained"
                    disabled={false}
                  >
                    {"Submit"}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleClose}
                    color="error"
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
            {errorAlert ? (
              <DialogContent>
                <Grid item margin={1}>
                  <Typography color="error">{alertContent}</Typography>
                </Grid>
              </DialogContent>
            ) : (
              <></>
            )}
          </>
        )}
      </Box>
    </Dialog>
  );
}
