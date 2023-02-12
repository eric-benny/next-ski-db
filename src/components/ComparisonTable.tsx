import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton, Typography, Stack, Skeleton } from "@mui/material";
// import { deleteSkiComp, Ski, SkiComp } from '../../Services/Skis';
import { CreateSkiCompModal } from "./CreateSkiCompModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import { Link as RouterLink } from 'react-router-dom';
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { isServiceError } from '../../Services/Utils';
import { api, RouterOutputs } from "../utils/api";
import Link from "next/link";

type Skis = RouterOutputs["ski"]["getAll"];
type Ski = Skis[0];
type SkiComps = RouterOutputs["skiComp"]["getForSki"];
type SkiComp = SkiComps[0];

interface ComparisonProps {
  currSki: Ski;
  modalOpen: boolean;
  setModalOpen: any;
  modalOnClose: any;
}

export function ComparisonTable({
  currSki,
  modalOpen,
  setModalOpen,
  modalOnClose,
}: ComparisonProps) {
  const [editComp, setEditComp] = useState<SkiComp | undefined>(undefined);

  const { data: comparisons, ...res } = api.skiComp.getForSki.useQuery({
    skiId: currSki.id,
  });

  const attrIcon = (value: number) => {
    if (value === 1) {
      return <ArrowDropDownIcon color="error" fontSize="large" />;
    }
    if (value === 0) {
      return <RemoveIcon fontSize="large" />;
    }
    if (value === -1) {
      return <ArrowDropUpIcon color="success" fontSize="large" />;
    }
    return "N/A";
  };

  const properQuantifier = (
    primarySkiId: string,
    secondarySkiId: string,
    quantifier: number
  ) => {
    return currSki.id === primarySkiId ? quantifier : quantifier * -1;
  };

  const getAttrs = () => {
    const allAttrs = comparisons
      ?.map((comp) => comp.comps.map((attrComp) => attrComp.attribute))
      .flat();
    return Array.from(new Set(allAttrs));
  };

  const [compEditModalOpen, setCompEditModalOpen] = useState<boolean>(false);
  const onCompEditModalClose = () => {
    setCompEditModalOpen(false);
  };

  // const queryClient = useQueryClient();
  // const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation(deleteSkiComp, {
  //     onSuccess: data => {
  //         if (isServiceError(data)) {
  //             alert("ski could not be deleted")
  //         } else {
  //         }
  //     },
  //     onError: () => {
  //         alert("there was an error deleting the ski")
  //     },
  //     onSettled: () => {
  //         queryClient.invalidateQueries(['ski']);
  //     }
  // });

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              {getAttrs().map((attr) => {
                return (
                  <TableCell key={attr} variant="head" align="center">
                    {attr}
                  </TableCell>
                );
              })}
              <TableCell align="left">Notes</TableCell>
              <TableCell align="left" width="5px"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* {isLoadingDelete ? ( */}
            {false ? (
              <TableRow>
                {getAttrs().map((a) => (
                  <TableCell key={a}>
                    <Skeleton variant="rectangular" width="100%" />
                  </TableCell>
                ))}
              </TableRow>
            ) : (
              <>
                {comparisons?.map((comp) => (
                  <TableRow
                    key={
                      currSki.id === comp.primarySkiId
                        ? comp.secondarySkiId
                        : comp.primarySkiId
                    }
                  >
                    <>
                      <TableCell component="th" scope="row">
                        <Link
                          href={`/skis/${
                            currSki.id === comp.primarySkiId
                              ? comp.secondarySkiId
                              : comp.primarySkiId
                          }`}
                          target="_blank"
                          className="text-red-500 no-underline hover:text-red-800  hover:underline "
                        >
                          <Typography variant="h6">
                            {currSki.id === comp.primarySkiId
                              ? comp.secondarySki.model
                              : comp.primarySki.model}
                          </Typography>
                        </Link>
                      </TableCell>
                      {getAttrs().map((attr) => {
                        const attrComp = comp.comps.find(
                          (c) => c.attribute === attr
                        );
                        if (attrComp) {
                          return (
                            <TableCell key={attr} align="center">
                              {attrIcon(
                                properQuantifier(
                                  comp.primarySkiId,
                                  comp.secondarySkiId,
                                  attrComp.quantifier
                                )
                              )}
                            </TableCell>
                          );
                        }
                        return (
                          <TableCell key={attr} align="center">
                            N/A
                          </TableCell>
                        );
                      })}
                      <TableCell align="left" width="200px">
                        {/* {comp.notes} */} notes...
                      </TableCell>
                      <TableCell align="left">
                        <Stack direction="row" justifyContent="flex-start">
                          {/* <IconButton
                            onClick={() => {
                              setEditComp(comp);
                              setCompEditModalOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              mutateDelete(comp._id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton> */}
                        </Stack>
                      </TableCell>
                    </>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* {currSki && (
        <CreateSkiCompModal
          currentComps={comparisons}
          open={compEditModalOpen}
          onClose={onCompEditModalClose}
          currentSki={currSki}
          editComp={editComp}
        />
      )} */}
    </>
  );
}
