export const existingAccounts = [
    {
        email: "johnbohn@email.com",
        password: "12345pass",
        favourites: [
            {
                "name": "London",
                "lat": 51.5073219,
                "lon": -0.1276474,
                "country": "GB",
            },
        ]
    },
    {
        email: "jamesbames@email.com",
        password: "ssap54321",
        favourites: [
            {
                "name": "Stoke-on-Trent",
                "lat": 53.0162014,
                "lon": -2.1812607,
                "country": "GB",
            }
        ]
    },
    {
        email: "jimbim@email.com",
        password: "1p5a2s4s3",
        favourites: [
            {
                "name": "Glasgow",
                "lat": 55.8609825,
                "lon": -4.2488787,
                "country": "GB",
            },
            {
                "name": "Edinburgh",
                "lat": 55.9533456,
                "lon": -3.1883749,
                "country": "GB",
            }
        ]
    },
    {
        email: "jillbill@email.com",
        password: "2s4s1a5p3",
        favourites: [
            {
                "name": "London",
                "lat": 51.5073219,
                "lon": -0.1276474,
                "country": "GB",
            },
            {
                "name": "Stoke-on-Trent",
                "lat": 53.0162014,
                "lon": -2.1812607,
                "country": "GB",
            }  
        ]
    },
    {
        email: "janebane@email.com",
        password: "OTTFF7455",
        favourites: [
            {
                "name": "Glasgow",
                "lat": 55.8609825,
                "lon": -4.2488787,
                "country": "GB",
            },
            {
                "name": "Edinburgh",
                "lat": 55.9533456,
                "lon": -3.1883749,
                "country": "GB",
            },
            {
                "name": "Tobermory",
                "lat": 56.6227872,
                "lon": -6.0682243,
                "country": "GB",
            },
        ]
    },
    {
        email: "kyle@email.com",
        password: "5547FFTTO",
        favourites: [
            {
                "name": "London",
                "lat": 51.5073219,
                "lon": -0.1276474,
                "country": "GB",
            },
            {
                "name": "Edinburgh",
                "lat": 55.9533456,
                "lon": -3.1883749,
                "country": "GB",
            },
        ]
    },
];

export const newAccounts = {
    valid: {
        email: "name@email.com",
        password: "password"
    }, 
    invalidEmail: {
        email: "nameemailcom",
        password: "password"
    },
    emptyEmail: {
        email: "",
        password: "password"
    },
    missingEmail: {
        password: "password"
    },
    emptyPassword: {
        email: "name@email.com",
        password: ""
    },
    missingPassword: {
        email: "name@email.com",
    },
    sameEmail: {
        email: "johnbohn@email.com",
        password: "password"
    }
}