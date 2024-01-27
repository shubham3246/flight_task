const yearOptions = [];
function getYears() {
    for (let year = 2006; year <= 2020; year++) {
        yearOptions.push(year);
    }
    return yearOptions;
}

const launch_year_filter = {
    id: 'launch_year',
    name: 'Launch Year',
    options: getYears(),
}

const filters = [
    {
        id: 'launch_success',
        name: 'Launch Success',
        options: [
            {value: 'succeeded', label: 'Succeeded', checked: false},
            {value: 'failed', label: 'Failed', checked: false},
            {value: 'both', label: 'Both', checked: false},
        ]
    },
    {
        id: 'rocket_type',
        name: 'Rocket Type',
        options: [
            {value: 'merlinA', label: 'Merlin A', checked: false},
            {value: 'merlinC', label: 'Merlin C', checked: false},
            {value: 'v1.0', label: 'v1.0', checked: false},
            {value: 'v1.1', label: 'v1.1', checked: false},
            {value: 'FT', label: 'FT', checked: false},
        ]
    },
    // {
    //     id: 'color',
    //     name: 'Color',
    //     options: [
    //         { value: 'white', label: 'White', checked: false },
    //         { value: 'beige', label: 'Beige', checked: false },
    //         { value: 'blue', label: 'Blue', checked: true },
    //         { value: 'brown', label: 'Brown', checked: false },
    //         { value: 'green', label: 'Green', checked: false },
    //         { value: 'purple', label: 'Purple', checked: false },
    //     ],
    // },
    // {
    //     id: 'category',
    //     name: 'Category',
    //     options: [
    //         { value: 'new-arrivals', label: 'New Arrivals', checked: false },
    //         { value: 'sale', label: 'Sale', checked: false },
    //         { value: 'travel', label: 'Travel', checked: false },
    //         { value: 'organization', label: 'Organization', checked: false },
    //         { value: 'accessories', label: 'Accessories', checked: false },
    //     ],
    // },
    // {
    //     id: 'size',
    //     name: 'Size',
    //     options: [
    //         { value: '2l', label: '2L', checked: false },
    //         { value: '6l', label: '6L', checked: false },
    //         { value: '12l', label: '12L', checked: false },
    //         { value: '18l', label: '18L', checked: false },
    //         { value: '20l', label: '20L', checked: false },
    //         { value: '40l', label: '40L', checked: false },
    //     ],
    // },
]

export default filters;
export {launch_year_filter};