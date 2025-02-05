import { useEffect } from 'react'
import { Button, HorizontalScroll, Icon, Image, Skeleton } from '../components'
import { useDispatch, useSelector } from 'react-redux'
import { rightArrowIcon } from '../assets/img/icons'
import { Link, useSearchParams } from 'react-router-dom'
import { getGeneralHomeFeed } from '../features/feed/feedSlice'
import HorizontalScrollControlled from '../components/ui/HorizontalScrollControlled'
import { typeEnum } from '../assets/constants'


const GameItem = ({ item }) => {
    return  (
        <Link className="flex flex-col gap-3"
            to={`/g/${item?.game?._id || item?._id}`}
        >
            <Image img={item?.image} classNameContainer="h-set-200-px border-radius overflow-hidden"/>
            <div className="flex align-center pos-relative flex-1">
                <div className="fs-14 bold text-ellipsis-2 flex-1">
                    {item?.name}
                </div>
            </div>
            <div className="flex gap-2">
                {item.playTimeMinutes ?
                    <div className="tag-secondary fs-12 px-2 py-1 border-radius-sm">
                        {item.playTimeMinutes} min
                    </div>
                : null}
            </div>
        </Link>
    )
}

const HomeFeed = () => {
    const dispatch = useDispatch()

    const { home, isLoading, hasMore } = useSelector((state) => state.feed)

    useEffect(() => {
        if (home) return

        const promise = dispatch(getGeneralHomeFeed())

        return () => {
            promise && promise.abort()
        }
    }, [])

    return (
        <>
        {isLoading ?
            <div className="py-4 flex flex-col gap-4 gap-sm-3 overflow-hidden px-sm-4 py-sm-4">
                <div className="flex flex-col gap-3">
                    <HorizontalScrollControlled
                        label={
                            <Skeleton animation="wave" width="150" height="22"/>
                        }
                        maxVisibleItems={window.innerWidth < 800 ? 2 : 5}
                        items={[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton animation="wave" height="210" className="flex-shrink-0" key={i}/>
                        ))}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <HorizontalScrollControlled
                        label={
                            <Skeleton animation="wave" width="150" height="22"/>
                        }
                        maxVisibleItems={window.innerWidth < 800 ? 2 : 5}
                        items={[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton animation="wave" height="210" className="flex-shrink-0" key={i}/>
                        ))}
                    />
                </div>
            </div>
        :
            <div className="py-6 flex flex-col gap-4 overflow-hidden py-sm-4 gap-sm-4 animation-slide-in">
                {home?.recommended?.length ?
                    <HorizontalScrollControlled
                        label={
                            <div className="fs-20 flex align-center gap-4 weight-500 transition-slide-right-hover-parent">
                                Recommended
                            </div>
                        }
                        maxVisibleItems={window.innerWidth < 800 ? 2 : 5}
                        items={home.recommended.map((item, i) => (
                            <GameItem key={i} item={item}/>
                        ))}
                    />
                : null}
                <div>
                    
                {home?.mostPlayed?.length ?
                    <HorizontalScrollControlled
                        label={
                            <div className="fs-20 flex align-center gap-4 weight-500 transition-slide-right-hover-parent">
                                Most Played
                            </div>
                        }
                        maxVisibleItems={window.innerWidth < 800 ? 2 : 5}
                        items={home.mostPlayed.map((item, i) => (
                            <GameItem key={i} item={item.game}/>
                        ))}
                    />
                : null}
                    <div className="py-4">
                        <div className="fs-20 flex align-center gap-4 weight-500 transition-slide-right-hover-parent pb-4">
                            Popular Types
                        </div>
                        <HorizontalScroll>
                            {typeEnum
                            .slice(0, 15)
                            .map((item, i) => (
                                <Link
                                    key={i}
                                    to={`/discover?types=${item.name}`}
                                    className="flex justify-between transition-slide-right-hover-parent align-center transition-opacity-hover-parent gap-1 bg-secondary border-radius px-4 py-3 pointer w-w-min-200-px flex-shrink-0"
                                >
                                    <div className="flex align-center gap-4">
                                        <Icon icon={item.icon} size="lg"/>
                                        <div className="fs-14 weight-500">
                                            {item.name}
                                        </div>
                                    </div>
                                    <Icon
                                        icon={rightArrowIcon}
                                        size="xs"
                                        className="transition-slide-right-hover transition-opacity-hover ms-2"
                                    />
                                </Link>
                        ))}
                        </HorizontalScroll>
                    </div>
                </div>
            </div>
        }
        </>
    )
}


