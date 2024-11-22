import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, ErrorInfo, HorizontalScroll, IconButton } from '../components'
import { getMyFriends } from '../features/friend/friendSlice'
import { linkIcon } from '../assets/img/icons'


const CommunityPage = () => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { friends, isLoading } = useSelector((state) => state.friends)
  const [tag, setTag] = useState(null)
  const [selectedFriend, setSelectedFriend] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Community'

    const promise = dispatch(getMyFriends())
  }, [])

  return (
    <div>
        <main className="page-body">
            <div className="animation-slide-in">
                <div className="container">
                    <div className="flex justify-between px-sm-3">
                        <div className="pt-6 pb-3 pt-sm-3 title-1 bold">
                            Community
                        </div>
                        {window.innerWidth <= 800 && user ? (
                        <div className="justify-end flex align-center flex-no-wrap gap-3">
                            <div
                                onClick={() => {
                                    document.querySelector('.open-navbar-button').click()
                                }}
                            >
                                <Avatar
                                    img={`${user?.avatar}`}
                                    name={user ? `${user?.email}` : null}
                                    rounded
                                    avatarColor="1"
                                    size="sm"
                                />
                            </div>
                        </div>
                        ) : null}
                    </div>
                    <div className="sticky top-0 bg-main py-1 z-3 py-sm-0">
                        {friends.length > 0 && !isLoading && (
                            <HorizontalScroll
                                contentClassName="align-start gap-0"
                            >
                                {friends.map((item) => (
                                    <div className={`pointer h-100 animation-fade-in border-radius-sm hover-opacity-100 transition-duration clickable flex-shrink-0${selectedFriend ? selectedFriend === item?.game?._id ? "" : " opacity-25" : " bg-secondary-hover"}`}
                                        key={item._id}
                                        onClick={() => {
                                            if (selectedFriend === item?.game?._id) {
                                                setSelectedFriend(null)
                                            } else {
                                                setSelectedFriend(item?.game?._id)
                                            }
                                        }}
                                    >
                                        <div className="flex flex-col p-2 align-center">
                                            <Avatar
                                                img={item?.game?.thumbnail}
                                                size="lg"
                                                rounded
                                                label={item.game.name}
                                            />
                                            <div className="fs-12 text-center text-ellipsis-1 w-max-75-px pt-2 weight-500">
                                                {item.game.name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </HorizontalScroll>
                        )}
                    </div>
                    <div>
                        <div className="pt-3 px-sm-3">
                            <div className="flex">
                                <HorizontalScroll className="flex-1">
                                    {selectedFriend || tag ?
                                        <IconButton
                                            icon={closeIcon}
                                            variant="secondary"
                                            className="animation-fade-in flex-shrink-0"
                                            type={tag === null ? 'filled' : 'default'}
                                            onClick={() => {
                                                setSelectedFriend(null)
                                                setTag(null)
                                            }}
                                        />
                                    : null}
                                    <Button
                                        label="All"
                                        variant="secondary"
                                        className="animation-fade-in flex-shrink-0"
                                        type={tag === null ? 'filled' : 'default'}
                                        onClick={() => setTag(null)}
                                    />
                                    {['Plays', 'Library']
                                    .map((a) => (
                                        <Button
                                            key={a}
                                            label={a}
                                            variant="secondary"
                                            className="animation-fade-in flex-shrink-0"
                                            type={tag === a ? 'filled' : 'default'}
                                            onClick={() => {
                                                if (tag == a) {
                                                    setTag(null)
                                                } else {
                                                    setTag(a)
                                                }
                                            }}
                                        />
                                    ))}
                                </HorizontalScroll>
                            </div>
                                {selectedFriend ?
                                <div className="pt-3 flex gap-2 overflow-auto">
                                    <Button
                                        icon={linkIcon}
                                        variant="secondary"
                                        type="outline"
                                        className="flex-shrink-0"
                                        label="Details"
                                        onClick={() => navigate(`/u/${selectedFriend}`)}
                                    />
                                </div>
                                : null }
                        </div>
                    </div>
                    <div>
                        {/* {plays.length > 0 && !isLoading ? (
                            <div className="flex flex-col">
                            {plays
                            .map((item, index, arr) =>
                                <div
                                    key={item._id}
                                    ref={arr.length === index + 1 ? lastElementRef : undefined}
                                >
                                    <PlayItem item={item}/>
                                </div>
                            )}
                            </div>
                        ) : isLoading ? (
                            <ErrorInfo isLoading/>
                        ) : (
                            plays.length === 0 && <ErrorInfo
                            label="No plays found"
                            secondary="Once you start logging plays, they will appear here."
                            icon={diceIcon}
                            />
                        )} */}
                    </div>
                </div>
            </div>
        </main>
    </div>
  )
}

export default CommunityPage