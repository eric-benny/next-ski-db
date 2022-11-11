import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { TableBody, TableContainer, Box, Dialog, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, Table, TableCell, TableRow, styled, Divider, Link, Stack, Typography, IconButton, Grid } from '@mui/material';
// import { Ski } from '../../Services/Skis';
// import { SkiData } from '../../Services/Skis';
import { theme } from '../../legacy/Theme';
import CloseIcon from '@mui/icons-material/Close';
import { GuideSki, Manufacturer, Ski, SkiFamily, SkiSpec, SkiLength } from '@prisma/client';
type Skis = (Ski & {
    manufacturer: Manufacturer;
    family: SkiFamily | null;
    guideInfo: GuideSki[];
    specs: SkiSpec[];
    lengths: SkiLength[];
})[]

interface ComparisonModalProps {
    skis: Skis
    open: boolean
    onClose: any
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    }
}));


export function ComparisonModal({ skis, open, onClose }: ComparisonModalProps) {

    const handleClose = (event: any = undefined, reason: any = undefined) => {
        // if (reason && reason === "backdropClick")
        //     return;
        onClose()
    }

    const [specMap, setSpecMap] = useState<any>()

    useEffect(() => {
        setSpecMap(new Map(skis.map(ski => {
            return [ski.id, 0]
        })))
    }, [skis])

    const formatSkiName = (ski: Ski) => {
        const prevYear = ski.yearCurrent - 1
        return `${ski.model} ${prevYear - 2000}/${ski.yearCurrent - 2000}`
    }

    const fSpec = (spec: string | undefined | null) => {
        return spec ? spec : "N/A"
    }

    return (
        skis && skis.length > 0 && specMap ?
            <Dialog open={open} onClose={handleClose} maxWidth='xl' fullWidth>
                <Grid container justifyContent="flex-end" margin={0} padding={0}>
                <IconButton aria-label="close" sx={{padding: 1}} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                </Grid>
                <Box sx={{ maxHeight: window.innerHeight }}>
                    <DialogContent sx={{paddingTop: 0}}>
                        <TableContainer sx={{ maxHeight: window.innerHeight / 1.25 }}>
                            <Table stickyHeader size='small' sx={{
                                [theme.breakpoints.up('md')]: {
                                    tableLayout: 'fixed',
                                },
                            }}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell key={99} variant="head" sx={{ zIndex: 99 }}></TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return (
                                                    <TableCell key={index} variant='head'>
                                                        <div>
                                                            <span>{formatSkiName(ski)}</span>
                                                            {ski.specs.length > 1 &&
                                                                <RadioGroup
                                                                    row
                                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                                    name="radio-buttons-group"
                                                                    defaultValue={0}
                                                                    onChange={(e) => { setSpecMap(new Map(specMap.set(ski.id, parseInt(e.target.value)))) }}
                                                                >
                                                                    {ski.specs.map((spec, index) => {
                                                                        return <FormControlLabel key={index} value={index} control={<Radio size="small" />} label={<Typography variant='body2'>{spec.length}</Typography>} />
                                                                    })}
                                                                </RadioGroup>
                                                            }
                                                        </div>
                                                    </TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>
                                    <StyledTableRow>
                                        <TableCell key={99} variant="head">Reviews</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return (
                                                    <TableCell key={index}>
                                                        <Stack direction='row'>
                                                            {ski.fullReview ?
                                                                <>
                                                                    <Link color="secondary" underline="hover" variant="inherit" href={ski.fullReview} target="_blank">
                                                                        <Typography>
                                                                            Full
                                                                        </Typography>
                                                                    </Link>
                                                                </> : <></>
                                                            }
                                                            {ski.firstLook ?
                                                                <>
                                                                    {ski.fullReview ? <Typography sx={{ whiteSpace: 'pre-wrap' }}>, </Typography> : <></>}
                                                                    <Link color="secondary" underline="hover" variant="inherit" href={ski.firstLook} target="_blank">
                                                                        <Typography>
                                                                            First Look
                                                                        </Typography>
                                                                    </Link>
                                                                </> : <></>
                                                            }
                                                            {ski.flashReview ?
                                                                <>
                                                                    {ski.fullReview || ski.firstLook ? <Typography sx={{ whiteSpace: 'pre-wrap' }}>, </Typography> : <></>}
                                                                    <Link color="secondary" underline="hover" variant="inherit" href={ski.flashReview} target="_blank">
                                                                        <Typography>
                                                                            Flash
                                                                        </Typography>
                                                                    </Link>
                                                                </> : <></>
                                                            }
                                                            {ski.deepDive ?
                                                                <>
                                                                    {ski.fullReview || ski.firstLook || ski.flashReview ? <Typography sx={{ whiteSpace: 'pre-wrap' }}>, </Typography> : <></>}
                                                                    <Link color="secondary" underline="hover" variant="inherit" href={ski.deepDive} target="_blank">
                                                                        <Typography>
                                                                            Deep Dive
                                                                        </Typography>
                                                                    </Link>
                                                                </> : <></>
                                                            }
                                                        </Stack>
                                                    </TableCell>)
                                            })
                                        }
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell key={99} variant="head">Manufacturer</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return <TableCell key={index}>{ski.manufacturer.name}</TableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell variant="head">Year Released</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return <TableCell key={index}>{ski.yearReleased}</TableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell key={99} variant="head">Available Lengths</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return <TableCell key={index}>{`${ski.lengths.reduce((allLengths: string, length: SkiLength) => {
                                                    return allLengths ? `${allLengths}, ${length.length.toString()}` : length.length.toString()
                                                }, "")}`}</TableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell key={99} variant="head">Stated Dimensions</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return <TableCell key={index}>{`${ski.specs[specMap.get(ski.id)]?.dimTip}-${ski.specs[specMap.get(ski.id)]?.dimWaist}-${ski.specs[specMap.get(ski.id)]?.dimTail}`}</TableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell key={99} variant="head">Measured Dimensions</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return <TableCell key={index}>{`${ski.specs[specMap.get(ski.id)]?.dimTipMeas}-${ski.specs[specMap.get(ski.id)]?.dimWaistMeas}-${ski.specs[specMap.get(ski.id)]?.dimTailMeas}`}</TableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell key={99} variant="head">Stated Sidecut Radius (m)</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return <TableCell key={index}>{fSpec(`${ski.specs[specMap.get(ski.id)]?.sidcutStated}`)}</TableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell key={99} variant="head">{'Tip & Tail Splay (mm)'}</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return <TableCell key={index}>{ski.specs[specMap.get(ski.id)]?.splayTip && ski.specs[specMap.get(ski.id)]?.splayTail ? `${ski.specs[specMap.get(ski.id)]?.splayTip} / ${ski.specs[specMap.get(ski.id)]?.splayTail}` : "N/A"}</TableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell key={99} variant="head">{'Camber (mm)'}</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return <TableCell key={index}>{fSpec(`${ski.specs[specMap.get(ski.id)]?.camberMeas}`).replace('mm', '')}</TableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell key={99} variant="head">{'Core'}</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return <TableCell key={index}>{fSpec(ski.specs[specMap.get(ski.id)]?.core)}</TableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell key={99} variant="head">{'Base'}</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return <TableCell key={index}>{fSpec(ski.specs[specMap.get(ski.id)]?.base)}</TableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                    <StyledTableRow>
                                        <TableCell key={99} variant="head">{'Flex'}</TableCell>
                                        {
                                            skis.map((ski, index) => {
                                                return <TableCell key={index}>
                                                    <Typography variant='inherit' align='left'>
                                                        {`Tip: `}{fSpec(ski.specs[specMap.get(ski.id)]?.flexTip)}
                                                    </Typography>
                                                    <Typography variant='inherit' align='left'>
                                                        {`Shovel: `}{fSpec(ski.specs[specMap.get(ski.id)]?.flexShovel)}
                                                    </Typography>
                                                    <Typography variant='inherit' align='left'>
                                                        {`Front of Toe Piece: `}{fSpec(ski.specs[specMap.get(ski.id)]?.flexFront)}
                                                    </Typography>
                                                    <Typography variant='inherit' align='left'>
                                                        {`Underfoot: `}{fSpec(ski.specs[specMap.get(ski.id)]?.flexFoot)}
                                                    </Typography>
                                                    <Typography variant='inherit' align='left'>
                                                        {`Behind Heel Piece: `}{fSpec(ski.specs[specMap.get(ski.id)]?.flexBack)}
                                                    </Typography>
                                                    <Typography variant='inherit' align='left'>
                                                        {`Tails: `}{fSpec(ski.specs[specMap.get(ski.id)]?.flexTail)}
                                                    </Typography>
                                                </TableCell>
                                            })
                                        }
                                    </StyledTableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                </Box>
            </Dialog > :
            <></>
    );
}
