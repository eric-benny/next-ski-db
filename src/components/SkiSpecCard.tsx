import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { theme } from '../legacy/Theme';
import { SkiSpec } from '@prisma/client';

interface SkiSpecCardProps {
    spec: SkiSpec | undefined
    textVariant: "body1" | "body2"
}

const formatSpec = (spec: string | number | undefined | null, dim = "") => {
    if (spec) {
        const specStr = spec.toString()
        return dim ? `${specStr} ${dim}` : `${specStr}`
    } else {
        return "N/A"
    }
}

export function SkiSpecCard({ spec, textVariant }: SkiSpecCardProps) {

    return (
        <Card variant="outlined" sx={{ 'backgroundColor': theme.palette.background.paper, borderRadius: "10px" }}>
            <Grid container spacing={0} className="BannerGrid" justifyContent="center">
                <CardContent >
                    <Typography variant='h5' gutterBottom align='center'>
                        {spec?.length} cm
                    </Typography>
                    <Typography variant={textVariant} align='left' gutterBottom>
                        <b>Measured Tip-to-Tail Length (straight-tape pull): </b>{formatSpec(spec?.measuredLength, "cm")}
                    </Typography>
                    <Typography variant={textVariant} align='left' gutterBottom>
                        <b>Stated Weight Per Ski: </b>{formatSpec(spec?.weightStated, "grams")}
                    </Typography>
                    <Typography variant={textVariant} align='left' gutterBottom>
                        <b>Measured Weight per Ski: </b>{spec?.weightMeas1} {` & `} {spec?.weightMeas2} grams
                    </Typography>
                    <Typography variant={textVariant} align='left' gutterBottom>
                        <b>Stated Dimensions: </b>{`${spec?.dimTip ? spec.dimTip : "N/A"} - ${spec?.dimWaist ? spec.dimWaist : "N/A"} - ${spec?.dimTail ? spec.dimTail : "N/A"}`} mm
                    </Typography>
                    <Typography variant={textVariant} align='left' gutterBottom>
                        <b>Measured Dimensions: </b>{`${spec?.dimTipMeas ? spec.dimTipMeas : "N/A"} - ${spec?.dimWaistMeas ? spec.dimWaistMeas : "N/A"} - ${spec?.dimTailMeas ? spec.dimTailMeas : "N/A"}`} mm
                    </Typography>
                    <Typography variant={textVariant} align='left' gutterBottom>
                        <b>Stated Sidecut Radius: </b>{formatSpec(spec?.sidcutStated, "meters")}
                    </Typography>
                    <Typography variant={textVariant} align='left' gutterBottom>
                        <b>{`Measured Tip & Tail Splay (ski decambered): `}</b>{spec?.splayTip && spec.splayTail ? `${spec.splayTip} mm / ${spec.splayTail} mm`: "N/A"}
                    </Typography>
                    <Typography variant={textVariant} align='left' gutterBottom>
                        <b>{`Measured Traditional Camber Underfoot: `}</b>{formatSpec(spec?.camberMeas, spec && spec.camberMeas?.includes("mm") ? "": "mm")}
                    </Typography>
                    <Typography variant={textVariant} align='left' gutterBottom>
                        <b>{`Core: `}</b>{formatSpec(spec?.core)}
                    </Typography>
                    <Typography variant={textVariant} align='left' gutterBottom>
                        <b>{`Base: `}</b>{formatSpec(undefined)}
                    </Typography>
                    <Typography variant={textVariant} align='left' gutterBottom>
                        <b>{`Flex: `}</b>
                    </Typography>
                    <Typography variant={textVariant} align='left' sx={{paddingLeft: 2}}>
                        {`Tip: `}{formatSpec(spec?.flexTip)}
                    </Typography>
                    <Typography variant={textVariant} align='left' sx={{paddingLeft: 2}}>
                        {`Shovel: `}{formatSpec(spec?.flexShovel)}
                    </Typography>
                    <Typography variant={textVariant} align='left' sx={{paddingLeft: 2}}>
                        {`Front of Toe Piece: `}{formatSpec(spec?.flexFront)}
                    </Typography>
                    <Typography variant={textVariant} align='left' sx={{paddingLeft: 2}}>
                        {`Underfoot: `}{formatSpec(spec?.flexFoot)}
                    </Typography>
                    <Typography variant={textVariant} align='left' sx={{paddingLeft: 2}}>
                        {`Behind Heel Piece: `}{formatSpec(spec?.flexBack)}
                    </Typography>
                    <Typography variant={textVariant} align='left' sx={{paddingLeft: 2}}>
                        {`Tails: `}{formatSpec(spec?.flexTail)}
                    </Typography>
                </CardContent>

            </Grid>
        </Card>
    );
}
