const BASE_URL = `https://pixabay.com/api/`;


function fetchImages (name, page) {
    const params = new URLSearchParams({
        key: `36686955-32d5f33599a736e8573496700`,
        q: name,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page,
    })
   return fetch(`${BASE_URL}?${params}`).then(response =>  response.json())
}

export {fetchImages}