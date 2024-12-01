import { useEffect, useState } from 'react'
import { Avatar, Button, ErrorInfo, HorizontalScroll, Icon, IconButton, Image, InputSearch, Modal, Skeleton } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { arrowLeftShortIcon, arrowRightShortIcon, bellIcon, clockIcon, diceIcon, rightArrowIcon, searchIcon, usersIcon } from '../assets/img/icons'
import { getSuggestions } from '../features/game/gameSlice'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { setSearchHistory } from '../features/local/localSlice'
import FriendsModal from './friend/FriendsModal'
import { getGeneralHomeFeed } from '../features/feed/feedSlice'
import HorizontalScrollControlled from '../components/ui/HorizontalScrollControlled'
import { typeEnum } from '../assets/constants'


const PlayItem = ({ item }) => {
    const { user } = useSelector((state) => state.auth)

    const [searchParams, setSearchParams] = useSearchParams()

    return  (
        <div className="flex flex-col gap-3"
            onClick={() => {
                searchParams.set('logPlay', item.game._id)
                setSearchParams(searchParams)
            }}
        >
            <Image img={item?.game?.thumbnail} classNameContainer="h-set-200-px border-radius overflow-hidden"/>
            <div className="flex align-center pos-relative flex-1">
                <div className="fs-14 bold text-ellipsis-2 flex-1">
                    {item?.game?.name}
                </div>
            </div>
            <div className="flex gap-2">
                {item?.players?.find((player) => player.user === user._id && player.winner) ?
                    <div className="tag-success fs-12 px-2 py-1 border-radius-sm">
                        Winner
                    </div>
                : null}
                {item.playTimeMinutes ?
                    <div className="tag-secondary fs-12 px-2 py-1 border-radius-sm">
                        {item.playTimeMinutes} min
                    </div>
                : null}
            </div>
        </div>
    )
}

const GameItem = ({ item }) => {
    const { user } = useSelector((state) => state.auth)

    const [searchParams, setSearchParams] = useSearchParams()

    return  (
        <div className="flex flex-col gap-3"
            onClick={() => {
                searchParams.set('addGame', item._id)
                setSearchParams(searchParams)
            }}
        >
            <Image img={item?.thumbnail} classNameContainer="h-set-200-px border-radius overflow-hidden"/>
            <div className="flex align-center pos-relative flex-1">
                <div className="fs-14 bold text-ellipsis-2 flex-1">
                    {item?.name}
                </div>
            </div>
            <div className="flex gap-2">
                {item?.players?.find((player) => player.user === user._id && player.winner) ?
                    <div className="tag-success fs-12 px-2 py-1 border-radius-sm">
                        Winner
                    </div>
                : null}
                {item.playTimeMinutes ?
                    <div className="tag-secondary fs-12 px-2 py-1 border-radius-sm">
                        {item.playTimeMinutes} min
                    </div>
                : null}
            </div>
        </div>
    )
}

const HomeFeed = () => {
    const dispatch = useDispatch()

    const { home, isLoading, hasMore } = useSelector((state) => state.feed)

    useEffect(() => {
        if (home) return

        const promise = dispatch(getGeneralHomeFeed())

        return () => {
            promise.abort()
        }
    }, [])

    return (
        <>
        {isLoading ?
            <div className="flex flex-col gap-6 py-6 overflow-hidden py-sm-3">
                <div className="flex flex-col gap-3">
                    <Skeleton animation="wave" width="100" height="30"/>
                    <div className="flex gap-3">
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton animation="wave" width="100" height="30"/>
                    <div className="flex gap-3">
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton animation="wave" width="100" height="30"/>
                    <div className="flex gap-3">
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                        <Skeleton animation="wave" height="300"/>
                    </div>
                </div>
            </div>
        :
            <div className="py-6 flex flex-col gap-6 overflow-hidden px-sm-3 py-sm-3">
                {home?.mostPlayed?.length ?
                    <HorizontalScrollControlled
                        label={
                            <div className="fs-24 flex align-center gap-4 weight-500 transition-slide-right-hover-parent">
                                Games for you
                            </div>
                        }
                        maxVisibleItems={window.innerWidth < 800 ? 2 : 5}
                        items={home.mostPlayed.map((item, i) => (
                            <GameItem key={i} item={item.game}/>
                        ))}
                    />
                : null}
            </div>
        }
        </>
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
    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "Home"
    }, [])

    return (
        <div>
        <div className="pt-3 px-sm-3">
            <HorizontalScroll>
                {typeEnum
                .slice(0, 15)
                .map((item, i) => (
                    <div
                        key={i}
                        className="flex justify-between transition-slide-right-hover-parent h-set-30-px align-center transition-opacity-hover-parent gap-1 bg-secondary border-radius p-4 pointer w-set-150-px"
                    >
                        <div className="flex align-center gap-4">
                            <Icon icon={item.icon} size="lg"/>
                            <div className="fs-14 weight-500">
                                {item.type}
                            </div>
                        </div>
                        <Icon
                            icon={rightArrowIcon}
                            size="sm"
                            className="transition-slide-right-hover transition-opacity-hover"
                        />
                    </div>
            ))}
            </HorizontalScroll>
        </div>
        <HomeFeed/>
        </div>
    )
}

export default HomePage