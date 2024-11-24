import React, { useEffect, useState } from 'react'
import { Icon, IconButton, InputSearch, Modal, Image, ErrorInfo } from '../../components'
import { Link, useSearchParams } from 'react-router-dom'
import { arrowLeftShortIcon, gamesIcon, leftArrowIcon, searchIcon } from '../../assets/img/icons'
import { useDispatch, useSelector } from 'react-redux'
import { getSuggestions } from '../../features/game/gameSlice'

const GameSearchModal = () => {
    const dispatch = useDispatch()

    const { suggestions, loadingId } = useSelector((state) => state.game)
    const { library } = useSelector((state) => state.library)

    const [searchParams, setSearchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        let promise;

        if (searchValue.length > 0) {
            promise = dispatch(getSuggestions(searchValue))
        }

        return () => {
            promise?.abort()
        }
    }, [searchValue])

    const highlightText = (text, query) => {
        if (!query) {
            return text;
        }
    
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);
    
        return parts.map((part, index) =>
            regex.test(part) ? <strong key={index} className="text-primary">{part}</strong> : part
        );
    };

    return (
        <>
        <Modal
            modalIsOpen={searchParams.get('sg') === 'true'}
            closeModal={() => {
                searchParams.delete('sg')
                setSearchParams(searchParams.toString())
            }}
            classNameContent="p-0"
            headerNone
            noAction
        >
            <div className="border-bottom align-center flex">
                <IconButton
                    icon={arrowLeftShortIcon}
                    variant="link"
                    size="lg"
                    type="secondary"
                    onClick={() => {
                        searchParams.delete('sg')
                        setSearchParams(searchParams.toString())
                    }}
                />
                <InputSearch
                    className="flex-1 py-1"
                    placeholder="What do you wanna play?"
                    value={searchValue}
                    clearable
                    autoFocus
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div className="py-4">
                {library && library
                .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                .length > 0 ?
                <>
                    <div className="fs-20 pb-3 bold px-3">
                        Your library
                    </div>
                    {library
                    .filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .slice(0, 10)
                    .map((searchItem) => (
                        <div className="flex justify-between align-center bg-secondary-hover"
                            key={searchItem}
                        >
                            <Link
                                key={searchItem}
                                to={`/g/${searchItem._id}`}
                                className="fs-14 flex align-center px-4 py-2 gap-3 pointer flex-1 overflow-hidden clickable opacity-75-active"
                            >
                                <div className="flex gap-3 align-center">
                                    <Image
                                        img={searchItem.game.thumbnail}
                                        alt={searchItem.game.name}
                                        classNameContainer="w-set-50-px h-set-50-px border-radius-sm overflow-hidden"
                                    />
                                    <div className="flex flex-col">
                                        <div className="fs-14 weight-500 text-ellipsis-2">
                                            {highlightText(searchItem.game.name, searchValue)}
                                        </div>
                                        <div className="fs-12 text-secondary">
                                            {searchItem.game.yearPublished}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </>
                : null}
                {suggestions && suggestions.length > 0 ?
                <>
                    {suggestions
                    .map((searchItem) => (
                        <div className="flex justify-between align-center bg-secondary-hover"
                            key={searchItem}
                        >
                            <Link
                                key={searchItem}
                                to={`/g/${searchItem._id}`}
                                className="fs-14 flex align-center px-4 py-2 gap-3 pointer flex-1 overflow-hidden clickable opacity-75-active"
                            >
                                <div className="flex gap-3 align-center">
                                    <Image
                                        img={searchItem.thumbnail}
                                        alt={searchItem.name}
                                        classNameContainer="w-set-50-px h-set-50-px border-radius-sm overflow-hidden"
                                    />
                                    <div className="flex flex-col">
                                        <div className="fs-14 weight-500 text-ellipsis-2">
                                            {highlightText(searchItem.name, searchValue)}
                                        </div>
                                        <div className="fs-12 text-secondary">
                                            {searchItem.yearPublished}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </>
                :
                    loadingId === 'suggestions' ?
                        <ErrorInfo isLoading/>
                    :
                    library.filter((item) => item.game.name.toLowerCase().includes(searchValue.toLowerCase())).length === 0 ?
                        <ErrorInfo
                            label="No games found"
                            secondary={`Nothing matched your search for "${searchValue}"`}
                        />
                : null}
            </div>
        </Modal>
        </>
    )
}

export default GameSearchModal