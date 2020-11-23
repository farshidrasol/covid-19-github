import React from 'react'
import './../Styles/Table.css'
import PN from "persian-number";
import numeral from "numeral";

function Table({ countres ,casesType , ...props}) {
   const sendBackData = () => {
        props.onClick("dfgdfg");
   }
    return (
        <div className="table">
            {countres.map(({country ,cases , recovered, deaths},index) => (
                    <tr onClick={sendBackData} >
                        <td style = {{paddingRight:0}}>{PN.convertEnToPe(index + 1)}</td>
                        <td>{country}</td>
                        <td>
                            <strong>{PN.convertEnToPe(numeral( casesType==="cases"?cases: casesType==="recovered"? recovered :deaths).format("0,0"))}</strong>
                        </td>
                    </tr>
                ))
            }
        </div>
    )
}

export default Table
