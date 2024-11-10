import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyLibrary } from '../features/library/librarySlice'
import {ErrorInfo} from '../components'
import { useSearchParams } from 'react-router-dom'
import { gamesIcon } from '../assets/img/icons'

const LibraryItem = ({ game }) => {
    return (
        <div className="library-item">
            <div className="library-item-image">
                <img
                    src="https://via.placeholder.com/150"
                    alt={game.title}
                />
            </div>
            <div className="library-item-info">
                <div className="library-item-title">{game.title}</div>
                <div className="library-item-genre">{game.genre}</div>
                <div className="library-item-platform">{game.platform}</div>
            </div>
        </div>
    )
}

const LibraryPage = () => {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()
    const { library, isLoading, msg } = useSelector((state) => state.library)

    useEffect(() => {
        const promise = dispatch(getMyLibrary())

        if (document.querySelector('.header-title')) document.querySelector('.header-title').innerText = 'Library'
        return () => {
            if (document.querySelector('.header-title')) document.querySelector('.header-title').innerText = ''
            promise.abort()
        }
    }, [])

    return (
        <div>
            <main className="page-body">
                <div className="animation-slide-in">
                    <div className="container">
                        <div className="py-3 title-1 bold px-sm-2">
                            Library
                        </div>
                        <div className="pb-6 pt-5 px-sm-3">
                            {library.length > 0 && !isLoading ? (
                                library.map((game) => <LibraryItem key={game._id} game={game} />)
                            ) : isLoading ? (
                                <ErrorInfo isLoading/>
                            ) : (
                                library.length === 0 && <ErrorInfo
                                label="Your library is empty"
                                btnLabel="Add games"
                                icon={gamesIcon}
                                onClick={() => {
                                    searchParams.set('sg', true)
                                    setSearchParams(searchParams)
                                }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LibraryPage