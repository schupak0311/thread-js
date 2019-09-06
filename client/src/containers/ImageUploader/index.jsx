import React from 'react';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import { Button, Input, Modal } from 'semantic-ui-react';
import * as imageService from '../../services/imageService';

import styles from './styles.module.scss';

class ImageUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            src: null,
            file: null,
            loading: false,
            crop: {
                unit: 'px',
                width: 200,
                height: 200,
                aspect: 1 / 1
            }
        };
    }

    onSelectFile = (event) => {
        if (event.target.files && event.target.files.length > 0) {

            const reader = new FileReader();
            reader.addEventListener('load', () => this.setState({ src: reader.result }));
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    onImageLoaded = (image) => {
        this.imageRef = image;
    };

    onCropComplete = (crop) => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop) => {
        this.setState({ crop });
    };

    getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            200,
            200
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    return;
                }

                blob.name = fileName;
                this.setState({ file: blob });

                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);
            }, 'image/jpeg');
        });
    }

    handleUpdateImage = async () => {
        this.setState({ loading: true });
        const { id } = await imageService.uploadImage(this.state.file);

        this.props.updateUser({ ...this.props.user, imageId: id });
        this.closeModal();
    };

    closeModal = () => {
        this.props.toggleImageUploader();
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            this.setState({ croppedImageUrl });
        }
    }

    render() {
        const { crop, croppedImageUrl, src, loading } = this.state;

        return (
            <Modal dimmer="blurring" centered={false} open={this.state.open} onClose={this.closeModal}>
                <Modal.Header>Upload new photo</Modal.Header>
                <Modal.Content className={styles.containerCentered}>
                    <Input type="file" onChange={this.onSelectFile} className={styles.fileInput} />
                    {croppedImageUrl && (
                        <Button color="blue" loading={loading} onClick={() => this.handleUpdateImage()}>Update image</Button>
                    )}
                    <Modal.Description>
                        <div className={styles.contentRow}>
                            {src && (
                                <ReactCrop
                                    src={src}
                                    crop={crop}
                                    onImageLoaded={this.onImageLoaded}
                                    onComplete={this.onCropComplete}
                                    onChange={this.onCropChange}
                                />
                            )}
                            {croppedImageUrl && (
                                <div className={styles.preview}>
                                    Preview:
                                    <br />
                                    <img alt="Crop" style={{ maxWidth: '200px' }} src={croppedImageUrl} />
                                </div>
                            )}
                        </div>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

ImageUploader.propTypes = {
    user: PropTypes.objectOf(PropTypes.any).isRequired,
    toggleImageUploader: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired
};

export default ImageUploader;
