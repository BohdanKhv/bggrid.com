import React, { useEffect, useState } from 'react'
import { Button, HorizontalScroll, Icon, InputSearch } from '../components'
import { useSelector } from 'react-redux'
import { businessTypeEnum } from '../assets/constants'
import { Link, useNavigate } from 'react-router-dom'
import { arrowRightShortIcon, lockIcon, rightArrowIcon, searchIcon, targetIcon, userCardIcon } from '../assets/img/icons'

const wordsToTypeForPlaceholder = ['Barista', 'Bartender', 'Server', 'Chef', 'Cook', 'Host', 'Busser', 'Manager', 'Barback', 'Sommelier', 'Bar Manager', 'General Manager', 'Restaurant Manager', 'Kitchen Manager', 'Shift Manager', 'Assistant Manager', 'Front of House Manager', 'Back of House Manager', 'Food Runner', 'Expeditor', 'Line Cook', 'Prep Cook', 'Pastry Chef', 'Sous Chef', 'Executive Chef', 'Head Chef', 'Catering Chef', 'Private Chef', 'Personal Chef', 'Culinary Instructor', 'Culinary Consultant', 'Culinary Director', 'Culinary Manager', 'Culinary Supervisor', 'Culinary Specialist', 'Culinary Coordinator', 'Culinary Assistant', 'Culinary Intern', 'Culinary Apprentice', 'Culinary Trainee', 'Culinary Student', 'Culinary Graduate', 'Culinary Professional', 'Culinary Expert', 'Culinary Enthusiast', 'Culinary Artist', 'Culinary Innovator', 'Culinary Visionary', 'Culinary Pioneer', 'Culinary Trailblazer', 'Culinary Maestro', 'Culinary Genius', 'Culinary Virtuoso', 'Culinary Prodigy']


const BusinessType = () => {
    return (
        <section className="gap-2 grid grid-cols-4 grid-md-cols-2 w-100">
                <Link
                    to="/jobs"
                    className="flex-shrink-0 border-radius-md text-capitalize box-shadow-hover-sm p-4 fs-24 weight-600 pointer bg-main"
                >
                    <div className="flex flex-col gap-4">
                        <div>
                            🏢 
                        </div>
                        <div>
                            Browse all
                        </div>
                    </div>
                </Link>
            {businessTypeEnum.map((type) => (
                <Link
                    key={type.label}
                    to={`/jobs?businessType=${type.label.replaceAll(' ', '+').toLocaleLowerCase()}`}
                    className="flex-shrink-0 border-radius-md text-capitalize box-shadow-hover-sm p-4 fs-24 weight-600 pointer bg-main"
                >
                    <div className="flex flex-col gap-4">
                        <div>
                        {`${type.icon}`}
                        </div>
                        <div>
                        {`${type.label}`}
                        </div>
                    </div>
                </Link>
            ))}
        </section>
    )
}


