import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const API_KEY = '31467435-54c16c412ae77b93a56496c09';
const URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1) {
  const { data } = await axios.get(URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page,
    },
  });
  if (!data.total)
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  Notify.success(`Hooray! We found ${data.total} images.`);
  return data;
}