const Section5 = () => {

    return (
        <section className="flex gap-4 pb-6 flex-col">
            <div className="flex border-radius-lg text-white pos-relative h-set-400-px h-sm-100 flex-sm-col overflow-hidden"
            style={{
                background: "radial-gradient(50% 120% at 60% 100%, rgb(51, 0, 255) 0%, rgb(0, 0, 0) 100%)"
            }}>
                <div className="flex flex-1 p-6 pb-sm-0 text-sm-center">
                    {/* <div className="flex-2 d-sm-none"/> */}
                    <div className="flex align-center gap-6 flex-1">
                        <div>
                            <div className="fs-28 bold pb-3 text-shadow-hard">
                                List of board games
                            </div>
                            <div className="fs-14 text-shadow-hard">
                                Keep track of the games you've played or want to play.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-2 px-6 pt-6 p-sm-0 flex align-end">
                    <img
                        src='./assets/section-5.png'
                        className="w-100 h-100 object-cover"
                    />
                </div>
            </div>
            <div className="flex gap-4 flex-sm-col">
                <div className="flex border-radius-lg overflow-hidden text-white pos-relative flex-1 bg-black">
                    <div className="pos-absolute mask-image-100">
                        <img
                            src='./assets/section-5-1.png'
                            className="w-100 h-100 object-cover"
                        />
                    </div>
                    <div className="flex align-center justify-center text-center gap-6 flex-1 h-set-300-px h-sm-set-250-px p-6 z-3">
                        <div>
                            <div className="fs-28 bold pb-3 text-shadow-hard">
                                Write Reviews and Ratings
                            </div>
                            <div className="fs-14 text-shadow-hard">
                                Share your thoughts and opinions on games you've played.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex border-radius-lg overflow-hidden text-white pos-relative flex-1 bg-black">
                    <div className="pos-absolute mask-image-100 h-100 w-100">
                        <img
                            src='./assets/section-5-2.png'
                            className="w-100 h-100 object-cover"
                        />
                    </div>
                    <div className="flex align-center justify-center text-center gap-6 flex-1 h-set-300-px h-sm-set-250-px p-6 z-3">
                        <div>
                            <div className="fs-28 bold pb-3 text-shadow-hard">
                                Record Your Plays
                            </div>
                            <div className="fs-14 text-shadow-hard">
                                Keep track of the games you've played with your follow.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex border-radius-lg p-6 text-white pos-relative flex-1 bg-black"
                style={{
                    background: "radial-gradient(50% 120% at 80% 100%, rgb(134, 0, 255) 0%, rgb(0, 0, 0) 100%)"
                }}>
                <div className="flex align-center gap-6 flex-1">
                    <div>
                        <div className="fs-20 bold pb-4 text-sm-center">
                            Let's get your board game collection started
                        </div>
                        <div className="flex justify-sm-center">
                            <Button
                                label="Create an Account"
                                to="/register"
                                variant="filled"
                                size="lg"
                                className="transition-slide-right-hover-parent"
                                iconRight={<span
                                    className="transition-slide-right-hover"
                                >
                                    {rightArrowIcon}
                                </span>}
                                borderRadius="lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const Section1 = () => {
    return (
        <div className="my-3 offset-header-sm animation-slide-in">
            <div className="w-100 h-set-400-px flex align-end overflow-hidden pos-relative border-radius-lg bg-black">
                <div className="h-100 w-100 pos-absolute offset-header mask-image-100">
                    <img
                        src='./assets/section-1.png'
                        className="w-100 h-100 object-cover filter-brightness-50"
                    />
                </div>
                <div className="pos-relative container px-sm-3 py-5 py-sm-3">
                    <div>
                        <div className="fs-20 weight-400 text-white">
                            Welcome to
                        </div>
                        <div className="fs-54 bold text-white">
                            BGGRID
                        </div>
                        <div className="fs-14 text-white w-max-75 opacity-75">
                            A place to keep track of your board game collection, write reviews, and share your plays with follow.
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button
                                label="Search Games"
                                to="/discover"
                                type="secondary"
                                iconRight={<span className="transition-slide-right-hover ms-2">{rightArrowIcon}</span>}
                                size="lg"
                                className="transition-slide-right-hover-parent"
                                borderRadius="lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const HomePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "Home"
    }, [])

    return (
        <div>
            <div className="mx-auto w-max-xl offset-header w-100">
                <div className="container px-sm-3">
                    <Section1/>
                    <HomeFeed/>
                    <Section5/>
                </div>
            </div>
        </div>
    )
}

export default HomePage