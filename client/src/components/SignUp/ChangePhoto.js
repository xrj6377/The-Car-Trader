// Reference: https://ant.design/components/modal/
// https://ant.design/components/avatar/

import React, { Component } from 'react'
import { Modal, Button } from 'antd';

import 'antd/dist/antd.css';
import './ChangePhoto.css'


export class ChangePhoto extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            photos: [props.photo1, props.photo2, props.photo3, props.photo4, props.photo5]
        }
    }

    showModal = () => {
        this.setState({
          isVisible: true
        });
      };
    
    handleOk = () => {
        this.setState({ isVisible: false });
    };
    
    handleCancel = () => {
        this.setState({ isVisible: false });
    };
    
    render() {
        
        const photoMapper = this.state.photos.map((photo, index) => {
            return (
                <img className = 'profilePhoto' key={ index } alt={ index } src = { photo } onClick = { () => this.props.handlePhotoChange(photo)}/>
            )
        })

        return(
            <div>
                <Button type="primary" onClick={this.showModal}>
                    Change Photo
                </Button>
                <Modal title="Choose your profile photo" visible={this.state.isVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    {photoMapper}
                </Modal>
            </div>
        )
    }
}
export default ChangePhoto