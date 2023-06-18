import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // https://www.npmjs.com/package/react-toastify
import { Modal } from 'components/Modal/Modal';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { Button } from 'components/Button/Button';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Loader } from '../Loader/Loader';
import { getImage } from '../UI/api';
import { toastConfig } from '../UI/toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppBox, ModalImage } from './App.styled';

export class App extends Component {
  state = {
    largeImageURL: '',
    searchQuery: '',
    page: 1,
    binder: [],
    loading: false,
    totalBinder: 0,
  };

  //задаємо параметри пошуку та номер сторінки
  componentDidUpdate(_, prevState) {
    const { searchQuery, page } = this.state; //дістаємо значення шо зараз є в поточному стані

    if (prevState.searchQuery !== searchQuery || prevState.page !== page) {
      this.setState({ loading: true }); // якщо не дорівнює (змінилось) дозволяємо пошук
      getImage(searchQuery, page) // шукаємо і передаємо нові значення
        .then(({ binder: newBinder, totalBinder }) => {
          if (this.state.searchQuery.trim() === '' || totalBinder === 0) {
            toast.error('Нашкрябай щось путнє 🙄', toastConfig); //перевірка на валідність запиту
            return;
          }
          if (
            (prevState.binder.length === 0 &&
              newBinder.length === totalBinder) ||
            (prevState.binder.length !== 0 && newBinder.length < 12)
          ) {
            toast.info('Все! Мультікі закінчились 😉', toastConfig); // перевірка на наявність нових зображень, якщо прийло менше 12 - фініш
          }
          // Виводимо нові сторінки із зображеннями що у запиті
          this.setState(prevState => ({
            binder: [...prevState.binder, ...newBinder],
            totalBinder,
          }));
        })
        // Ловимо помилку
        .catch(error => {
          console.error(error.response);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  }

  //Підтвердження форми пошуку
  hendleSearchFormSubmit = searchValue => {
    this.setState({
      searchQuery: searchValue,
      page: 1,
      binder: [],
      totalBinder: 0,
    });
  };

  //функція скролу
  handleLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  // метод для відкриття/закриття модального вікна
  toggleModal = (largeImageURL = '') => {
    this.setState({ largeImageURL: largeImageURL });
  };

  render() {
    const { loading, binder, largeImageURL, totalBinder } = this.state;
    const showLoadMoreBtn = !loading && binder.length !== totalBinder;

    return (
      <AppBox>
        <Searchbar onSearchSubmit={this.hendleSearchFormSubmit} />
        {binder.length > 0 && (
          <ImageGallery images={binder} handleImageClick={this.toggleModal} />
        )}
        {showLoadMoreBtn && (
          <Button onClick={this.handleLoadMore} disabled={loading} />
        )}
        {loading && <Loader />}
        {largeImageURL && (
          <Modal onClose={this.toggleModal}>
            <ModalImage src={largeImageURL} />
          </Modal>
        )}
        <ToastContainer />
      </AppBox>
    );
  }
}
