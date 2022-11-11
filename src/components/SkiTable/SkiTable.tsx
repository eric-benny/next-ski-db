import { Container, Chip, Button, Link, Grid } from "@mui/material"
import { GridRowsProp, GridColDef, GridRenderCellParams, GridSelectionModel, GridRowId, DataGrid, GridRowParams } from "@mui/x-data-grid"
import React, { useEffect, useState } from "react"
// import { Link as RouterLink } from 'react-router-dom';
// import { ComparisonModal } from "../../Pages/Home/ComparisonModal"
import { SkiData } from "../../legacy/Services/Skis"
import { theme } from "../../legacy/Theme"

import { GuideSki, Manufacturer, Ski, SkiFamily, SkiSpec } from '@prisma/client';

// type Skis = RouterOutput['ski']['getAll'];

type Skis = (Ski & {
    manufacturer: Manufacturer;
    family: SkiFamily | null;
    guideInfo: GuideSki[];
    specs: SkiSpec[];
})[]

interface SkiTableProps {
    skis: Skis
    skisLoading: boolean
    height?: string | number
    selectedSkis?: Skis
    setSelectedSkis?: any
    selectionLimit?: number
}

export const SkiTable = ({ skis, skisLoading, height, selectedSkis, setSelectedSkis, selectionLimit }: SkiTableProps) => {

    // MUI data grid
    let rows: GridRowsProp<Ski> = []
    if (skis) {
        rows = skis
    }

    const columns: GridColDef[] = [
        {
            field: 'model', headerName: 'Model', minWidth: 200, align: 'left',
            renderCell: (params: GridRenderCellParams<String>) => (
                // <Link color="secondary" underline="hover" variant="inherit" component={RouterLink} to={`/skis/${params.row._id}`}>{params.value}</Link>
                <p>{params.value}</p>
            )
        },
        {
            field: 'manufacturer', headerName: 'Manufacturer', align: 'left', valueGetter: (params) => {
                return params.row.manufacturer.name
            }
        },
        { field: 'yearCurrent', headerName: 'Current Year', },
        { field: 'yearReleased', headerName: 'Released' },
        {
            field: 'availableLengths', headerName: 'Lengths', minWidth: 150, align: 'left', type: 'string', valueGetter: (params) => {
                return `${params.row.lengths?.reduce((allLengths: string, length: number) => {
                    return allLengths ? `${allLengths}, ${length.toString()}` : length.toString()
                }, "")}`
            }
        },
        {
            field: 'tip', headerName: 'Tip', align: 'left', valueGetter: (params) => {
                return `${params.row.specs[0]?.dimTip}`
            }
        },
        {
            field: 'waist', headerName: 'Waist', align: 'left', valueGetter: (params) => {
                return `${params.row.specs[0]?.dimWaist}`
            }
        },
        {
            field: 'tail', headerName: 'Tail', align: 'left', valueGetter: (params) => {
                return `${params.row.specs[0]?.dimTail}`
            }
        },
    ];

    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

    function selectedSkiChange(newSelectionModel: GridSelectionModel) {
        const compSkis = rows.filter(ski => newSelectionModel.includes(ski.id))
        setSelectedSkis(compSkis)
        setSelectionModel(newSelectionModel);
    }

    useEffect(() => {
        const newSelectionModel = selectedSkis ? selectedSkis.map(s => s.id) : []
        setSelectionModel(newSelectionModel)
    }, [selectedSkis])

    const [tableHeight, setTableHeight] = useState('500px')

    useEffect(() => setTableHeight(`${window.innerHeight / 1.5}px`), [])

    // console.log(tableHeight);
    

    return (
        <>
            <Container>
                    <Grid container justifyContent="space-between" spacing={2} rowSpacing={2}>
                        <Grid item xs={12}>
                            <div style={{ display: 'flex', height: height ? height : tableHeight }}>
                                <div style={{ flexGrow: 1 }}>
                                    <DataGrid
                                        sx={{
                                            "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
                                                display: "none"
                                            }
                                        }}
                                        getRowId={(row) => row.id}
                                        rows={rows}
                                        columns={columns}
                                        checkboxSelection={selectedSkis ? true : false}
                                        isRowSelectable={(params: GridRowParams<Ski>) => selectionModel.includes(params.row.id) || (selectionLimit && selectedSkis ? selectedSkis.length < selectionLimit : true)}
                                        onSelectionModelChange={(newSelectionModel) => {
                                            selectedSkiChange(newSelectionModel)
                                        }}
                                        selectionModel={selectionModel}
                                        loading={skisLoading}
                                        disableSelectionOnClick
                                        getRowHeight={() => 'auto'}
                                    />
                                </div>
                            </div>
                        </Grid>
                    </Grid>
            </Container>
        </>
    )

}