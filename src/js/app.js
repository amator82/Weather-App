import API_KEY from './apikey.js'

const link = `http://api.weatherstack.com/current?access_key=${API_KEY}`

const root = document.getElementById('root')
const popup = document.getElementById('popup')
const popupClose = document.getElementById('close')
const textInput = document.getElementById('text-input')
const form = document.getElementById('form')

let store = {
    city: ' Alaska',
    feelsLike: 0,
    temperature: 0,
    observationTime: '00:00 AM',
    isDay: 'yes',
    weatherDescriptions: '',
    properties: {
        windSpeed: {},
        humidity: {},
        visibility: {},
        cloudCover: {},
        pressure: {},
        uvIndex: {}
    }
}

const fetchData = async () => {
    try {
        const query = localStorage.getItem('query') || store.city
        
        const result = await fetch(`${link}&query=${query}`)
        const data = await result.json()

        const {
            current: {
                feelslike: feelsLike,
                cloudcover: cloudCover,
                temperature,
                humidity,
                observation_time: observationTime,
                pressure,
                visibility,
                uv_index: uvIndex,
                is_day: isDay,
                weather_descriptions: weatherDescriptions,
                wind_speed: windSpeed
            },
            location: { name }
        } = data

        store = {
            ...store,
            feelsLike,
            temperature,
            observationTime,
            isDay,
            city: name,
            weatherDescriptions: weatherDescriptions[0],
            properties: {
                windSpeed: {
                    title: 'windSpeed',
                    value: `${windSpeed}km/h`,
                    icon: 'wind.png'
                },
                humidity: {
                    title: 'humidity',
                    value: `${humidity}%`,
                    icon: 'humidity.png'
                },
                visibility: {
                    title: 'visibility',
                    value: `${visibility}%`,
                    icon: 'visibility.png'
                },
                cloudCover: {
                    title: 'cloudCover',
                    value: `${cloudCover}%`,
                    icon: 'cloud.png'
                },
                pressure: {
                    title: 'pressure',
                    value: `${pressure / 100} `,
                    icon: 'gauge.png'
                },
                uvIndex: {
                    title: '',
                    value: `${uvIndex}`,
                    icon: 'uv-index.png'
                }
            }
        }
        renderComponents()
    } catch (err) {
        console.log(err)
    }
}

const getImage = (weatherDescriptions) => {
    const value = weatherDescriptions.toLowerCase()

    switch (value) {
        case 'overcast':
            return 'partly.png'
        case 'sunny':
            return 'sunny.png'
        case 'cloud':
            return 'cloud.png'
        case 'partly cloudy':
            return 'cloud.png'
        case 'fog':
            return 'fog.png'
        case 'clear':
            return 'clear.png'
        default:
            return 'the.png'
    }
}

const renderProperty = (properties) => {
    return Object.values(properties)
        .map(({ title, value, icon }) => {
            return `
            <div class="property">
                <div class="property__icon">
                    <img src="../../img/icons/${icon}" alt="" />
                </div>
                <div class="property__info info-property">
                    <div class="property-info__value">${value}</div>
                    <div class="property-info__description">${title}</div>
                </div>
            </div>
            `
        })
        .join('')
}

const markup = () => {
    const {
        city,
        weatherDescriptions,
        observationTime,
        temperature,
        isDay,
        properties
    } = store

    const containerClass = isDay === 'yes' ? 'is-day' : ''

    return `
    <div class="container ${containerClass}">
        <div class="top">
            <div class="city">
                <div class="city__subtitle">Weather today in</div>
                <div class="city__title" id="city">
                    <span>${city}</span>
                </div>
            </div>
            <div class="city__info info-city">
                <div class="top-left">
                    <img class="icon" src="../../img/${getImage(
                        weatherDescriptions
                    )}" alt="" />
                    <div class="description">${weatherDescriptions}</div>
                </div>
                <div class="top-right">
                    <div class="info-city__subtitle">
                        as of ${observationTime}
                    </div>
                    <div class="info-city__title">${temperature}°</div>
                </div>
            </div>
        </div>
        <div id="properties">${renderProperty(properties)}</div>
    </div>`
}

const togglePopupClass = () => {
    popup.classList.toggle('active')
}

const renderComponents = () => {
    root.innerHTML = markup()

    const city = document.getElementById('city')
    city.addEventListener('click', togglePopupClass)
}

const handleInput = (e) => {
    store = {
        ...store,
        city: e.target.value
    }
}

const handleSubmit = (e) => {
    e.preventDefault()
    const value = store.city

    if (!value) return null

    localStorage.setItem('query', value)
    fetchData()
    togglePopupClass()
}

form.addEventListener('submit', handleSubmit)
textInput.addEventListener('input', handleInput)
popupClose.addEventListener('click', (e) => {
    popup.classList.remove('popup')
    popup.classList.add('popup-close')
})

fetchData()
