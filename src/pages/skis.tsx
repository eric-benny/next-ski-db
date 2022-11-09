import React, { useEffect, useState } from 'react';
import { Button, Container, FormControl, Grid, TextField } from '@mui/material';
import { SkiData, useSkisFull } from '../legacy/Services/Skis';
// import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { theme } from '../legacy/Theme';
import { SkiTableCompare } from '../components/SkiTable/SkiTableCompare';
import { trpc } from '../utils/trpc';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { AppRouter } from '../server/trpc/router/_app';
import { GuideSki, Manufacturer, Ski, SkiFamily, SkiSpec } from '@prisma/client';

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;
 
// type Skis = RouterOutput['ski']['getAll'];

type Skis = (Ski & {
    manufacturer: Manufacturer;
    family: SkiFamily | null;
    guideInfo: GuideSki[];
    specs: SkiSpec[];
})[]


export default function Skis() {

    const data = trpc.ski.getAll.useQuery()

    // const { isLoading, isError, data, error } = useSkisFull()

    const [skis, setSkis] = useState<Skis>([])
    useEffect(() => {
        if (data.data && data.data.length > 0) {
            setSkis(data.data)
        }
    }, [data])


    const [filter, setFilter] = useState<string>("")
    useEffect(() => {
        if (skis && skis.length > 0) {
            const searchTerms = filter.split(" ");
            const newSkis = skis.filter(s => searchTerms.some(t => s.model.toLowerCase().indexOf(t.toLowerCase()) > -1) || searchTerms.some(t => s.manufacturer.name.toLowerCase().indexOf(t.toLowerCase()) > -1))
            setSkis(newSkis)
        }
    }, [filter, skis])


    if (data.isError && data.error instanceof Error) {
        return <span>Error: {data.error.message}</span>
    }

    return (
        <>
            <Container>
                <Grid container justifyContent="space-between" spacing={2} rowSpacing={2}>
                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={2} md={1} marginRight={2}>
                                {/* <Button component={RouterLink} to={'/skis/create'} color='primary' sx={
                                    {
                                        "&:hover": {
                                            backgroundColor: theme.palette.secondary.main,
                                            color: "white"
                                        }
                                    }}
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                >
                                    Ski
                                </Button> */}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <FormControl fullWidth>
                            <TextField
                                id="filter"
                                label="Quick Filter"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                        </FormControl>
                    </Grid>
                    <SkiTableCompare skis={skis} skisLoading={data.isLoading} />
                </Grid>

                <Button onClick={() => {}}> button mui</Button>
                <button onClick={() => {}}>button html</button>
            </Container>
        </>
    )
}
