import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { useLocation, useNavigate } from 'react-router-dom'
import spaceXData from '../../data/Data';
import filters, { launch_year_filter } from '../../data/Filter.jsx';
import Card from '../card/Card.jsx'

const sortOptions = [
    { name: 'Most Popular', href: '#', current: true },
    { name: 'Best Rating', href: '#', current: false },
    { name: 'Newest', href: '#', current: false },
    { name: 'Price: Low to High', href: '#', current: false },
    { name: 'Price: High to Low', href: '#', current: false },
]

// const sampleFilters = spaceXData();


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Filter() {

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [launch, setLaunch] = useState([2006, 2020]);
    const [data, setData] = useState([]);
    const [uniqueData, setUniqueData] = useState([]);
    const [launchSuccess, setLaunchSuccess] = useState(null);


    const addUniqueData = (property, value) => {
        const newData = data.filter((item) => {
            if (property in item) {
                return item[property] === value;
            } else if (item.rocket && property in item.rocket) {
                return item.rocket[property] === value;
            } else {
                return false;
            }
        });

        if(uniqueData.length == data.length) {
            setUniqueData([...newData]);
        }
        else {
            setUniqueData([...uniqueData, ...newData]);
        }
    }
    const removeUniqueData = (property, value) => {
        const newData = uniqueData.filter((item) => {
            if (property in item) {
                return item[property] !== value;
            } else if (item.rocket && property in item.rocket) {
                return item.rocket[property] !== value;
            } else {
                return false;
            }
        });
        setUniqueData(newData);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await spaceXData();
                setData(response);
                setUniqueData(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const location = useLocation();
    const navigate = useNavigate();
    const handleFilter = (value, sectionId) => {
        const searchParams = new URLSearchParams(location.search);

        let filterValue = searchParams.getAll(sectionId);
        // console.log(`${value} - ${sectionId}`);

        if (filterValue.length > 0 && filterValue[0].split(",").includes(value)) {
            filterValue = filterValue[0].split(",").filter((item) => item !== value);

            if (filterValue.length === 0) {
                searchParams.delete(sectionId);
            }

            removeUniqueData(sectionId.toString(), value);
        }
        else {
            filterValue.push(value);
            addUniqueData(sectionId.toString(), value);
            // console.log(uniqueData);
        }

        if (filterValue.length > 0) {
            searchParams.set(sectionId, filterValue.join(","));
        }

        const query = searchParams.toString();
        navigate({ search: `?${query}` });
    }

    const handleSingleFilter = (label, value) => {
        if(label === "launch_success" && value === 'succeeded') {
            setLaunchSuccess(true);
        }
        else if (label === "launch_success" && value === 'failed') {
            setLaunchSuccess(false);
        }
        else if (label === "launch_success" && value === 'both') {
            setLaunchSuccess(null);
        }
        const searchParams = new URLSearchParams(location.search);
        searchParams.set(label, value);
        const query = searchParams.toString();
        navigate({ search: `?${query}` });
    }
    const handleLaunchFilter = (label, value) => {
        const searchParams = new URLSearchParams(location.search);
        var param = '';
        if (label === 'min') {
            param = `${value}-${Math.max(value, launch[1])}`;
            setLaunch([value, Math.max(value, launch[1])]);
        }
        else {
            param = `${Math.min(value, launch[0])}-${value}`;
            setLaunch([Math.min(value, launch[0]), value]);
        }
        searchParams.set('launch_year', param);
        const query = searchParams.toString();
        navigate({ search: `?${query}` });
    }

    const checkLaunch = (item) => {
        var year = item.launch_year >= launch[0] && item.launch_year <= launch[1];
        console.log(`${item.launch_year} - ${item.launch_success}`)
        if(launchSuccess === null) {
            return year;
        }
        else {
            return year && item.launch_success === launchSuccess;
        }
    }


    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                        <button
                                            type="button"
                                            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                            onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    {/* Filters */}
                                    <form className="mt-4 border-t border-gray-200 px-5">

                                    <Disclosure as="div" key={'launch_year'} className="border-b border-gray-200 py-6">
                                    {({ open }) => (
                                        <>
                                            <h3 className="-my-3 flow-root">
                                                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                    <span className="font-medium text-gray-900"> Launch Year </span>
                                                    <span className="ml-6 flex items-center">
                                                        {open ? (
                                                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                        ) : (
                                                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                        )}
                                                    </span>
                                                </Disclosure.Button>
                                            </h3>
                                            <Disclosure.Panel className="pt-6">
                                                <div className='flex justify-around'>
                                                    <select className='border rounded-sm' name="launch_year_min" id="launch_year_min" value={launch[0]} onChange={(e) => handleLaunchFilter('min', e.target.value)}>
                                                        {launch_year_filter.options.map((option) => {
                                                            return <option value={`${option}`} key={option}>{option}</option>
                                                        })}
                                                    </select>
                                                    <span className='text-gray-400'>to</span>
                                                    <select className='border rounded-sm' name="launch_year_max" id="launch_year_max" value={launch[1]} onChange={(e) => handleLaunchFilter('max', e.target.value)}>
                                                        {launch_year_filter.options.map((option) => {
                                                            return <option value={`${option}`} key={option} name={`${option}`}>{option}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>

                                {filters.map((section) => (
                                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                                        {({ open }) => (
                                            <>
                                                <h3 className="-my-3 flow-root">
                                                    <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                        <span className="font-medium text-gray-900">{section.name}</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel className="pt-6">
                                                    <div className="space-y-4">
                                                        {section.options.map((option, optionIdx) => (
                                                            <div key={option.value} className="flex items-center">
                                                                <input
                                                                    onChange={
                                                                        () => {
                                                                            (section.id === 'launch_success')
                                                                                ? handleSingleFilter(section.id, option.value)
                                                                                : handleFilter(option.label, section.id)
                                                                        }
                                                                    }
                                                                    id={`filter-${section.id}-${optionIdx}`}
                                                                    name={`${section.id}[]`}
                                                                    type={(section.id === 'launch_success') ? "radio" : "checkbox"}
                                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                    className="ml-3 text-sm text-gray-600"
                                                                >
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        ))
                                                        }
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <main className="mx-auto  px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Flight Details</h1>

                        <div className="flex items-center">
                            <button
                                type="button"
                                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pb-24 pt-6 ">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
                            {/* Filters */}
                            <form className="hidden lg:block">
                                <Disclosure as="div" key={'launch_year'} className="border-b border-gray-200 py-6">
                                    {({ open }) => (
                                        <>
                                            <h3 className="-my-3 flow-root">
                                                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                    <span className="font-medium text-gray-900"> Launch Year </span>
                                                    <span className="ml-6 flex items-center">
                                                        {open ? (
                                                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                        ) : (
                                                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                        )}
                                                    </span>
                                                </Disclosure.Button>
                                            </h3>
                                            <Disclosure.Panel className="pt-6">
                                                <div className='flex justify-around'>
                                                    <select className='border rounded-sm' name="launch_year_min" id="launch_year_min" value={launch[0]} onChange={(e) => handleLaunchFilter('min', e.target.value)}>
                                                        {launch_year_filter.options.map((option) => {
                                                            return <option value={`${option}`} key={option}>{option}</option>
                                                        })}
                                                    </select>
                                                    <span className='text-gray-400'>to</span>
                                                    <select className='border rounded-sm' name="launch_year_max" id="launch_year_max" value={launch[1]} onChange={(e) => handleLaunchFilter('max', e.target.value)}>
                                                        {launch_year_filter.options.map((option) => {
                                                            return <option value={`${option}`} key={option} name={`${option}`}>{option}</option>
                                                        })}
                                                    </select>
                                                </div>
                                            </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>

                                {filters.map((section) => (
                                    <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
                                        {({ open }) => (
                                            <>
                                                <h3 className="-my-3 flow-root">
                                                    <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                        <span className="font-medium text-gray-900">{section.name}</span>
                                                        <span className="ml-6 flex items-center">
                                                            {open ? (
                                                                <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                                            ) : (
                                                                <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                                            )}
                                                        </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel className="pt-6">
                                                    <div className="space-y-4">
                                                        {section.options.map((option, optionIdx) => (
                                                            <div key={option.value} className="flex items-center">
                                                                <input
                                                                    onChange={
                                                                        () => {
                                                                            (section.id === 'launch_success')
                                                                                ? handleSingleFilter(section.id, option.value)
                                                                                : handleFilter(option.label, section.id)
                                                                        }
                                                                    }
                                                                    id={`filter-${section.id}-${optionIdx}`}
                                                                    name={`${section.id}[]`}
                                                                    type={(section.id === 'launch_success') ? "radio" : "checkbox"}
                                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                    className="ml-3 text-sm text-gray-600"
                                                                >
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        ))
                                                        }
                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </form>

                            {/* Product grid */}
                            <div className="lg:col-span-4 flex flex-wrap justify-center">
                                {
                                    uniqueData.map((item) => (
                                        (checkLaunch(item)) && 
                                        <div key={item.flight_number + Math.random()} className='w-[250px] rounded-md m-1 bg-green-400'>
                                            <Card flightNumber={item.flight_number} missionName={item.mission_name} launchYear={item.launch_year}/>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
