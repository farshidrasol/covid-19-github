import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import PN from "persian-number";
import numeral from "numeral";
import './../Styles/infobox.css'

function Infobox({title,active,isRed, cases, total, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infbox ${active && "infbox--selected"} ${isRed && "infbox--red"}`}>
            <CardContent>
                 <Typography color="textSecondary" className="infobox__title">
                    {title}
                </Typography>
                <h2 className={`infobox__cases ${!isRed && "infbox__cases--green"}`}>{cases}</h2>
                <Typography color="textSecondary" className="infobox__total">
                جمع کل {PN.convertEnToPe(numeral(total).format("0,0"))}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Infobox