const Section4 = () => {
    return (
        <section>
            <div className="mx-auto w-max-md h-min-100 flex flex-col bg-main">
                <div className="flex justify-center align-center flex-col gap-6 container px-sm-2 pt-6 flex-1">
                    <div className="flex flex-sm-col justify-between w-100 gap-4 text-sm-center align-center">
                        <div className="title-2 weight-600 col-6 col-sm-12">
                            Optimize your search
                        </div>
                        <div className="flex flex-col col-6 col-sm-12 gap-4">
                            <div className="fs-18 text-secondary">
                                Simple and easy to use job search platform made for the service industry.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-100">
                        <div className="flex justify-between border-bottom py-6">
                            <div className="title-2 fs-sm-20 weight-600 col-6 col-sm-12">
                                YOUR GOAL
                            </div>
                            <div className="title-2 fs-sm-20 weight-600 col-6 col-sm-12">
                                HOW WE HELP
                            </div>
                        </div>
                        <div className="border-bottom py-6">
                            <div className="flex justify-between gap-4">
                                <div className="title-2 fs-sm-20 weight-600 col-6 col-sm-12">
                                    1. Job Search
                                </div>
                                <div className="flex flex-col col-6 col-sm-12 gap-4">
                                    <div className="fs-20 text-secondary fs-sm-16">
                                        - Customize your search with filters and find the job that fits you best.
                                    </div>
                                    <div className="fs-20 text-secondary fs-sm-16">
                                        - Bookmark jobs to view them later.
                                    </div>
                                    <div className="fs-20 text-secondary fs-sm-16">
                                        - Apply to jobs with a single click.
                                    </div>
                                    <div className="fs-20 text-secondary fs-sm-16">
                                        - Track job you've applied to.
                                    </div>
                                    <div className="fs-20 text-secondary fs-sm-16">
                                        - Save your resume and work preferences.
                                    </div>
                                    <div className="fs-20 text-secondary fs-sm-16">
                                        - Build your In Crew profile and get discovered by employers.
                                    </div>
                                    <div className="fs-20 text-secondary fs-sm-16">
                                        - Get notified when new jobs are posted.
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center align-center">
                                <Button
                                    label="Create a Profile"
                                    to="/login"
                                    variant="outline"
                                    className="mt-6"
                                    type="primary"
                                    size="lg"
                                    iconRight={arrowRightShortIcon}
                                    borderRadius="lg"
                                    />
                            </div>
                        </div>
                        <div className="border-bottom py-6">
                            <div className="flex justify-between gap-4">
                                <div className="title-2 fs-sm-20 weight-600 col-6 col-sm-12">
                                    2. Hiring
                                </div>
                                <div className="flex flex-col col-6 col-sm-12 gap-4">
                                    <div className="fs-20 text-secondary fs-sm-16">
                                        - In Crew profiles help you find the best talent for your business.
                                    </div>
                                    <div className="fs-20 text-secondary fs-sm-16">
                                        - Get notified when new applications are submitted.
                                    </div>
                                    <div className="fs-20 text-secondary fs-sm-16">
                                        - Job posting easy and customizable.
                                    </div>
                                    <div className="fs-20 text-secondary fs-sm-16">
                                        - Transparent pricing.
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center align-center">
                                <Button
                                    label="Create a Job Listing"
                                    to="/new"
                                    variant="filled"
                                    className="mt-6"
                                    type="primary"
                                    size="lg"
                                    iconRight={arrowRightShortIcon}
                                    borderRadius="lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const Section3 = () => {
    return (
        <section
            className="py-6 container px-sm-2 flex align-center justify-center flex-col"
        >
            <div className="mx-auto w-max-default">
                <div className="flex justify-center align-center text-center flex-col gap-4">
                <div className="weight-500 title-1 text-center fs-sm-28">
                    Find the best crew<br/>for your business
                </div>
                    <Button
                        label="Create a Job Listing"
                        to="/new"
                        variant="filled"
                        type="primary"
                        size="lg"
                        borderRadius="lg"
                    />
                </div>
            </div>
        </section>
    )
}

const Section5 = () => {

    return (
        <section
            className="py-6 container px-sm-2 h-min-100 flex align-center justify-center flex-col"
        >
            <div className="mx-auto w-max-md">
                <div className="bg-black px-sm-4 border-radius-lg p-6 text-white">
                <div className="flex justify-center align-center text-center flex-col gap-6">
                <div className="weight-500 fs-54 pb-6 pb-sm-0 text-center fs-sm-28">
                        Create your profile<br/>& stay on top of your career.
                </div>
                <div className="flex gap-6 justify-center flex-sm-col">
                    <div className="flex-1 flex flex-col">
                        <div className="flex flex-col gap-3 align-center">
                            <div className="p-4 border-radius-lg bg-white">
                                <Icon
                                    icon={lockIcon}
                                    size="xl"
                                />
                            </div>
                            <div>
                                <div className="pb-2 fs-24 fs-sm-20 weight-600">
                                    No more passwords
                                </div>
                                <p>
                                    You only need your email to register and start using In Crew Cafe.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <div className="flex flex-col gap-3 align-center">
                            <div className="p-4 border-radius-lg bg-white">
                                <Icon
                                    icon={userCardIcon}
                                    size="xl"
                                />
                            </div>
                            <div>
                                <div className="pb-2 fs-24 fs-sm-20 weight-600">
                                    Establish a presence
                                </div>
                                <p>
                                    Your profile lets thousands of businesses discover you and your unique talents.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <div className="flex flex-col gap-3 align-center">
                            <div className="p-4 border-radius-lg bg-white">
                                <Icon
                                    icon={targetIcon}
                                    size="xl"
                                    className="text-black"
                                />
                            </div>
                                <div>
                                    <div className="pb-2 fs-24 fs-sm-20 weight-600">
                                        Fuel your career
                                    </div>
                                    <p>
                                        The more you share with us, the better we can customize your experience on In Cere Cafe.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
    )
}

const Section6 = () => {
    return (
        <HorizontalScroll
            noControllers
        >
            {[{ label: 'New York', value: 'new-york', geo: 'lat=40.7128&lng=-74.0060'},
            { label: 'Los Angeles', value: 'la', geo: 'lat=34.0522&lng=-118.2437'},
            { label: 'Chicago', value: 'chicago', geo: 'lat=41.8781&lng=-87.6298'},
            { label: 'Philadelphia', value: 'philadelphia', geo: 'lat=39.9526&lng=-75.1652'},
            { label: "Seattle", value: 'seattle', geo: 'lat=47.6062&lng=-122.3321'},
            { label: "San Francisco", value: 'san-francisco', geo: 'lat=37.7749&lng=-122.4194'},
            { label: "Miami", value: 'miami', geo: 'lat=25.7617&lng=-80.1918'},
            { label: "Las Vegas", value: 'las-vegas', geo: 'lat=36.1699&lng=-115.1398'},
            ]
            .map((state) => (
                <Link
                    key={state.label}
                    to={`/jobs?${state.geo}`}
                    className="flex-shrink-0 opacity-75-active border-radius-md text-capitalize box-shadow-hover-sm p-4 fs-24 weight-600 pointer bg-main h-min-150-px w-min-300-px pos-relative overflow-hidden display-on-hover-parent transition-slide-right-hover-parent overflow-hidden flex align-end"
                    style={{
                        backgroundImage: `url(${import.meta.env.VITE_CLIENT_URL}/assets/cities/${state.value}.png)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundBlendMode: 'multiply'
                    }}
                >
                    <div
                        className="pos-absolute bottom-fade-effect bottom-0 w-100 h-100 left-0 z-0"
                    />
                    <div className="flex flex-col justify-end align-start h-100 w-100 fs-24 bold text-white text-shadow-hard z-2 pos-relative flex-1 h-100"
                    >
                        <div className="flex justify-between align-center w-100">
                            <span className="flex-1">{`${state.label}`}</span>
                            <Icon
                                icon={rightArrowIcon}
                                className="display-on-hover transition-slide-right-hover fill-white"
                            />
                        </div>
                    </div>
                </Link>
            ))} 
        </HorizontalScroll>
    )
}

const HomePage = () => {
    const navigate = useNavigate()

    const { user } = useSelector(state => state.auth)

    const [searchValue, setSearchValue] = React.useState('')

    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [delay, setDelay] = useState(false);

    useEffect(() => {
        const handleTyping = () => {
            const currentWord = wordsToTypeForPlaceholder[currentWordIndex];
            if (isDeleting) {
                setDisplayText(prev => prev.slice(0, -1));
                if (displayText === '') {
                    setIsDeleting(false);
                    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % wordsToTypeForPlaceholder.length);
                }
            } else {
                setDisplayText(prev => currentWord.slice(0, prev.length + 1));
                if (displayText === currentWord) {
                    setIsDeleting(true);
                    setDelay(true);
                    setTimeout(() => setDelay(false), 1000); // 1 second delay before deleting
                }
            }
        };

        if (!delay) {
            const interval = setInterval(handleTyping, isDeleting ? 50 : 100); // Adjust typing speed here
            return () => clearInterval(interval);
        }
    }, [displayText, isDeleting, currentWordIndex, delay, wordsToTypeForPlaceholder]);


    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = 'In Crew cafe - find a job in the food, beverage and hospitality industry.'
    }, [])

    return (
        <div>
            <section className="animation-slide-in bg-main">
                <div className="mx-auto w-max-md">
                    <div className="container px-sm-2">
                        <div className="h-min-100 flex justify-center flex-col">
                            <div className="flex flex-col gap-6 justify-center w-100 pt-5">
                                <div className="py-sm-5 bold fs-sm-48 line-height-1 text-center"
                                    style={{
                                        fontSize: '74px'
                                    }}
                                >
                                    Top Food & Hospitality Jobs Near You
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 pt-6 pt-sm-5 px-sm-2">
                            <div className="flex border gap-2 border-radius-lg align-center py-1">
                                <InputSearch
                                    value={searchValue}
                                    clearable={false}
                                    icon={searchIcon}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder={displayText}
                                    className="flex-1"
                                    onSubmit={() => {
                                        navigate(`/jobs?q=${searchValue}`)
                                    }}
                                />
                                <Button
                                    label="Search"
                                    borderRadius="lg"
                                    className="weight-400 flex-shrink-0 mx-1 my-sm-0"
                                    type="primary"
                                    variant={"filled"}
                                    onClick={() => {
                                        navigate(`/jobs?q=${searchValue}`)
                                    }}
                                />
                            </div>
                            <div className="overflow-hidden w-available">
                                <div className="flex gap-4 overflow-x-auto scrollbar-none">
                                <Button
                                    to="/jobs"
                                    size="lg"
                                    borderRadius="lg"
                                    label="All Jobs"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                <Button
                                    to="/jobs?q=barista"
                                    size="lg"
                                    borderRadius="lg"
                                    icon="☕"
                                    label="Barista"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                <Button
                                    to="/jobs?q=bartender"
                                    size="lg"
                                    borderRadius="lg"
                                    icon="🍸"
                                    label="Bartender"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                <Button
                                    to="/jobs?q=chef"
                                    size="lg"
                                    borderRadius="lg"
                                    icon="👨‍🍳"
                                    label="Chef"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                <Button
                                    to="/jobs?q=baker"
                                    size="lg"
                                    borderRadius="lg"
                                    icon="🥖"
                                    label="Bakers"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                <Button
                                    to="/jobs?q=server"
                                    size="lg"
                                    borderRadius="lg"
                                    icon="🍽️"
                                    label="Server"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                <Button
                                    to="/jobs?q=cook"
                                    size="lg"
                                    borderRadius="lg"
                                    icon="🍳"
                                    label="Cook"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                <Button
                                    to="/jobs?q=host"
                                    size="lg"
                                    borderRadius="lg"
                                    icon="🎫"
                                    label="Host"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                <Button
                                    to="/jobs?q=busser"
                                    size="lg"
                                    borderRadius="lg"
                                    icon="🧹"
                                    label="Busser"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                <Button
                                    to="/jobs?q=manager"
                                    size="lg"
                                    borderRadius="lg"
                                    icon="👔"
                                    label="Manager"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                <Button
                                    to="/jobs?q=barback"
                                    size="lg"
                                    borderRadius="lg"
                                    icon="🍺"
                                    label="Barback"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                <Button
                                    to="/jobs?q=sommelier"
                                    size="lg"
                                    borderRadius="lg"
                                    icon="🍷"
                                    label="Sommelier"
                                    variant="outline"
                                    className="flex-grow-1 flex-shrink-0"
                                    type="secondary"
                                />
                                </div>
                            </div>
                            <Section6/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-secondary">
                    <div className="mx-auto w-max-md">
                        <div className="container px-sm-2 h-min-100 flex align-center justify-center flex-col py-6">
                            <div className="weight-500 fs-54 pb-6 text-center fs-sm-28">
                                In what business are you interested?
                            </div>
                            <BusinessType/>
                        </div>
                    </div>
                </div>
                {!user ?
                <>
                    <Section5/>
                    <Section4/>
                </>
                :
                    user?.accountType === 'employer' ?
                    <Section3/>
                    : null
                }
            </section>
        </div>
    )
}

export default HomePage