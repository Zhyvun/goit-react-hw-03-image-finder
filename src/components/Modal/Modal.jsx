//REPETA Красава https://youtu.be/rKzrg6N8qco?t=1678

import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { ModalBackdrop, ModalContent } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {
  componentDidMount() {
    console.log('Modal componentDidMout');
    window.addEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = 'hidden'; // за замовчуванням вікно сховано
  }

  componentWillUnmount() {
    console.log('Modal componentWillUnmount');
    window.removeEventListener('keydown', this.handleKeyDown);
    document.body.style.overflow = 'auto'; // в принципі пофіг бо ми "підчистили" за собою
  }

  handleKeyDown = event => {
    if (event.code === 'Escape') {
      this.props.onClose();
    }
  };

  handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      this.props.onClose();
      console.log('ky-ky');
    }
  };

  render() {
    return createPortal(
      <ModalBackdrop onClick={this.handleBackdropClick}>
        <ModalContent> {this.props.children}</ModalContent>
      </ModalBackdrop>,
      modalRoot
    );
  }
}
