import React, { Component } from 'react'
import NumberFormat from 'react-number-format';

import './CarInfoHeader.css'

export class CarInfoHeader extends Component {
    render() {
        const { make, model, year } = this.props.info
        const price = this.props.price

        return (
            <div className='header'>
                <h3 id='name'>{ year + ' ' + make + ' ' + model }</h3>
                <h3 id='price'>
                    {/* <NumberFormat>1000</NumberFormat> */}
                    <NumberFormat value={ price } prefix={'$'} thousandSeparator={ true } displayType={'text'}/>
                </h3>
            </div>
        )
    }
}

export default CarInfoHeader
