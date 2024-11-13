import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGameById } from '../../features/game/gameSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorInfo, Image, TabContent } from '../../components'

const CoverImage = ({ img }) => {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <div
            className="bg-secondary mask-bottom h-set-300-px"
        >
            <img
                src={img}
                alt="cover"
                className="w-100 object-cover object-top"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    )
}

const GamePage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { gameId, tab } = useParams()

    const { gameById, isLoading } = useSelector(state => state.game)

    useEffect(() => {
        window.scrollTo(0, 0)

        const promise = dispatch(getGameById(gameId))

        return () => {
            promise && promise.abort()
        }
    }, [])

    useEffect(() => {
        document.title = gameById?.name || 'Game'
    }, [gameById])


    return (
        <div
            className="h-min-100 container px-sm-3"
        >
            {isLoading ?
                <ErrorInfo
                    isLoading
                />
            : gameById ? 
                <div className="flex flex-col my-3 border border-radius-lg overflow-hidden h-min-100">
                <div className="flex gap-3 p-4">
                        <div className="h-set-250-px">
                            <Image
                                img={gameById.thumbnail}
                                alt={gameById.name}
                                classNameImg="w-100 h-100 object-cover border-radius"
                                classNameContainer="bg-secondary w-100"
                            />
                        </div>
                        <div className="flex flex-col px-4">
                            <div className="fs-54 bold">
                                {gameById.name}
                            </div>
                            <div className="weight-600 ds-16">
                                {gameById.yearPublished}
                            </div>
                        </div>
                    </div>
                    <div className="border-bottom px-4">
                        <TabContent
                            items={[
                                {label: 'Overview'},
                                {label: 'Rules'},
                                {label: 'Reviews'},
                                {label: 'My Plays'}
                            ]}
                            activeTabName={tab || 'overview'}
                            setActiveTabName={(e) => {
                                navigate(`/g/${gameId}/${e}`)
                            }}
                        />
                    </div>
                    {/* <CoverImage img={gameById.thumbnail}/> */}
                    <div className="flex gap-3 px-4">
                    </div>
                </div>
            :
                <ErrorInfo
                    code="404"
                />
            }
        </div>
    )
}

export default GamePage