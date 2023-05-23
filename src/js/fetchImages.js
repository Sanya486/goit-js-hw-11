const BASE_URL = `https://pixabay.com/api/`;
const PER_PAGE = 40;

function fetchImages (name, page) {
    const modName = name.split(' ').join('+');
    // дає можливість записувати декілька слів у пошуку
        const params = new URLSearchParams({
        key: `36686955-32d5f33599a736e8573496700`,
        q: modName,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: PER_PAGE,
        page,
    })
   return fetch(`${BASE_URL}?${params}`).then(response => response.json())
}

export {fetchImages, PER_PAGE}