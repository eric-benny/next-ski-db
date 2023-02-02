import React, { useEffect, useState } from 'react';
import { FormControlLabel, Grid, Radio, RadioGroup, Stack, Tab, Tabs, Typography } from '@mui/material';
import { CATEGORIES } from '../pages/guide';
import { CenterLoader } from './CenterLoader';
import { api, RouterOutputs } from '../utils/api';

type GuideSki = RouterOutputs["guideSki"]["getBySki"][0];

interface GuideProps {
    skiId: string
}

interface TabPanelProps {
    guideSkis: GuideSki[];
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { guideSkis, value, index, ...other } = props;

    const [selectedCategory, setSelectedCategory] = useState<string>(guideSkis[0]?.category || "")
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Grid container margin={2}>
                    <Grid item xs={12}>
                        <Stack direction='row' spacing={2}>
                            <Typography variant='body1' align='left' gutterBottom>
                                <b>Category: </b>
                            </Typography>
                            {guideSkis.length > 1 ?
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="radio-buttons-group"
                                    defaultValue={guideSkis[0]?.category}
                                    onChange={(e) => { setSelectedCategory(e.target.value) }}
                                >
                                    {guideSkis.map((gs, index) => {
                                        return <FormControlLabel key={index} value={gs.category} control={<Radio size="small" />} label={CATEGORIES.find(cat => cat.value === gs.category)?.display} />
                                    })}
                                </RadioGroup> :
                                <Typography>{CATEGORIES.find(cat => cat.value === guideSkis[0]?.category)?.display}</Typography>
                            }
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid item xs={12} sm={2} lg={1}>
                            <Typography variant='body1' align='left' gutterBottom>
                                <b>Summary: </b>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={10} lg={11}>
                            <Typography variant='body1' align='left' gutterBottom>
                                {guideSkis.find(gs => gs.category === selectedCategory)?.summary}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </div>
    );
}


export function Guide({ skiId }: GuideProps) {

    const { data: guideSkis, isLoading } =  api.guideSki.getBySki.useQuery({skiId: skiId});

    const [gsByYear, setGsByYear] = useState<Map<number, GuideSki[]>>(new Map());
    useEffect(() => {
        if (guideSkis && guideSkis[0]) {
            setValue(guideSkis[0].year)
            const newGsByYear = new Map()
            for (let i = 0; i < guideSkis.length; i++) {
                const curYearSkis = newGsByYear.get(guideSkis[i]?.year)
                if (curYearSkis) {
                    newGsByYear.set(guideSkis[i]?.year, [...curYearSkis, guideSkis[i]])
                } else {
                    newGsByYear.set(guideSkis[i]?.year, [guideSkis[i]])
                }
            }
            setGsByYear(newGsByYear)
        }
    }, [guideSkis])

    const [value, setValue] = useState<number>(guideSkis && guideSkis[0] ? guideSkis[0].year : 0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    
    return (
        <Grid container >
            {isLoading ? <CenterLoader /> :
                gsByYear && Array.from(gsByYear.keys()).length > 0 ?
                    <>
                        <Grid item xs={12}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" indicatorColor="secondary">
                                {Array.from(gsByYear).map(([year, gs]) => {
                                    return <Tab key={year} label={year} value={year} />
                                })}
                            </Tabs>
                        </Grid>
                        {Array.from(gsByYear).map(([year, gs]) => {
                            return <TabPanel key={year} value={value} index={year} guideSkis={gs} />
                        })}
                    </> :
                    <Typography fontStyle='italic'>No guide summaries</Typography>
            }
        </Grid>

    );
}
