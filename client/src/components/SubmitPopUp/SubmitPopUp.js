import React, { Component } from "react";
import './SubmitPopUp.css';


export class SubmitPopUp extends Component {

    handleClick = () => {
        this.props.toggle();
    };

    render() {
        return (
            <div className="modal_wrapper">
                <div className="modal_content">
                    <a href='/'>
                        <span className="close" onClick={this.handleClick}> x </span>
                    </a>
                    <p className='text'> Your listing has been successfully submitted! </p>
                    <p className='text'> Please note that your postings will be reviewed by an admin before publishing. </p>
                    <p className='text'> It may take up to three business days for processing. </p>
                </div>
            </div>
        );
    }
}

export default SubmitPopUp