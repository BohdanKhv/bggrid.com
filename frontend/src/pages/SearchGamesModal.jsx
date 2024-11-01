import React from 'react'
import { IconButton, Modal } from '../components'
import { useSearchParams } from 'react-router-dom'
import { closeIcon } from '../assets/img/icons'

const SearchGamesModal = () => {

    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <Modal
            modalIsOpen={searchParams.get('sg') === 'true'}
            headerNone
        >
            <IconButton
                onClick={() => {
                    searchParams.delete('sg')
                    setSearchParams(searchParams)
                }}
                icon={closeIcon}
                variant="text"
            />
        </Modal>
    )
}

export default SearchGamesModal