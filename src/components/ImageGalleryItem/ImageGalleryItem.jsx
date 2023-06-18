import React from 'react';
import PropTypes from 'prop-types';
import { GalleryItem, GalleryImage } from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({ webformatURl, tags, onClick }) => {
  return (
    <GalleryItem>
      <GalleryImage src={webformatURl} alt={tags} onClick={onClick} />
    </GalleryItem>
  );
};

ImageGalleryItem.propTypes ={
webformatURl: PropTypes.string.isRequired,
tags: PropTypes.string.isRequired,
onClick: PropTypes.func.isRequired
}

