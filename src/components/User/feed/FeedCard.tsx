import React, { useEffect, useRef, useState } from 'react';
import { BsReddit } from 'react-icons/bs';
import { GoBookmark, GoBookmarkFill } from 'react-icons/go';
import { BiLike, BiSolidLike } from 'react-icons/bi';
import { RiShareForwardLine } from 'react-icons/ri';
import { MediaRenderer } from './FeedItemMedia';
import { FiMoreHorizontal } from 'react-icons/fi';
import { handleRedirectToReddit } from './MediaRenderer';
import { FeedItem } from '../../../types/feed';
import { saveFeedItem, toggleFeedLike } from '../../../api/feed';
import { Report } from '../../../types/report';

interface FeedCardProps {
    item: FeedItem;
    onSave?: (itemId: string) => void;
    onUnsave?: (itemId: string) => void;
    onShare?: (itemId: string) => void;
    onReport?: (data:Partial<Report>) => void;
    compact?: boolean;
}

const FeedCard: React.FC<FeedCardProps> = ({
    item,
    onShare,
    onReport,
    compact = false,
}) => {
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [isLiked, setIsLiked] = useState<boolean>(item.isLiked)
    const [likeCount, setLikeCount] = useState<number>(item.likes)
    const [isSaved, setIsSaved] = useState<boolean>(item.isSaved);
    const [showMore, setShowMore] = useState<boolean>(false)
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setShowMore(false);
          }
        }

        onShare
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    const handleReport = () => {
        if (reportReason.trim()) {
            const data : Partial<Report>= {
                reportedUser: item.userId,
                postId:item.id,
                reason: reportReason,
                status: 'pending',
                adminNotes: '',
            }
            onReport?.(data);

            setShowReportModal(false);
            setReportReason('');
        }
    };

    if (item.media) {
        item.media = item.media.map(media => {
            if (media.url && media.url.includes('&amp;')) {
                return { ...media, url: media.url.replace(/&amp;/g, '&') };
            }
            return media;
        });
    }



    const getSourceIcon = (source: FeedItem['source']) => {
        switch (source) {
            case 'twitter':
                return '🐦';
            case 'reddit':
                return <BsReddit className='text-orange-500' />
                    ;
            case 'linkedin':
                return '💼';
            default:
                return '📱';
        }
    };

    const handleLike = async (id: string) => {
        setIsLiked(await toggleFeedLike(id))
        !isLiked ? setLikeCount(likeCount + 1) : setLikeCount(likeCount - 1)
    }

    const handleToggleSavePost = async (postId: string) => {
        setIsSaved(await saveFeedItem(postId))
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setShowMore(false);
          }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);



    return (
        <>
            <div className={`transition-all duration-300 bg-shell rounded-lg hover:scale-102 shadow-2xl shad p-2 hover:shadow-md w-72 relative shadow-gray-900`}>

                <div className="flex h-full">
                    {item.author.avatar && (
                        <img
                            src={item.author.avatar}
                            alt={item.author.name}
                            className="w-10 h-auto rounded-full"
                        />
                    )}
                    <div className="flex flex-col w-full h-full">
                        <div className=' w-full h-full'>
                            <div className="flex items-center justify-between">
                                <div className='w-full'>
                                    <div className='flex w-full '>
                                        <div>
                                            <p className="font-semibold text-text-primary">{item.author.name}</p>
                                        </div>
                                        <div className="flex-grow"></div>

                                        <div className=''></div>

                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-500">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-lg">{getSourceIcon(item.source)}</span>
                                        </div>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div>
                                            {item.author.username && (
                                                <p className="text-sm text-gray-500">@{item.author.username}</p>
                                            )}
                                        </div>
                                        <button className='transition-all duration-150 text-text-primary rounded-full hover:bg-gray-800 mt-1 cursor-pointer text-xl' onClick={()=> setShowMore(true)}>
                                            <FiMoreHorizontal />
                                        </button>
                                        {showMore && (
                                            <div ref={popupRef} className="absolute right-2 top-10 z-50 bg-primary border border-text-secondary rounded shadow-md p-2 w-40">
                                                <button className="block rounded-xs w-full text-left text-sm p-1 hover:bg-gray-700 text-text-secondary" 
                                                        onClick={()=> {
                                                                    setShowMore(false)
                                                                    handleRedirectToReddit(item)
                                                        }}>
                                                        Visit
                                                </button>
                                                <button className="block rounded-xs w-full text-left text-sm p-1 hover:bg-gray-700 text-text-secondary">Share</button>
                                                <button className="block rounded-xs w-full text-left text-sm p-1 hover:bg-gray-700 text-text-secondary" onClick={() => setShowReportModal(true)}>Report</button>
                                            </div>
                                        )}

                                    </div>

                                </div>

                            </div>

                            <p className={`mt-2 text-sm text-gray-600 ${compact ? 'line-clamp-2' : ''} break-words`}>
                                {item.content}
                            </p>
                            <MediaRenderer feedItem={item} />
                            {/* {item.media && item.media.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {item.media.map((media, index) => {
                                        // Skip media with errors
                                        if (mediaErrors[media.url]) return null;

                                        return (
                                            <div key={`${item.id}-media-${index}`} className="relative rounded-lg overflow-hidden">
                                                {media.type === 'image' ? (
                                                    <img
                                                        src={media.url}
                                                        alt={`Content from ${item.author.name}`}
                                                        className="w-full h-auto max-h-96 object-contain"
                                                        onError={() => handleMediaError(media.url)}
                                                    />
                                                ) : media.url.includes('youtube.com/embed') ? (
                                                    <iframe
                                                        src={media.url}
                                                        className="w-full aspect-video"
                                                        title={`YouTube video`}
                                                        allowFullScreen
                                                        frameBorder="0"
                                                    />
                                                ) : (
                                                    <video
                                                        src={media.url}
                                                        controls
                                                        className="w-full"
                                                        onError={() => handleMediaError(media.url)}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )} */}

                            {/* {item.media && item.media.length > 0 && (
                                <div className="mt-3 space-y-2">


                                    {item.media.map((media, index) => (
                                        <div key={index} className="relative rounded-lg overflow-hidden h-full ">
                                            {media.type === 'image' ? (
                                                <img
                                                    src={media.url}
                                                    alt=""
                                                    className="w-full object-cover h-full"
                                                />
                                            ) : (
                                                <video
                                                    src={media.url}
                                                    controls
                                                    className="w-full"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )} */}
                        </div>
                        {/* <div className="flex-grow"></div> */}

                        <div className=' '>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center  text-gray-500 text-xl">
                                    <button className='flex justify-center items-center gap-1 text-md' onClick={() => handleLike(item.id)}>
                                        {!isLiked ? <BiLike className='hover:scale-105 cursor-pointer ' /> : <BiSolidLike className='hover:scale-105 cursor-pointer text-md' />}

                                    </button>
                                    {/* <span>💬 {item.comments}</span> */}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className='flex justify-center items-center gap-1 text-sm text-gray-500'>
                                        <RiShareForwardLine className='hover:scale-105 cursor-pointer text-2xl' />
                                    </span>
                                    {isSaved ? (
                                        <button
                                            onClick={() => handleToggleSavePost(item.id)}
                                            className="p-2 text-gray-500 hover:text-gray-600 text-xl cursor-pointer"
                                            title="Unsave"
                                        >
                                            <GoBookmarkFill />


                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleToggleSavePost(item.id)}
                                            className="p-2 text-gray-500 hover:text-gray-600 text-xl cursor-pointer"
                                            title="Save"
                                        >
                                            <GoBookmark />
                                        </button>
                                    )}
                                    {/* 
                                    <button
                                        onClick={() => onShare(item.id)}
                                        className="p-2 text-gray-400 hover:text-blue-500 cursor-pointer"
                                        title="Share"
                                    >
                                        <FaRegCopy />

                                    </button> */}

                                    {/* <button
                                        onClick={() => setShowReportModal(true)}
                                        className="p-2 text-gray-400 hover:text-red-500"
                                        title="Report"
                                    >
                                        🚩
                                    </button> */}
                                </div>
                            </div>
                            <div className='flex gap-4 justify-between'>
                                <h1 className='text-xs text-gray-500'>{likeCount} likes</h1>
                                <h1 className='text-xs text-gray-500'>{item.shares > 0 && `${item.shares} shares`}</h1>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-secondary rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4 text-text-primary">Report Content</h3>
                        <p className="text-sm mb-4 text-text-secondary">
                            Please provide a reason for reporting this content:
                        </p>
                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            className="w-full border rounded-lg border-text-secondary text-text-secondary p-2 mb-4 placeholder-text-secondary"
                            rows={3}
                            placeholder="Enter reason..."
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReport}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FeedCard;