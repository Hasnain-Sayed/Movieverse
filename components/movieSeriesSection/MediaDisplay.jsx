"use client"

import Card from "../Card"
import {Skeleton} from "boneyard-js/react"

export default function MediaDisplay({items,isLoading,mediaType}){
    const displayItems = isLoading
        ? Array.from({ length: 15 }, (_, index) => ({ id: `skeleton-${index}` }))
        : items

    return (
        <div className="bg-black text-white min-h-screen w-full flex justify-center">
            <section className="py-8 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 max-w-350 w-full">
                {displayItems.length > 0 ? (
                    <div className="flex justify-center">
                        <div className="inline-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 lg:gap-10" 
                        style={{minWidth:"min-content"}}>
                            {displayItems.slice(0,15).map((item) => (

                                <Skeleton
                                key={item.id}
                                name="movie-card"
                                loading={isLoading}
                                >
                                    <div className="timeline-view w-45 md:w-50 lg:w-55" >
                                    {!isLoading && <Card media={item} mediaType={mediaType} />}
                                </div>
                                </Skeleton>

                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400 text-center"> No Movies Found</p>
                )}

            </section>


        </div>
    )


}